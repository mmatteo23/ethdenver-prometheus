import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { WagmiConfig } from "wagmi";
import { linea, lineaTestnet, mainnet } from "wagmi/chains";
import { defaultWagmiConfig } from "@web3modal/wagmi/react";

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "";

const metadata = {
  name: "Prometeus",
  url: "https://github.com/mmatteo23/ethdenver-prometeus",
};

const chains = [linea, lineaTestnet, mainnet];
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// createWeb3Modal({ wagmiConfig, projectId, chains });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <App />
    </WagmiConfig>
  </React.StrictMode>
);
