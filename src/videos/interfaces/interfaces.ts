import { videoSchema } from "../schema/videoSchema";
import { z } from "zod";

export type Tvideo = z.infer<typeof videoSchema>;
