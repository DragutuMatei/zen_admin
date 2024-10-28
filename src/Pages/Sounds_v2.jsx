import React, { useEffect, useState } from "react";
import SideNav from "../components/SideNav";
import {
  AXIOS,
  CATEGORIES,
  CATEGORIES_SOUNDS,
  FILE_TYPE,
  UPLOAD_TYPE,
} from "../utils/Contstants";
import MainButton from "../utils/MainButton";
import SimpleButton from "../utils/SimpleButton";
import { FileUploader } from "react-drag-drop-files";
import Select from "react-select";
import Footer from "../components/Footer";
import SecondButton from "../utils/SecondButton";
import { Link } from "react-router-dom";

function Sounds_v2({ checkit }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  //category
  const [categoryTitle, setcategoryTitle] = useState("");
  const [backgroundImage, setbackgroundImage] = useState(null);
  const [order, setOrder] = useState(0);

  //meditatie
  const [category, setcategory] = useState("");
  const [background, setbackground] = useState("");
  const [title, settitle] = useState("");
  const [isLocked, setisLocked] = useState(false);
  const [duration, setduration] = useState("");
  const [listenLink, setlistenLink] = useState(null);

  const [categories, setCategories] = useState([]);
  const [update, setUpdate] = useState(0);
  useEffect(() => {
    getAllCategories();
  }, [, update]);

  const getAllCategories = async () => {
    setCategories([]);
    setData([]);
    await AXIOS.get(`/getAllListenCats`).then((res) => {
      const data = res.data;
      data.data.forEach((item) => {
        setCategories((old) => [
          {
            label: item.categoryTitle,
            backgroundImage: item.backgroundImage,
            value: item.uid,
            order: item.order,
          },
          ...old,
        ]);
        let arr = [...item.listenRoutines];

        arr.forEach((ar) => {
          ar["cat_id"] = item.uid;
        });
        setData((old) => [...arr, ...old]);
      });
    });
  };

  const deleteListenCatById = async (id) => {
    await AXIOS.post(`/deleteListenCatById`, { id: id }).then((res) => {
      const data = res.data;
      console.log(data);
      setUpdate(update + 1);
    });
  };

  const addListenCat = async () => {
    setLoading(true);

    await AXIOS.post(
      "/addListenCat",
      {
        categoryTitle,
        backgroundImage,
        order,
        listenRoutines: [],
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

  const addListenToCat = async () => {
    setLoading(true);
    let categorie = "";
    categories.forEach((cat) => {
      if (cat.value === category) {
        categorie = cat.label;
      }
    });
    console.log(isLocked);
    await AXIOS.post(
      "/addListenToCat",
      {
        uid: category,
        category: categorie,
        background,
        title,
        isLocked,
        duration,
        listenLink,
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

  const deleteListenFromCat = async (category, id) => {
    let uid = "";
    categories.forEach((cat) => {
      if (cat.value === category) {
        uid = cat.value;
      }
    });
    await AXIOS.post("/deleteListenFromCat", { uid, id }).then((res) => {
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
            <h2>New listen Category</h2>
            <div className="row">
              <label>Title</label>
              <input
                type="text"
                onChange={(e) => setcategoryTitle(e.target.value)}
              />{" "}
              <div className="row">
                <label>Order</label>
                <input
                  type="number"
                  onChange={(e) => setOrder(e.target.value)}
                />
              </div>
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
                  <MainButton text={"Submit"} action={addListenCat} />
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
            <h2>New listen</h2>
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
              <label>Mp3 File</label>
              <FileUploader
                handleChange={setlistenLink}
                name="file"
                types={UPLOAD_TYPE}
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
            {/* <div className="row">
                <label>Large</label>
                <select
                  name=""
                  id=""
                  onChange={(e) => setLarge(e.target.value === "true")}
                >
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>
              </div> */}
            <div className="buttons">
              {!loading ? (
                <>
                  <SimpleButton text={"Close"} action={() => setShow(false)} />
                  <MainButton text={"Submit"} action={addListenToCat} />
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
            <h3>listens</h3>
            <div className="links">
              {/* <pre>{JSON.stringify(user)}</pre> */}
              <Link to={"/"}>Home</Link> / <b>listens</b>
            </div>
          </div>
          <div className="right">
            <MainButton text={"New listen"} action={() => setShow(true)} />
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Order</th>
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
                    <td>{cat.order}</td>
                    <td>{cat.label}</td>
                    <td>
                      <img src={cat.backgroundImage} width={60} alt="" />
                    </td>
                    <td>
                      <SecondButton
                        text={"Delete"}
                        action={() => deleteListenCatById(cat.value)}
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
              <th>is Premium?</th>
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
                      <Link to={`/listens/${da.cat_id}/${da.id}`}>
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
                      <audio controls src={da.listenLink}></audio>
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
                        <Link to={`/listens/${da[1].createdAt}`}>
                          Details
                        </Link>
                      </td> */}
                    {/* <td>
                        <Link to={`/listens/${da[0]}`}>Details</Link>
                      </td> */}
                    <td>
                      <SecondButton
                        text={"Delete"}
                        action={() => deleteListenFromCat(da.cat_id, da.id)}
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

export default Sounds_v2;
