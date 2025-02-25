import express from 'express';
import mongoose from 'mongoose';
import { Wallet } from "./db/Wallet";
import syncTransactions from "./syncTransactions";
import {Transaction} from "./db/Transaction";
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());


const MONGO_URL = "mongodb://127.0.0.1:27017";
mongoose.connect(MONGO_URL, {
    dbName: "cointracker-prototype",
}).then(() => {
    console.log("Database connected successfully");
})

app.listen(4000, () => {
    console.log(`Server running on http://localhost:4000`);
    syncTransactions();
})


/**
 * @route GET /wallets
 * @description Retrieves a list of all wallets stored in the database.
 * @access Public
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>} Responds with a JSON object containing an array of wallets or an error message.
 */
app.get('/wallets', async (req, res) => {
    try {
        const wallets = await Wallet.find();

        res.status(200).json({
            wallets,
        })
    } catch (error){
        console.error(error);
        res.status(500).json({
            error: 'Error retrieving wallets'
        })
    }
})


/**
 * @route GET /wallet/:id
 * @description Retrieves Bitcoin addresses for a specific wallet by its ID.
 * @access Public
 *
 * @param {Request} req - The Express request object containing the wallet ID in params.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>} Responds with the Bitcoin addresses if found, otherwise throws an error.
 */
app.get('/wallet/:id', async (req, res) => {
    try {

        const { id } = req.params;

        const btcWallet = await Wallet.findById(id);

        if (!btcWallet) {
            res.status(404).json({
                message: 'Wallet not found',
            });
            return;
        }

        res.status(200).json({
            bitcoin_addresses: btcWallet.btc_addresses,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving Bitcoin addresses',
        });
    }
})


/**
 * @route POST /wallet
 * @description Creates a new wallet entry in the database.
 * @access Public
 *
 * @param {Request} req - The Express request object containing wallet details.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>} Responds with the created wallet or an error message.
 */
app.post('/wallet', async (req, res) => {
    try {
        const { addresses } = req.body;
        if (!addresses || !Array.isArray(addresses) || addresses.length === 0) {
            res.status(400).json({
                message: 'Invalid request: addresses must be a non-empty array.',
            });
            return;
        }

        const formattedAddresses = addresses.map((addr) => ({
            address: addr,
        }));

        const newWallet = await Wallet.create({ btc_addresses: formattedAddresses });

        res.status(201).json({
            data: newWallet,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to add Bitcoin addresses successfully.',
        });
    }
});

/**
 * @route PATCH /wallet/:id
 * @description Adds a new Bitcoin address to an existing wallet.
 * @access Public
 *
 * @param {Request} req - The Express request object containing the new address.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>} Responds with the updated wallet or an error message.
 */
app.patch('/wallet/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { address } = req.body; // Expecting a single address

        if (!address || typeof address !== 'string') {
             res.status(400).json({
                message: 'Invalid request: address must be a non-empty string.',
            });
             return;
        }

        const updatedWallet = await Wallet.findByIdAndUpdate(
            id,
            { $push: { btc_addresses: { address } } },
            { new: true, runValidators: true }
        );

        if (!updatedWallet) {
            res.status(404).json({
                message: 'Wallet not found',
            });
            return;
        }

        res.status(200).json({
            message: 'Bitcoin address successfully added',
            data: updatedWallet,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to update Wallet',
        });
    }
})

/**
 * @route DELETE /wallet/:address
 * @description Deletes a specific Bitcoin address from a wallet.
 * @access Public
 *
 * @param {Request} req - The Express request object containing wallet ID and Bitcoin address.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>} Responds with the updated wallet or an error message.
 */
app.delete('/wallet/:id/address/:address', async (req, res) => {
    try {
        const { id, address } = req.params;

        if (!id || !address) {
            res.status(400).json({
                message: 'Invalid request: Wallet ID and address must be provided.',
            });
            return;
        }

        const wallet = await Wallet.findById(id);

        if (!wallet) {
            res.status(404).json({
                message: 'Wallet not found.',
            });
            return;
        }

        const addressExists = wallet.btc_addresses.some((addrObj) => addrObj.address === address);
        if (!addressExists) {
            res.status(404).json({
                message: 'Bitcoin address not found in this wallet.',
            });
            return;
        }

        const updatedWallet = await Wallet.findByIdAndUpdate(
            id,
            { $pull: { btc_addresses: { address: address } } },
            { new: true, runValidators: true }
        );

        if (!updatedWallet) {
            res.status(500).json({
                message: 'Failed to remove Bitcoin address.',
            });
            return;
        }

        console.log(`Address ${address} removed. Now deleting associated transactions...`);

        // Delete all transactions associated with this address
        try {
            await Transaction.deleteMany({ btc_address: address });
        } catch (error) {
             res.status(500).json({
                message: 'Bitcoin address removed, but transactions could not be deleted.',
             });
             return;
        }

        res.status(200).json({
            message: `Bitcoin address ${address} successfully removed from wallet ${id}.`,
            data: updatedWallet,
        });
        return;

    } catch (error) {
        console.error("Error removing Bitcoin address:", error);
         res.status(500).json({
            message: 'Failed to remove Bitcoin address due to server error.',
        });
        return;
    }
});







/* ------------------ APIS FOR TESTING ---------------------------- */

// Get transactions for a Bitcoin address
app.get("/transactions/:address", async (req, res) => {
    try {
        const { address } = req.params;
        const transactions = await Transaction.find({ btc_address: address });
        res.json({ address, transactions });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving transactions", error });
    }
});

// Delete all transactions
app.delete("/transactions", async (req, res) => {
    try {
        await Transaction.deleteMany({});
        res.json({ message: "All transactions deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting transactions", error });
    }
});

// Get all wallets
app.delete("/wallets", async (req, res) => {
    try {
        await Wallet.deleteMany({});
        res.json({ message: "All Wallets deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting Wallets", error });
    }
});


