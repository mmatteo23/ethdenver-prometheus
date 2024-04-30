import { NavLink } from "react-router-dom";
import "./Navbar.css";
import React from "react";
import ConnectButton from "./ConnectButton";

const Navbar: React.FC = () => {
  return (
    <nav className="navbar sticky top-5 z-20">
      <div className="container px-2">
        <ul className="flex nav navbar-nav pull-xs-right justify-between">
          <div className="ml-2">
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
          <li className="py-2 mr-2">
            <ConnectButton />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
