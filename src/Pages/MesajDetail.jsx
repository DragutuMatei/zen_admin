import React, { useEffect, useState } from "react";
import { Navigate, useParams, useSearchParams } from "react-router-dom";
import { AXIOS } from "../utils/Contstants";
import SideNav from "../components/SideNav";

function MesajDetail({ checkit }) {
  const { id } = useParams();

  const [isAuthenticated, setAuth] = useState(false);
  const [mes, setMes] = useState({});
  useEffect(() => {
    let teest = !!localStorage.getItem("auth");
    setAuth(teest);

    const getOne = async (id) => {
      await AXIOS.get(`/getMessageById/${id}`).then((res) => {
        console.log(res);
        setMes(res.data.data);
      });
    };
    getOne(id);
  }, []);

  return (
    <>
      <SideNav checkit={checkit} />
      <div className="fullpage">
        <pre>{JSON.stringify(mes, null, "\t")}</pre>
      </div>
    </>
  );
}

export default MesajDetail;
