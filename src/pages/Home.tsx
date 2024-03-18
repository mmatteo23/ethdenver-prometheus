import "./Home.css";
import React, { useState, useEffect } from "react";

import GetProjects from "../components/GetProjects";
import ForceGraph from "../components/Graph/ForceGraph";

import { Attestation } from "@verax-attestation-registry/verax-sdk";
import { getAttestations, useVeraxSdk } from "../utils/verax";
import { useScroll, useTransform } from "framer-motion";
import { GoogleGeminiEffect } from "../components/ui/gemini";

const Home = ({ title }: { title: string }) => {
  const scrollRef = React.useRef(null);

  // all attestations
  const [attestations, setAttestations] = useState<Attestation[]>([]);
  const [attestationsLinks, setAttestationsLinks] = useState<Attestation[]>([]);

  const veraxSdk = useVeraxSdk();

  const { scrollYProgress } = useScroll({
    target: scrollRef,
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

  useEffect(() => {
    if (veraxSdk) {
      // get attestations
      getAttestations(veraxSdk, false)
        .then((res) => setAttestations(res))
        .catch((e) => console.error(e));

      // get attestations links
      getAttestations(veraxSdk, true)
        .then((res) => setAttestationsLinks(res))
        .catch((e) => console.error(e));
    }
  }, [veraxSdk]);

  return (
    <>
      <div className={`w-full lg:container my-10`}>
        <div
          className="relative h-[400vh] bg-black w-full dark:border dark:border-white/[0.1] rounded-md pt-40 overflow-clip"
          ref={scrollRef}
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
            <ForceGraph
              attestations={attestations}
              attestationsLinks={attestationsLinks}
            />
          </div>
        </section>
        <section id="get-projects" className="my-10">
          <h1 className="text-3xl">Explore attestations</h1>
          <GetProjects filterByUser={false} attestations={attestations} />
        </section>
      </div>
    </>
  );
};

export default Home;
