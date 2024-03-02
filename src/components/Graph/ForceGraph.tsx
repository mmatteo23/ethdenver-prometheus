import { useState, useEffect, useRef } from "react";
import { ForceGraph2D } from "react-force-graph";
import type { ForceGraphMethods } from "react-force-graph-2d";
import * as d3 from "d3";

import csvData from "../../assets/d3-dependencies.csv?url";

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
      />
    );
  };

  useEffect(() => {
    fetch(csvData)
      .then((r) => r.text())
      .then((text) => d3.csvParse(text))
      .then((data) => {
        const nodes = [];
        const links = [];
        data.forEach(({ size, path }: { size: string; path: string }) => {
          const levels = path.split("/"),
            level = levels.length - 1,
            module = level > 0 ? levels[1] : null,
            leaf = levels.pop(),
            parent = levels.join("/");

          const node = {
            path,
            leaf,
            module,
            size: +size || 20,
            level,
          };

          nodes.push(node);

          if (parent) {
            links.push({ source: parent, target: path, targetNode: node });
          }
        });
        setNodes(nodes);
        setLinks(links);
      });
  }, []);

  return <ForceTree data={{ nodes, links }} />;
};
export default ForceGraph;
