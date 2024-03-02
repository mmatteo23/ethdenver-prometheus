import { useConnectWallet } from "@web3-onboard/react";
import React, { useEffect, useState } from "react";
import { useNetwork } from "wagmi";
import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";
// import { toBytes } from "viem";

const PORTAL_ID = import.meta.env.VITE_PROJECT_PORTAL;
// Relationship Schema
// const SCHEMA_ID =
//   "0x89bd76e17fd84df8e1e448fa1b46dd8d97f7e8e806552b003f8386a5aebcb9f0";

const CUSTOM_SCHEMA_ID = import.meta.env.VITE_CUSTOM_RELATIONSHIP_SCHEMA;

// const Linea_AttestationId =
//   "000000000000000000000000000000000000000000000000000000000000173d";
// const Prometheus_AttestationId =
//   "000000000000000000000000000000000000000000000000000000000000173e";

const CreateAttestationLinks = () => {
  const [error, setError] = useState<string>("");
  const [veraxSdk, setVeraxSdk] = useState<VeraxSdk>();
  const [{ wallet }] = useConnectWallet();
  const { chain } = useNetwork();
  const [txHash, setTxHash] = useState<string>("");

  const accountData = wallet?.accounts[0];

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

  const createAnAttestation = async (
    subject_id: string,
    predicate: string,
    object_id: string
  ) => {
    if (veraxSdk && accountData?.address) {
      try {
        console.log(
          "Creating attestation with these params:",
          PORTAL_ID,
          CUSTOM_SCHEMA_ID,
          Math.floor(Date.now() / 1000) + 25920000,
          subject_id,
          predicate,
          object_id
        );
        console.log({
          subject: subject_id,
          predicate: predicate,
          object: object_id,
        });
        const hash = await veraxSdk.portal.attest(
          PORTAL_ID,
          {
            schemaId: CUSTOM_SCHEMA_ID,
            expirationDate: Math.floor(Date.now() / 1000) + 25920000,
            subject: accountData.address as string,
            attestationData: [
              {
                subject: subject_id,
                predicate: predicate,
                object: object_id,
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      baseProject: { value: string };
      linkedAttestations: { value: string };
    };
    const baseProject = target.baseProject.value;
    const attestationToLink = target.linkedAttestations.value;

    await createAnAttestation(baseProject, "inspiredBy", attestationToLink);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-6/12">
      <h1 className="text-2xl font-bold">Step2: Link other projects</h1>
      <form onSubmit={handleSubmit} className="flex flex-col max-w-[90%]">
        <label htmlFor="baseProject">Choose a project</label>
        <input type="text" name="baseProject" placeholder="Project id" />

        <label htmlFor="attestationToLink">Inspired by</label>
        <input
          type="text"
          name="attestationToLink"
          placeholder="Attestation id"
        />

        <button
          type="submit"
          className="btn btn-primary p-2 bg-slate-300 rounded-lg"
          disabled={!accountData?.address || !veraxSdk}
        >
          Create Link
        </button>
        {txHash !== "" && <p>{`Transaction with hash ${txHash} sent!`}</p>}
        {error !== "" && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default CreateAttestationLinks;
