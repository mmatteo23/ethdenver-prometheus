import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface FDGNode extends d3.SimulationNodeDatum {
  id: string;
  group: number;
}

interface FDGLink extends d3.SimulationLinkDatum<FDGNode> {
  value: number;
}

export type FDGData = {
  nodes: Array<FDGNode>;
  links: Array<FDGLink>;
};

export default function ForceDirectedGraph(props: {
  children?: never;
  data: FDGData;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const width = 928;
  const height = 600;
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  useEffect(() => {
    if (!svgRef.current) return;

    const links = props.data.links.map((d) => ({ ...d }));
    const nodes = props.data.nodes.map((d) => ({ ...d }));

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3.forceLink<FDGNode, FDGLink>(links).id((d) => d.id)
      )
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .force("charge", d3.forceManyBody());
    // .force("center", d3.forceCenter(width / 2, height / 2));

    const svg = d3
      .select<SVGSVGElement, unknown>(svgRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    const link = svg
      .selectAll<SVGLineElement, FDGLink>("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d) => Math.sqrt(d.value));

    const node = svg
      .selectAll<SVGCircleElement, FDGNode>("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 7)
      .attr("fill", (d) => color(`${d.group}`));

    node.append("title").text((d) => d.id);

    function ticked() {
      link
        .attr("x1", (d) => (d.source as FDGNode).x!)
        .attr("y1", (d) => (d.source as FDGNode).y!)
        .attr("x2", (d) => (d.target as FDGNode).x!)
        .attr("y2", (d) => (d.target as FDGNode).y!);

      node.attr("cx", (d) => d.x!).attr("cy", (d) => d.y!);
    }

    simulation.on("tick", ticked);

    function dragstarted(
      event: d3.D3DragEvent<SVGCircleElement, FDGNode, FDGNode>
    ) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(
      event: d3.D3DragEvent<SVGCircleElement, FDGNode, FDGNode>
    ) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(
      event: d3.D3DragEvent<SVGCircleElement, FDGNode, FDGNode>
    ) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    node.call(
      d3
        .drag<SVGCircleElement, FDGNode>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

    return () => {
      simulation.stop();
    };
  }, [svgRef, props.data, color, height, width]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{
        maxWidth: "100%",
        height: "auto",
      }}
    />
  );
}
