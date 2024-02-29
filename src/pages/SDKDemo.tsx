import { type FunctionComponent, useEffect, useState } from "react";
import "./SDKDemo.css";
import { Attestation, VeraxSdk } from "@verax-attestation-registry/verax-sdk";
import { useAccount, useNetwork } from "wagmi";
import ConnectWallet from "../components/ConnectWallet.tsx";

const PORTAL_ID = "0x6ae91f2e1657a86aabd186e7c3525bc617ce54ce";
const SCHEMA_ID = "0x0bccab24e4b6b6cc2a71e6bc2874c4d76affaafd28715328782ebb4397e380dd";

export type SDKDemoProps = {
  title: string;
};

const SDKDemo: FunctionComponent<SDKDemoProps> = ({ title }) => {
  const [attestations, setAttestations] = useState<Attestation[]>([]);
  const [attestationsCounter, setAttestationsCounter] = useState<number>(0);
  const [txHash, setTxHash] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [veraxSdk, setVeraxSdk] = useState<VeraxSdk>();

  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    if (chain && address) {
      const sdkConf =
        chain.id === 59144 ? VeraxSdk.DEFAULT_LINEA_MAINNET_FRONTEND : VeraxSdk.DEFAULT_LINEA_TESTNET_FRONTEND;
      const sdk = new VeraxSdk(sdkConf, address);
      setVeraxSdk(sdk);
    }
  }, [chain, address]);

  const shortenHexString = (longString: string) => {
    return `${longString.slice(0, 6)}••••${longString.slice(longString.length - 4, longString.length)}`;
  };

  const getSomeAttestations = async () => {
    if (veraxSdk) {
      setAttestations(await veraxSdk.attestation.findBy(2, 1234));
    } else {
      console.error("SDK not instantiated");
    }
  };

  const getAttestationCounter = async () => {
    if (veraxSdk) {
      setAttestationsCounter((await veraxSdk.utils.getAttestationIdCounter()) as number);
    } else {
      console.error("SDK not instantiated");
    }
  };

  const createAnAttestation = async () => {
    if (veraxSdk) {
      try {
        // const hash = await veraxSdk.portal.attest(
        //   "0xeea25bc2ec56cae601df33b8fc676673285e12cc",
        //   {
        //     schemaId: "0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738",
        //     expirationDate: 1693583329,
        //     subject: "0x068579b2398992629df8dDbcB048D26d863f7A70",
        //     attestationData: [{ isBuidler: true }],
        //   },
        //   [],
        // );
        // setTxHash(hash);
        console.log(
          "Creating attestation with these params:",
          PORTAL_ID,
          SCHEMA_ID,
          Math.floor(Date.now() / 1000) + 25920000,
          address
        );
        const hash = await veraxSdk.portal.attest(
          PORTAL_ID,
          {
            schemaId: SCHEMA_ID,
            expirationDate: Math.floor(Date.now() / 1000) + 25920000,
            subject: address as string,
            attestationData: [
              {
                projectName: "Prometeus",
                owners: [address, "0x699d04F9994f181F3E310F70cF6aC8E8445aCe9A"],
                teamName: "Gli Scoppiati",
              },
            ],
          },
          []
        );
        setTxHash(hash as string);
      } catch (e) {
        console.log(e);
        if (e instanceof Error) {
          setError(`Oops, something went wrong: ${e.message}`);
        }
      }
    } else {
      console.error("SDK not instantiated");
    }
  };

  return (
    <>
      <h1>Verax - SDK Demo</h1>
      <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ConnectWallet />
      </div>

      <div className="card">
        <button onClick={getSomeAttestations}>Get 2 attestations from the subgraph</button>
        {attestations.length > 0 && (
          <>
            {attestations.map((attestation) => (
              <pre key={attestation.id}>
                ID = {shortenHexString(attestation.id)} - Subject = {shortenHexString(attestation.subject)}
              </pre>
            ))}
          </>
        )}
      </div>

      <div className="card">
        <button onClick={getAttestationCounter}>Count attestations from the contract</button>
        {attestationsCounter > 0 && <p>{`We have ${attestationsCounter} attestations at the moment`}</p>}
      </div>

      <div className="card">
        <button onClick={createAnAttestation} disabled={!isConnected}>
          Create an attestation via a Portal
        </button>
        {txHash !== "" && <p>{`Transaction with hash ${txHash} sent!`}</p>}
        {error !== "" && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </>
  );
};

export default SDKDemo;
