import React, { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Breaths from "./Pages/Breaths";
import Cards from "./Pages/Cards";
import Login from "./Pages/Login";
import MedDetails from "./Pages/MedDetails";
import Meditations_v2 from "./Pages/Meditations_v2";
import Mesaj from "./Pages/Mesaj";
import MesajDetail from "./Pages/MesajDetail";
import Podcast from "./Pages/Podcast";
import Sounds_v2 from "./Pages/Sounds_v2";
import Yoga from "./Pages/Yoga";
import "./scss/main.scss";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Fire";
import {  useAuth } from "./Context";

const App = () => {
  const [isAuthenticated, setAuth] = useState(false);

  const checkit = () => {
    setAuth(!!localStorage.getItem("auth"));
  };

  const { currentUser } = useAuth();

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/meditations/:category/:id"
            element={currentUser ? <MedDetails checkit={checkit} /> : <Login />}
          />
          <Route
            path="/getMessageById/:id"
            element={
              currentUser ? <MesajDetail checkit={checkit} /> : <Login />
            }
          />
          <Route
            path="/"
            element={
              currentUser ? <Meditations_v2 checkit={checkit} /> : <Login />
            }
          />
          <Route
            path="/meditations"
            element={
              currentUser ? <Meditations_v2 checkit={checkit} /> : <Login />
            }
          />
          <Route
            path="/messages"
            element={currentUser ? <Mesaj checkit={checkit} /> : <Login />}
          />
          <Route
            path="/breaths"
            element={currentUser ? <Breaths checkit={checkit} /> : <Login />}
          />{" "}
          <Route
            path="/yoga"
            element={currentUser ? <Yoga checkit={checkit} /> : <Login />}
          />
          <Route
            path="/cards"
            element={currentUser ? <Cards checkit={checkit} /> : <Login />}
          />
          <Route
            path="/sounds"
            element={currentUser ? <Sounds_v2 checkit={checkit} /> : <Login />}
          />
          <Route
            path="/podcast"
            element={currentUser ? <Podcast checkit={checkit} /> : <Login />}
          />
        </Routes>
        <ToastContainer draggable={true} position="top-center" />
      </Router>
    </>
  );
};

export default App;
