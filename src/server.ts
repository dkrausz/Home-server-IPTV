import { app } from "./app";
import os from "os";
import { videoService } from "./videos/services/videoService";

const PORT = 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on in ${videoService.getLocalIP()} port ${PORT}`);
});
