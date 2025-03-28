import { useState } from "react";
import { useRouter } from "next/router";

// Update the import to a named export
import { CeramicClient } from "@ceramicnetwork/http-client";
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import { randomBytes } from "@stablelib/random";

export default function Profile() {
  const router = useRouter();
  const { wallet } = router.query;

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    github: "",
    aadhar: "",
    fiverr: "",
    upwork: "",
    additional: ""
  });
  const [didCreated, setDidCreated] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to create a Ceramic DID using a randomly generated seed
  const createCeramicDID = async (profileData) => {
    // Initialize Ceramic client (using Ceramic Clay testnet)
    const ceramic = new CeramicClient("https://ceramic-clay.3boxlabs.com");

    // Generate a random seed for the DID (32 bytes)
    const seed = randomBytes(32);
    const provider = new Ed25519Provider(seed);
    const did = new DID({ 
      provider, 
      resolver: { ...getResolver() } 
    });

    await did.authenticate();
    ceramic.did = did;

    // Optionally, you can use profileData to create or update a stream with additional info.
    // For this example, we simply return the DID identifier.
    return did.id;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const completeProfile = { wallet, ...formData };
    console.log("Form submitted:", completeProfile);

    try {
      const createdDID = await createCeramicDID(completeProfile);
      setDidCreated(createdDID);
    } catch (error) {
      console.error("Error creating DID:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Complete Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Wallet Address</label>
          <input
            type="text"
            className="form-control"
            value={wallet || ""}
            readOnly
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            name="name"
            type="text"
            className="form-control"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Date of Birth</label>
          <input
            name="dob"
            type="date"
            className="form-control"
            value={formData.dob}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">GitHub</label>
          <input
            name="github"
            type="url"
            className="form-control"
            placeholder="https://github.com/yourprofile"
            value={formData.github}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Aadhar</label>
          <input
            name="aadhar"
            type="text"
            className="form-control"
            placeholder="Enter your Aadhar number"
            value={formData.aadhar}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Fiverr Link</label>
          <input
            name="fiverr"
            type="url"
            className="form-control"
            placeholder="https://www.fiverr.com/yourprofile"
            value={formData.fiverr}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Upwork Link</label>
          <input
            name="upwork"
            type="url"
            className="form-control"
            placeholder="https://www.upwork.com/yourprofile"
            value={formData.upwork}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Additional Freelance Account</label>
          <input
            name="additional"
            type="text"
            className="form-control"
            placeholder="Enter any additional freelance account details"
            value={formData.additional}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit Profile
        </button>
      </form>
      {didCreated && (
        <div className="alert alert-success mt-4">
          <h4>Your Ceramic DID:</h4>
          <p>{didCreated}</p>
        </div>
      )}
    </div>
  );
}
