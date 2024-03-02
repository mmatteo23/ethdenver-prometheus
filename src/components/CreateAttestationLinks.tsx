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

const PORTAL_ID = import.meta.env.VITE_PROJECT_PORTAL;
// Relationship Schema
// const SCHEMA_ID =
//   "0x89bd76e17fd84df8e1e448fa1b46dd8d97f7e8e806552b003f8386a5aebcb9f0";

const SCHEMA_ID = import.meta.env.VITE_PROJECT_SCHEMA;

const CUSTOM_SCHEMA_ID = import.meta.env.VITE_CUSTOM_RELATIONSHIP_SCHEMA;

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
      getAttestationsBySchemaId().catch((e) => console.error(e));
      getAttestationsByUser().catch((e) => console.error(e));
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
        console.log("TX HASH", hash);
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

  const getAttestationsByUser = async () => {
    if (veraxSdk && accountData?.address) {
      try {
        const result = await veraxSdk.attestation.findBy(
          undefined,
          undefined,
          { schemaId: SCHEMA_ID, subject: accountData.address },
          "attestedDate",
          undefined
        );
        setMyAttestations(result);
        console.log("My Attestations", result);
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

    const baseProject = selectedMyOptions.value;
    const attestationToLink = selectedOptions.value;

    await createAnAttestation(baseProject, "inspiredBy", attestationToLink);
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
