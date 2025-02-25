# CoinTracker Prototype

This CoinTracker prototype allows users to add, remove, and track Bitcoin addresses. This application fetches real-time Bitcoin balances and transactions, ensuring an up-to-date overview of wallet activity.

## 📌 Features
✅ Add Bitcoin Addresses – Users can add BTC addresses.

✅ Remove Bitcoin Addresses – Users can remove BTC addresses.

✅ View Balances & Transactions – The system syncs balances and transactions from the Blockchain.com API.

✅ Automatic Data Synchronization – Updates balances at regular intervals.

✅ User-Friendly UI – A simple, clean, and interactive front-end for managing addresses.

## 📂 Project Structure
coin-tracker-prototype/
├── src/                            # Express.js Backend
│   ├── db/                         # Database models (Mongoose)
│   │   ├── Wallet.ts        # Schema for Bitcoin wallets
│   │   ├── Transaction.ts          # Schema for transactions
│   ├── syncTransactions.ts         # Function to sync transactions & balances
│   ├── index.ts                    # Express server entry point
│
├── app/                            # React.js Frontend
│   ├── components/                 # Reusable UI components
│   │   ├── BitcoinAddress.tsx      # Component for adding/removing addresses
│   ├── styles/                     # CSS styles
│   │   │   ├── BitcoinAddress.css  # Main UI logic for displaying addresses
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Main React app entry & logic for displaying addresses
│
├── package.json                   # Dependencies for frontend & backend
├── README.md                      # Project documentation


## 🛠️ Technologies & Tools

### Frontend (React + TypeScript)
•	React.js – Component-based UI development
•	TypeScript – Type-safe JavaScript
•	Axios – API calls to fetch BTC data
•	CSS Modules – Styling for components

### Backend (Node.js + Express)
•	Node.js – JavaScript runtime
•	Express.js – Web framework for API endpoints
•	Mongoose – ODM for MongoDB
•	Axios – Fetch BTC data from Blockchain.com API

#### Database (MongoDB)
•	MongoDB Atlas – Cloud-hosted NoSQL database
•	Mongoose – Schema validation & queries

## 🛠 DB Models
The Wallet model stores a list of Bitcoin addresses that are being tracked, along with their balances.
The Transaction model stores a list of transactions with their bitcoin addresses, txn id, amount and date. Model and db used to test
syncing capabilities but is not optimal for solution

## 🚀️ Setup 
Backend: npm run start 

Frontend:  npm run frontend-dev


## 🔗 API Endpoints
---- MAIN APIs ----

GET /wallet/:id - Retrieves Bitcoin addresses for a specific wallet by its ID
POST /wallet - Creates a new wallet entry in the database
PATCH /wallet/:id - Adds a new Bitcoin address to an existing wallet
DELETE /wallet/:address - Deletes a specific Bitcoin address from a wallet

---- APIs USED FOR TESTING ----
GET /wallets - Retrieves a list of all wallets stored in the database
GET /transactions/:address - Retrieves a list of transactions for bitcoin address
DELETE /transactions - Deletes all transactions
DELETE /wallets - Deletes all wallets



## ℹ️ Important: 

### Assumptions Made
1. A user can have multiple bitcoin addresses
2. The Wallet model is designed to compliment a user model (if one existed) where each wallet would have a userId. Thus each user would only have one wallet 
3. The Wallet model is also designed to store addresses for other cryptocurrencies in the future - for example a column can be added for etheruem addresses (another list of strings)
