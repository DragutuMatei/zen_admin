import React, { useEffect, useState } from "react";
import { Navigate, useParams, useSearchParams } from "react-router-dom";
import { AXIOS } from "../utils/Contstants";
import SideNav from "../components/SideNav";

export default function MedDetails({ checkit }) {
  const { category, id } = useParams();
  console.log(category, id);
  const [isAuthenticated, setAuth] = useState(false);

  const [med, setMed] = useState({});
  useEffect(() => {
    let teest = !!localStorage.getItem("auth");
    setAuth(teest);

    const getOne = async (id) => {
      console.log(category);
      await AXIOS.get(`/getMedFromCatById/${category}/${id}`).then((res) => {
        console.log(res);
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
        <>{/* <Navigate to="/" /> */}</>
      )}
    </>
  );
}
