import { useState, useEffect, useRef } from "react";
import { ForceGraph2D } from "react-force-graph";
import type { ForceGraphMethods } from "react-force-graph-2d";
import * as d3 from "d3";
import * as uuid from "uuid";

import { attestationsData, attestationLinksData } from "../../utils/costants";

const ForceGraph = () => {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);

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
    attestationsData.forEach((attestation) => {
      const node = {
        id: attestation.id,
        path: attestation.decodedPayload[0].projectName,
        module: 0,
        size: 10,
        level: 0,
      };
      nodes.push(node);
    });

    attestationLinksData.forEach((link) => {
      const sourceNode = nodes.find((node) => node.id === link.subject);
      const targetNode = nodes.find((node) => node.id === link.object);
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
  }, []);

  return <ForceTree data={{ nodes, links }} />;
};
export default ForceGraph;
