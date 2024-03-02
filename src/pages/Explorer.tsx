import ForceGraph from "../components/Graph/ForceGraph";
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

  return (
    <div>
      <h2>Explorer</h2>
      <div className="w-full items-center justify-center flex">
        <ForceGraph />
      </div>
    </div>
  );
};

export default Explorer;
