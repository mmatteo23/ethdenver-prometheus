import { useConnectWallet } from "@web3-onboard/react";
import React, { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { createSchema, useVeraxSdk } from "../utils/verax";

const CreateNewSchema = () => {
  const [error, setError] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");

  const [{ wallet }] = useConnectWallet();
  const accountData = wallet?.accounts[0];
  const veraxSdk = useVeraxSdk();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createSchema(veraxSdk, accountData?.address)
      .then((res) => setTxHash(res))
      .catch((e) => setError(e.message));
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
