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
  const [isEditMode, setIsEditMode] = useState(false); // Pentru Update
  
  // Form states
  const [alias, setAlias] = useState("");
  const [androidTextCodes, setAndroidTextCodes] = useState("");
  const [iosTextCodes, setIosTextCodes] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  
  const [data, setData] = useState([]);
  const [rawCodes, setRawCodes] = useState([]);

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

  const fetchRawStoreCodes = async (aliasName) => {
    try {
      const res = await AXIOS.post("/getRawStoreCodes", { alias: aliasName });
      if (res.data.ok) {
        setRawCodes(res.data.data);
      } else {
        toast("Eroare la preluarea codurilor individuale");
      }
    } catch (e) {
       console.log(e);
    }
  };

  const deleteSingleCode = async (docId) => {
    if(!window.confirm("Ștergi acest cod definitiv?")) return;
    try {
      const res = await AXIOS.post("/deleteSingleStoreCode", { docId });
      if(res.data.ok) {
        toast("Cod șters.");
        fetchRawStoreCodes(alias); // refresh list
        fetchStats();          // refresh main dashboard
      }
    } catch (e) {
      toast("Eroare stergere cod");
    }
  };

  const processSave = async () => {
    if (alias.trim() === "") {
      toast("Introdu un nume/alias pentru cod!");
      return;
    }
    
    setLoading(true);
    let hasError = false;

    // Actualizăm data de expirare pentru codurile deja existente (doar dacă suntem în EditMode)
    if (isEditMode) {
      try {
        const payload = { alias: alias.trim(), expiresAt: expiresAt ? expiresAt : null };
        const res = await AXIOS.post("/updateStoreCodes", payload);
        if (!res.data.ok) hasError = true;
      } catch (err) {
        hasError = true;
      }
    }

    const androidCodes = androidTextCodes.split(/[\n,]+/).map(c => c.trim()).filter(c => c.length > 0);
    const iosCodes = iosTextCodes.split(/[\n,]+/).map(c => c.trim()).filter(c => c.length > 0);

    if (!isEditMode && androidCodes.length === 0 && iosCodes.length === 0) {
      toast("Trebuie sa incarci cel puțin un cod pentru o campanie nouă.");
      setLoading(false);
      return;
    }

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
      toast("Au aparut erori la salvare!");
    } else {
      setAlias("");
      setAndroidTextCodes("");
      setIosTextCodes("");
      setExpiresAt("");
      setShow(false);
      setIsEditMode(false);
      setRawCodes([]);
      toast("Salvat cu succes!");
      fetchStats();
    }
  };

  const deleteCampaign = async (aliasToDelete) => {
    if (!window.confirm(`Ești sigur că vrei să ștergi TOATE codurile pentru aliasul: ${aliasToDelete}?`)) return;
    try {
      const res = await AXIOS.post("/deleteStoreCodes", { alias: aliasToDelete });
      if (res.data.ok) {
        toast("Campanie ștearsă.");
        fetchStats();
      } else {
        toast("Eroare la ștergere.");
      }
    } catch (e) {
      toast("A apărut o eroare la conexiune.");
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
            <h2>{isEditMode ? "Actualizare Deadline Campanie" : "Add Store Promo Codes"}</h2>
            <div className="row">
              <label>Alias / Nume Campanie (ex: ZEN_PROMO)</label>
              <input type="text" value={alias} disabled={isEditMode} onChange={(e) => setAlias(e.target.value.toUpperCase())} />
            </div>
            <div className="row" style={{ marginTop: 15 }}>
              <label>Data Expirare Backend (Optional):</label>
              <input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
              <small>*(Dacă furnizezi o dată, codurile nu vor mai fi returnate aplicației după acea zi. Dacă lași gol, nu expiră din backend, dar vor fi supuse expirărilor din Google/Apple).*</small>
            </div>

            <hr style={{margin: '20px 0', borderColor: '#444'}}/>
            {isEditMode && <p style={{color: 'orange', fontSize: 13, marginBottom: 15}}><b>Info:</b> Adaugă coduri noi aici pentru a suplimenta stocul campaniei {alias}. Cele vechi vor fi păstrate!</p>}
            
            <div className="row">
              <label style={{color: '#a4d955'}}>🍏 Coduri iOS {isEditMode ? '(Adaugă în plus)' : '(App Store)'}</label>
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
              <label style={{color: '#55a4d9'}}>🤖 Coduri Android {isEditMode ? '(Adaugă în plus)' : '(Google Play)'}</label>
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

            {isEditMode && rawCodes.length > 0 && (
              <div style={{marginTop: 20}}>
                <hr style={{margin: '20px 0', borderColor: '#444'}}/>
                <h3 style={{fontSize: 16, marginBottom: 10}}>Coduri Individuale ({rawCodes.length})</h3>
                <div className="custom-scrollbar" style={{maxHeight: 250, overflowY: 'auto', background: '#222', padding: 10, borderRadius: 5}}>
                  <table style={{width: '100%', fontSize: 13, textAlign: 'left', borderCollapse: 'collapse'}}>
                    <thead>
                      <tr>
                        <th style={{padding: '5px', borderBottom: '1px solid #444'}}>Cod Magazin</th>
                        <th style={{padding: '5px', borderBottom: '1px solid #444'}}>Platformă</th>
                        <th style={{padding: '5px', borderBottom: '1px solid #444'}}>Status</th>
                        <th style={{padding: '5px', borderBottom: '1px solid #444', textAlign: 'right'}}>Acțiune</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rawCodes.map(c => (
                        <tr key={c.id}>
                          <td style={{padding: '5px', borderBottom: '1px solid #333', fontFamily: 'monospace'}}>{c.code}</td>
                          <td style={{padding: '5px', borderBottom: '1px solid #333'}}>{c.platform}</td>
                          <td style={{padding: '5px', borderBottom: '1px solid #333', color: c.isUsed ? '#ff4d4d' : '#4dff4d'}}>{c.isUsed ? `Consumat (${c.usedByEmail.split('@')[0]}...)` : 'Liber'}</td>
                          <td style={{padding: '5px', borderBottom: '1px solid #333', textAlign: 'right'}}>
                            {!c.isUsed ? (
                               <button onClick={() => deleteSingleCode(c.id)} style={{background: 'red', color: 'white', border: 'none', borderRadius: 3, cursor: 'pointer', padding: '4px 8px'}}>Sterge</button>
                            ) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="buttons" style={{marginTop: 15}}>
              {!loading ? (
                <>
                  <SimpleButton text={"Close"} action={() => {setShow(false); setIsEditMode(false);}} />
                  <MainButton text={isEditMode ? "Salvează & Suplimentează" : "Creează Campanie"} action={processSave} />
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
              setExpiresAt("");
              setIsEditMode(false);
              setShow(true);
            }} />
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Alias (Campanie)</th>
              <th>Platforme</th>
              <th>Coduri Noi</th>
              <th>Aplicate</th>
              <th>Expiră la</th>
              <th>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((item, index) => {
                return (
                  <tr key={item.alias}>
                    <td>{index + 1}</td>
                    <td style={{fontWeight:'bold'}}>{item.alias}</td>
                    <td>{item.platforms ? item.platforms.toUpperCase() : (item.platform ? item.platform.toUpperCase() : '')}</td>
                    <td style={{color: 'green', fontWeight:'bold'}}>{item.total - item.used} din {item.total}</td>
                    <td style={{color: 'red'}}>{item.used}</td>
                    <td>{item.expiresAt ? item.expiresAt.substring(0, 10) : 'Fără expirare'}</td>
                    <td style={{display: 'flex', gap: '10px'}}>
                       <button onClick={() => {
                          setAlias(item.alias);
                          setExpiresAt(item.expiresAt ? item.expiresAt.substring(0, 10) : "");
                          setIsEditMode(true);
                          setShow(true);
                          fetchRawStoreCodes(item.alias);
                       }} style={{background: 'orange', padding: '5px 10px', borderRadius: 4, cursor: 'pointer', border: 'none', color: '#fff'}}>Edit</button>
                       <button onClick={() => deleteCampaign(item.alias)} style={{background: 'red', padding: '5px 10px', borderRadius: 4, cursor: 'pointer', border: 'none', color: '#fff'}}>🗑</button>
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

export default StoreCodes;
