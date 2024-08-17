import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import MainButton from "../utils/MainButton";
import Select from "react-select";
import { FileUploader } from "react-drag-drop-files";
import SimpleButton from "../utils/SimpleButton";
import { AXIOS, FILE_TYPE, VIDEO_TYPE } from "../utils/Contstants";
import { toast } from "react-toastify";
import SecondButton from "../utils/SecondButton";
import SideNav from "../components/SideNav";

function Yoga({ checkit }) {
  const [title, setTitle] = useState("");
  const [mp4, setMp4] = useState("");
  const [background, setBack] = useState(null);
  const [duration, setDuration] = useState();
  const [premium, setPremium] = useState(false);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const handleBack = (file) => {
    setBack(file);
  };
  const delete_this_shit = async (pk) => {
    await AXIOS.delete(`yoga/${pk}/delete`)
      .then((res) => {
        console.log(res);
        setData(data.filter((da) => da[0] != pk));
        toast("Yoga stearsa cu succes!");
      })
      .catch((err) => {
        console.log(err);
        toast("Yoga nu a fost stearsa!");
      });
  };
  const handleMp4 = (file) => {
    setMp4(file);
  };
  const uploadYoga = async () => {
    setLoading(true);

    if (title == "" || background == null || mp4 == null) {
      setLoading(false);
      toast("Completeaza toate campurile!");
      return;
    }
    const form = new FormData();
    form.append("title", title);
    form.append("mp4", mp4);
    form.append("background", background);
    form.append("duration", duration);
    form.append("premium", premium);
    form.append("createdAt", Date.now());
    form.append("plays", 0);

    await AXIOS.post("yoga/create", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        console.log(res);
        let data = res.data.data;
        let id = res.data.id;
        setTitle("");
        setMp4(null);
        setDuration();
        setPremium(false);
        setData((old) => [[id, data], ...old]);
        toast("Yoga adaugata cu succes!");
      })
      .catch((err) => {
        console.log(err);
        toast("Yoga nu a fost adaugata!");
      });

    setLoading(false);
    setShow(false);
  };

  useEffect(() => {
    const get = async () => {
      await AXIOS.get("yoga/").then((res) => {
        if (res.data.data && res.data.data.lenght != 0)
          setData(Object.entries(res.data.data).reverse());
        console.log(res.data.data);
      });
    };
    get();
  }, []);

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
            <h2>New Yoga Video</h2>
            <div className="row">
              <label>Title</label>
              <input type="text" onChange={(e) => setTitle(e.target.value)} />
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
              <label>Mp4 File</label>
              <FileUploader
                handleChange={handleMp4}
                name="file"
                types={VIDEO_TYPE}
              />
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
            <div className="buttons">
              {!loading ? (
                <>
                  <SimpleButton text={"Close"} action={() => setShow(false)} />
                  <MainButton text={"Submit"} action={uploadYoga} />
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
            <h3>Yoga</h3>
            <div className="links">
              <Link to={"/"}>Home</Link> / <b>Yoga</b>
            </div>
          </div>
          <div className="right">
            <MainButton text={"New Yoga"} action={() => setShow(true)} />
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Thumbnail</th>
              <th>video</th>
              <th>Title</th>
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
                const dateObject = new Date(Number(da[1].createdAt));
                console.log(da[1]);
                return (
                  <tr key={da[0]}>
                    <td>{index}</td>
                    <td>
                      <img src={da[1].background} width={60} alt="" />
                    </td>
                    <td>
                      <video width="60" src={da[1].mp4}></video>{" "}
                    </td>
                    <td>{da[1].title}</td>
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
                      <button
                        onClick={async () => {
                          const form = new FormData();
                          form.append("email", "mateidr7@gmail.com");
                          await AXIOS.post(
                            `yoga/${da[1].createdAt}/details/`,
                            form
                          ).then((res) => {
                            console.log(res);
                          });
                        }}
                      >
                        Details
                      </button>{" "}
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

export default Yoga;
