import { NavLink } from "react-router-dom";
import "./Navbar.css";
import React from "react";
import ConnectButton from "./ConnectButton";

const Navbar: React.FC = () => {
  return (
    <nav className="navbar sticky top-5 z-20">
      <div className="container">
        <ul className="flex nav navbar-nav pull-xs-right justify-between">
          <div className="">
            <li className="">
              <NavLink className="rounded-md" to="/" end>
                Home
              </NavLink>
            </li>
            <li className="">
              <NavLink className="rounded-md " to="/profile" end>
                Profile
              </NavLink>
            </li>
          </div>
          <li className="py-2">
            <ConnectButton />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
