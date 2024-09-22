import express from "express";

import {
  addNewCode,
  handlePostTypeCode,
  handleRenameType,
} from "../controller/ManageTypeCode/PostTypeCode.js";
import { getTypeCode } from "../controller/ManageTypeCode/GetTypeCode.js";
import { updatedCode } from "../controller/ManageTypeCode/updateCode.js";
import { HandleDeleteType, handleDeleteTypeData } from "../controller/ManageTypeCode/DeleteTypeCode.js";

const TypeRouter = express.Router();

TypeRouter.post("/type", handlePostTypeCode);
TypeRouter.get("/type", getTypeCode);
TypeRouter.put("/rename/type", handleRenameType);
TypeRouter.put("/type/code/:id", updatedCode);
TypeRouter.post("/create/code", addNewCode);
TypeRouter.delete("/type/code/:id", HandleDeleteType);
TypeRouter.delete("/type/:id", handleDeleteTypeData);
export default TypeRouter;
