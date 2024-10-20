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
import Yoga from "./Pages/Yoga";
import Podcast from "./Pages/Podcast";
import Meditations_v2 from "./Pages/Meditations_v2";
import Mesaj from "./Pages/Mesaj";
import MesajDetail from "./Pages/MesajDetail";
import firebase from "firebase/compat/app";
import Sounds_v2 from "./Pages/Sounds_v2";

const App = () => {
  const [isAuthenticated, setAuth] = useState(false);

  const checkit = () => {
    setAuth(!!localStorage.getItem("auth"));
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
            path="/meditations/:category/:id"
            element={<MedDetails checkit={checkit} />}
          />
          <Route
            path="/getMessageById/:id"
            element={<MesajDetail checkit={checkit} />}
          />
          <Route
            path="/"
            // path="/meditations"
            element={<Meditations_v2 checkit={checkit} />}
          />{" "}
          <Route
            path="/meditations"
            element={<Meditations_v2 checkit={checkit} />}
          />
          <Route path="/messages" element={<Mesaj checkit={checkit} />} />
          <Route path="/breaths" element={<Breaths checkit={checkit} />} />{" "}
          <Route path="/yoga" element={<Yoga checkit={checkit} />} />
          <Route path="/cards" element={<Cards checkit={checkit} />} />
          <Route path="/sounds" element={<Sounds_v2 checkit={checkit} />} />
          <Route path="/podcast" element={<Podcast checkit={checkit} />} />
          <Route path="/login" element={<Login checkit={checkit} />} />
        </Routes>
        <ToastContainer draggable={true} position="top-center" />
      </Router>
    </>
  );
};

export default App;
