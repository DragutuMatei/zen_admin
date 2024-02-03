import React, { useEffect, useState } from "react";

import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import MainButton from "../utils/MainButton";
import Select from "react-select";
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

function Cards() {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [message, setMessage] = useState("");
  const [background, setBack] = useState(null);
  const [mp3, setMp3] = useState(null);

  const handleBack = (file) => {
    setBack(file);
  };

  const handleMp3 = (file) => {
    setMp3(file);
  };
  const uploadCard = async () => {
    setLoading(true);

    if (excerpt == "" || message == "" || background == null || mp3 == null) {
      setLoading(false);
      toast("Completeaza toate campurile!");
      return;
    }
    const form = new FormData();
    form.append("excerpt", excerpt);
    form.append("message", message);
    form.append("background", background);
    form.append("mp3", mp3);
    form.append("createdAt", Date.now());
    form.append("plays", 0);

    await AXIOS.post("cards/create", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        console.log(res);
        let data = res.data.data;
        let id = res.data.id;
        setExcerpt("");
        setMessage("");
        setBack(null);
        setMp3(null);
        setData((old) => [[id, data], ...old]);
        toast("Card adaugat cu succes!");
      })
      .catch((err) => {
        console.log(err);
        toast("The Card nu a fost adaugat!");
      });

    setLoading(false);
    setShow(false);
  };

  const delete_this_shit = async (pk) => {
    await AXIOS.delete(`cards/${pk}/delete`)
      .then((res) => {
        console.log(res);
        setData(data.filter((da) => da[0] != pk));
        toast("Card sters cu succes!");
      })
      .catch((err) => {
        console.log(err);
        toast("The Card nu a fost sters!");
      });
  };

  const [data, setData] = useState([]);

  useEffect(() => {
    const get = async () => {
      await AXIOS.get("cards/").then((res) => {
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
            <h2>New Card</h2>
            <div className="row">
              <label>Excerpt</label>
              <textarea onChange={(e) => setExcerpt(e.target.value)} />
            </div>
            <div className="row">
              <label>Message</label>
              <textarea onChange={(e) => setMessage(e.target.value)} />
            </div>
            <div className="row">
              <label>Background</label>
              <FileUploader
                handleChange={handleBack}
                name="file"
                types={FILE_TYPE}
              />
            </div>
            <div className="row">
              <label>Mp3 File</label>
              <FileUploader
                handleChange={handleMp3}
                name="file"
                types={UPLOAD_TYPE}
              />
            </div>
            <div className="buttons">
              {!loading ? (
                <>
                  <SimpleButton text={"Close"} action={() => setShow(false)} />
                  <MainButton text={"Submit"} action={uploadCard} />
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
            <h3>Cards</h3>
            <div className="links">
              <Link to={"/"}>Home</Link> / <b>Cards</b>
            </div>
          </div>
          <div className="right">
            <MainButton text={"New Card"} action={() => setShow(true)} />
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Excerpt</th>
              <th>Mp3 File</th>
              <th>Plays</th>
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
                    <td>
                      <img src={da[1].background} alt="" width={60} />
                    </td>
                    <td>
                      <br />
                      {da[1].excerpt.length >= 100
                        ? da[1].excerpt.slice(0, 100) + "..."
                        : da[1].excerpt}
                    </td>
                    <td>
                      <audio controls src={da[1].mp3}></audio>
                    </td>
                    <td>{da[1].plays} </td>
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

export default Cards;
