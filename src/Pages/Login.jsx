import React, { useEffect, useState } from "react";
import { AXIOS } from "../utils/Contstants";
import MainButton from "../utils/MainButton";
import { useNavigate } from "react-router-dom";

function Login({ checkit }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await AXIOS.post("login/", {
        email,
        password,
        plan: "admin",
      });
      if (response.data.admin) {
        console.log("Login successful. Token:", response.data.token);
          localStorage.setItem("auth", response.data.token);
          checkit()
        navigate("/meditations");
      }
    } catch (error) {
      console.error("Login error:", error.response.data.error);
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
