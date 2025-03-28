
// // pages/index.js
// import Head from "next/head";
// import { useEffect, useState } from "react";
// import { useViewerConnection, useViewerRecord } from "@self.id/react";
// import { EthereumAuthProvider } from "@self.id/web";

// export default function Home() {
//   // Profile field states
//   const [name, setName] = useState("");
//   const [age, setAge] = useState("");
//   const [github, setGithub] = useState("");
//   const [fiverr, setFiverr] = useState("");
//   const [upwork, setUpwork] = useState("");
//   const [aadhaar, setAadhaar] = useState("");

//   // Ceramic connection hook
//   const [connection, connect, disconnect] = useViewerConnection();
//   // State for storing the generated DID
//   const [did, setDid] = useState("");
//   // Loading state
//   const [loading, setLoading] = useState(false);
//   // Check for browser environment
//   const [isWindow, setIsWindow] = useState(false);

//   // Use Self.ID hook to manage the Ceramic basicProfile record
//   const record = useViewerRecord("basicProfile");

//   // Set isWindow true once client-side
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       setIsWindow(true);
//       console.log("Running on client-side");
//     }
//   }, []);

//   // Debug: Log connection changes
//   useEffect(() => {
//     console.log("Connection status:", connection.status);
//     console.log("Viewer data:", connection.viewer);
//   }, [connection]);

//   // Function to create EthereumAuthProvider from MetaMask
//   async function createAuthProvider() {
//     if (window.ethereum) {
//       try {
//         console.log("Requesting MetaMask accounts...");
//         const addresses = await window.ethereum.request({
//           method: "eth_requestAccounts",
//         });
//         const address = addresses[0];
//         console.log("MetaMask returned address:", address);
//         return { authProvider: new EthereumAuthProvider(window.ethereum, address), address };
//       } catch (error) {
//         console.error("Error requesting MetaMask accounts:", error);
//         throw error;
//       }
//     } else {
//       console.error("MetaMask is not installed.");
//       throw new Error("MetaMask not detected");
//     }
//   }

//   // Connect wallet and update DID
//   async function connectAccount() {
//     setLoading(true);
//     try {
//       const result = await createAuthProvider();
//       if (result && result.authProvider) {
//         console.log("Attempting to connect using Self.ID...");
//         await connect(result.authProvider);
//         console.log("Self.ID connect() resolved. Current connection status:", connection.status);
//         // Wait a moment to allow the connection state to update
//         setTimeout(() => {
//           // Check connection state again
//           if (connection.status === "connected" || connection.status === "connecting") {
//             const userDid = `did:pkh:eip155:1:${result.address}`;
//             console.log("Generated DID:", userDid);
//             setDid(userDid);
//             localStorage.setItem("userDID", userDid);
//           } else {
//             console.error("Connection did not transition to connected state as expected.");
//           }
//           setLoading(false);
//         }, 2500);
//       }
//     } catch (error) {
//       console.error("Error during wallet connection:", error);
//       setLoading(false);
//     }
//   }

//   // Validate form inputs
//   function validateInputs() {
//     if (!name.trim() || !age.trim() || !github.trim() || !fiverr.trim() || !upwork.trim() || !aadhaar.trim()) {
//       alert("All fields are required!");
//       return false;
//     }
//     const ageNum = parseInt(age, 10);
//     if (isNaN(ageNum) || ageNum < 18 || ageNum > 120) {
//       alert("Please enter a valid age (18-120).");
//       return false;
//     }
//     if (!/^\d{12}$/.test(aadhaar)) {
//       alert("Please enter a valid 12-digit Aadhaar number.");
//       return false;
//     }
//     return true;
//   }

//   // Update profile: merge details into Ceramic record
//   async function updateProfile(e) {
//     e.preventDefault();
//     if (!validateInputs()) return;
//     if (!record || !record.isMutable) {
//       alert("Profile record not available or is immutable.");
//       console.error("Record state:", record);
//       return;
//     }
//     setLoading(true);
//     try {
//       console.log("Attempting to merge profile data:", { name, age, github, fiverr, upwork, aadhaar });
//       await record.merge({
//         name,
//         age,
//         github,
//         fiverr,
//         upwork,
//         aadhaar,
//       });
//       console.log("Profile updated successfully!");
//       alert("Profile updated successfully!");
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       alert("Profile update failed. Check console for details.");
//     }
//     setLoading(false);
//   }

