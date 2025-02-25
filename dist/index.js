"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const bitcoin_address_1 = require("./db/bitcoin-address");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const MONGO_URL = "mongodb://127.0.0.1:27017";
mongoose_1.default.connect(MONGO_URL, {
    dbName: "cointracker-prototype",
}).then(() => {
    console.log("Database connected successfully");
});
app.listen(8000, () => {
    console.log(`Server running on http://localhost:4000`);
});
app.get('/user-wallets/btc-addresses/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userWallet = yield bitcoin_address_1.UserWalletModel.findById(id);
        if (!userWallet) {
            res.send({
                success: false,
                message: 'User wallet not found',
            });
        }
        // Ensure response follows the UserWallet TypeScript structure
        const responseWallet = {
            id: userWallet.id,
            btcAddresses: userWallet.btc_addresses, // Ensure correct field mapping
        };
        res.send({
            success: true,
            message: 'Todo lists retrieved successfully',
            data: responseWallet.btcAddresses,
        });
    }
    catch (error) {
        console.error(error);
        res.send({
            success: false,
            message: 'Error retrieving Bitcoin addresses',
        });
    }
}));
//# sourceMappingURL=index.js.map