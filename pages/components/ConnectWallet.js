import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";

export default function ConnectWallet() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState("");
  const router = useRouter();

  useEffect(() => {
    checkIfWalletIsConnected();
    listenForAccountChange();
  }, []);

  const checkIfWalletIsConnected = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setWalletConnected(true);
        setAccount(address);
        // Redirect to profile page once connected
        router.push(`/profile?wallet=${address}`);
      } catch (error) {
        console.log("Wallet not connected:", error);
      }
    }
  };

  const listenForAccountChange = () => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setWalletConnected(true);
          router.push(`/profile?wallet=${accounts[0]}`);
        } else {
          setAccount("");
          setWalletConnected(false);
        }
      });
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      setWalletConnected(true);
      // Redirect after connecting
      router.push(`/profile?wallet=${accounts[0]}`);
    } catch (error) {
      console.error("Connection failed:", error);
    }
  };

  return (
    <div className="container text-center mt-5">
      <button
        className={`btn ${walletConnected ? "btn-success" : "btn-primary"}`}
        onClick={connectWallet}
      >
        {walletConnected
          ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`
          : "Connect Wallet"}
      </button>
    </div>
  );
}


// import { useState, useEffect } from "react";
// import { ethers } from "ethers";

// export default function ConnectWallet() {
//   const [walletConnected, setWalletConnected] = useState(false);
//   const [account, setAccount] = useState("");

//   useEffect(() => {
//     checkIfWalletIsConnected();
//     listenForAccountChange();
//   }, []);

//   // ✅ Check if wallet is already connected
//   const checkIfWalletIsConnected = async () => {
//     if (typeof window.ethereum !== "undefined") {
//       try {
//         const provider = new ethers.BrowserProvider(window.ethereum);
//         const signer = await provider.getSigner();
//         const address = await signer.getAddress();
//         setWalletConnected(true);
//         setAccount(address);
//       } catch (error) {
//         console.log("Wallet not connected:", error);
//       }
//     }
//   };

//   // ✅ Handle account change (MetaMask, WalletConnect, etc.)
//   const listenForAccountChange = () => {
//     if (window.ethereum) {
//       window.ethereum.on("accountsChanged", (accounts) => {
//         if (accounts.length > 0) {
//           setAccount(accounts[0]);
//           setWalletConnected(true);
//         } else {
//           setAccount("");
//           setWalletConnected(false);
//         }
//       });
//     }
//   };

//   // ✅ Connect Wallet Function
//   const connectWallet = async () => {
//     if (!window.ethereum) {
//       alert("Please install MetaMask!");
//       return;
//     }
//     try {
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const accounts = await provider.send("eth_requestAccounts", []);
//       setAccount(accounts[0]);
//       setWalletConnected(true);
//     } catch (error) {
//       console.error("Connection failed:", error);
//     }
//   };

//   return (
//     <div className="container text-center mt-5">
//       <button
//         className={`btn ${walletConnected ? "btn-success" : "btn-primary"}`}
//         onClick={connectWallet}
//       >
//         {walletConnected ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
//       </button>
//     </div>
//   );
// }
