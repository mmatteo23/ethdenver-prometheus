import { useEffect, useState } from "react";
import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";
import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import { LineaTestnetChain } from "../utils/costants";

const SCHEMA_ID = import.meta.env.VITE_PROJECT_SCHEMA || "0x0bccab24e4b6b6cc2a71e6bc2874c4d76affaafd28715328782ebb4397e380dd";
const CUSTOM_SCHEMA_ID = import.meta.env.VITE_CUSTOM_RELATIONSHIP_SCHEMA || "0xa14e1c01467bc670edc3790c2692293a2837d1168d0ad87a1a64680216f647fa";
const PORTAL_ID = import.meta.env.VITE_PROJECT_PORTAL || "0x6ae91f2e1657a86aabd186e7c3525bc617ce54ce";

export type IAttestationPayload = {
  projectName: string;
  owners: string[];
  teamName: string;
};
export type IAttestationLinkPayload = {
  subject: string;
  predicate: string;
  object: string;
};

export const useVeraxSdk = () => {
  const [{ wallet }] = useConnectWallet();
  const accountAddress = wallet?.accounts[0].address;

  const [veraxSdk, setVeraxSdk] = useState<VeraxSdk>();
  const [{ connectedChain }, setChain] = useSetChain();

  useEffect(() => {
    if (!veraxSdk) {
      if (connectedChain) {
        const sdk = new VeraxSdk(
          VeraxSdk.DEFAULT_LINEA_TESTNET_FRONTEND,
          accountAddress ? (accountAddress as `0x${string}`) : undefined
        );
        setVeraxSdk(sdk);
      } else {
        console.log("veraxSdk: Linea Goerli chain not connected");
        if (connectedChain && accountAddress) {
          // so connectedChain is undefined or not Linea Testnet
          setChain({ chainId: LineaTestnetChain.id });
        }
      }
    }
  }, [veraxSdk, wallet, accountAddress, connectedChain, setChain]);

  return veraxSdk;
};

export const getAttestations = async (
  veraxSdk: VeraxSdk,
  isAttestationLink: boolean,
  userAddress?: string
) => {
  const whereVerax = {
    schemaId: isAttestationLink ? CUSTOM_SCHEMA_ID : SCHEMA_ID,
  };
  if (userAddress) {
    whereVerax["subject"] = userAddress;
  }
  if (veraxSdk) {
    const result = await veraxSdk.attestation.findBy(
      undefined, // first
      undefined, // skip
      whereVerax, // where
      "attestedDate", // order by
      undefined // order direction
    );
    return result;
  } else {
    console.error("getAttestationsBySchemaId: SDK not instantiated");
  }
};

export const createAttestation = async (
  veraxSdk: VeraxSdk,
  userAddress: string,
  isAttestationLink: boolean,
  payload: IAttestationPayload | IAttestationLinkPayload
) => {
  if (veraxSdk && userAddress) {
    console.log("Creating attestation with these params:", {
      portalId: PORTAL_ID,
      schemaId: isAttestationLink ? CUSTOM_SCHEMA_ID : SCHEMA_ID,
      expirationDate: Math.floor(Date.now() / 1000) + 25920000,
      subject: userAddress,
      attestationData: [payload],
    });
    const txHash = await veraxSdk.portal.attest(
      PORTAL_ID, // portal address
      {
        schemaId: isAttestationLink ? CUSTOM_SCHEMA_ID : SCHEMA_ID,
        expirationDate: Math.floor(Date.now() / 1000) + 25920000,
        subject: userAddress as string,
        attestationData: [payload],
      },
      []
    );
    console.log("createAttestation txHash", txHash);
    return txHash;
  } else {
    console.error("SDK not instantiated");
  }
};

export const createSchema = async (veraxSdk: VeraxSdk, userAddress: string) => {
  if (veraxSdk && userAddress) {
    const txHash = await veraxSdk.schema.create(
      "New Relationship Schema", // name
      "Custom Relationship Schema", // description
      "https://ver.ax/#/tutorials", // context
      "(string subject, string predicate, string object)" // schemaString
    );
    console.log("createSchema txHash", txHash);
    return txHash;
  } else {
    console.error("SDK not instantiated");
  }
};

export const checkSchema = async (veraxSdk: VeraxSdk, schemaId: string) => {
  if (veraxSdk) {
    const schema = (await veraxSdk.schema.getSchema(schemaId)) as boolean;
    console.log("checkSchema", schema);
    return schema;
  } else {
    console.error("SDK not instantiated");
  }
};

export const checkAllSchemes = async (veraxSdk: VeraxSdk) => {
  if (veraxSdk) {
    const s = checkSchema(veraxSdk, SCHEMA_ID);
    const c = checkSchema(veraxSdk, CUSTOM_SCHEMA_ID);
    return [s, c];
  } else {
    console.error("SDK not instantiated");
  }
};
