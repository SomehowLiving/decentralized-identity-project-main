// pages/dashboard.js
import Head from "next/head";

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="User Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="container my-5">
        <div className="alert alert-info">
          <h1>Welcome to the Dashboard!</h1>
          <p>Your wallet is connected, and your DID has been generated.</p>
        </div>
      </main>
    </>
  );
}
