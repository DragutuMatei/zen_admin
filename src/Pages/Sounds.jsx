import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import Select from "react-select";
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
  CATEGORIES_SOUNDS,
} from "../utils/Contstants";
import { toast } from "react-toastify";
import SecondButton from "../utils/SecondButton";
import SideNav from "../components/SideNav";

function Sounds() {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [mp3, setMp3] = useState(null);
  const [background, setBack] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [category, setCategory] = useState("");
  const [premium, setPremium] = useState(false);

  const handleBack = (file) => {
    setBack(file);
  };
  const handleThumb = (file) => {
    setThumbnail(file);
  };

  const handleMp3 = (file) => {
    setMp3(file);
  };

  const uploadsound = async () => {
    setLoading(true);
    if (
      title == "" ||
      mp3 == null ||
      background == null ||
      thumbnail == null ||
      category == ""
    ) {
      setLoading(false);
      toast("Completeaza toate campurile!");
      return;
    }
    const form = new FormData();
    form.append("title", title);
    form.append("category", category);
    form.append("thumbnail", thumbnail);
    form.append("background", background);
    form.append("mp3", mp3);
    form.append("premium", premium);
    form.append("createdAt", Date.now());
    form.append("plays", 0);

    await AXIOS.post("sounds/create", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        console.log(res);
        let data = res.data.data;
        let id = res.data.id;

        setTitle("");
        setBack(null);
        setMp3(null);
        setThumbnail(null);
        setCategory("");
        setPremium(false);

        setData((old) => [[id, data], ...old]);
        toast("Sound adaugat cu succes!");
      })
      .catch((err) => {
        console.log(err);
        toast("The Sound nu a fost adaugat!");
      });

    setLoading(false);
    setShow(false);
  };
  const delete_this_shit = async (pk) => {
    await AXIOS.delete(`sounds/${pk}/delete`)
      .then((res) => {
        console.log(res);
        setData(data.filter((da) => da[0] != pk));
        toast("Sound sters cu succes!");
      })
      .catch((err) => {
        console.log(err);
        toast("The Sound nu a fost sters!");
      });
  };

  const [data, setData] = useState([]);

  useEffect(() => {
    const get = async () => {
      await AXIOS.get("sounds/").then((res) => {
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
            <h2>New Sound</h2>
            <div className="row">
              <label>Title</label>
              <input type="text" onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="row">
              <label>Category</label>
              <Select
                className="select"
                options={CATEGORIES_SOUNDS}
                onChange={(e) => setCategory(e.value)}
              />
            </div>
            <div className="row">
              <label>Thumbnail</label>
              <FileUploader
                handleChange={handleThumb}
                name="file"
                types={FILE_TYPE}
              />
            </div>{" "}
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
            <div className="row">
              <label>Premium</label>
              <select
                name=""
                id=""
                onChange={(e) => setPremium(e.target.value === "true")}
              >
                <option value={false}>No</option>
                <option value={true}>Yes</option>
              </select>
            </div>
            <div className="buttons">
              {!loading ? (
                <>
                  <SimpleButton text={"Close"} action={() => setShow(false)} />
                  <MainButton text={"Submit"} action={uploadsound} />
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
            <h3>Sounds</h3>
            <div className="links">
              <Link to={"/"}>Home</Link> / <b>Sounds</b>
            </div>
          </div>
          <div className="right">
            <MainButton text={"New Sound"} action={() => setShow(true)} />
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Thumbnail</th>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Mp3 File</th>
              <th>Plays</th>
              <th>is Premium?</th>
              <th>Created at</th>
              <th>Details</th>
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
                      <img src={da[1].thumbnail} width={60} alt="" />
                    </td>
                    <td>
                      <img src={da[1].background} width={60} alt="" />
                    </td>
                    <td>{da[1].title}</td>
                    <td>{da[1].category}</td>
                    <td>
                      <audio src={da[1].mp3} controls></audio>
                    </td>
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
                      <button
                        onClick={async () => {
                          const form = new FormData();
                          form.append("email", "mateidr7@gmail.com");
                          await AXIOS.post(
                            `sounds/${da[1].createdAt}/details/`,
                            form
                          ).then((res) => {
                            console.log(res);
                          });
                        }}
                      >
                        Details
                      </button>
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

export default Sounds;
