import { useSetChain, useConnectWallet } from "@web3-onboard/react";
import React, { useEffect, useState } from "react";
import { useNetwork } from "wagmi";
import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";

import { LineaTestnetChain } from "../utils/costants";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { createAttestation } from "../utils/verax";

const CreateAttestationForm = () => {
  const [error, setError] = useState<string>("");
  const [veraxSdk, setVeraxSdk] = useState<VeraxSdk>();
  const [{ wallet }] = useConnectWallet();
  const { chain } = useNetwork();

  const [
    {
      // chains, // the list of chains that web3-onboard was initialized with
      connectedChain, // the current chain the user's wallet is connected to
      // settingChain, // boolean indicating if the chain is in the process of being set
    },
    setChain, // function to call to initiate user to switch chains in their wallet
  ] = useSetChain();

  console.log("Chain", chain);

  const accountData = wallet?.accounts[0];
  console.log("VERAX SDK (Profile)", veraxSdk);

  console.log("Connected Chain", connectedChain);
  console.log("Account", accountData);

  useEffect(() => {
    if (!veraxSdk) {
      if (connectedChain && accountData?.address) {
        const sdkConf =
          connectedChain.id === LineaTestnetChain.id
            ? VeraxSdk.DEFAULT_LINEA_MAINNET_FRONTEND
            : VeraxSdk.DEFAULT_LINEA_TESTNET_FRONTEND;
        const sdk = new VeraxSdk(
          sdkConf,
          accountData?.address as `0x${string}`
        );
        setVeraxSdk(sdk);
        console.log("Verax SDK (after init)", sdk);
      } else {
        console.error("Chain not connected");
        if (accountData?.address) {
          // so connectedChain is undefined
          setChain({
            chainId: LineaTestnetChain.id,
          });
        }
      }
    }
  }, [connectedChain, accountData, accountData?.address, setChain, veraxSdk]);

  // remove error after 3 seconds
  useEffect(() => {
    if (error !== "") {
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  }, [error]);

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
    const payload = {
      projectName: projectName,
      owners: owners,
      teamName: teamName,
    };
    createAttestation(veraxSdk, accountData?.address, false, payload).catch(
      (e) => {
        console.error(e);
        setError(`Oops3, something went wrong: ${e.message}`);
      }
    );
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
