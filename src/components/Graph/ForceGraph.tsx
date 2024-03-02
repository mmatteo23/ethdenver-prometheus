import { useState, useEffect, useRef } from "react";
import { ForceGraph2D } from "react-force-graph";
import type { ForceGraphMethods } from "react-force-graph-2d";
import * as d3 from "d3";
import * as uuid from "uuid";

import { attestationsData, attestationLinksData } from "../../utils/costants";
import { Attestation, VeraxSdk } from "@verax-attestation-registry/verax-sdk";
import { useConnectWallet } from "@web3-onboard/react";
import { useNetwork } from "wagmi";

const SCHEMA_ID = import.meta.env.VITE_PROJECT_SCHEMA;
const CUSTOM_SCHEMA_ID = import.meta.env.VITE_CUSTOM_RELATIONSHIP_SCHEMA;

const ForceGraph = () => {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);

  const [veraxSdk, setVeraxSdk] = useState<VeraxSdk>();
  const [{ wallet }] = useConnectWallet();
  const { chain } = useNetwork();
  const accountData = wallet?.accounts[0];
  const [attestations, setAttestations] = useState<Attestation[]>([]);
  const [attestationsLinks, setAttestationsLinks] = useState<Attestation[]>([]);

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

  useEffect(() => {
    if (veraxSdk && accountData?.address) {
      getAttestationsLinkBySchemaId().catch((e) => console.error(e));
      getProjectsBySchemaId().catch((e) => console.error(e));
    }
  }, [veraxSdk]);

  const getAttestationsLinkBySchemaId = async () => {
    if (veraxSdk && accountData?.address) {
      try {
        const result = await veraxSdk.attestation.findBy(
          undefined,
          undefined,
          { schemaId: CUSTOM_SCHEMA_ID },
          "attestedDate",
          undefined
        );
        setAttestationsLinks(result);
        console.log("Linked Attestations", result);
      } catch (e) {
        console.log(e);
      }
    } else {
      console.error("SDK not instantiated");
    }
  };

  const getProjectsBySchemaId = async () => {
    if (veraxSdk && accountData?.address) {
      try {
        const result = await veraxSdk.attestation.findBy(
          undefined,
          undefined,
          { schemaId: SCHEMA_ID },
          "attestedDate",
          undefined
        );
        setAttestations(result);
        console.log("Attestations", result);
      } catch (e) {
        console.log(e);
      }
    } else {
      console.error("SDK not instantiated");
    }
  };

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
        maxZoom={2}
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
      let linkSourceSubject =
        (link.decodedPayload[0].subject as string).slice(0, 2) === "0x"
          ? link.decodedPayload[0].subject
          : `0x${link.decodedPayload[0].subject}`;
      let linkSourceObject =
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
