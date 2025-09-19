import "dotenv/config";
import express, { json } from "express";
import { videoRouter } from "./videos/routes/routes";

export const app = express();

app.use(json());
app.use("/videos", videoRouter);
