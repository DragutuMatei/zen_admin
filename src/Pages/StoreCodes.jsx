import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainButton from "../utils/MainButton";
import Footer from "../components/Footer";
import SimpleButton from "../utils/SimpleButton";
import SideNav from "../components/SideNav";
import { toast } from "react-toastify";
import { AXIOS } from "../utils/Contstants";
// Vom folosi manual delimitatorul dac[ nu avem papaparse, dar mai simplu e split pe \n
// actually nu avem neaparat papaparse in deps, let's use string split.

function StoreCodes() {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  
  // Form states
  const [alias, setAlias] = useState("");
  const [androidTextCodes, setAndroidTextCodes] = useState("");
  const [iosTextCodes, setIosTextCodes] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  
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
    
    const androidCodes = androidTextCodes.split(/[\n,]+/).map(c => c.trim()).filter(c => c.length > 0);
    const iosCodes = iosTextCodes.split(/[\n,]+/).map(c => c.trim()).filter(c => c.length > 0);
    
    if (androidCodes.length === 0 && iosCodes.length === 0) {
      toast("Nu ai introdus niciun cod valid.");
      return;
    }

    setLoading(true);
    let hasError = false;

    if (androidCodes.length > 0) {
      try {
        const payload = { alias: alias.trim(), platform: 'android', codes: androidCodes, expiresAt: expiresAt ? expiresAt : null };
        const res = await AXIOS.post("/addStoreCodes", payload);
        if (!res.data.ok) hasError = true;
      } catch (err) {
        hasError = true;
      }
    }

    if (iosCodes.length > 0) {
      try {
        const payload = { alias: alias.trim(), platform: 'ios', codes: iosCodes, expiresAt: expiresAt ? expiresAt : null };
        const res = await AXIOS.post("/addStoreCodes", payload);
        if (!res.data.ok) hasError = true;
      } catch (err) {
        hasError = true;
      }
    }

    setLoading(false);

    if (hasError) {
      toast("Au aparut erori la adaugarea unor coduri!");
    } else {
      setAlias("");
      setAndroidTextCodes("");
      setIosTextCodes("");
      setExpiresAt("");
      setShow(false);
      toast("Codurile au fost incarcate cu succes!");
      fetchStats();
    }
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      if (type === 'android') {
        setAndroidTextCodes((prev) => prev ? prev + "\n" + text : text);
      } else {
        setIosTextCodes((prev) => prev ? prev + "\n" + text : text);
      }
    };
    reader.readAsText(file);
    // Reset the input value so the same file can be loaded again if needed
    e.target.value = null;
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
            <div className="row" style={{ marginTop: 15 }}>
              <label>Data Expirare Backend (Optional):</label>
              <input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
              <small>*(Dacă furnizezi o dată, codurile nu vor mai fi returnate aplicației după acea zi. Dacă lași gol, nu expiră din backend, dar vor fi supuse expirărilor din Google/Apple).*</small>
            </div>

            <hr style={{margin: '20px 0', borderColor: '#444'}}/>

            <div className="row">
              <label style={{color: '#a4d955'}}>🍏 Coduri iOS (App Store)</label>
              <div style={{display:'flex', justifyContent: 'space-between'}}>
                 <input type="file" accept=".csv,.txt" onChange={(e) => handleFileUpload(e, 'ios')} />
              </div>
              <textarea 
                rows={3} 
                value={iosTextCodes}
                onChange={(e) => setIosTextCodes(e.target.value)}
                placeholder={"COD_IOS_1\nCOD_IOS_2"}
                style={{marginTop: 5}}
              />
              <small>Avem {iosTextCodes.split(/[\n,]+/).filter(c=>c.trim().length>0).length} coduri pt iOS.</small>
            </div>

            <div className="row" style={{ marginTop: 15 }}>
              <label style={{color: '#55a4d9'}}>🤖 Coduri Android (Google Play)</label>
              <div style={{display:'flex', justifyContent: 'space-between'}}>
                 <input type="file" accept=".csv,.txt" onChange={(e) => handleFileUpload(e, 'android')} />
              </div>
              <textarea 
                rows={3} 
                value={androidTextCodes}
                onChange={(e) => setAndroidTextCodes(e.target.value)}
                placeholder={"COD_ANDROID_1\nCOD_ANDROID_2"}
                style={{marginTop: 5}}
              />
              <small>Avem {androidTextCodes.split(/[\n,]+/).filter(c=>c.trim().length>0).length} coduri pt Android.</small>
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
              setAndroidTextCodes("");
              setIosTextCodes("");
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
              <th>Folosite</th>
              <th>Disponibile</th>
              <th>Expiră la</th>
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
                    <td>{item.expiresAt ? item.expiresAt.substring(0, 10) : 'Fără expirare'}</td>
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
