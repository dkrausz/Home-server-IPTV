import axios from "axios";

export const UploadApi = axios.create({
  baseURL: "http://localhost:3000/videos",
  timeout: 5 * 1000,
});
