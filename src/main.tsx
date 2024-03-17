import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import { WagmiConfig } from "wagmi";
import { linea, lineaTestnet, mainnet } from "wagmi/chains";
import { defaultWagmiConfig } from "@web3modal/wagmi/react";

import { Web3OnboardProvider, init } from "@web3-onboard/react";
import injectedModule from "@web3-onboard/injected-wallets";
import { chains as metamaskChains } from "./utils/costants.ts";

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "";

const metadata = {
  name: "Prometeus",
  url: "https://github.com/mmatteo23/ethdenver-prometeus",
};

const chains = [linea, lineaTestnet, mainnet];
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

const wallets = [injectedModule()];
const web3Onboard = init({
  wallets,
  chains: metamaskChains,
  appMetadata: {
    name: "Prometheus",
    description:
      "Create an attestation of your projects and inspire others to build on them.",
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Web3OnboardProvider web3Onboard={web3Onboard}>
      <WagmiConfig config={wagmiConfig}>
        <App />
      </WagmiConfig>
    </Web3OnboardProvider>
  </React.StrictMode>
);
