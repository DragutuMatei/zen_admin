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

function Meditations({ checkit }) {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCat] = useState("");
  const [tags, setTags] = useState([]);
  const [background, setBack] = useState(null);
  const [mp3, setMp3] = useState(null);
  const [voice, setVoice] = useState("");
  const [duration, setDuration] = useState();
  const [premium, setPremium] = useState(false);
  const [large, setLarge] = useState(false);

  const cat = async (id) => {
    // await AXIOS.get(`meditations/${id}/category/`).then((res) => {
    //   console.log(res.data.data);

    //   setData(Object.entries(res.data.data).reverse());
    // });
  };

  const handleBack = (file) => {
    setBack(file);
  };

  const handleMp3 = (file) => {
    setMp3(file);
  };

  const uploadMeditatie = async () => {
    setLoading(true);

    if (
      title == "" ||
      category == "" ||
      tags.length == 0 ||
      background == null ||
      mp3 == null ||
      voice == ""
    ) {
      setLoading(false);
      toast("Completeaza toate campurile!");
      return;
    }

    let modi_tags = [];
    for (let tag of tags) {
      modi_tags.push(tag.value);
    }
    console.log(modi_tags);
    const form = new FormData();
    form.append("title", title);
    form.append("category", category);
    form.append("tags", modi_tags);
    form.append("background", background);
    form.append("mp3", mp3);
    form.append("voice", voice);
    form.append("duration", duration);
    form.append("premium", premium);
    form.append("large", large);
    form.append("createdAt", Date.now());
    form.append("plays", 0);

    console.log(premium);
    console.log(typeof premium);

    // await AXIOS.post("meditations/create", form, {
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //   },
    // })
    //   .then((res) => {
    //     console.log(res);
    //     let data = res.data.data;
    //     let id = res.data.id;
    //     setTitle("");
    //     setCat("");
    //     setTags([]);
    //     setBack(null);
    //     setMp3(null);
    //     setVoice("");
    //     setDuration();
    //     setPremium(false);
    //     setLarge(false);
    //     setData((old) => [[id, data], ...old]);
    //     toast("Meditatie adaugata cu succes!");
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     toast("Meditatia nu a fost adaugata!");
    //   });

    setLoading(false);
    setShow(false);
  };

  const delete_this_shit = async (pk) => {
    // await AXIOS.delete(`meditations/${pk}/delete`)
    //   .then((res) => {
    //     setData(data.filter((da) => da[0] != pk));
    //     toast("Meditatie stearsa cu succes!");
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     toast("Meditatia nu a fost stearsa!");
    //   });
  };

  const [data, setData] = useState([]);

  useEffect(() => {
    const get = async () => {
      // await AXIOS.get("meditations/").then((res) => {
      //   if (res.data.data && res.data.data.lenght != 0)
      //     setData(Object.entries(res.data.data).reverse());
      // });

      const form = new FormData();
      form.append("email", "mateidr7@gmail.com");
      // form.append("plan", 1);

      // await AXIOS.post("yoga/updateCountYoga/", form).then((res) => {
      //   console.log(res.data);
      // });
    };
    get();
    fetchUserInfo();
  }, []);
  ///                 LOCALSTORAGE
  const check_in_pref = (id) => {
    const datas = JSON.parse(localStorage.getItem("preferate"));
    return datas.some((med) => med.id == id);
  };

  const delete_pref = (id) => {
    const datas = JSON.parse(localStorage.getItem("preferate"));
    const update_data = datas.filter((med) => med.id == id);
    const newdata = JSON.stringify(update_data);
    localStorage.setItem("preferate", newdata);
  };

  const save = (data, id) => {
    if (localStorage.getItem("preferate") != null) {
      const datas = JSON.parse(localStorage.getItem("preferate"));
      datas.push({ id, ...data });
      const newdata = JSON.stringify(datas);
      console.log(newdata);
      localStorage.setItem("preferate", newdata);
    } else {
      const datas = [{ id, ...data }];
      console.log("datas:", datas);
      const newdata = "[" + JSON.stringify(data) + "]";
      console.log("newdata: ", newdata);
      localStorage.setItem("preferate", newdata);
      const olddata = JSON.parse(newdata);
      console.log("olddata: ", olddata);
    }
  };

  ///                 GetUserInfo
  const [user, setUser] = useState({});

  const fetchUserInfo = async () => {
    let token = localStorage.getItem("auth");
    try {
      const response = await AXIOS.get("idk/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      const userInfo = response.data;
      setUser(response);
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
    <>
      <SideNav checkit={checkit} />
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
            <h2>New Meditation</h2>
            <div className="row">
              <label>Title</label>
              <input type="text" onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="row">
              <label>Category</label>
              <Select
                className="select"
                options={CATEGORIES}
                onChange={(e) => setCat(e.value)}
              />
            </div>
            <div className="row">
              <label>Tags</label>
              <Select
                className="select"
                closeMenuOnSelect={false}
                isMulti
                options={OPTIONS}
                onChange={(e) => setTags(e)}
              />
            </div>
            <div className="row">
              <label>Background</label>
              <FileUploader
                handleChange={handleBack}
                name="file"
                types={FILE_TYPE}
              />
            </div>{" "}
            <div className="row">
              <label>Mp3 File</label>
              <FileUploader
                handleChange={handleMp3}
                name="file"
                types={UPLOAD_TYPE}
              />
            </div>
            <div className="row">
              <label>Voice</label>
              <input type="text" onChange={(e) => setVoice(e.target.value)} />
            </div>
            <div className="row">
              <label>Duration (seconds)</label>
              <input
                type="number"
                onChange={(e) => setDuration(e.target.value)}
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
            <div className="row">
              <label>Large</label>
              <select
                name=""
                id=""
                onChange={(e) => setLarge(e.target.value === "true")}
              >
                <option value={false}>No</option>
                <option value={true}>Yes</option>
              </select>
            </div>
            <div className="buttons">
              {!loading ? (
                <>
                  <SimpleButton text={"Close"} action={() => setShow(false)} />
                  <MainButton text={"Submit"} action={uploadMeditatie} />
                </>
              ) : (
                <>
                  <p>Loading...</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="fullpage">
        <div className="top">
          <div className="left">
            <h3>Meditations</h3>
            <div className="links">
              {/* <pre>{JSON.stringify(user)}</pre> */}
              <Link to={"/"}>Home</Link> / <b>Meditations</b>
            </div>
          </div>
          <div className="right">
            <MainButton text={"New Meditation"} action={() => setShow(true)} />
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Title</th>
              <th>Tags</th>
              <th>Category</th>
              <th>Mp3 File</th>
              <th>Duration</th>
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
                const isSaved = check_in_pref(da[0]);
                // console.log(isSaved);
                const dateObject = new Date(Number(da[1].createdAt));
                // console.log(da[0]);
                return (
                  <tr key={da[0]}>
                    <td>{index}</td>
                    <td>
                      <img src={da[1].background} alt="" width={60} />
                    </td>
                    <td>
                      <Link to={`/meditations/${da[1].createdAt}`}>
                        {da[1].title}
                      </Link>
                    </td>
                    <td>
                      {da[1].tags &&
                        da[1].tags.map((tag) => {
                          return <SecondButton text={tag} />;
                        })}
                    </td>
                    <td>
                      <MainButton
                        action={() => cat(da[1].category)}
                        text={da[1].category}
                      />
                    </td>
                    <td>
                      <audio controls src={da[1].mp3}></audio>
                    </td>
                    <td>{da[1].duration}</td>
                    <td>{da[1].plays} </td>
                    <td>
                      {da[1].premium ? (
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
                      {isSaved ? (
                        <button onClick={() => delete_pref(da[0])}>
                          delete from favorites
                        </button>
                      ) : (
                        <button onClick={() => save(da[1], da[0])}>
                          save in favorites
                        </button>
                      )}
                      <Link to={`/meditations/${da[1].createdAt}`}>Details</Link>
                    </td>
                    {/* <td>
                      <Link to={`/meditations/${da[0]}`}>Details</Link>
                    </td> */}
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

export default Meditations;
