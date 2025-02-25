"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserWalletController_1 = __importDefault(require("../controllers/UserWalletController")); // Ensure correct path
const router = express_1.default.Router();
// Use arrow functions to maintain `this` context
router.get("/user-wallet/btc-addresses/:id", (req, res) => UserWalletController_1.default.getBitCoinAddresses(req, res));
router.post("/user-wallet/btc-addresses", (req, res) => UserWalletController_1.default.createBitCoinAddress(req, res));
router.delete("/user-wallet/btc-addresses/:id/:wallet_address", (req, res) => UserWalletController_1.default.deleteBitCoinAddress(req, res));
//# sourceMappingURL=index.js.map