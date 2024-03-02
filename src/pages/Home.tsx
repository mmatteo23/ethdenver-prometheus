import React from "react";
import GetProjects from "../components/GetProjects";
import "./Home.css";
import { type FunctionComponent, useEffect } from "react";
import ForceGraph from "../components/Graph/ForceGraph";
import { useScroll, useTransform } from "framer-motion";
import { GoogleGeminiEffect } from "../components/ui/gemini";

export type HomeProps = {
  title: string;
};

const Home: FunctionComponent<HomeProps> = ({ title }) => {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]);
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]);
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <>
      <div
        className="h-[400vh] bg-black w-full dark:border dark:border-white/[0.1] rounded-md relative pt-40 overflow-clip"
        ref={ref}
      >
        <GoogleGeminiEffect
          title="Prometheus"
          description="Create an attestation of your project and inspire others to build on top.
          Increase your on-chain reputation and create a network of projects."
          pathLengths={[
            pathLengthFirst,
            pathLengthSecond,
            pathLengthThird,
            pathLengthFourth,
            pathLengthFifth,
          ]}
        />
      </div>
      <section id="explorer" className="mt-20 mb-10 w-[80%] mx-auto">
        <h1 className="text-3xl my-10">
          Explore the network of the interconnected projects
        </h1>
        <div className=" items-center justify-center flex">
          <ForceGraph />
        </div>
      </section>
      <section id="get-projects" className="my-10">
        <h1 className="text-3xl">Explore attestations</h1>
        <GetProjects />
      </section>
    </>
  );
};

export default Home;
