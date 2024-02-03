import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import MainButton from "../utils/MainButton";
import Footer from "../components/Footer";
import { FileUploader } from "react-drag-drop-files";
import SimpleButton from "../utils/SimpleButton";
import {
  FILE_TYPE,
  UPLOAD_TYPE,
  CATEGORIES,
  OPTIONS,
  AXIOS,
} from "../utils/Contstants";
import { toast } from "react-toastify";
import SecondButton from "../utils/SecondButton";
import SideNav from "../components/SideNav";

function Breaths() {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [mp3, setMp3] = useState(null);
  const [tempo, setTempo] = useState("");
  const [premium, setPremium] = useState(false);

  const handleMp3 = (file) => {
    setMp3(file);
  };

  const uploadbreath = async () => {
    setLoading(true);

    if (name == "" || mp3 == null || tempo == "") {
      setLoading(false);
      toast("Completeaza toate campurile!");
      return;
    }
    const form = new FormData();
    form.append("name", name);
    form.append("mp3", mp3);
    form.append("tempo", tempo);
    form.append("premium", premium);
    form.append("createdAt", Date.now());
    form.append("plays", 0);
    console.log(premium);
    await AXIOS.post("breaths/create", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        console.log(res);
        let data = res.data.data;
        let id = res.data.id;
        setName("");
        setMp3(null);
        setTempo("");
        setPremium(false);
        setData((old) => [[id, data], ...old]);
        toast("Breath adaugat cu succes!");
      })
      .catch((err) => {
        console.log(err);
        toast("The Breath nu a fost adaugat!");
      });
    setLoading(false);
    setShow(false);
  };
  const delete_this_shit = async (pk) => {
    console.log(pk);
    await AXIOS.delete(`breaths/${pk}/delete`)
      .then((res) => {
        console.log(res);
        setData(data.filter((da) => da[0] != pk));
        toast("Breath sters cu succes!");
      })
      .catch((err) => {
        console.log(err);
        toast("The Breath nu a fost sters!");
      });
  };

  const [data, setData] = useState([]);

  useEffect(() => {
    const get = async () => {
      await AXIOS.get("breaths/").then((res) => {
        if (res.data.data && res.data.data.lenght != 0)
          setData(Object.entries(res.data.data).reverse());
      });
    };
    get();
  }, []);

  return (
    <>
      <SideNav />
      {show && (
        <div
          className="over"
          onClick={(e) => {
            if (e.target.className === "over" && !loading) {
              setShow(false);
            }
          }}
        >
          <div className="form">
            <h2>New Breath</h2>
            <div className="row">
              <label>Name</label>
              <input type="text" onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="row">
              <label>Mp3 File</label>
              <FileUploader
                handleChange={handleMp3}
                name="file"
                types={UPLOAD_TYPE}
              />
            </div>
            <div className="row">
              <label>Tempo</label>
              <input
                type="text"
                placeholder="Ex: i4/o2/h5"
                onChange={(e) => setTempo(e.target.value)}
              />
            </div>
            <div className="row">
              <label>Premium</label>
              <select
                name=""
                id=""
                onChange={(e) => setPremium(e.target.value === "true")}
                // onChange={(e) => console.log(e.target.value === "true")}
              >
                <option value={false}>No</option>
                <option value={true}>Yes</option>
              </select>
            </div>
            <div className="buttons">
              {!loading ? (
                <>
                  <SimpleButton text={"Close"} action={() => setShow(false)} />
                  <MainButton text={"Submit"} action={uploadbreath} />
                </>
              ) : (
                <>
                  <p>Loading...</p>
                </>
              )}{" "}
            </div>
          </div>
        </div>
      )}
      <div className="fullpage">
        <div className="top">
          <div className="left">
            <h3>Breaths</h3>
            <div className="links">
              <Link to={"/"}>Home</Link> / <b>Breaths</b>
            </div>
          </div>
          <div className="right">
            <MainButton text={"New Breaths"} action={() => setShow(true)} />
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Mp3 File</th>
              <th>Tempo</th>
              <th>Plays</th>
              <th>is Premium?</th>
              <th>Created at</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((da, index) => {
                const dateObject = new Date(Number(da[1].createdAt));

                return (
                  <tr key={da[0]}>
                    <td>{index}</td>
                    <td>{da[1].name}</td>
                    <td>
                      <audio src={da[1].mp3} controls></audio>
                    </td>
                    <td>{da[1].tempo}</td>
                    <td>{da[1].plays}</td>
                    <td>
                      {da[1].premium === "true" ? (
                        <MainButton text={"Premium"} />
                      ) : (
                        <SecondButton text={"Not Premium"} />
                      )}
                    </td>
                    <td>
                      {String(dateObject.getUTCDate()).padStart(2, "0")}/
                      {String(dateObject.getUTCMonth() + 1).padStart(2, "0")}/
                      {dateObject.getUTCFullYear()}
                    </td>
                    <td>
                      <SecondButton
                        text={"Delete"}
                        action={() => delete_this_shit(da[0])}
                      />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <Footer />
      </div>
    </>
  );
}

export default Breaths;
