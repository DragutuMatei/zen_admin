import React, { useEffect, useState } from "react";
import SideNav from "../components/SideNav";
import Footer from "../components/Footer";
import MainButton from "../utils/MainButton";
import { Link } from "react-router-dom";
import SimpleButton from "../utils/SimpleButton";
import { AXIOS } from "../utils/Contstants";
import SecondButton from "../utils/SecondButton";

function Mesaj({ checkit }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(0);

  const [title, settitle] = useState("");
  const [message, setmessage] = useState("");
  const [author, setauthor] = useState("");
  const [details, setdetails] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    getAllMessages();
  }, [, update]);

  const getAllMessages = async () => {
    setData([]);
    await AXIOS.get("/getAllMessages").then((res) => {
      const data = res.data;
      console.log(data);
      setData(data.data);
    });
  };
  function replace(text) {
    return text.replace(/ț/g, "t");
  }
  const addMessage = async () => {
    setLoading(true);
    await AXIOS.post("/addMessage", {
      title: replace(title)
        .replace(/(\r\n|\r|\n)+/g, "!!!")
        .split("!!!")[0],
      message: replace(title)
        .replace(/(\r\n|\r|\n)+/g, "!!!")
        .split("!!!")[1],
      author: replace(title)
        .replace(/(\r\n|\r|\n)+/g, "!!!")
        .split("!!!")[2],
      details: replace(details).replace(/(\r\n|\r|\n)+/g, "!!!"),
    }).then((res) => {
      const data = res.data;
      console.log(data);
      setLoading(false);
      setShow(false);
      setUpdate(update + 1);
    });
  };
  const deleteMessage = async (id) => {
    await AXIOS.post("/deleteMessage", { id }).then((res) => {
      setUpdate(update + 1);
      console.log(res);
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
            <h2>New Message</h2>

            <div className="row">
              <label>Title + messaje + author</label>
              <textarea onChange={(e) => settitle(e.target.value)} />
            </div>
            {/* <div className="row">
              <label>Title</label>
              <input type="text" onChange={(e) => settitle(e.target.value)} />
            </div>
            <div className="row">
              <label>Message</label>
              <textarea onChange={(e) => setmessage(e.target.value)}></textarea>
            </div>
            <div className="row">
              <label>Author</label>
              <input type="text" onChange={(e) => setauthor(e.target.value)} />
            </div>{" "} */}
            <div className="row">
              <label>Details</label>
              <textarea onChange={(e) => setdetails(e.target.value)} />
            </div>
            <div className="buttons">
              {!loading ? (
                <>
                  <SimpleButton text={"Close"} action={() => setShow(false)} />
                  <MainButton text={"Submit"} action={addMessage} />
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
            <h3>Messages</h3>
            <div className="links">
              {/* <pre>{JSON.stringify(user)}</pre> */}
              <Link to={"/"}>Home</Link> / <b>Messages</b>
            </div>
          </div>
          <div className="right">
            <MainButton text={"New Message"} action={() => setShow(true)} />
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Message</th>
              <th>Author</th>
              <th>Details</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((da, index) => {
                return (
                  <tr>
                    <td>{index}</td>
                    <td>
                      <Link to={`/getMessageById/${da.id}`}>{da.title}</Link>{" "}
                    </td>
                    <td>{da.message}</td>
                    <td>{da.author}</td>
                    <td>{da.details}</td>
                    <td>
                      <SecondButton
                        text={"Delete"}
                        action={() => deleteMessage(da.id)}
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

export default Mesaj;
