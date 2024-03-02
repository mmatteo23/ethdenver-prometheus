import { useConnectWallet } from "@web3-onboard/react";
import { useEffect, useState } from "react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

import { attestationsData } from "../utils/costants";
import React from "react";

const SCHEMA_ID = import.meta.env.VITE_PROJECT_SCHEMA;

const GetProjectsByUser = () => {
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
      getAttestationsByUser();
    } else {
      setAttestations(JSON.parse(JSON.stringify(attestationsData)));
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

  const lessUsername = (username: string) => {
    if (username.length < 10 || !username) {
      return username;
    } else return `${username.slice(0, 6)}...${username.slice(-4)}`;
  };

  return (
    <>
      <h2>List of your attestations</h2>
      {error && <div className="text-red-500">{error}</div>}
      {attestations.length > 0 ? (
        <Table>
          <TableCaption>List of your attestations</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Attestation Id</TableHead>
              <TableHead>Project Name</TableHead>
              <TableHead>Team Name</TableHead>
              <TableHead>Owners</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attestations.map((attestation, i) => (
              <TableRow key={i}>
                <TableCell
                  className="cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(attestation.id);
                  }}
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        {lessUsername(attestation.id)}
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Click to copy to clipboard</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
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
                <TableCell>
                  {attestation.decodedPayload[0].owners
                    .map((o) => lessUsername(o))
                    .join(", ")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        "No attestations found."
      )}
    </>
  );
};

export default GetProjectsByUser;
