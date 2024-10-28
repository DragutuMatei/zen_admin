import React, { useEffect, useState } from "react";
import SideNav from "../components/SideNav";
import { AXIOS, CATEGORIES, FILE_TYPE, VIDEO_TYPE } from "../utils/Contstants";
import MainButton from "../utils/MainButton";
import SimpleButton from "../utils/SimpleButton";
import { FileUploader } from "react-drag-drop-files";
import Select from "react-select";
import Footer from "../components/Footer";
import SecondButton from "../utils/SecondButton";
import { Link } from "react-router-dom";

function Yoga({ checkit }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  //category
  const [categoryTitle, setcategoryTitle] = useState("");
  const [backgroundImage, setbackgroundImage] = useState(null);

  //meditatie
  const [category, setcategory] = useState("");
  const [background, setbackground] = useState("");
  const [title, settitle] = useState("");
  const [isLocked, setisLocked] = useState(false);
  const [duration, setduration] = useState("");
  const [yogaLink, setyogaLink] = useState(null);

  const [categories, setCategories] = useState([]);
  const [update, setUpdate] = useState(0);
  useEffect(() => {
    getAllCategories();
  }, [, update]);

  const getAllCategories = async () => {
    setCategories([]);
    setData([]);
    await AXIOS.get(`/getAllyogaCats`).then((res) => {
      const data = res.data;
      data.data.forEach((item) => {
        setCategories((old) => [
          {
            label: item.categoryTitle,
            backgroundImage: item.backgroundImage,
            value: item.uid,
          },
          ...old,
        ]);
        let arr = [...item.yogaRoutines];

        arr.forEach((ar) => {
          ar["cat_id"] = item.uid;
        });
        setData((old) => [...arr, ...old]);
      });
    });
  };

  const deleteyogaCatById = async (id) => {
    await AXIOS.post(`/deleteyogaCatById`, { id: id }).then((res) => {
      const data = res.data;
      console.log(data);
      setUpdate(update + 1);
    });
  };

  const addyogaCat = async () => {
    setLoading(true);

    await AXIOS.post(
      "/addyogaCat",
      {
        categoryTitle,
        backgroundImage,
        yogaRoutines: [],
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    ).then((res) => {
      console.log(res);
      setUpdate(update + 1);
      setLoading(false);
      setShow(false);
    });
  };

  const addyogaToCat = async () => {
    setLoading(true);
    let categorie = "";
    categories.forEach((cat) => {
      if (cat.value === category) {
        categorie = cat.label;
      }
    });
    console.log(isLocked);
    await AXIOS.post(
      "/addyogaToCat",
      {
        uid: category,
        category: categorie,
        background,
        title,
        isLocked,
        duration,
        yogaLink,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    ).then((res) => {
      const data = res.data;
      setUpdate(update + 1);
      setLoading(false);
      setShow(false);
    });
  };

  const deleteyogaFromCat = async (category, id) => {
    let uid = "";
    categories.forEach((cat) => {
      if (cat.label === category) {
        uid = cat.value;
      }
    });
    await AXIOS.post("/deleteyogaFromCat", { uid, id }).then((res) => {
      const data = res.data;
      console.log(data);
      setUpdate(update + 1);
    });
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
            <h2>New yoga Category</h2>
            <div className="row">
              <label>Title</label>
              <input
                type="text"
                onChange={(e) => setcategoryTitle(e.target.value)}
              />
            </div>
            <div className="row">
              <label>Background</label>
              <FileUploader
                handleChange={setbackgroundImage}
                name="file"
                types={FILE_TYPE}
              />
            </div>
            <div className="buttons">
              {!loading ? (
                <>
                  <SimpleButton text={"Close"} action={() => setShow(false)} />
                  <MainButton text={"Submit"} action={addyogaCat} />
                </>
              ) : (
                <>
                  <p>Loading...</p>
                </>
              )}
            </div>
            <hr
              style={{
                width: "90%",
                height: 2,
                background: "#2f2f2f",
              }}
            />
            <h2>New yoga</h2>
            <div className="row">
              <label>Title</label>
              <input type="text" onChange={(e) => settitle(e.target.value)} />
            </div>
            <div className="row">
              <label>Category</label>
              <Select
                className="select"
                options={categories}
                onChange={(e) => setcategory(e.value)}
              />
            </div>
            {/* <div className="row">
                <label>Tags</label>
                <Select
                  className="select"
                  closeMenuOnSelect={false}
                  isMulti
                  options={OPTIONS}
                  onChange={(e) => setTags(e)}
                />
              </div> */}
            <div className="row">
              <label>Background</label>
              <FileUploader
                handleChange={setbackground}
                name="file"
                types={FILE_TYPE}
              />
            </div>{" "}
            <div className="row">
              <label>Mp4 File</label>
              <FileUploader
                handleChange={setyogaLink}
                name="file"
                types={VIDEO_TYPE}
              />
            </div>
            {/* <div className="row">
                <label>Voice</label>
                <input type="text" onChange={(e) => setVoice(e.target.value)} />
              </div> */}
            <div className="row">
              <label>Duration (minute)</label>
              <input
                type="number"
                onChange={(e) => setduration(e.target.value)}
              />
            </div>
            <div className="row">
              <label>Premium</label>
              <select
                name=""
                id=""
                onChange={(e) => setisLocked(e.target.value === "true")}
              >
                <option value={false}>No</option>
                <option value={true}>Yes</option>
              </select>
            </div>
            <div className="buttons">
              {!loading ? (
                <>
                  <SimpleButton text={"Close"} action={() => setShow(false)} />
                  <MainButton text={"Submit"} action={addyogaToCat} />
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
            <h3>yogas</h3>
            <div className="links">
              {/* <pre>{JSON.stringify(user)}</pre> */}
              <Link to={"/"}>Home</Link> / <b>yogas</b>
            </div>
          </div>
          <div className="right">
            <MainButton text={"New yoga"} action={() => setShow(true)} />
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Title</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {categories &&
              categories.map((cat, index) => {
                return (
                  <tr>
                    <td>{index}</td>
                    <td>{cat.label}</td>
                    <td>
                      <img src={cat.backgroundImage} width={60} alt="" />
                    </td>
                    <td>
                      <SecondButton
                        text={"Delete"}
                        action={() => deleteyogaCatById(cat.value)}
                      />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Mp3 File</th>
              <th>Duration</th>
              {/* <th>Plays</th> */}
              <th>is Premium?</th>
              {/* <th>Created at</th> */}
              {/* <th>Details</th> */}
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((da, index) => {
                // const dateObject = new Date(Number(da[1].createdAt));
                return (
                  <tr key={da.id}>
                    <td>{index}</td>
                    <td>
                      <img src={da.background} alt="" width={60} />
                    </td>
                    <td>
                      <Link to={`/yogas/${da.cat_id}/${da.id}`}>
                        {da.title}
                      </Link>
                    </td>
                    <td>
                      <MainButton
                        // action={() => cat(da[1].category)}
                        text={da.category}
                      />
                    </td>
                    <td>
                      <audio controls src={da.yogaLink}></audio>
                    </td>
                    <td>{da.duration}</td>
                    {/* <td>{da[1].plays} </td> */}
                    <td>
                      {da.isLocked ? (
                        <MainButton text={"Premium"} />
                      ) : (
                        <SecondButton text={"Not Premium"} />
                      )}
                    </td>
                    {/* <td>
                        {String(dateObject.getUTCDate()).padStart(2, "0")}/
                        {String(dateObject.getUTCMonth() + 1).padStart(2, "0")}/
                        {dateObject.getUTCFullYear()}
                      </td> */}
                    {/* <td>
                        {isSaved ? (
                          <button>delete from favorites</button>
                        ) : (
                          <button>save in favorites</button>
                        )}
                        <Link to={`/yogas/${da[1].createdAt}`}>
                          Details
                        </Link>
                      </td> */}
                    {/* <td>
                        <Link to={`/yogas/${da[0]}`}>Details</Link>
                      </td> */}
                    <td>
                      <SecondButton
                        text={"Delete"}
                        action={() => deleteyogaFromCat(da.cat_id, da.id)}
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

export default Yoga;
