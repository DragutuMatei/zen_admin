import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Meditations from "./Pages/Meditations";
import Breaths from "./Pages/Breaths";
import Cards from "./Pages/Cards";
import Sounds from "./Pages/Sounds";
import SideNav from "./components/SideNav";
import "./scss/main.scss";
import Login from "./Pages/Login";
import { AXIOS } from "./utils/Contstants";
import MedDetails from "./Pages/MedDetails";

const App = () => {
  const [isAuthenticated, setAuth] = useState(false);


  const checkit = () => {
    // setAuth(!!localStorage.getItem("auth"));
  };
  useEffect(() => {
    let teest = !!localStorage.getItem("auth");
    setAuth(teest);
  }, [, window, localStorage.getItem("auth")]);

  useEffect(() => {
    console.log(isAuthenticated);
  }, [, isAuthenticated]);

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/meditations/:id"
            element={
              // isAuthenticated ? (
                <MedDetails checkit={checkit} />
              // ) : (
                // <Navigate to="/" />
              // )
            }
          />
          <Route
            path="/meditations"
            element={
              isAuthenticated ? (
                <Meditations checkit={checkit} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/breaths"
            element={
              isAuthenticated ? (
                <Breaths checkit={checkit} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/cards"
            element={
              isAuthenticated ? (
                <Cards checkit={checkit} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/sounds"
            element={
              isAuthenticated ? (
                <Sounds checkit={checkit} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to={"/meditations"} />
              ) : (
                <Login checkit={checkit} />
              )
            }
          />
        </Routes>
        <ToastContainer draggable={true} position="top-center" />
      </Router>
    </>
  );
};

export default App;
