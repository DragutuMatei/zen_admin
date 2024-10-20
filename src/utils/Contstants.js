import axios from "axios";

const FILE_TYPE = ["JPG", "PNG", "GIF"];

const UPLOAD_TYPE = ["MP3"];
const VIDEO_TYPE = ["MP4"];

const CATEGORIES = [
  { value: "ok1", label: "ok1" },
  { value: "ok2", label: "ok2" },
  { value: "ok3", label: "ok3" },
  { value: "ok4", label: "ok4" },
];

const CATEGORIES_SOUNDS = [
  {
    value: "Sunete 3D din natura & tonuri binaurale",
    label: "Sunete 3D din natura & tonuri binaurale",
  },
  {
    value: "Somn & frecvente sacre ale solfegiului",
    label: "Somn & frecvente sacre ale solfegiului",
  },
  { value: "Meditatie, relaxare, yoga", label: "Meditatie, relaxare, yoga" },
  {
    value: "LoFi Chill beats - studiu, relaxare, ambient",
    label: "LoFi Chill beats - studiu, relaxare, ambient",
  },
];

//

const OPTIONS = [
  { value: "Incepatori", label: "Incepatori" },
  { value: "Focus", label: "Focus" },
  { value: "Somn", label: "Somn" },
  { value: "Anxietate", label: "Anxietate" },
  { value: "Putere interioara", label: "Putere interioara" },
  { value: "Antrenarea mintii", label: "Antrenarea mintii" },
  { value: "Obiceiuri sanatoase", label: "Obiceiuri sanatoase" },
  { value: "Iubire de sine", label: "Iubire de sine" },
  { value: "Relatii", label: "Relatii" },
  { value: "Pace interioara", label: "Pace interioara" },
  { value: "Recunostiinta", label: "Recunostiinta" },
  { value: "Spiritualitate", label: "Spiritualitate" },
  { value: "Zen Zilnic", label: "Zen Zilnic" },
];

const AXIOS = axios.create({
  // baseURL: "http://192.168.1.196:8000/",
  baseURL: "http://localhost:3001/",

  headers: {
    "content-type": "application/json",
  },
  withCredentials: true,
});

export {
  FILE_TYPE,
  UPLOAD_TYPE,
  CATEGORIES,
  OPTIONS,
  VIDEO_TYPE,
  AXIOS,
  CATEGORIES_SOUNDS,
};
