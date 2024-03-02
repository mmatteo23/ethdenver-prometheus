// import { useEffect, useState } from "react";
import { useConnectWallet } from "@web3-onboard/react";
import CreateAttestationLinks from "../components/CreateAttestationLinks";
import CreateAttestationForm from "../components/CreateAttestationForm";
import GetProjectsByUser from "../components/GetProjectsByUser";
import ConnectButton from "../components/ConnectButton";
import "./Profile.css";

export type IAttestation = {
  id: string;
  title: string;
  description: string;
};

const Profile = () => {
  const [{ wallet }] = useConnectWallet();

  const accountData = wallet?.accounts[0];

  // useEffect(() => {
  //   // Fetch attestations
  //   setMyAttestations([
  //     {
  //       id: "0", // This is the attestation id
  //       title: "Bitcoin",
  //       description: "This is the first project",
  //     },
  //   ]);
  //   // Fetch projects inspired
  //   setProjectsInspired([
  //     {
  //       id: "1", // This is the attestation id
  //       title: "Ethereum",
  //       description: "This is the first attestation",
  //     },
  //   ]);
  // }, []);

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
            <p>2</p>
          </div>
          <div className="counterCard border-2 border-solid rounded-md">
            <h3 className="cardTitle"># Projects Inspired</h3>
            <p>15</p>
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
