import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { GiMeditation } from "react-icons/gi";
import { IoCardSharp } from "react-icons/io5";
import { GiSoundWaves } from "react-icons/gi";
import { MdOutlineAir } from "react-icons/md";
import SecondButton from "../utils/SecondButton";
import { AXIOS } from "../utils/Contstants";
import { auth } from "../Fire";
import { signOut } from "firebase/auth";

function SideNav({ checkit }) {
  const navigate = useNavigate();
  return (
    <nav className="sidenav">
      <div className="header">
        <img src={require("../utils/imgs/person.png")} alt="" />
        <h2>Admin</h2>
      </div>{" "}
      <Link to="/meditations">
        <GiMeditation /> Meditations
      </Link>{" "}
      <Link to="/messages">
        <GiMeditation /> Messages
      </Link>{" "}
      <Link to="/yoga">
        <GiMeditation /> Yoga
      </Link>
      <Link to="/podcast">
        <GiMeditation /> Podcast
      </Link>
      {/* <Link to="/cards">
        <IoCardSharp /> Cards
      </Link> */}
      <Link to="/sounds">
        <GiSoundWaves /> Sounds
      </Link>
      <SecondButton
        text={"Logout"}
        action={async () => {
          await signOut(auth);
          // localStorage.removeItem("auth");
          // checkit();
          // navigate("/");
        }}
      />
    </nav>
  );
}

export default SideNav;
