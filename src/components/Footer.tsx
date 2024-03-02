import "./Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faTelegram } from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";
import { FollowOnLens } from "@lens-protocol/widgets-react";
import React from "react";

const Footer: React.FC = () => {
  return (
    <ul className="social-icon">
      <li className="social-icon__item">
        <Link
          className="social-icon__link"
          to={"https://t.me/bianc8_eth"}
          target={"_blank"}
        >
          <FontAwesomeIcon icon={faTelegram} />
        </Link>
      </li>

      <li className="social-icon__item">
        <Link
          className="social-icon__link"
          to={"https://t.me/frayeX"}
          target={"_blank"}
        >
          <FontAwesomeIcon icon={faTelegram} />
        </Link>
      </li>

      <li className="social-icon__item">
        <Link
          className="social-icon__link"
          to={"https://github.com/mmatteo23/ethdenver-prometeus"}
          target={"_blank"}
        >
          <FontAwesomeIcon icon={faGithub} />
        </Link>
      </li>

      <li className="social-icon__item social-icon__link lens">
        <FollowOnLens handle="verax" title={"Follow us on Lens"} />
      </li>
    </ul>
  );
};

export default Footer;
