import React, { useState } from "react";
import axios from "axios";
const axios_fara_cred = axios.create({
  baseURL: "http://localhost:8000/",
  // withCredentials: true,
  headers: {
    "content-type": "application/json",
  },
  method: "POST",
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [plan, setPlan] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios_fara_cred.post("login/", {
        email,
        password,
        plan,
      });

      console.log("Login successful. Token:", response.data.token);
      localStorage.setItem("auth", response.data.token);
      fetchUserInfo();
    } catch (error) {
      console.error("Login error:", error.response.data.error);
    }
  };
  const [user, setUser] = useState({});

  const fetchUserInfo = async () => {
    let token = localStorage.getItem("auth");
    try {
      const response = await axios.get("http://localhost:8000/idk/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      const userInfo = response.data;
      setUser(response.data);
      console.log("User Information:", userInfo);
      // You can store the user information in state or use it as needed
    } catch (error) {
      console.error(
        "Error fetching user information:",
        error.response.data.error
      );
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label>Plan:</label>
        <select onChange={(e) => setPlan(e.target.value)}>
          <option value="">select one</option>
          <option value="premium">premium</option>
          <option value="pleb">pleb</option>
        </select>
        <button type="submit">Login</button>
      </form>
      <br />
      <br />
      <br />
      <br />
      <button
        onClick={() => {
          localStorage.removeItem("auth");
          setUser({});
        }}
      >
        logout
      </button>

      <button onClick={fetchUserInfo}>check</button>
      <br />
      <br />
      <p>{JSON.stringify(user)}</p>
    </div>
  );
};

export default Login;
