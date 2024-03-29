import { useConnectWallet } from "@web3-onboard/react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { waitForTransaction } from "@wagmi/core";

import { Attestation } from "@verax-attestation-registry/verax-sdk";

import Select from "react-select";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  IAttestationLinkPayload,
  createAttestation,
  useVeraxSdk,
} from "../utils/verax";
import { LineaTestnetChain } from "../utils/costants";

const CreateAttestationLinks = ({
  attestations,
  myAttestations,
  setLinked,
}: {
  attestations: Attestation[];
  myAttestations: Attestation[];
  setLinked: Dispatch<SetStateAction<number>>;
}) => {
  const [selectedOptions, setSelectedOptions] = useState(null);
  const [selectOptions, setSelectOptions] = useState([]);

  const [selectedMyOptions, setSelectedMyOptions] = useState(null);
  const [selectMyOptions, setSelectMyOptions] = useState([]);

  const [error, setError] = useState<string>("");

  const [{ wallet }] = useConnectWallet();
  const accountData = wallet?.accounts[0];
  const veraxSdk = useVeraxSdk();

  // load all attestations as selectable options
  useEffect(() => {
    if (!attestations || attestations.length === 0) {
      return;
    }
    const tmpSelectOptions = [];
    attestations.forEach((attestation) => {
      tmpSelectOptions.push({
        value: attestation.id,
        label: attestation.decodedPayload[0].projectName,
      });
    });
    setSelectOptions(tmpSelectOptions);
  }, [attestations]);

  // load my attestations as selectable options
  useEffect(() => {
    if (!myAttestations || myAttestations.length === 0) {
      return;
    }
    const tmpSelectOptions = [];
    myAttestations.forEach((attestation) => {
      tmpSelectOptions.push({
        value: attestation.id,
        label: attestation.decodedPayload[0].projectName,
      });
    });
    setSelectMyOptions(tmpSelectOptions);
  }, [myAttestations]);

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

    const baseProject = selectedMyOptions.value;
    const attestationToLink = selectedOptions.value;
    const payload: IAttestationLinkPayload = {
      subject: baseProject,
      predicate: "inspiredBy",
      object: attestationToLink,
    };
    await createAttestation(veraxSdk, accountData?.address, true, payload)
      .then((res) => {
        waitForTransaction({
          chainId: parseInt(LineaTestnetChain.id, 16), // should use better hex to number conversion
          hash: res as `0x${string}`,
        }).then(() => setLinked((prev) => prev + 1));
      })
      .catch((e) => {
        console.error(e);
        setError(`Oops, something went wrong: ${e.message}`);
      });
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <h1 className="text-2xl font-bold">Step2: Link other projects</h1>
      <form onSubmit={handleSubmit} className="flex flex-col max-w-[90%]">
        <Card>
          <CardHeader>
            <CardTitle>Create a Link</CardTitle>
            <CardDescription>
              Choose the project that inspired you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <label htmlFor="baseProject">Choose a project</label>
              <Select
                id="baseProject"
                defaultValue={selectedMyOptions}
                onChange={setSelectedMyOptions}
                options={selectMyOptions}
                isMulti={false}
              />

              <label htmlFor="attestationToLink">Inspired by</label>
              <Select
                id="attestationToLink"
                defaultValue={selectedOptions}
                onChange={setSelectedOptions}
                options={selectOptions}
                isMulti={false}
              />
            </div>
          </CardContent>
          <CardFooter>
            <button
              type="submit"
              className="btn btn-primary p-2 border border-black rounded-lg"
              disabled={!accountData?.address || !veraxSdk}
            >
              Create Link
            </button>
          </CardFooter>
        </Card>
        {error !== "" ? <p style={{ color: "red" }}>{error}</p> : null}
      </form>
    </div>
  );
};

export default CreateAttestationLinks;
