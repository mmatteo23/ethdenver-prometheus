import { useConnectWallet } from "@web3-onboard/react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { waitForTransaction } from "@wagmi/core";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  IAttestationPayload,
  createAttestation,
  useVeraxSdk,
} from "../utils/verax";
import { LineaTestnetChain } from "../utils/costants";

const CreateAttestationForm = ({
  setCreated,
}: {
  setCreated: Dispatch<SetStateAction<number>>;
}) => {
  const [error, setError] = useState<string>("");

  const [{ wallet }] = useConnectWallet();
  const accountData = wallet?.accounts[0];
  const veraxSdk = useVeraxSdk();

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
    const payload: IAttestationPayload = {
      projectName: projectName,
      owners: [accountData.address].concat(owners),
      teamName: teamName,
    };
    createAttestation(veraxSdk, accountData?.address, false, payload)
      .then((res) => {
        waitForTransaction({
          chainId: parseInt(LineaTestnetChain.id, 16), // should use better hex to number conversion
          hash: res as `0x${string}`,
        }).then(() => setCreated((prev) => prev + 1));
      })
      .catch((e) => {
        console.error(e);
        setError(`Oops3, something went wrong: ${e.message}`);
      });
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
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
                id="projectName"
                type="text"
                name="projectName"
                placeholder="Project Name"
                className="bg-slate-100 px-2"
              />

              <label htmlFor="owners">Owners</label>
              <input
                id="owners"
                type="text"
                name="owners"
                placeholder="owner1, owner2, owner3"
                className="bg-slate-100 px-2"
              />

              <label htmlFor="teamName">Team Name</label>
              <input
                id="teamName"
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
              Create Attestation
            </button>
          </CardFooter>
        </Card>
        {error !== "" && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default CreateAttestationForm;
