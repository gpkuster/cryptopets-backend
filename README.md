# 🐾 CryptoPets Backend
A Node.js + Express backend to interact with the CryptoPets smart contract deployed on Ethereum (e.g., Sepolia testnet). This has been developed to interact wiht the CrypoPets smart contract, which source code is available [here](https://github.com/gpkuster/crypto-pets). The contract to which this backend connects is deployed [here](https://sepolia.etherscan.io/address/0x39d80b357580bfafcfc9827baad5a990052ba49b).

## 🧑🏽‍⚕️ Testing options
### Option 1
1. Deploy your own CryptoPets NFT contract by following the instructions on [this link](https://github.com/gpkuster/crypto-pets).
2. Run your server locally to interact with the deployed smart contract.

### Option 2
1. Interact with the already deployed smart contract, which address you can find on [this link](https://sepolia.etherscan.io/address/0x39d80b357580bfafcfc9827baad5a990052ba49b).

## 🚀 Features
- Mint new NFT pets
- Fetch pet information
- Update pet name and age
- Vote for the cutest pet
- Retrieve the winning pets
- Get the tokenURI

## 📦 Requirements
- Node.js v18 or higher
- NPM or Yarn
- A deployed smart contract and its ABI
- `.env` file with credentials (see below)

## 🔧 Installation
Clone the repository:
```bash
git clone https://github.com/your-username/cryptopets-backend.git
cd cryptopets-backend
```
Install dependencies:
```bash
npm install
```

## 🛠️ Configuration
### Part 1
You are going to need an address for this server to sign the transactions and pay for the gas. If you don't want to use your own address (recommended), use the `generateAndFundWallet.js` script:
1. Install dependencies
```bash
npm install express ethers dotenv cors
```
2. Include the private key of the wallet from which you want to fund the server's wallet at a new `.env` file
```.env
SENDER_PRIVATE_KEY=<wallet_with_funds_private_key>
RPC_URL=https://sepolia.infura.io/v3/<your_infura_project_id>
```
3. Adjust the amount of ETH you want to send to the new wallet in this line:
```javascript
const amountToSend = "0.0000001"; // Adjust amount if needed
```
4. Run the script:
```bash
node generateAndFundWallet.js
```
This will return a wallet address and a private key for that wallet that wil be set automatically in your `.env` file, removing the other sensitive data. Something similar to this should appear in the new file:
```env
PRIVATE_KEY=4b8b5.........3edf4
WALLET_ADDRESS=0x91101.........187
MNEMONIC="behind boat check fade abuse chef squirrel inner capital dog model occur"
```

⚠️ Never share your private key.
This wallet should only be used by the backend and should not store significant funds.

### Part 2
Add to the `.env` file the address of the CryptoPets smart contract and the port:
```env
CONTRACT_ADDRESS=0xYourContractAddressHere // You can use mine, as mentioned above in Testing Option 2, or yours (Option 1)
PORT:3000 // you can use any
```

## ▶️ Running the server

Start the server with:
```bash
node cryptopet-backend.js
```
The backend will be available at: http://localhost:3000

## 🧠 Notes
- Interactions with the blockchain (e.g., minting, voting) may take a few seconds.
- This backend uses a dedicated wallet to sign transactions.
- Any BigInt values are converted to strings before being returned in JSON.

## 📄 License
MIT License