//   return (
//     <>
//       <Head>
//         <title>Decentralized Identity: Create a DID</title>
//         <meta name="description" content="Build your decentralized identity profile using Ceramic" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       <main className="container my-5">
//         <div className="bg-dark text-white text-center p-3 mb-4">
//           <h1 className="display-4">Decentralized Identity System</h1>
//           <p className="lead">Connect your wallet, enter your details, and create your DID!</p>
//         </div>

//         {/* Wallet Connection Section */}
//         <div className="d-flex flex-column align-items-center mb-4">
//           {connection.status !== "connected" ? (
//             <>
//               <button
//                 className="btn btn-primary mb-3"
//                 onClick={connectAccount}
//                 disabled={loading}
//               >
//                 {loading ? "Connecting..." : "Connect Wallet"}
//               </button>
//               {isWindow && !window.ethereum && (
//                 <p className="text-danger">
//                   MetaMask is required.{" "}
//                   <a href="https://metamask.io/" target="_blank" rel="noreferrer">
//                     Install MetaMask
//                   </a>
//                 </p>
//               )}
//             </>
//           ) : (
//             <div className="alert alert-success w-50" role="alert">
//               Wallet Connected! Your DID: <strong>{did}</strong>
//             </div>
//           )}
//         </div>

//         {/* Profile Form Section (display only when wallet is connected) */}
//         {connection.status === "connected" && (
//           <div className="card w-50 mx-auto">
//             <div className="card-body">
//               <h2 className="card-title mb-4">Enter Your Details</h2>
//               <form onSubmit={updateProfile}>
//                 <div className="mb-3">
//                   <label htmlFor="name" className="form-label">Name</label>
//                   <input
//                     id="name"
//                     type="text"
//                     className="form-control"
//                     placeholder="Your name"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label htmlFor="age" className="form-label">Age</label>
//                   <input
//                     id="age"
//                     type="number"
//                     className="form-control"
//                     placeholder="Your age"
//                     value={age}
//                     onChange={(e) => setAge(e.target.value)}
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label htmlFor="github" className="form-label">GitHub</label>
//                   <input
//                     id="github"
//                     type="text"
//                     className="form-control"
//                     placeholder="Your GitHub username or URL"
//                     value={github}
//                     onChange={(e) => setGithub(e.target.value)}
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label htmlFor="fiverr" className="form-label">Fiverr</label>
//                   <input
//                     id="fiverr"
//                     type="text"
//                     className="form-control"
//                     placeholder="Your Fiverr profile URL"
//                     value={fiverr}
//                     onChange={(e) => setFiverr(e.target.value)}
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label htmlFor="upwork" className="form-label">Upwork</label>
//                   <input
//                     id="upwork"
//                     type="text"
//                     className="form-control"
//                     placeholder="Your Upwork profile URL"
//                     value={upwork}
//                     onChange={(e) => setUpwork(e.target.value)}
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label htmlFor="aadhaar" className="form-label">Aadhaar Number</label>
//                   <input
//                     id="aadhaar"
//                     type="text"
//                     className="form-control"
//                     placeholder="12-digit Aadhaar number"
//                     value={aadhaar}
//                     onChange={(e) => setAadhaar(e.target.value)}
//                   />
//                 </div>
//                 <button type="submit" className="btn btn-success" disabled={loading}>
//                   {loading ? "Updating Profile..." : "Update Profile and Create DID"}
//                 </button>
//               </form>
//             </div>
//           </div>
//         )}
//       </main>
//     </>
//   );
// }






// // ================================================================================================

// // // pages/index.js
// // import Head from "next/head";
// // import { useEffect, useState, useRef } from "react";
// // import { useViewerConnection } from "@self.id/react";
// // import { EthereumAuthProvider } from "@self.id/web";

