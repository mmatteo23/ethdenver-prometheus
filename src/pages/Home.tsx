import veraxLogo from "../assets/verax-logo-circle.svg";
import CreateAttestationForm from "../components/CreateAttestationForm";
import "./Home.css";
import { type FunctionComponent, useEffect } from "react";

export type HomeProps = {
  title: string;
};

const Home: FunctionComponent<HomeProps> = ({ title }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <>
      <div>
        <a href="https://docs.ver.ax/" target="_blank">
          <img src={veraxLogo} className="logo" alt="Verax logo" />
        </a>
      </div>

      <h1>Prometheus</h1>
      <p>
        Create an attestation of your project and inspire others to build on
        top.
        <br />
        Increase your on-chain reputation and create a network of projects.
      </p>
      <CreateAttestationForm />
    </>
  );
};

export default Home;
