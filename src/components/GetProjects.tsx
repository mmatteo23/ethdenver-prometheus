import { useConnectWallet } from "@web3-onboard/react";
import React, { useEffect, useState } from "react";
import { useNetwork } from "wagmi";
import { Attestation, VeraxSdk } from "@verax-attestation-registry/verax-sdk";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";

import attestationJson from "../assets/attestations.json";

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
    } else {
      setAttestations(JSON.parse(JSON.stringify(attestationJson)));
    }
  }, [veraxSdk, accountData?.address]);

  useEffect(() => {
    if (attestations.length > 0)
      console.log(
        "Attestations",
        JSON.parse(
          JSON.stringify(attestations[0].decodedPayload[0].projectName)
        )
      );
  }, [attestations]);

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
      {error && <div className="text-red-500">{error}</div>}
      {attestations.length > 0 ? (
        <Table>
          <TableCaption>A list of all attestations</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Attestation Id</TableHead>
              <TableHead>Project Name</TableHead>
              <TableHead>Team Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attestations.map((attestation, i) => (
              <TableRow key={i}>
                <TableCell>{attestation.id}</TableCell>
                <TableCell>
                  {JSON.parse(
                    JSON.stringify(attestation.decodedPayload[0].projectName)
                  )}
                </TableCell>
                <TableCell>
                  {JSON.parse(
                    JSON.stringify(attestation.decodedPayload[0].teamName)
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : null}
    </>
  );
};

export default GetProjects;