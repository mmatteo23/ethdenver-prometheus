import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";

const SCHEMA_ID = import.meta.env.VITE_PROJECT_SCHEMA;
const CUSTOM_SCHEMA_ID = import.meta.env.VITE_CUSTOM_RELATIONSHIP_SCHEMA;
const PORTAL_ID = import.meta.env.VITE_PROJECT_PORTAL;

export const getAttestations = async (
  veraxSdk: VeraxSdk,
  isLinkedAttestation: boolean,
  userAddress?: string
) => {
  const whereVerax = {
    schemaId: isLinkedAttestation ? CUSTOM_SCHEMA_ID : SCHEMA_ID,
  };
  if (userAddress) {
    whereVerax["subject"] = userAddress;
  }
  if (veraxSdk) {
    const result = await veraxSdk.attestation.findBy(
      undefined,
      undefined,
      whereVerax,
      "attestedDate",
      undefined
    );
    return result;
  } else {
    console.error("getAttestationsBySchemaId: SDK not instantiated");
  }
};

type IAttestationPayload = {
  projectName: string;
  owners: string[];
  teamName: string;
};
type IAttestationLinkPayload = {
  subject_id: string;
  predicate: string;
  object_id: string;
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
      linkedAttestationId: CUSTOM_SCHEMA_ID,
      expirationDate: Math.floor(Date.now() / 1000) + 25920000,
      payload: payload,
    });
    const txHash = await veraxSdk.portal.attest(
      PORTAL_ID,
      {
        schemaId: isAttestationLink ? CUSTOM_SCHEMA_ID : SCHEMA_ID,
        expirationDate: Math.floor(Date.now() / 1000) + 25920000,
        subject: userAddress as string,
        attestationData: [payload],
      },
      []
    );
    console.log("TX HASH", txHash);
    return txHash;
  } else {
    console.error("SDK not instantiated");
  }
};

export const createSchema = async (veraxSdk: VeraxSdk, userAddress: string) => {
  if (veraxSdk && userAddress) {
    const txHash = await veraxSdk.schema.create(
      "New Relationship Schema",
      "Custom Relationship Schema",
      "https://ver.ax/#/tutorials",
      "(string subject, string predicate, string object)"
    );
    console.log("TX HASH", txHash);
    return txHash;
  } else {
    console.error("SDK not instantiated");
  }
};
