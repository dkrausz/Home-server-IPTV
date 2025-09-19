import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import os from "os";
import { TDataVideo, Tvideo } from "../interfaces/interfaces";
import { AppError } from "../../@shared/appError";
import fg from "fast-glob";
import "dotenv/config";

class VideoService {
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

  public uploadNewVideo = async (payload: Tvideo) => {
    if (!payload.folderName) {
      payload.folderName = "";
    }

    const tempDir = path.join(process.cwd(), "uploads", "temp");
    const tempCompletePath = this.findTempFile(tempDir, "tempVideo");
    const videoDir = path.join(process.cwd(), VideoService.videosPath, payload.folderName);
    const timestamp = Date.now();
    const videoName = `${timestamp}-${payload.name}`;

    await this.createTsFiles(tempCompletePath, videoDir, videoName);

    console.log("process", process.cwd());
    console.log("videoDir", videoDir);
    const videoData = await this.createVideoData(videoName, VideoService.videosPath, videoName, payload.folderName);
    this.addToMaster(videoData);

    return `Video ${payload.name} adicionado com sucesso`;
  };

  private findTempFile(tempDir: string, baseName: string): string {
    const files = fs.readdirSync(tempDir);
    const match = files.find((file) => path.parse(file).name === baseName);
    if (!match) {
      throw new AppError(404, "Video nao encontrado");
    }
    return path.join(tempDir, match);
  }

  private createTsFiles = async (originVideoSource: string, destinationDir: string, videoName: string) => {
    console.log("create TS Files");

    const output = path.join(destinationDir, path.parse(videoName).name, "index.m3u8");
    console.log("output", output);
    fs.mkdirSync(path.dirname(output), { recursive: true });

    return new Promise<void>((resolve, reject) => {
      ffmpeg(originVideoSource)
        .outputOptions(["-codec: copy", "-start_number 0", "-hls_time 10", "-hls_list_size 0", "-f hls"])
        .output(output)
        .on("end", () => {
          console.log("✅ TS e index.m3u8 criados");
          resolve();
        })
        .on("error", (err) => {
          console.error("❌ Erro ao criar TS:", err);
          reject(err);
        })
        .run();
    });
  };

  private createVideoData = async (videoName: string, destinationDir: string, folderName: string, groupTitle: string): Promise<TDataVideo> => {
    const ip = this.getLocalIP();

    const videoFolder = await fg([`**/${folderName}/index.m3u8`], {
      cwd: destinationDir,
      absolute: false,
      caseSensitiveMatch: false,
    });

    const [_, name] = videoName.split("-");

    const relativePath = videoFolder[0].split(path.sep).join("/");
    const safePath = encodeURI(relativePath);

    const url = `http://${ip}:3000/videos/${safePath}`;

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
