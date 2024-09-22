import express from "express";

import {
  changeNameFolder,
  createFolder,
  deleteFolder,
  getDataFolder,
  getSingleFolder,
  uploadFile,
  deleteFile,
  handleChangeSingleFile,
} from "../controller/ManageFolder/PostFolder.js";
import { postWiringFile } from "../controller/ManageTypeCode/PostTypeCode.js";
import {
  getDataWiring,
  deleteWiringFile,
} from "./../controller/ManageTypeCode/PostTypeCode.js";

const FolderRouter = express.Router();

FolderRouter.post("/create/folder", createFolder);
FolderRouter.get("/folder", getDataFolder);
FolderRouter.get("/folder/:id", getSingleFolder);
FolderRouter.post("/upload/file/:id", uploadFile);
FolderRouter.put("/rename/folder/:id", changeNameFolder);
FolderRouter.delete("/folder/:id", deleteFolder);
FolderRouter.delete("/file/:id", deleteFile);
FolderRouter.put("/file/:id", handleChangeSingleFile);
FolderRouter.post("/create/wiring", postWiringFile);
FolderRouter.get("/wiring", getDataWiring);
FolderRouter.delete("/wiring/:id", deleteWiringFile);
export default FolderRouter;
