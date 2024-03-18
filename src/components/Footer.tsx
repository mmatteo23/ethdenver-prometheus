import "./Footer.css";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faTelegram } from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

import imgBianc8 from "../../images/bianc8.png";
import imgFrayex from "../../images/midena.jpg";

const Footer: React.FC = () => {
  return (
    <ul className="social-icon">
      <li className="social-icon__item">
        <Link
          className="flex flex-row items-center text-center mr-10 text-white text-sm sm:text-md"
          to={"https://biancotto.eu"}
          target={"_blank"}
        ><img src={imgBianc8} alt="frayex matteo midena image" width={35} height={35} className={"mr-2 rounded-full"}/>
          @bianc8_eth
        </Link>
      </li>

      <li className="social-icon__item">
        <Link
          className="flex flex-row items-center text-center mr-10 text-white text-sm sm:text-md"
          to={"https://t.me/frayeX"}
          target={"_blank"}
        >
          <img src={imgFrayex} alt="frayex matteo midena image" width={35} height={35} className={"mr-2 rounded-full"}/>
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
