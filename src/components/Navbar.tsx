import { NavLink } from "react-router-dom";
import "./Navbar.css";
import React from "react";
import ConnectButton from "./ConnectButton";

const Navbar: React.FC = () => {
  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            <NavLink className="navbar-brand" to="/" end>
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="navbar-brand" to="/profile" end>
              Profile
            </NavLink>
          </li>
          <li className="nav-item">
            <ConnectButton />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
