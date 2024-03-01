import { useEffect, useState } from "react";
import { useConnectWallet } from "@web3-onboard/react";

export type IAttestation = {
  id: string;
  title: string;
  description: string;
};

const Profile = () => {
  const [{ wallet }] = useConnectWallet();
  const [myAttestations, setMyAttestations] = useState<IAttestation[]>([]);
  const [projectsInspired, setProjectsInspired] = useState<IAttestation[]>([]);

  const accountData = wallet?.accounts[0];
  const accountAddress = accountData?.ens
    ? accountData.ens?.name
    : `${accountData?.address.slice(0, 6)}...${accountData?.address.slice(-4)}`;

  useEffect(() => {
    // Fetch attestations
    setMyAttestations([
      {
        id: "0", // This is the attestation id
        title: "Bitcoin",
        description: "This is the first project",
      },
    ]);
    // Fetch projects inspired
    setProjectsInspired([
      {
        id: "1", // This is the attestation id
        title: "Ethereum",
        description: "This is the first attestation",
      },
    ]);
  }, []);

  return (
    <div className="flex flex-col gap-4 container mx-auto">
      <h1>Hi {accountAddress}!</h1>
      <h2 className="text-xl font-bold">Your attestations</h2>
      {myAttestations.map((attestation, i) => (
        <AttestationCard
          key={i}
          id={attestation.id}
          title={attestation.title}
          description={attestation.description}
        />
      ))}
      <h2 className="text-xl font-bold">Project that you inspired</h2>
      {projectsInspired.map((project, i) => (
        <AttestationCard
          key={i}
          id={project.id}
          title={project.title}
          description={project.description}
        />
      ))}
    </div>
  );
};

const AttestationCard = ({ id, title, description }: IAttestation) => {
  return (
    <div className="border">
      <p>{id}</p>
      <h3>
        <b>Title</b>:{title}
      </h3>
      <p>
        <b>Description</b>
        {description}
      </p>
    </div>
  );
};

export default Profile;
