import { videoSchema } from "../schema/videoSchema";
import { z } from "zod";

export type Tvideo = z.infer<typeof videoSchema>;

export type TDataVideo = {
  tvgId: string;
  tvgName: string;
  tvgLanguage: string;
  groupTitle: string;
  duration: number;
  name: string;
  url: string;
  extras?: Record<string, any>;
};
