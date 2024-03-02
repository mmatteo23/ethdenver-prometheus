import { useConnectWallet } from "@web3-onboard/react";
import React, { useEffect, useState } from "react";
import { useNetwork } from "wagmi";
import { Attestation, VeraxSdk } from "@verax-attestation-registry/verax-sdk";

const SCHEMA_ID =
  "0x0bccab24e4b6b6cc2a71e6bc2874c4d76affaafd28715328782ebb4397e380dd";

const GetProjects = () => {
  const [error, setError] = useState<string>("");
  const [veraxSdk, setVeraxSdk] = useState<VeraxSdk>();
  const [{ wallet }] = useConnectWallet();
  const { chain } = useNetwork();
  const [attestations, setAttestations] = useState<Attestation[]>([]);

  const accountData = wallet?.accounts[0];

  console.log("VERAX SDK", veraxSdk);

  useEffect(() => {
    if (chain && accountData?.address) {
      const sdkConf =
        chain.id === 59144
          ? VeraxSdk.DEFAULT_LINEA_MAINNET_FRONTEND
          : VeraxSdk.DEFAULT_LINEA_TESTNET_FRONTEND;
      const sdk = new VeraxSdk(sdkConf, accountData?.address as `0x${string}`);
      setVeraxSdk(sdk);
    }
  }, [chain, accountData?.address]);

  useEffect(() => {
    if (veraxSdk && accountData?.address) {
      getAttestationsBySchemaId();
    }
  }, [veraxSdk]);

  const getAttestationsBySchemaId = async () => {
    if (veraxSdk && accountData?.address) {
      try {
        const result = await veraxSdk.attestation.findBy(
          undefined,
          undefined,
          { schemaId: SCHEMA_ID },
          "attestedDate",
          undefined
        );
        setAttestations(result);
        console.log("Attestations", result);
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
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-xl font-bold">Attestations</h1>
        {!error ? (
          attestations.map((attestation, i) => (
            <div key={i} className="flex flex-col gap-2">
              <p>{attestation.attestationId}</p>
              <p>{attestation.attestedDate}</p>
              <p>{attestation.attester}</p>
              <p>{attestation.attestationData}</p>
              <p>{JSON.stringify(attestation.decodedPayload)}</p>
            </div>
          ))
        ) : (
          <p>{error}</p>
        )}
      </div>
    </>
  );
};

export default GetProjects;
