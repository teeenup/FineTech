import Axios from "axios";

const axios = Axios.create({
  baseURL: "http://127.0.0.1:8000/",
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});

export default axios;
