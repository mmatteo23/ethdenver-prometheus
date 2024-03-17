// import { useEffect, useState } from "react";
import { useConnectWallet } from "@web3-onboard/react";
import CreateAttestationLinks from "../components/CreateAttestationLinks";
import CreateAttestationForm from "../components/CreateAttestationForm";
import GetProjectsByUser from "../components/GetProjectsByUser";
import ConnectButton from "../components/ConnectButton";
import "./Profile.css";
import { useNetwork } from "wagmi";
import { useEffect, useState } from "react";
import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";

import {
  LineaTestnetChain,
  // attestationsData
} from "../utils/costants";

import { useSetChain } from "@web3-onboard/react";

const SCHEMA_ID = import.meta.env.VITE_PROJECT_SCHEMA;
const CUSTOM_SCHEMA_ID = import.meta.env.VITE_CUSTOM_RELATIONSHIP_SCHEMA;

export type IAttestation = {
  id: string;
  title: string;
  description: string;
};

const Profile = () => {
  const [veraxSdk, setVeraxSdk] = useState<VeraxSdk>();
  const [{ wallet }] = useConnectWallet();
  const { chain } = useNetwork();
  const [attestationsCounter, setAttestationsCounter] = useState<number>(0);
  const [linkedAttestationsCounter, setLinkedAttestationsCounter] =
    useState<number>(0);

  const [
    {
      // chains, // the list of chains that web3-onboard was initialized with
      connectedChain, // the current chain the user's wallet is connected to
      // settingChain, // boolean indicating if the chain is in the process of being set
    },
    setChain, // function to call to initiate user to switch chains in their wallet
  ] = useSetChain();

  console.log("Chain", chain);

  const accountData = wallet?.accounts[0];
  console.log("VERAX SDK (Profile)", veraxSdk);

  useEffect(() => {
    console.log("Connected Chain", connectedChain);
    console.log("Account", accountData);
    if (!veraxSdk) {
      if (connectedChain && accountData?.address) {
        const sdkConf =
          connectedChain.id === LineaTestnetChain.id
            ? VeraxSdk.DEFAULT_LINEA_MAINNET_FRONTEND
            : VeraxSdk.DEFAULT_LINEA_TESTNET_FRONTEND;
        const sdk = new VeraxSdk(
          sdkConf,
          accountData?.address as `0x${string}`
        );
        setVeraxSdk(sdk);
        console.log("Verax SDK (after init)", sdk);
      } else {
        console.error("Chain not connected");
        if (accountData?.address) {
          // so connectedChain is undefined
          setChain({
            chainId: LineaTestnetChain.id,
          });
        }
      }
    }
  }, [connectedChain, accountData, accountData?.address, setChain, veraxSdk]);

  useEffect(() => {
    if (veraxSdk && accountData?.address) {
      getAttestationsByUser().catch((e) => console.error(e));
      getLinkedAttestationsByUser().catch((e) => console.error(e));
    }
    // else {
    //   const attestations = JSON.parse(JSON.stringify(attestationsData));
    //   setAttestationsCounter(attestations.length);
    // }
  });

  const getAttestationsByUser = async () => {
    if (veraxSdk && accountData?.address) {
      try {
        console.log("using", SCHEMA_ID, accountData.address);
        const result = await veraxSdk.attestation.findBy(
          undefined,
          undefined,
          { schemaId: SCHEMA_ID, subject: accountData.address },
          "attestedDate",
          undefined
        );
        console.log("(Profile) Attestations", result);
        setAttestationsCounter(result.length);
      } catch (e) {
        console.log(e);
      }
    } else {
      console.error("SDK not instantiated");
    }
  };

  const getLinkedAttestationsByUser = async () => {
    if (veraxSdk && accountData?.address) {
      try {
        const result = await veraxSdk.attestation.findBy(
          undefined,
          undefined,
          { schemaId: CUSTOM_SCHEMA_ID, subject: accountData.address },
          "attestedDate",
          undefined
        );
        console.log("(Profile) Linked Attestations", result);
        setLinkedAttestationsCounter(result.length);
      } catch (e) {
        console.log(e);
      }
    } else {
      console.error("SDK not instantiated");
    }
  };

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
            <p>{attestationsCounter}</p>
          </div>
          <div className="counterCard border-2 border-solid rounded-md">
            <h3 className="cardTitle"># Links</h3>
            <p>{linkedAttestationsCounter}</p>
          </div>
        </div>
        {/* {myAttestations.map((attestation, i) => (
        <AttestationCard
          key={i}
          id={attestation.id}
          title={attestation.title}
          description={attestation.description}
        />
      ))} */}
        {/* <h2 className="text-xl font-bold">Project that you inspired</h2>
      {projectsInspired.map((project, i) => (
        <AttestationCard
          key={i}
          id={project.id}
          title={project.title}
          description={project.description}
        />
      ))} */}
        <div className="flex place-content-between border-2 border-solid rounded-md p-4">
          <CreateAttestationForm />
          <CreateAttestationLinks />
        </div>

        <GetProjectsByUser />
      </div>
    </>
  );
};

// const AttestationCard = ({ id, title, description }: IAttestation) => {
//   return (
//     <div className="border">
//       <p>{id}</p>
//       <h3>
//         <b>Title</b>:{title}
//       </h3>
//       <p>
//         <b>Description</b>
//         {description}
//       </p>
//     </div>
//   );
// };

export default Profile;
