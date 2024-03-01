import "./App.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.tsx";
// import Poh from "./pages/Poh.tsx";
// import SDKDemo from "./pages/SDKDemo.tsx";
import Navbar from "./components/Navbar.tsx";
import Footer from "./components/Footer.tsx";
// import Explorer from "./pages/Explorer.tsx";
import Profile from "./pages/Profile.tsx";
import metamaskSDK from "@web3-onboard/metamask";
import { init } from "@web3-onboard/react";
import { chains } from "./utils/costants.ts";

// initialize the module with options
const metamaskSDKWallet = metamaskSDK({
  options: {
    extensionOnly: false,
    logging: {
      developerMode: true,
    },
    dappMetadata: {
      name: "Prometheus",
    },
  },
});

init({
  // ... other Onboard options
  wallets: [
    metamaskSDKWallet,
    //... other wallets
  ],
  chains,
});

function App() {
  return (
    <HashRouter>
      <header>
        <Navbar />
      </header>
      <Routes>
        <Route path="*" element={<Home title={"Prometeus"} />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <footer>
        <Footer />
      </footer>
    </HashRouter>
  );
}

export default App;
