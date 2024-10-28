import React, { useEffect, useState } from "react";
import { AXIOS } from "../utils/Contstants";
import MainButton from "../utils/MainButton";
import { useNavigate } from "react-router-dom";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Fire";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const allowedUsers = ["mateidr7@gmail.com", "admin@zenapp.ro"];
  const handleLogin = async (e) => {
    e.preventDefault();

    // Check if the email is in the list of allowed users
    if (!allowedUsers.includes(email)) {
      toast("Access denied. You do not have permission to log in.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      // Optionally, redirect or perform other actions
    } catch (error) {
      toast(error.message);
    }
  };
  return (
    <div className="login">
      <form className="form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <div className="row">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="row">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <MainButton text={"Login"} />
      </form>
    </div>
  );
}

export default Login;
