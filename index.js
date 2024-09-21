import express from "express";
import { createServer } from "http";
import cors from "cors";
import AuthRouter from "./src/router/AuthRoutes.js";
import TypeRouter from "./src/router/TypeCodeRoutes.js";
import FolderRouter from "./src/router/FolderRoues.js";


const app = express();
const port = 5005;
const httpServer = createServer(app);
app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use("/api/v1", AuthRouter);
app.use("/api/v1", TypeRouter);
app.use("/api/v1", FolderRouter);
app.use('/dokumen', express.static('public/dokumen'));

httpServer.listen(port, () => {
  console.log("Server running on port " + port);
});
