// utils/web3.js
import { ethers } from "ethers";

export async function connectWallet() {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      return signer.address;
    } else {
      alert("Install MetaMask!");
      return null;
    }
  }