import express from "express";

import { handlePostTypeCode, handleRenameType } from "../controller/ManageTypeCode/PostTypeCode.js";
import upload from "../config/multer.js";
import { getTypeCode } from "../controller/ManageTypeCode/GetTypeCode.js";


const TypeRouter = express.Router();

TypeRouter.post("/type",upload , handlePostTypeCode)
TypeRouter.get("/type", getTypeCode)
TypeRouter.put("/rename/type", handleRenameType)
export default TypeRouter