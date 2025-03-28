import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;


// // pages/_app.js
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Provider } from "@self.id/react";
// // import "../styles/globals.css";

// export default function App({ Component, pageProps }) {
//   return (
//     <Provider client={{ ceramic: "testnet-clay" }}>
//       <Component {...pageProps} />
//     </Provider>
//   );
// }
