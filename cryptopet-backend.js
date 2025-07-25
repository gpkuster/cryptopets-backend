// Framework for creating the HTTP server
const express = require('express');

// Library for interacting with Ethereum contracts
const { ethers } = require('ethers');

// For reading environment variables from .env
require('dotenv').config();

// Allows frontend (in another domain/port) to communicate with this backend
const cors = require('cors');

// Smart contract's ABI
const abi = require('./abi.json');

// ------------------------------
// Initialize Express and middleware
// ------------------------------
const app = express();
app.use(express.json()); // Allows JSON in requests (e.g. POST)
app.use(cors());         // Enables CORS for frontend communication

// ------------------------------
// Configure Ethereum provider and wallet
// ------------------------------

// RPC provider (e.g., Sepolia via Infura or Alchemy)
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

// Wallet loaded from private key (backend identity)
const privateKey = process.env.PRIVATE_KEY.startsWith('0x')
  ? process.env.PRIVATE_KEY
  : `0x${process.env.PRIVATE_KEY}`;
const wallet = new ethers.Wallet(privateKey, provider);

// Connect to deployed smart contract
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);

// ------------------------------
// Routes
// ------------------------------

// Mint a new pet
app.post('/mint', async (req, res) => {
  const { name, breed, age, image } = req.body;
  try {
    const tx = await contract.mintPet(name, breed, age, image);
    await tx.wait();
    res.json({ success: true, txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get pet info by tokenId
app.get('/pet/:id', async (req, res) => {
  try {
    console.log("Getting pet info for id: " + req.params.id);
    const petInfo = await contract.getPetInfo(req.params.id);
    console.log('petInfo:', petInfo);
    res.json({
      tokenId: petInfo[0].toString(),
      name: petInfo[1],
      breed: petInfo[2],
      age: petInfo[3].toString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update pet name (must be owner)
app.post('/pet/:id/update-name', async (req, res) => {
  const { newName } = req.body;
  try {
    const tx = await contract.updateName(req.params.id, newName);
    await tx.wait();
    res.json({ success: true, txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update pet age (must be creator)
app.post('/pet/:id/update-age', async (req, res) => {
  const { newAge } = req.body;
  try {
    const tx = await contract.updateAge(req.params.id, newAge);
    await tx.wait();
    res.json({ success: true, txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Vote for cutest pet
app.post('/vote', async (req, res) => {
  const { tokenId } = req.body;
  try {
    const tx = await contract.voteCutestPet(tokenId);
    await tx.wait();
    res.json({ success: true, txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get pet(s) with most votes
app.get('/cutest', async (req, res) => {
  try {
    const result = await contract.getCutestPets();
    res.json({ winners: result.map(id => id.toString()) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get tokenURI (metadata) of a pet
app.get('/pet/:id/uri', async (req, res) => {
  try {
    const uri = await contract.tokenURI(req.params.id);
    res.json({ tokenURI: uri });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------------------
// Start HTTP server
// ------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ CryptoPets backend running at http://localhost:${PORT}`);
});
