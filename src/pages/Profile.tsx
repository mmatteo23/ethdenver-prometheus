import { useEffect, useState } from "react";
import { useConnectWallet } from "@web3-onboard/react";
import CreateAttestationLinks from "../components/CreateAttestationLinks";
import CreateAttestationForm from "../components/CreateAttestationForm";
import GetProjects from "../components/GetProjects";
import ConnectButton from "../components/ConnectButton";
import { lessUsername } from "../utils/lib"
import { Attestation } from "@verax-attestation-registry/verax-sdk";
import { getAttestations, useVeraxSdk } from "../utils/verax";

export type IAttestation = {
  id: string;
  title: string;
  description: string;
};

const Profile = () => {
  const [created, setCreated] = useState<number>(0);
  const [linked, setLinked] = useState<number>(0);

  const [attestations, setAttestations] = useState<Attestation[]>([]);

  const [myAttestations, setMyAttestations] = useState<Attestation[]>([]);
  const [myAttestationsLinks, setMyAttestationsLinks] =
    useState<Attestation[]>([]);

  const [{ wallet }] = useConnectWallet();
  const accountData = wallet?.accounts[0];
  const veraxSdk = useVeraxSdk();

  useEffect(() => {
    if (veraxSdk) {
      if (created > 0 || linked > 0) {
        // sleep 2s to wait for the attestations to be indexed, after waitForTransaction
        setTimeout(() => {
          console.log("profile: refresh attestations");
          setCreated(0);
          setLinked(0);
        }, 2000);
      }
      // get all attestations
      getAttestations(veraxSdk, false)
        .then((res) => setAttestations(res))
        .catch((e) => console.error(e));
      // get all attestations links not needed (for now)

      // get my attestations
      getAttestations(veraxSdk, false, accountData?.address)
        .then((res) => setMyAttestations(res))
        .catch((e) => console.error(e));

      // get my attestations links
      getAttestations(veraxSdk, true, accountData?.address)
        .then((res) => {
          console.log("profile: my attestations links", res);
          setMyAttestationsLinks(res);
        })
        .catch((e) => console.error(e));
    }
  }, [veraxSdk, wallet, accountData?.address, created, linked]);

  return (
    <>
      {!wallet ? (
        <div className="absolute z-10 w-full">
          <div className="flex flex-col gap-4 mx-auto mt-[10%] w-[60%] lg:w-[40%]">
            <h1 className="text-xl lg:text-3xl">Connect your wallet</h1>
            <p className="text-sm lg:text-md">
              You need to connect your wallet to manage your attestations and
              projects inspired.
            </p>
            <ConnectButton />
          </div>
        </div>
      ) : null}
      <div
        className={`w-full container flex flex-col gap-4 mx-auto ${
          !wallet ? "blur-xl" : ""
        }`}
      >
        <h1>Manage Attestations</h1>
        <h2 className="text-xl font-bold">Hi {lessUsername(accountData?.address)}!</h2>
        <div className="flex flex-row w-full space-x-4 mt-4">
          <div className="w-1/2 p-[1em] border-2 border-solid rounded-md">
            <h3 className="font-bold text-lg sm:text-xl text-left"># Attestations</h3>
            <p className="font-bold text-md sm:text-lg text-left">{myAttestations?.length}</p>
          </div>
          <div className="w-1/2 p-[1em] border-2 border-solid rounded-md">
            <h3 className="font-bold text-lg sm:text-xl text-left"># Links</h3>
            <p className="font-bold text-md sm:text-lg text-left">{myAttestationsLinks?.length}</p>
          </div>
        </div>
        <div className="grid grid-rows-2 grid-cols-1 sm:grid-rows-1 sm:grid-cols-2 place-content-between border-2 border-solid rounded-md p-4">
          <CreateAttestationForm setCreated={setCreated} />
          <CreateAttestationLinks
            attestations={attestations}
            myAttestations={myAttestations}
            setLinked={setLinked}
          />
        </div>

        <h1 className="text-2xl lg:text-3xl">Explore your attestations</h1>
        <GetProjects filterByUser={true} attestations={myAttestations} />
      </div>
    </>
  );
};

export default Profile;
