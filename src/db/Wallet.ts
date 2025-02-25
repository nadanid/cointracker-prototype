import mongoose from 'mongoose';

const WalletSchema = new mongoose.Schema(
    {
        btc_addresses: [
            {
                address: { type: String, required: true },
                balance: { type: Number , default: 0},
                _id: false
            }
        ],
    },
    { timestamps: true }
);

export const Wallet = mongoose.model('Wallet', WalletSchema);