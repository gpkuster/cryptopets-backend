const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");
require("dotenv").config();

(async () => {
  // Setup provider and sender wallet
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const senderWallet = new ethers.Wallet(process.env.SENDER_PRIVATE_KEY, provider);

  // Generate a new wallet
  const newWallet = ethers.Wallet.createRandom();
  console.log("✅ New wallet generated:");
  console.log("Address:       ", newWallet.address);
  console.log("Mnemonic:      ", newWallet.mnemonic.phrase);
  console.log("Private Key:   ", newWallet.privateKey);

  // Save to .env
  const envContent = `PRIVATE_KEY=${newWallet.privateKey.replace("0x", "")}
WALLET_ADDRESS=${newWallet.address}
MNEMONIC="${newWallet.mnemonic.phrase}"`;

  fs.writeFileSync(path.join(__dirname, ".env"), envContent, { flag: "w" });

  // Save to wallet.json (optional)
  const jsonData = {
    address: newWallet.address,
    privateKey: newWallet.privateKey,
    mnemonic: newWallet.mnemonic.phrase
  };

  fs.writeFileSync(path.join(__dirname, "wallet.json"), JSON.stringify(jsonData, null, 2), { flag: "w" });

  // Send ETH to new wallet
  const amountToSend = "0.0000001"; // Adjust amount if needed
  const tx = await senderWallet.sendTransaction({
    to: newWallet.address,
    value: ethers.parseEther(amountToSend) 
  });

  console.log(`🚀 Sending ${amountToSend} ETH to ${newWallet.address}...`);
  await tx.wait();
  console.log("✅ Transaction confirmed! Hash:", tx.hash);
})();
