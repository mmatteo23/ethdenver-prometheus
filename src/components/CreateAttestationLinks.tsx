import { useConnectWallet } from "@web3-onboard/react";
import React, { useEffect, useState } from "react";
import { useNetwork } from "wagmi";
import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";

const PORTAL_ID = "0x6ae91f2e1657a86aabd186e7c3525bc617ce54ce";
// Relationship Schema
const SCHEMA_ID =
  "0x89bd76e17fd84df8e1e448fa1b46dd8d97f7e8e806552b003f8386a5aebcb9f0";

const Linea_AttestationId =
  "0x000000000000000000000000000000000000000000000000000000000000173d";
const Prometheus_AttestationId =
  "0x000000000000000000000000000000000000000000000000000000000000173e";

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
          SCHEMA_ID,
          Math.floor(Date.now() / 1000) + 25920000,
          subject_id,
          predicate,
          object_id
        );
        const hash = await veraxSdk.portal.attest(
          PORTAL_ID,
          {
            schemaId: SCHEMA_ID,
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
    // const target = e.target as typeof e.target & {
    //   subject_id: { value: string };
    //   object_id: { value: string };
    // };
    // const projectName = target.subject_id.value;
    // const teamName = target.object_id.value;

    await createAnAttestation(
      Prometheus_AttestationId,
      "inspiredBy",
      Linea_AttestationId
    );
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-xl font-bold">Link other projects</h1>
      <form onSubmit={handleSubmit} className="flex flex-col max-w-[90%]">
        <label htmlFor="projectName">Project Name</label>
        <input type="text" name="projectName" placeholder="Project Name" />

        <label htmlFor="owner">Owners</label>
        <input type="text" name="owners" placeholder="owner1, owner2, owner3" />

        <label htmlFor="owner">Team Name</label>
        <input
          type="text"
          name="teamName"
          placeholder="supreme ethdenver team"
        />

        <label htmlFor="inspirationIds">Inspiration Attestation Ids</label>
        <input
          name="inspirationIds"
          type="text"
          placeholder="attestationId1, attestationId2, attestationId3"
        />
        <button
          type="submit"
          className="btn btn-primary p-2 bg-slate-300 rounded-lg"
          disabled={!accountData?.address || !veraxSdk}
        >
          Create Attestation
        </button>
        {txHash !== "" && <p>{`Transaction with hash ${txHash} sent!`}</p>}
        {error !== "" && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default CreateAttestationLinks;
