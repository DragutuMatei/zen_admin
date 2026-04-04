import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainButton from "../utils/MainButton";
import Footer from "../components/Footer";
import SimpleButton from "../utils/SimpleButton";
import SecondButton from "../utils/SecondButton";
import SideNav from "../components/SideNav";
import { toast } from "react-toastify";
import { AXIOS } from "../utils/Contstants";

function DiscountCodes() {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  // Form states
  const [code, setCode] = useState("");
  const [active, setActive] = useState(true);
  const [discountPercentage, setDiscountPercentage] = useState("20");
  const [validFrom, setValidFrom] = useState("");
  const [validTo, setValidTo] = useState("");
  
  const [data, setData] = useState([]);
  const [showActivations, setShowActivations] = useState(null);

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    try {
      const res = await AXIOS.get("/getAllPromoCodes");
      if (res.data.ok) {
        setData(res.data.data);
      } else {
        toast.error("Eroare la preluarea codurilor!");
      }
    } catch (err) {
      console.log(err);
      toast.error("Eroare la preluarea codurilor!");
    }
  };

  const uploadCode = async () => {
    setLoading(true);

    if (code.trim() === "") {
      setLoading(false);
      toast("Introdu un nume pentru cod!");
      return;
    }
    if (!validFrom || !validTo) {
      setLoading(false);
      toast("Selectează datele de valabilitate!");
      return;
    }

    try {
      const payload = {
        code: code.trim(),
        discountPercentage: parseInt(discountPercentage),
        validFrom,
        validTo,
        active
      };
      
      const res = await AXIOS.post("/addPromoCode", payload);
      if (res.data.ok) {
        setCode("");
        setActive(true);
        setDiscountPercentage("20");
        setValidFrom("");
        setValidTo("");
        setShow(false);
        toast("Cod adăugat cu succes!");
        fetchCodes(); // refresh list
      } else {
        toast("Eroare la adăugare!");
      }
    } catch (err) {
      console.log(err);
      toast("Codul nu a putut fi adăugat!");
    }

    setLoading(false);
  };

  const toggleActive = async (item) => {
    try {
      const res = await AXIOS.post("/updatePromoCode", {
        id: item.id,
        active: !item.active
      });
      if (res.data.ok) {
        toast("Status modificat!");
        fetchCodes();
      }
    } catch (err) {
      console.log(err);
      toast("Eroare la modificare!");
    }
  };

  const deleteCode = async (id) => {
    try {
      const res = await AXIOS.post("/deletePromoCode", { id });
      if (res.data.ok) {
        setData(data.filter((item) => item.id !== id));
        toast("Cod sters cu succes!");
      } else {
        toast.error("Eroare la stergere");
      }
    } catch (err) {
      console.log(err);
      toast("Codul nu a putut fi sters!");
    }
  };

  return (
    <>
      <SideNav />
      {showActivations && (
        <div className="over" onClick={(e) => {
          if (e.target.className === "over") {
            setShowActivations(null);
          }
        }}>
          <div className="form" style={{maxHeight:'80vh', overflowY:'auto'}}>
            <h2>Useri care au activat: {showActivations.code.toUpperCase()}</h2>
            <div style={{marginTop: 20}}>
              {showActivations.activatedBy && showActivations.activatedBy.length > 0 ? (
                showActivations.activatedBy.map((email, idx) => (
                  <div key={idx} style={{padding: 10, borderBottom:'1px solid #ccc'}}>{email}</div>
                ))
              ) : (
                <p>Niciun utilizator nu a activat acest cod.</p>
              )}
            </div>
            <div className="buttons" style={{marginTop: 20}}>
              <SimpleButton text={"Închide"} action={() => setShowActivations(null)} />
            </div>
          </div>
        </div>
      )}

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
            <h2>Creare Cod Reducere</h2>
            <div className="row">
              <label>Cod Reducere (ex: MATEI)</label>
              <input type="text" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
            </div>
            <div className="row">
              <label>Procent Reducere</label>
              <select
                onChange={(e) => setDiscountPercentage(e.target.value)}
                value={discountPercentage}
              >
                <option value="10">10%</option>
                <option value="20">20%</option>
                <option value="30">30%</option>
                <option value="40">40%</option>
                <option value="50">50%</option>
              </select>
            </div>
            <div className="row">
              <label>Valabil de la:</label>
              <input type="date" value={validFrom} onChange={(e) => setValidFrom(e.target.value)} />
            </div>
            <div className="row">
              <label>Valabil până la:</label>
              <input type="date" value={validTo} onChange={(e) => setValidTo(e.target.value)} />
            </div>
            <div className="row">
              <label>Activ?</label>
              <select
                onChange={(e) => setActive(e.target.value === "true")}
                value={active.toString()}
              >
                <option value="true">Da</option>
                <option value="false">Nu</option>
              </select>
            </div>
            <div className="buttons">
              {!loading ? (
                <>
                  <SimpleButton text={"Close"} action={() => setShow(false)} />
                  <MainButton text={"Submit"} action={uploadCode} />
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
            <h3>Coduri de Reducere</h3>
            <div className="links">
              <Link to={"/"}>Home</Link> / <b>Coduri Reducere</b>
            </div>
          </div>
          <div className="right">
            <MainButton text={"Adaugă Cod nou"} action={() => {
              setCode("");
              setDiscountPercentage("20");
              setValidFrom("");
              setValidTo("");
              setActive(true);
              setShow(true);
            }} />
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Cod</th>
              <th>Procent</th>
              <th>Valabilitate</th>
              <th>Activ?</th>
              <th>Contorizări</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((item, index) => {
                return (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td style={{fontWeight:'bold'}}>{item.code?.toUpperCase()}</td>
                    <td>{item.discountPercentage}%</td>
                    <td><span style={{fontSize: 12}}>{item.validFrom} - {item.validTo}</span></td>
                    <td>
                      {item.active ? (
                        <div onClick={() => toggleActive(item)} style={{cursor: "pointer", color: "green", fontWeight: "bold"}}>Activ</div>
                      ) : (
                        <div onClick={() => toggleActive(item)} style={{cursor: "pointer", color: "red"}}>Inactiv</div>
                      )}
                    </td>
                    <td>
                      <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                        <span style={{fontSize: 18, fontWeight:'bold'}}>{item.activationsCount || 0}</span>
                        <div onClick={() => setShowActivations(item)} style={{cursor: "pointer", color: "blue", textDecoration:'underline', fontSize: 12}}>Vezi useri</div>
                      </div>
                    </td>
                    <td>
                      <SecondButton
                        text={"Delete"}
                        action={() => deleteCode(item.id)}
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

export default DiscountCodes;
