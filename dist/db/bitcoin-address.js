"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserWalletModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UserWalletSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true,
    },
    btc_addresses: [{ type: String, required: true }],
}, {
    timestamps: true,
});
exports.UserWalletModel = mongoose_1.default.model('UserWallet', UserWalletSchema);
//# sourceMappingURL=bitcoin-address.js.map