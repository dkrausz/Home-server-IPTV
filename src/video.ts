import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import { parseM3U, writeM3U } from "@iptv/playlist";
import { getLocalIP } from "./server";

export const videosPath = "./videos";

export const createVideos = () => {
  const videoFiles = fs.readdirSync(videosPath).filter((f) => f.endsWith(".mp4"));
  const itens = [];
  const ip = getLocalIP();

  videoFiles.forEach((file) => {
    const input = path.join(videosPath, file);
    const output = path.join(videosPath, path.parse(file).name, "index.m3u8");
    console.log("input", input);
    console.log("output", output);
    fs.mkdirSync(path.dirname(output), { recursive: true });

    ffmpeg(input).outputOptions(["-codec: copy", "-start_number 0", "-hls_time 10", "-hls_list_size 0", "-f hls"]).output(output).run();
  });

  const videoFolders = fs.readdirSync(videosPath).filter((f) => {
    const fullPath = path.join(videosPath, f);
    return fs.statSync(fullPath).isDirectory();
  });

  // Cria array de canais para a playlist
  const channels = videoFolders.map((folder) => ({
    tvgId: folder,
    tvgName: folder,
    tvgLanguage: "pt",
    groupTitle: "Videos",
    duration: -1,
    name: folder,
    url: `http://${ip}:3000/videos/${folder}/index.m3u8`,
    extras: {},
  }));

  // Cria objeto de playlist
  const playlist = { channels };

  // Gera M3U
  const m3uContent = writeM3U(playlist);

  // Salva em arquivo
  fs.writeFileSync(path.join(videosPath, "master.m3u"), m3uContent);
  console.log("✅ master.m3u atualizado!");
};
