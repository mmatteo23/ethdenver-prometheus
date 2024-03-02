import { useConnectWallet } from "@web3-onboard/react";
import React, { useEffect, useState } from "react";
import { useNetwork } from "wagmi";
import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";

const PORTAL_ID = "0x6ae91f2e1657a86aabd186e7c3525bc617ce54ce";
const SCHEMA_ID =
  "0x0bccab24e4b6b6cc2a71e6bc2874c4d76affaafd28715328782ebb4397e380dd";

const CreateAttestationForm = () => {
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
    projectName: string,
    owners: string[],
    teamName: string
  ) => {
    if (veraxSdk && accountData?.address) {
      try {
        console.log(
          "Creating attestation with these params:",
          PORTAL_ID,
          SCHEMA_ID,
          Math.floor(Date.now() / 1000) + 25920000,
          [accountData.address].concat(owners)
        );
        const hash = await veraxSdk.portal.attest(
          PORTAL_ID,
          {
            schemaId: SCHEMA_ID,
            expirationDate: Math.floor(Date.now() / 1000) + 25920000,
            subject: accountData.address as string,
            attestationData: [
              {
                projectName: projectName,
                owners: [accountData.address].concat(owners),
                teamName: teamName,
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
      projectName: { value: string };
      owners: { value: string };
      teamName: { value: string };
      inspirationIds: { value: string };
    };
    const projectName = target.projectName.value;
    const owners = target.owners.value.split(", ");
    const teamName = target.teamName.value;
    const inspirationIds = target.inspirationIds.value.split(", ");

    console.log(
      "Create Attestation",
      projectName,
      owners,
      teamName,
      inspirationIds
    );
    await createAnAttestation(projectName, owners, teamName);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-3xl font-bold">Create Attestation</h1>
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

export default CreateAttestationForm;
