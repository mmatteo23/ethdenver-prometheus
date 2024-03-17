import { useSetChain, useConnectWallet } from "@web3-onboard/react";
import { useState, useEffect, useRef } from "react";
import { ForceGraph2D } from "react-force-graph";
import type { ForceGraphMethods } from "react-force-graph-2d";
import * as d3 from "d3";
import * as uuid from "uuid";

import { Attestation, VeraxSdk } from "@verax-attestation-registry/verax-sdk";
import { useNetwork } from "wagmi";
import { getAttestations } from "../../utils/verax";

import { LineaTestnetChain } from "../../utils/costants";

const ForceGraph = () => {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);

  const [veraxSdk, setVeraxSdk] = useState<VeraxSdk>();
  const [{ wallet }] = useConnectWallet();
  const { chain } = useNetwork();
  const [attestations, setAttestations] = useState<Attestation[]>([]);
  const [attestationsLinks, setAttestationsLinks] = useState<Attestation[]>([]);

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

  console.log("Connected Chain", connectedChain);
  console.log("Account", accountData);

  useEffect(() => {
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
      // get attestations
      getAttestations(veraxSdk, false)
        .then((res) => setAttestations(res))
        .catch((e) => console.error(e));

      // get attestations links
      getAttestations(veraxSdk, true)
        .then((res) => setAttestationsLinks(res))
        .catch((e) => console.error(e));
    }
  }, [veraxSdk, accountData?.address]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ForceTree = ({ data }: { data: { nodes: any; links: any } }) => {
    const fgRef = useRef<ForceGraphMethods>();

    useEffect(() => {
      if (!fgRef.current) return;

      // add collision force
      fgRef.current.d3Force(
        "collision",
        d3.forceCollide((node) => Math.sqrt(100 / (node.level + 1)))
      );
    }, []);

    return (
      <ForceGraph2D
        ref={fgRef}
        graphData={data}
        //dagMode={"radialout"}
        dagLevelDistance={300}
        backgroundColor="#242430"
        linkColor={() => "rgba(255,255,255,0.2)"}
        nodeRelSize={1}
        nodeId="path"
        nodeVal={(node) => 100 / (node.level + 1)}
        nodeLabel="path"
        nodeAutoColorBy="module"
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={2}
        d3VelocityDecay={0.3}
        width={1270}
        height={550}
        maxZoom={5}
        minZoom={0.5}
      />
    );
  };

  useEffect(() => {
    const nodes = [];
    const links = [];
    attestations.forEach((attestation) => {
      const node = {
        id: attestation.id,
        path: attestation.decodedPayload[0].projectName,
        module: 0,
        size: 10,
        level: 0,
      };
      nodes.push(node);
    });

    attestationsLinks.forEach((link) => {
      const linkSourceSubject =
        (link.decodedPayload[0].subject as string).slice(0, 2) === "0x"
          ? link.decodedPayload[0].subject
          : `0x${link.decodedPayload[0].subject}`;
      const linkSourceObject =
        (link.decodedPayload[0].object as string).slice(0, 2) === "0x"
          ? link.decodedPayload[0].object
          : `0x${link.decodedPayload[0].object}`;

      const sourceNode = nodes.find((node) => node.id === linkSourceSubject);
      const targetNode = nodes.find((node) => node.id === linkSourceObject);
      if (!sourceNode || !targetNode) return;

      let uuidVal = "";
      if (sourceNode.module != 0) {
        uuidVal = sourceNode.module;
      } else if (targetNode.module != 0) {
        uuidVal = targetNode.module;
      } else {
        uuidVal = uuid.v4();
      }
      sourceNode.module = uuidVal;
      targetNode.module = uuidVal;
      links.push({
        source: sourceNode.path,
        target: targetNode.path,
        module: 1,
        value: 1,
      });
    });
    setNodes(nodes);
    setLinks(links);
  }, [attestations, attestationsLinks]);

  return <ForceTree data={{ nodes, links }} />;
};
export default ForceGraph;
