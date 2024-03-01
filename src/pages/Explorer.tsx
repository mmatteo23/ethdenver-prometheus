import { useEffect, useState } from "react";

import ForceDirectedGraph, { FDGData } from "../components/Graph/FDGraph";
import type { LoaderFunctionArgs } from "react-router-dom";

async function getAttestation(id: string | undefined) {
  if (!id) {
    return { id: "", title: "", description: "" };
  }
  return {
    id,
    title: "Bitcoin",
    description: "This is the first project",
  };
}

export async function loader({ params }: LoaderFunctionArgs) {
  const contact = await getAttestation(params.attestationId);
  return { contact };
}

const Explorer = () => {
  // const { contact } = useLoaderData();
  // console.log(contact);
  const [data, setData] = useState<FDGData>({ nodes: [], links: [] });

  useEffect(() => {
    fetch("/graph.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((response) => {
        setData(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <h2>Explorer</h2>
      <div className="w-full items-center justify-center flex">
        {data.nodes.length && data.links.length ? (
          <ForceDirectedGraph data={data} />
        ) : (
          "Getting data..."
        )}
      </div>
    </div>
  );
};

export default Explorer;