// // export default function Home() {
// //   const [connection, connect, disconnect] = useViewerConnection();
// //   const [did, setDid] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [isWindow, setIsWindow] = useState(false);
// //   const pollIntervalRef = useRef(null);

// //   useEffect(() => {
// //     if (typeof window !== "undefined") {
// //       setIsWindow(true);
// //       // Attach debug functions
// //       window.myDebug = {
// //         connection,
// //         connectAccount,
// //         disconnect,
// //       };
// //       console.log("Debug object set on window:", window.myDebug);
// //     }
// //   }, [connection]);

// //   useEffect(() => {
// //     console.log("Connection status:", connection.status);
// //   }, [connection.status]);

// //   // Polling for connection status changes
// //   useEffect(() => {
// //     if (connection.status === "connecting") {
// //       console.log("Polling for connection status...");
// //       pollIntervalRef.current = setInterval(() => {
// //         console.log("Polling - current status:", connection.status);
// //         if (connection.status === "connected") {
// //           clearInterval(pollIntervalRef.current);
// //           console.log("Status updated to connected!");
// //         }
// //       }, 2000);
// //     }
// //     return () => {
// //       if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
// //     };
// //   }, [connection.status]);

// //   async function createAuthProvider() {
// //     if (window.ethereum) {
// //       try {
// //         console.log("Requesting MetaMask accounts...");
// //         const addresses = await window.ethereum.request({ method: "eth_requestAccounts" });
// //         const address = addresses[0];
// //         console.log("MetaMask returned address:", address);
// //         return { authProvider: new EthereumAuthProvider(window.ethereum, address), address };
// //       } catch (error) {
// //         console.error("Error requesting MetaMask accounts:", error);
// //         throw error;
// //       }
// //     } else {
// //       console.error("MetaMask not detected.");
// //       throw new Error("MetaMask not detected");
// //     }
// //   }

// //   // Force disconnect before connecting (for debugging)
// //   async function forceReconnect() {
// //     if (connection.status === "connected") {
// //       console.log("Forcing disconnect...");
// //       await disconnect();
// //       setDid("");
// //       localStorage.removeItem("userDID");
// //     }
// //     connectAccount();
// //   }

// //   async function connectAccount() {
// //     setLoading(true);
// //     try {
// //       const result = await createAuthProvider();
// //       if (result && result.authProvider) {
// //         console.log("Attempting to connect using Self.ID...");
// //         await connect(result.authProvider);
// //         console.log("Self.ID connect() resolved.");
// //         // Wait a few seconds for connection state update
// //         setTimeout(() => {
// //           console.log("After timeout, connection status:", connection.status);
// //           if (connection.status === "connected" || connection.status === "connecting") {
// //             const userDid = `did:pkh:eip155:1:${result.address}`;
// //             console.log("Generated DID:", userDid);
// //             setDid(userDid);
// //             localStorage.setItem("userDID", userDid);
// //           } else {
// //             console.error("Connection status did not update as expected.");
// //           }
// //           setLoading(false);
// //         }, 3000);
// //       }
// //     } catch (error) {
// //       console.error("Error during wallet connection:", error);
// //       setLoading(false);
// //     }
// //   }

// //   return (
// //     <>
// //       <Head>
// //         <title>Wallet Connection Debug</title>
// //         <meta name="description" content="Connect your wallet and generate a DID" />
// //         <meta name="viewport" content="width=device-width, initial-scale=1" />
// //         <link rel="icon" href="/favicon.ico" />
// //       </Head>
// //       <main className="container my-5">
// //         <div className="bg-dark text-white text-center p-3 mb-4">
// //           <h1 className="display-4">Wallet Connection Demo</h1>
// //           <p className="lead">Click below to connect your MetaMask wallet.</p>
// //         </div>
// //         <div className="d-flex flex-column align-items-center">
// //           {connection.status !== "connected" ? (
// //             <>
// //               <button className="btn btn-primary mb-3" onClick={forceReconnect} disabled={loading}>
// //                 {loading ? "Connecting..." : "Connect Wallet"}
// //               </button>
// //               {isWindow && !window.ethereum && (
// //                 <p className="text-danger">
// //                   MetaMask is required. <a href="https://metamask.io/" target="_blank" rel="noreferrer">Install MetaMask</a>
// //                 </p>
// //               )}
// //             </>
// //           ) : (
// //             <div className="alert alert-success w-50" role="alert">
// //               Wallet Connected! Your DID: <strong>{did}</strong>
// //               <br />
// //               <button className="btn btn-danger mt-3" onClick={() => {
// //                 disconnect();
// //                 setDid("");
// //                 localStorage.removeItem("userDID");
// //               }}>
// //                 Disconnect
// //               </button>
// //             </div>
// //           )}
// //         </div>
// //       </main>
// //     </>
// //   );
// // }



