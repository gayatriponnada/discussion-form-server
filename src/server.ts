import * as dotenv from "dotenv";
import { createApp } from "./app";
import { createServer } from "http";
dotenv.config();

const app = createApp();

const PORT = process.env.PORT || 3002;

const httpServer = createServer(app);


httpServer.listen(PORT, () => {
  console.log(
    `🚀 started hardware-client on [::]:${PORT}, url: http://localhost:${PORT}`
  );
});

