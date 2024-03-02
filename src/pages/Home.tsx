import CreateAttestationForm from "../components/CreateAttestationForm";
// import CreateNewSchema from "../components/CreateNewSchema";
import GetProjects from "../components/GetProjects";
import "./Home.css";
import { type FunctionComponent, useEffect } from "react";
import ForceGraph from "../components/Graph/ForceGraph";

export type HomeProps = {
  title: string;
};

const Home: FunctionComponent<HomeProps> = ({ title }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <>
      <section id="hero" className="my-10">
        <h1>Prometheus</h1>
        <p>
          Create an attestation of your project and inspire others to build on
          top.
          <br />
          Increase your on-chain reputation and create a network of projects.
        </p>
      </section>
      <section id="explorer" className="my-10">
        <div className="w-full items-center justify-center flex">
          <ForceGraph />
        </div>
      </section>
      <section id="create-attestation" className="my-10">
        <CreateAttestationForm />
      </section>
      <section id="get-projects" className="my-10">
        <GetProjects />
      </section>
    </>
  );
};

export default Home;
