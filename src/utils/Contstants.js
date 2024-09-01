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
  { value: "ok1", label: "ok1" },
  { value: "ok2", label: "ok2" },
  { value: "ok3", label: "ok3" },
  { value: "ok4", label: "ok4" },
];

const OPTIONS = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
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
