import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainButton from "../utils/MainButton";
import Footer from "../components/Footer";
import SimpleButton from "../utils/SimpleButton";
import SideNav from "../components/SideNav";
import { toast } from "react-toastify";
import { AXIOS } from "../utils/Contstants";
import Papa from "papaparse"; // Vom folosi manual delimitatorul dac[ nu avem papaparse, dar mai simplu e split pe \n
// actually nu avem neaparat papaparse in deps, let's use string split.

function StoreCodes() {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  
  // Form states
  const [alias, setAlias] = useState("");
  const [platform, setPlatform] = useState("android");
  const [textCodes, setTextCodes] = useState("");
  
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await AXIOS.get("/getStoreCodesStats");
      if (res.data.ok) {
        setData(res.data.data);
      } else {
        toast.error("Eroare la preluarea statisticilor!");
      }
    } catch (err) {
      console.log(err);
      toast.error("Eroare de conexiune la statistici.");
    }
  };

  const processInputAndUpload = async () => {
    if (alias.trim() === "") {
      toast("Introdu un nume/alias pentru cod!");
      return;
    }
    
    // Spargem textul dup[ linii noi sau virgule
    const rawCodes = textCodes.split(/[\n,]+/);
    const cleanCodes = rawCodes.map(c => c.trim()).filter(c => c.length > 0);
    
    if (cleanCodes.length === 0) {
      toast("Nu ai introdus niciun cod valid.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        alias: alias.trim(),
        platform,
        codes: cleanCodes
      };
      
      const res = await AXIOS.post("/addStoreCodes", payload);
      if (res.data.ok) {
        setAlias("");
        setTextCodes("");
        setShow(false);
        toast("Coduri adaugate cu succes!");
        fetchStats();
      } else {
        toast("Eroare la adaugare!");
      }
    } catch (err) {
      console.log(err);
      toast("Codurile nu au putut fi adaugate!");
    }
    setLoading(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      setTextCodes((prev) => prev ? prev + "\n" + text : text);
    };
    reader.readAsText(file);
  };

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
            <h2>Add Store Promo Codes</h2>
            <div className="row">
              <label>Alias / Nume Campanie (ex: ZEN_PROMO)</label>
              <input type="text" value={alias} onChange={(e) => setAlias(e.target.value.toUpperCase())} />
            </div>
            <div className="row">
              <label>Platforma</label>
              <select
                onChange={(e) => setPlatform(e.target.value)}
                value={platform}
              >
                <option value="android">Android (Google Play)</option>
                <option value="ios">iOS (App Store)</option>
              </select>
            </div>
            
            <div className="row" style={{ marginTop: 15 }}>
              <label>Adauga din fisier CSV (.csv / id-uri unice per rand)</label>
              <input type="file" accept=".csv,.txt" onChange={handleFileUpload} />
            </div>

            <div className="row" style={{ marginTop: 15 }}>
              <label>SAU Lipeste (Paste) codurile separat prin virgula/rand nou</label>
              <textarea 
                rows={5} 
                value={textCodes}
                onChange={(e) => setTextCodes(e.target.value)}
                placeholder={"COD1\nCOD2\nCOD3"}
              />
              <small><b>Avem {textCodes.split(/[\n,]+/).filter(c=>c.trim().length>0).length} coduri pregatite.</b></small>
            </div>

            <div className="buttons" style={{marginTop: 15}}>
              {!loading ? (
                <>
                  <SimpleButton text={"Close"} action={() => setShow(false)} />
                  <MainButton text={"Submit"} action={processInputAndUpload} />
                </>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="fullpage">
        <div className="top">
          <div className="left">
            <h3>Coduri AppStore / GooglePlay</h3>
            <div className="links">
              <Link to={"/"}>Home</Link> / <b>Store Codes</b>
            </div>
          </div>
          <div className="right">
            <MainButton text={"Incarca Coduri Noi"} action={() => {
              setAlias("");
              setPlatform("android");
              setTextCodes("");
              setShow(true);
            }} />
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Alias (Campanie)</th>
              <th>Platforma</th>
              <th>Total Coduri</th>
              <th>Folosite (Revendicate)</th>
              <th>Disponibile</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((item, index) => {
                return (
                  <tr key={item.alias + item.platform}>
                    <td>{index + 1}</td>
                    <td style={{fontWeight:'bold'}}>{item.alias}</td>
                    <td>{item.platform === 'android' ? 'Android' : 'iOS'}</td>
                    <td>{item.total}</td>
                    <td style={{color: 'red'}}>{item.used}</td>
                    <td style={{color: 'green', fontWeight:'bold'}}>{item.total - item.used}</td>
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

export default StoreCodes;
