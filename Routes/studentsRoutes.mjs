import express from "express";
import {
  addComplaint,
  addStudent,
  addStudentAbsence,
  addStudentViolation,
  registerEvent,
  showClasses,
  showEvents,
  showSections,
  showStudentAbsence,
  showStudentProfile,
  showStudentViolation,
  studentLogin,
  unRegisterEvent,
} from "../controllers/studentsController.mjs";
import { checkStudentId } from "../middleware/checkStudentId.mjs";

export const studentsRoutes = express.Router();

studentsRoutes.post("/addStudent", addStudent);
studentsRoutes.get("/showSections", showSections);
studentsRoutes.get("/showClasses", showClasses);

studentsRoutes.post("/addStudentAbsence", addStudentAbsence);
studentsRoutes.post("/addStudentViolation", addStudentViolation);

//mobile
studentsRoutes.post("/studentLogin", studentLogin);
studentsRoutes.get("/showStudentProfile", checkStudentId, showStudentProfile);
studentsRoutes.get(
  "/showStudentViolation",
  checkStudentId,
  showStudentViolation
);
studentsRoutes.get("/showStudentAbsence", checkStudentId, showStudentAbsence);
studentsRoutes.post("/addComplaint", checkStudentId, addComplaint);
studentsRoutes.get("/showEvents", showEvents);

studentsRoutes.post("/registerEvent", registerEvent);
studentsRoutes.post("/unRegisterEvent", unRegisterEvent);
