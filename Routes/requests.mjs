import express from "express";
import {
  addTeachingRequest,
  addTCourse,
  addDSub,
  addPSub,
  addTexp,
  showTreqs,
  addEmpRequest,
  addECourse,
  addEexp,
  showEreqs,
  showReqData,
} from "../controllers/requestsController.mjs";
import multer from "multer";
const upload = multer();
import { checkUserId } from "../middleware/checkUserId.mjs";

export const requests = express.Router();

requests.post("/addTeachingRequest", addTeachingRequest);
requests.post("/addTCourse", addTCourse);
requests.post("/addDSub", addDSub);
requests.post("/addPSub", addPSub);
requests.post("/addTexp", addTexp);
requests.get("/showTreqs", showTreqs);

requests.post("/addEmpRequest", upload.any(), addEmpRequest);
requests.post("/addECourse", addECourse);
requests.post("/addEexp", addEexp);
requests.get("/showEreqs", showEreqs);
requests.post("/showReqData", checkUserId, showReqData);
