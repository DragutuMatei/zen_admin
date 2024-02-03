import React, { useEffect, useState } from "react";
import { Navigate, useParams, useSearchParams } from "react-router-dom";
import { AXIOS } from "../utils/Contstants";
import SideNav from "../components/SideNav";

export default function MedDetails({ checkit }) {
  const { id } = useParams();
  console.log(id);
  const [isAuthenticated, setAuth] = useState(false);

  const [med, setMed] = useState({});
  useEffect(() => {
    let teest = !!localStorage.getItem("auth");
      setAuth(teest);
      
    const getOne = async (id) => {
      await AXIOS.get(`meditations/${id}/details/`).then((res) => {
        console.log(res.data.data);
        setMed(res.data.data);
      });
    };
    getOne(id);
  }, []);

  return (
    <>
      {isAuthenticated ? (
        <>
          <SideNav checkit={checkit} />
          <div className="fullpage">
            <pre>{JSON.stringify(med, null, "\t")}</pre>
          </div>
        </>
      ) : (
        <>
          <Navigate to="/" />
        </>
      )}
    </>
  );
}
