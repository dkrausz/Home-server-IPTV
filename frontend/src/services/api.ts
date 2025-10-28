import axios from "axios";

export const UploadApi = axios.create({
  baseURL: "http://localhost:3000/videos",
  timeout: 1000 * 1000,
});
