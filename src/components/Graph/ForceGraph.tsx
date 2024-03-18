import { useState, useEffect, useRef } from "react";
import { ForceGraph2D } from "react-force-graph";
import type { ForceGraphMethods } from "react-force-graph-2d";
import * as d3 from "d3";
import * as uuid from "uuid";

import { Attestation } from "@verax-attestation-registry/verax-sdk";

const ForceGraph = ({
  attestations,
  attestationsLinks,
}: {
  attestations: Attestation[];
  attestationsLinks: Attestation[];
}) => {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ForceTree = ({ data }: { data: { nodes: any; links: any } }) => {
    const fgRef = useRef<ForceGraphMethods>();
    const [width, setWidth] = useState(window.innerWidth-40);
    const height = width / 2.3;

    useEffect(() => {
      const handleResize = () => {
        setWidth(window.innerWidth-40);
      };
  
      window.addEventListener('resize', handleResize);
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    useEffect(() => {
      if (!fgRef.current) return;

      // add collision force
      fgRef.current.d3Force(
        "collision",
        d3.forceCollide((node) => Math.sqrt(100 / (node.level + 1)))
      );

      fgRef.current.zoomToFit()
    }, []);

    return (
      <ForceGraph2D
        ref={fgRef}
        graphData={data}
        //dagMode={"radialout"}
        dagLevelDistance={200}
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
        width={width}//{1270}
        height={height}//{550}
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
