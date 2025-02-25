import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema(
    {
        btc_address: { type: String, required: true },
        tx_hash: { type: String, unique: true, required: true },
        amount: { type: Number, required: true },
        txn_date: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    }
);

export const Transaction = mongoose.model('Transaction', TransactionSchema);