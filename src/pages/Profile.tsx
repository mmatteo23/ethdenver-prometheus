import "./Profile.css";
import { useConnectWallet } from "@web3-onboard/react";
import CreateAttestationLinks from "../components/CreateAttestationLinks";
import CreateAttestationForm from "../components/CreateAttestationForm";
import GetProjects from "../components/GetProjects";
import ConnectButton from "../components/ConnectButton";
import { useEffect, useState } from "react";

import { Attestation } from "@verax-attestation-registry/verax-sdk";
import { getAttestations, useVeraxSdk } from "../utils/verax";

export type IAttestation = {
  id: string;
  title: string;
  description: string;
};

const Profile = () => {
  const [attestations, setAttestations] = useState<Attestation[]>();

  const [myAttestations, setMyAttestations] = useState<Attestation[]>();
  const [myAttestationsLinks, setMyAttestationsLinks] =
    useState<Attestation[]>();

  const [{ wallet }] = useConnectWallet();
  const accountData = wallet?.accounts[0];
  const veraxSdk = useVeraxSdk();

  useEffect(() => {
    if (veraxSdk && accountData?.address) {
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
    } else {
      console.log(
        "veraxSdk not set or accountAddress",
        veraxSdk,
        accountData?.address
      );
    }
  }, [veraxSdk, accountData?.address]);
  useEffect(() => {
    if (veraxSdk && accountData?.address) {
      // get my attestations
      getAttestations(veraxSdk, false, accountData?.address)
        .then((res) => {
          console.log("profile: my attestations", res);
          setMyAttestations(res);
        })
        .catch((e) => console.error(e));
    } else {
      console.log(
        "veraxSdk not set or accountAddress",
        veraxSdk,
        accountData?.address
      );
    }
  }, [veraxSdk, accountData?.address]);

  return (
    <>
      {!wallet ? (
        <div className="absolute z-10 w-[45%] h-[45%] ml-[20%] ">
          <div className="flex flex-col gap-4">
            <h1>Connect your wallet</h1>
            <p>
              You need to connect your wallet to manage your attestations and
              projects inspired.
            </p>
            <ConnectButton />
          </div>
        </div>
      ) : null}
      <div
        className={`flex flex-col gap-4 container mx-auto ${
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
          <CreateAttestationForm />
          <CreateAttestationLinks
            attestations={attestations}
            myAttestations={myAttestations}
          />
        </div>

        <GetProjects filterByUser={true} attestations={attestations} />
      </div>
    </>
  );
};

export default Profile;
