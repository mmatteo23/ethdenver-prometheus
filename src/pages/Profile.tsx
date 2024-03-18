import "./Profile.css";
import { useEffect, useState } from "react";
import { useConnectWallet } from "@web3-onboard/react";
import CreateAttestationLinks from "../components/CreateAttestationLinks";
import CreateAttestationForm from "../components/CreateAttestationForm";
import GetProjects from "../components/GetProjects";
import ConnectButton from "../components/ConnectButton";

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
    console.log("veraxSdk e address", veraxSdk, accountData?.address)
    if (veraxSdk) {
      if (created > 0 || linked > 0) {
        // sleep 20s to wait for the attestations to be indexed
        setTimeout(() => {
          console.log("profile: refresh attestations");
          setCreated(0);
          setLinked(0);
        }, 20000);
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
        <h2 className="text-xl font-bold">Hi {accountData?.address}!</h2>
        <div className="cardContainer space-x-4 mt-4">
          <div className="counterCard border-2 border-solid rounded-md">
            <h3 className="cardTitle"># Attestations</h3>
            <p>{myAttestations?.length}</p>
          </div>
          <div className="counterCard border-2 border-solid rounded-md">
            <h3 className="cardTitle"># Links</h3>
            <p>{myAttestationsLinks?.length}</p>
          </div>
        </div>
        <div className="flex place-content-between border-2 border-solid rounded-md p-4">
          <CreateAttestationForm setCreated={setCreated} />
          <CreateAttestationLinks
            attestations={attestations}
            myAttestations={myAttestations}
            setLinked={setLinked}
          />
        </div>

        <GetProjects filterByUser={true} attestations={myAttestations} />
      </div>
    </>
  );
};

export default Profile;
