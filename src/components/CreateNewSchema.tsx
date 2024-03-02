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

const CreateNewSchema = () => {
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

  const createVeraxSchema = async () => {
    if (veraxSdk && accountData?.address) {
      try {
        const txHash = await veraxSdk.schema.create(
          "New Relationship Schema",
          "Custom Relationship Schema",
          "https://ver.ax/#/tutorials",
          "(string subject, string predicate, string object)"
        );
        setTxHash(txHash as string);
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
    await createVeraxSchema();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-xl font-bold">Create a new schema</h1>
      <form onSubmit={handleSubmit} className="flex flex-col max-w-[90%]">
        <Card>
          <CardHeader>
            <CardTitle>Create a Schema</CardTitle>
            <CardDescription>Protect your IP with attestation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4"></div>
          </CardContent>
          <CardFooter>
            <button
              type="submit"
              className="btn btn-primary p-2 border border-black rounded-lg"
              disabled={!accountData?.address || !veraxSdk}
            >
              Create a schema
            </button>
          </CardFooter>
        </Card>

        {txHash !== "" && <p>{`Transaction with hash ${txHash} sent!`}</p>}
        {error !== "" && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default CreateNewSchema;
