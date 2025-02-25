import axios from "axios";
import cron from "node-cron";
import { Wallet } from "./db/Wallet";
import { Transaction } from "./db/Transaction";

interface TransactionData {
    tx_hash: string;
    btc_address: string;
    amount: number;
    txn_date: Date;
}

/**
 * Fetches Bitcoin transactions for a given address and updates its balance.
 *
 * @param {string} address - The Bitcoin address to fetch transactions for.
 * @returns {Promise<TransactionData[]>} - A list of transaction objects.
 */async function fetchTransactions(address: string): Promise<TransactionData[]> {
    try {
        const response = await axios.get(`https://blockchain.info/rawaddr/${address}`);
        if (!response.data || !response.data.txs) {
            console.log(`No transactions found for address: ${address}`);
            return [];
        }
        const balanceBTC = response.data.final_balance / 1e8;

        await Wallet.updateOne(
            { "btc_addresses.address": address },
            { $set: { "btc_addresses.$.balance": balanceBTC } }
        );

        return response.data.txs.map((tx: any) => ({
            tx_hash: tx.hash,
            btc_address: address,
            amount: tx.out.reduce((sum: number, output: any) => sum + output.value, 0) / 1e8, // Convert Satoshi to BTC
            txn_date: new Date(tx.time * 1000), // Convert UNIX timestamp to Date
        }));
    } catch (error) {
        console.error(`Error fetching transactions for ${address}:`, error);
        return [];
    }
}

/**
 * Synchronizes Bitcoin transactions for all wallets stored in the database.
 *
 * This function:
 * 1. Retrieves all wallets from the database.
 * 2. Iterates over each Bitcoin address in each wallet.
 * 3. Fetches recent transactions for each address using `fetchTransactions()`.
 * 4. Checks if the transaction already exists in the `Transaction` collection.
 * 5. Adds new transactions to the database if they do not already exist.
 *
 * @async
 * @function syncTransactions
 * @returns {Promise<void>} - Resolves when all transactions are processed.
 *
 * @throws {Error} Logs errors if fetching wallets or transactions fails.
 */
async function syncTransactions() {
    try {
        const wallets = await Wallet.find();
        for (const wallet of wallets) {
            for (const addressObj of wallet.btc_addresses) {
                const address = addressObj.address;
                const transactions = await fetchTransactions(address);

                for (const tx of transactions) {
                    const existingTx = await Transaction.findOne({ tx_hash: tx.tx_hash });

                    if (!existingTx) {
                        await Transaction.create(tx);
                        console.log(`New transaction added for ${address}: ${tx.tx_hash} (${tx.amount} BTC)`);
                    }
                }
            }
        }
    } catch (error) {
        console.error("Error syncing transactions:", error);
    }
}

/**
 * Schedules the Bitcoin transaction synchronization process to run every 5 minutes.
 *
* @returns {void} - Executes `syncTransactions()` asynchronously without returning a value.
*/
cron.schedule("*/5 * * * *", async () => {
    console.log("Running Bitcoin transaction sync...");
    await syncTransactions();
});

export default syncTransactions;