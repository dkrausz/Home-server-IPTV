import "dotenv/config";
import express, { json } from "express";
import { videoRouter } from "./videos/routes/routes";
import path from "path";
import cors from "cors";

export const app = express();

const frontEndPath = path.join(__dirname, "..", "frontend", "dist");

app.use(cors({ origin: "*" }));
app.use(json());
app.use((req, res, next) => {
  req.setTimeout(0);
  res.setTimeout(0);
  next();
});
app.use("/videos", videoRouter);
// console.log(path.join(__dirname, "frontend", "dist"));

app.use(express.static(frontEndPath));
app.get("/send", (req, res) => {
  console.log("envia");
  res.sendFile(path.join(frontEndPath, "index.html"));
});
