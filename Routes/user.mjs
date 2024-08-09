import express from "express";
import {
  showStatuses,
  showMServices,
  showNats,
  showSectors,
  showRoles,
  addWeekSchedule,
  showWeekSchedule,
  deleteWeekSchedule,
  addExamSchedule,
  showExamSchedule,
  deleteExamSchedule,
} from "../controllers/userController.mjs";

export const user = express.Router();

user.get("/showStatuses", showStatuses);
user.get("/showMServices", showMServices);
user.get("/showNats", showNats);
user.get("/showSectors", showSectors);
user.get("/showRoles", showRoles);

user.post("/addWeekSchedule", addWeekSchedule);
user.post("/showWeekSchedule", showWeekSchedule);
user.post("/deleteWeekSchedule", deleteWeekSchedule);

user.post("/addExamSchedule", addExamSchedule);
user.post("/showExamSchedule", showExamSchedule);
user.post("/deleteExamSchedule", deleteExamSchedule);
