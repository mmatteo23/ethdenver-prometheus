import { useConnectWallet } from "@web3-onboard/react";
import React, { useEffect, useState } from "react";
import { useNetwork } from "wagmi";
import { Attestation, VeraxSdk } from "@verax-attestation-registry/verax-sdk";
// import { toBytes } from "viem";
import Select from "react-select";

import { attestationsData } from "../utils/costants";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { createAttestation, getAttestations } from "../utils/verax";

// Relationship Schema
// const SCHEMA_ID =
//   "0x89bd76e17fd84df8e1e448fa1b46dd8d97f7e8e806552b003f8386a5aebcb9f0";

const CreateAttestationLinks = () => {
  const [selectedOptions, setSelectedOptions] = useState(null);
  const [selectOptions, setSelectOptions] = useState([]);

  const [selectedMyOptions, setSelectedMyOptions] = useState(null);
  const [selectMyOptions, setSelectMyOptions] = useState([]);

  const [error, setError] = useState<string>("");
  const [veraxSdk, setVeraxSdk] = useState<VeraxSdk>();
  const [{ wallet }] = useConnectWallet();
  const { chain } = useNetwork();
  const [attestations, setAttestations] = useState<Attestation[]>([]);
  const [myAttestations, setMyAttestations] = useState<Attestation[]>([]);

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

  useEffect(() => {
    if (veraxSdk && accountData?.address) {
      // get attestations of user
      getAttestations(veraxSdk, false)
        .then((res) => setAttestations(res))
        .catch((e) => setError(`Oops, something went wrong: ${e.message}`));

      // get my attestations
      getAttestations(veraxSdk, false, accountData?.address)
        .then((res) => setMyAttestations(res))
        .catch((e) => setError(`Oops, something went wrong: ${e.message}`));
    } else {
      setAttestations(JSON.parse(JSON.stringify(attestationsData)));
    }
  }, [veraxSdk, accountData?.address]);

  // load all attestations as selectable options
  useEffect(() => {
    const tmpSelectOptions = [];
    attestations.forEach((attestation) => {
      tmpSelectOptions.push({
        value: attestation.id,
        label: attestation.decodedPayload[0].projectName,
      });
    });
    setSelectOptions(tmpSelectOptions);
  }, [attestations]);

  useEffect(() => {
    const tmpSelectOptions = [];
    myAttestations.forEach((attestation) => {
      tmpSelectOptions.push({
        value: attestation.id,
        label: attestation.decodedPayload[0].projectName,
      });
    });
    setSelectMyOptions(tmpSelectOptions);
  }, [myAttestations]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const baseProject = selectedMyOptions.value;
    const attestationToLink = selectedOptions.value;
    const payload = {
      subject_id: baseProject,
      predicate: "inspiredBy",
      object_id: attestationToLink,
    };
    await createAttestation(
      veraxSdk,
      accountData?.address,
      true,
      payload
    ).catch((e) => setError(`Oops, something went wrong: ${e.message}`));
  };

  return (
    <div className="flex flex-col items-center gap-4 w-6/12">
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
                defaultValue={selectedMyOptions}
                onChange={setSelectedMyOptions}
                options={selectMyOptions}
                isMulti={false}
              />

              <label htmlFor="attestationToLink">Inspired by</label>
              <Select
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
        {error !== "" && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default CreateAttestationLinks;