// pages/index.js
// pages/index.js
import Head from "next/head";
import { useEffect, useState, useRef } from "react";
import { useViewerConnection } from "@self.id/react";
import { EthereumAuthProvider } from "@self.id/web";
import { connectWallet } from "../utils/web3";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  // Ceramic connection hook
  const [connection, connect, disconnect] = useViewerConnection();
  // States for wallet and DID
  const [did, setDid] = useState("");
  const [loading, setLoading] = useState(false);
  const [isWindow, setIsWindow] = useState(false);
  const pollIntervalRef = useRef(null);

  // Set isWindow to true on client-side
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsWindow(true);
      console.log("Running on client-side");
    }
  }, []);

  // Debug: Log connection status changes
  useEffect(() => {
    console.log("Connection status:", connection.status);
    // If connected, redirect to dashboard
    if (connection.status === "connected") {
      router.push("/dashboard");
    }
  }, [connection.status, router]);

  // Poll for connection state (for debugging)
  useEffect(() => {
    if (connection.status === "connecting") {
      console.log("Polling for connection status...");
      pollIntervalRef.current = setInterval(() => {
        console.log("Polling - current status:", connection.status);
        if (connection.status === "connected") {
          clearInterval(pollIntervalRef.current);
          console.log("Status is now connected!");
        }
      }, 2000);
    }
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [connection.status]);

  // Connect wallet and update DID using the imported connectWallet
  async function connectAccount() {
    setLoading(true);
    try {
      const address = await connectWallet();
      if (address) {
        console.log("Creating EthereumAuthProvider with address:", address);
        const authProvider = new EthereumAuthProvider(window.ethereum, address);
        console.log("Attempting to connect using Self.ID...");
        await connect(authProvider);
        console.log("Self.ID connect() resolved. Current connection status:", connection.status);
        // Wait a moment for the connection status to update
        setTimeout(() => {
          if (connection.status === "connected" || connection.status === "connecting") {
            const userDid = `did:pkh:eip155:1:${address}`;
            console.log("Generated DID:", userDid);
            setDid(userDid);
            localStorage.setItem("userDID", userDid);
          } else {
            console.error("Connection status did not update as expected.");
          }
          setLoading(false);
        }, 2500);
      } else {
        console.error("No address returned from connectWallet");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error during wallet connection:", error);
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Connect Wallet Only</title>
        <meta name="description" content="Connect your wallet using Ceramic and Self.ID" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container my-5">
        <div className="bg-dark text-white text-center p-3 mb-4">
          <h1 className="display-4">Wallet Connection Demo</h1>
          <p className="lead">Click the button below to connect your MetaMask wallet.</p>
        </div>
        <div className="d-flex flex-column align-items-center">
          {connection.status !== "connected" ? (
            <>
              <button
                className="btn btn-primary mb-3"
                onClick={connectAccount}
                disabled={loading}
              >
                {loading ? "Connecting..." : "Connect Wallet"}
              </button>
              {isWindow && !window.ethereum && (
                <p className="text-danger">
                  MetaMask is required.{" "}
                  <a href="https://metamask.io/" target="_blank" rel="noreferrer">
                    Install MetaMask
                  </a>
                </p>
              )}
            </>
          ) : (
            <div className="alert alert-success w-50" role="alert">
              Wallet Connected! Your DID: <strong>{did}</strong>
              <br />
              <button
                className="btn btn-danger mt-3"
                onClick={() => {
                  disconnect();
                  setDid("");
                  localStorage.removeItem("userDID");
                }}
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
