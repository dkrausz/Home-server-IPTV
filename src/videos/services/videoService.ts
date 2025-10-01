import fs from "fs";
import * as promiseFs from "fs/promises";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import os from "os";
import { TDataVideo, Tvideo } from "../interfaces/interfaces";
import { AppError } from "../../@shared/appError";
import fg from "fast-glob";
import "dotenv/config";

class VideoService {
  private tempDir = path.join(process.cwd(), "uploads", "temp");

  private static videosPath: string = (() => {
    if (!process.env.VIDEO_DIR) {
      throw new Error("Diretorio de Videos não encontrado");
    }

    return process.env.VIDEO_DIR!.replace(/^"+|"+$/g, "");
  })();

  public getVideoPath() {
    return VideoService.videosPath;
  }

  public getLocalIP() {
    const nets = os.networkInterfaces();
    for (const name of Object.keys(nets)) {
      for (const net of nets[name] || []) {
        if (net.family === "IPv4" && !net.internal) {
          return net.address;
        }
      }
    }
    return "localhost";
  }

  public uploadNewVideo = async (payload: Tvideo, name: string, dir: string) => {
    if (!payload.folderName) {
      payload.folderName = "";
    }

    const tempCompletePath = path.join(dir, name);
    const videoDir = path.join(process.cwd(), VideoService.videosPath, payload.folderName);
    const indexPath = await this.createTsFiles(tempCompletePath, videoDir, name);
    const groupTitle = payload.folderName;
    const videoData = await this.createVideoData(name, indexPath, groupTitle, VideoService.videosPath);
    this.addToMaster(videoData);
    return `Video ${payload.name} adicionado com sucesso`;
  };

  public uploadNewVideoList = async (payload: Tvideo) => {
    const files = await promiseFs.readdir(this.tempDir);
    for (let file of files) {
      const newVideo = await this.uploadNewVideo(payload, file, this.tempDir);
      console.log("caminho: ", path.join(this.tempDir, file));
      await promiseFs.unlink(path.join(this.tempDir, file));
      console.log(newVideo);
    }
  };

  private createTsFiles = async (originVideoSource: string, destinationDir: string, videoName: string): Promise<string> => {
    const output = path.join(destinationDir, path.parse(videoName).name, "index.m3u8");
    fs.mkdirSync(path.dirname(output), { recursive: true });

    return new Promise<string>((resolve, reject) => {
      ffmpeg(originVideoSource)
        .outputOptions(["-codec: copy", "-start_number 0", "-hls_time 10", "-hls_list_size 0", "-f hls"])
        .output(output)
        .on("end", () => {
          console.log("✅ TS e index.m3u8 criados");
          resolve(output);
        })
        .on("error", (err) => {
          console.error("❌ Erro ao criar TS:", err);
          reject(err);
        })
        .run();
    });
  };

  private createVideoData = async (videoName: string, videoDir: string, groupTitle: string, folderName: string): Promise<TDataVideo> => {
    const ip = this.getLocalIP();

    const [name, _] = videoName.split("@@");

    const relativePath = videoDir.split(path.sep).join("/");
    const safePath = encodeURI(relativePath);

    const [_garbage, urlPath] = safePath.split(folderName);

    const url = `http://${ip}:3000/videos${urlPath}`;

    const videoData = {
      tvgId: videoName,
      tvgName: name,
      tvgLanguage: "pt",
      groupTitle: groupTitle,
      duration: -1,
      name: name,
      url: url,
      extras: {},
    };

    console.log(videoData);
    return videoData;
  };

  private addToMaster = (videoData: TDataVideo) => {
    const playlistPath = path.join(VideoService.videosPath, "master.m3u");

    let content = "";

    if (!fs.existsSync(playlistPath)) {
      content = "#EXTM3U\n";
    } else {
      content = fs.readFileSync(playlistPath, "utf-8");
    }

    if (content.includes(`tvg-id="${videoData.tvgId}"`)) {
      console.log(`⚠️ Vídeo ${videoData.tvgId} já existe no master.m3u`);
      throw new AppError(409, "Esse Video já existe mo master.m3u");
    }
    const entry = `#EXTINF:${videoData.duration} tvg-id="${videoData.tvgId}" tvg-name="${videoData.tvgName}" tvg-language="${videoData.tvgLanguage}" group-title="${videoData.groupTitle}",${videoData.name}
${videoData.url}
`;

    fs.appendFileSync(playlistPath, entry, "utf-8");
    console.log(`✅ Vídeo ${videoData.tvgName} adicionado no master.m3u`);
  };

  public getMasterAddress = async () => {
    const ip = this.getLocalIP();
    return `http://${ip}:3000/videos/master.m3u`;
  };
}

export const videoService = new VideoService();
