import { z } from "zod";

export const videoSchema = z.object({
  name: z.string().min(1),
  category: z.string().nullish(),
  folderName: z.string().nullish(),
});
