import express from "express";
import {
  addEmp,
  addEmpAbs,
  addEmpcourse,
  addEmpPun,
  addEmpQua,
  addEmpRew,
  addEmpVac,
  searchEmp,
  showEmpData,
  showEmps,
} from "../controllers/empController.mjs";
// import { upload } from "../config/uploadImage.mjs";
import {
  approveAccounts,
  deletePendingAccount,
  showPendingAccounts,
} from "../controllers/userController.mjs";
import { addEvent, deleteEvent } from "../controllers/managerController.mjs";
import { checkUserId } from "../middleware/checkUserId.mjs";
import multer from "multer";
const upload = multer();
export const manager = express.Router();

manager.post("/addEmp", upload.any(), addEmp);

manager.get("/showEmpData/:id", showEmpData);
manager.get("/showEmps", showEmps);
manager.get("/showPendingAccounts", showPendingAccounts);
manager.get("/approveAccounts/:id", approveAccounts);
manager.get("/deletePendingAccount/:id", deletePendingAccount);

manager.post("/addEmpQua", addEmpQua);
manager.post("/addEmpcourse", addEmpcourse);
manager.post("/addEmpPun", addEmpPun);
manager.post("/addEmpRew", addEmpRew);
manager.post("/addEmpAbs", addEmpAbs);
manager.post("/addEmpVac", addEmpVac);
manager.post("/searchEmp", searchEmp);

manager.post("/addEvent", checkUserId, upload.any(), addEvent);
manager.post("/deleteEvent", deleteEvent);
