import "dotenv/config";
import express, { json } from "express";
import { videoRouter } from "./videos/routes/routes";

import cors from "cors";

export const app = express();

app.use(cors({ origin: "*" }));
app.use(json());
app.use("/videos", videoRouter);
app.get("/send", (req, res) => {
  console.log("envia");
  res.sendFile(__dirname + `/sendFiles.html`);
});
