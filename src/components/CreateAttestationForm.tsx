import { useConnectWallet } from "@web3-onboard/react";
import React, { useEffect, useState } from "react";
import { useNetwork } from "wagmi";
import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

const PORTAL_ID = import.meta.env.VITE_PROJECT_PORTAL;
const SCHEMA_ID = import.meta.env.VITE_PROJECT_SCHEMA;

const CreateAttestationForm = () => {
  const [error, setError] = useState<string>("");
  const [veraxSdk, setVeraxSdk] = useState<VeraxSdk>();
  const [{ wallet }] = useConnectWallet();
  const { chain } = useNetwork();
  const [txHash, setTxHash] = useState<string>("");

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
        console.log("TX HASH", txHash);
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
    };
    const projectName = target.projectName.value;
    const owners = target.owners.value.split(", ");
    const teamName = target.teamName.value;

    console.log("Create Attestation", projectName, owners, teamName);
    await createAnAttestation(projectName, owners, teamName);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-6/12">
      <h1 className="text-2xl font-bold">Step1: Create Attestation</h1>
      <form onSubmit={handleSubmit} className="flex flex-col max-w-[90%]">
        <Card>
          <CardHeader>
            <CardTitle>Create an Attestation</CardTitle>
            <CardDescription>Protect your IP with attestation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <label htmlFor="projectName">Project Name</label>
              <input
                type="text"
                name="projectName"
                placeholder="Project Name"
                className="bg-slate-100 px-2"
              />

              <label htmlFor="owner">Owners</label>
              <input
                type="text"
                name="owners"
                placeholder="owner1, owner2, owner3"
                className="bg-slate-100 px-2"
              />

              <label htmlFor="owner">Team Name</label>
              <input
                type="text"
                name="teamName"
                placeholder="supreme ethdenver team"
                className="bg-slate-100 px-2"
              />
            </div>
          </CardContent>
          <CardFooter>
            <button
              type="submit"
              className="btn btn-primary p-2 border border-black rounded-lg"
              disabled={!accountData?.address || !veraxSdk}
            >
              Create
            </button>
          </CardFooter>
        </Card>
        {error !== "" && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default CreateAttestationForm;
