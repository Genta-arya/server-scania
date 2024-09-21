import express from "express";

import {
  changeNameFolder,
  createFolder,
  deleteFolder,
  getDataFolder,
  getSingleFolder,
  uploadFile,
} from "../controller/ManageFolder/PostFolder.js";

const FolderRouter = express.Router();

FolderRouter.post("/create/folder", createFolder);
FolderRouter.get("/folder", getDataFolder);
FolderRouter.get("/folder/:id", getSingleFolder);
FolderRouter.post("/upload/file/:id", uploadFile);
FolderRouter.put("/rename/folder/:id", changeNameFolder);
FolderRouter.delete("/folder/:id", deleteFolder);
export default FolderRouter;
