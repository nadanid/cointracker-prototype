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
Object.defineProperty(exports, "__esModule", { value: true });
const bitcoin_address_1 = require("../db/bitcoin-address");
class UserWalletController {
    constructor() {
        // getAllBitCoinAddresses = async(request: express.Request, response: express.Response)=> {
        //     try {
        //         const userWallet = await UserWalletModel.find();
        //         return response.status(200).json({data: bitcoinAddresses});
        //     } catch (error){
        //         console.error(error);
        //         return response.sendStatus(400);
        //     }
        // }
        this.getBitCoinAddresses = (request, response) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = request.params;
                const userWallet = yield bitcoin_address_1.UserWalletModel.findById(id);
                if (!userWallet) {
                    return response.status(200).json({ data: userWallet.btcAddresses });
                }
            }
            catch (error) {
                console.error(error);
                return response.sendStatus(400);
            }
        });
        this.createBitCoinAddress = (request, response) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, wallet_address } = request.body;
                let userWallet = yield bitcoin_address_1.UserWalletModel.findById(id);
                if (!userWallet) {
                    userWallet = new bitcoin_address_1.UserWalletModel({
                        id,
                        btc_addresses: [wallet_address],
                    });
                    yield userWallet.save();
                }
                else {
                    // If user exists, update the array field
                    userWallet.btc_addresses.push(wallet_address);
                    yield userWallet.save();
                }
                // Convert Mongoose document to a plain JS object to match `UserWallet` type
                const responseWallet = {
                    id: userWallet.id,
                    btcAddresses: userWallet.btc_addresses, // Convert from btc_addresses -> btcAddresses
                };
                return response.status(201).json({ data: responseWallet.btcAddresses });
            }
            catch (error) {
                console.error(error);
                return response.sendStatus(400);
            }
        });
        this.deleteBitCoinAddress = (request, response) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, wallet_address } = request.params;
                const userWallet = yield bitcoin_address_1.UserWalletModel.findById(id);
                if (!userWallet) {
                    return response.status(404).json({ message: 'User not found' });
                }
                // Ensure btc_addresses exists and has a type
                if (!userWallet.btc_addresses || !Array.isArray(userWallet.btc_addresses)) {
                    return response.status(400).json({ message: 'Invalid wallet data' });
                }
                // Find and remove the address
                const addressIndex = userWallet.btc_addresses.findIndex(address => address === wallet_address);
                if (addressIndex === -1) {
                    return response.status(404).json({ message: 'Bitcoin address not found' });
                }
                // Remove the address from the array
                userWallet.btc_addresses.splice(addressIndex, 1);
                yield userWallet.save();
                return response.status(200).json({ message: 'Bitcoin address deleted successfully' });
            }
            catch (error) {
                console.error(error);
                return response.sendStatus(400).json({ error: 'Error deleting Bitcoin address' });
            }
        });
        this.getBitCoinAddresses = this.getBitCoinAddresses.bind(this);
        this.createBitCoinAddress = this.createBitCoinAddress.bind(this);
        this.deleteBitCoinAddress = this.deleteBitCoinAddress.bind(this);
    }
}
exports.default = new UserWalletController();
//# sourceMappingURL=UserWalletController.js.map