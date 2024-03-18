import "./Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faTelegram } from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";
import React from "react";

const Footer: React.FC = () => {
  return (
    <ul className="social-icon">
      <li className="social-icon__item">
        <Link
          className="flex flex-row items-center text-center mr-10 text-white text-sm sm:text-md"
          to={"https://biancotto.eu"}
          target={"_blank"}
        ><img src="/images/bianc8.png" alt="frayex matteo midena image" width={35} height={35} className={"mr-2 rounded-full"}/>
          @bianc8_eth
        </Link>
      </li>

      <li className="social-icon__item">
        <Link
          className="flex flex-row items-center text-center mr-10 text-white text-sm sm:text-md"
          to={"https://t.me/frayeX"}
          target={"_blank"}
        >
          <img src="/images/midena.jpg" alt="frayex matteo midena image" width={35} height={35} className={"mr-2 rounded-full"}/>
          <FontAwesomeIcon icon={faTelegram} className="mr-1" />
          @frayeX
        </Link>
      </li>

      <li className="social-icon__item">
        <Link
          className="flex flex-row items-center text-center mr-10 text-white text-sm sm:text-md"
          to={"https://github.com/mmatteo23/ethdenver-prometeus"}
          target={"_blank"}
        >
          <FontAwesomeIcon icon={faGithub} className="mr-1" />
          GitHub
        </Link>
      </li>
    </ul>
  );
};

export default Footer;
