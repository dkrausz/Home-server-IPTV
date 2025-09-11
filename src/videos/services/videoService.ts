import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import { writeM3U } from "@iptv/playlist";
import os from "os";
import { Tvideo } from "../interfaces/interfaces";
import { AppError } from "../../@shared/appError";
import fg from "fast-glob";

class VideoService {
  private static videosPath = "videoFiles";

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

  public uploadNewVideo = (payload: Tvideo) => {
    if (!payload.folderName) {
      payload.folderName = "";
    }

    const tempDir = path.join(process.cwd(), "uploads", "temp");
    const tempCompletePath = this.findTempFile(tempDir, "tempVideo");
    const videoDir = path.join(process.cwd(), "videos", payload.folderName);
    const timestamp = Date.now();
    const videoName = `${timestamp}-${payload.name}`;

    this.createTsFiles(tempCompletePath, videoDir, videoName);

    this.createVideoData(videoName, videoDir);
  };

  private findTempFile(tempDir: string, baseName: string): string {
    const files = fs.readdirSync(tempDir);
    const match = files.find((file) => path.parse(file).name === baseName);
    if (!match) {
      throw new AppError(404, "Video nao encontrado");
    }
    return path.join(tempDir, match);
  }

  private createTsFiles = (originVideoSource: string, destinationDir: string, videoName: string) => {
    const output = path.join(destinationDir, path.parse(videoName).name, "index.m3u8");
    fs.mkdirSync(path.dirname(output), { recursive: true });

    ffmpeg(originVideoSource).outputOptions(["-codec: copy", "-start_number 0", "-hls_time 10", "-hls_list_size 0", "-f hls"]).output(output).run();
  };

  private createVideoData = async (videoName: string, destinationDir: string) => {
    const ip = this.getLocalIP();
    const videoFolder = await fg(["index.m3u8", "**/index.m3u8"], {
      cwd: destinationDir,
      absolute: false,
      caseSensitiveMatch: false,
    });

    console.log(videoFolder);

    const [_, name] = videoName.split("-");

    const videoData = {
      tvgId: videoName,
      tvgName: name,
      tvgLanguage: "pt",
      groupTitle: "Videos",
      duration: -1,
      name: name,
      url: `http://${ip}:3000/videos/${videoFolder}`,
      extras: {},
    };

    console.log(videoData);
    return videoData;
  };

  public createPlaylist = async () => {
    const ip = this.getLocalIP();
    const videoFolders = await fg(["index.m3u8", "**/index.m3u8"], {
      cwd: VideoService.videosPath,
      absolute: false,
      caseSensitiveMatch: false,
    });

    const channels = videoFolders.map((folder) => ({
      tvgId: folder,
      tvgName: folder,
      tvgLanguage: "pt",
      groupTitle: "Videos",
      duration: -1,
      name: folder,
      url: `http://${ip}:3000/videos/${folder}`,
      extras: {},
    }));

    const playlist = { channels };

    const m3uContent = writeM3U(playlist);

    fs.writeFileSync(path.join(VideoService.videosPath, "master.m3u"), m3uContent);
    console.log("✅ master.m3u atualizado!");
    return `http://${ip}:3000/videos/master.m3u`;
  };
}

export const videoService = new VideoService();
