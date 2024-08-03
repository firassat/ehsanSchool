import express from "express";
import {
  addComplaint,
  addStudent,
  addStudentAbsence,
  addStudentsMarks,
  addStudentViolation,
  deleteStudentsAbsence,
  deleteStudentViolation,
  registerEvent,
  showClasses,
  showEvents,
  showStudentAbsence,
  showStudentProfile,
  showStudentsAbsence,
  showStudentsAndSubjectForClass,
  showStudentsViolation,
  showStudentViolation,
  studentLogin,
  unRegisterEvent,
} from "../controllers/studentsController.mjs";
import { checkStudentId } from "../middleware/checkStudentId.mjs";
import { checkUserId } from "../middleware/checkUserId.mjs";

export const studentsRoutes = express.Router();

studentsRoutes.post("/addStudent", addStudent);

studentsRoutes.get("/showClasses", showClasses);

studentsRoutes.post("/addStudentAbsence", addStudentAbsence);
studentsRoutes.post("/addStudentViolation", addStudentViolation);
studentsRoutes.post("/showStudentsViolation", showStudentsViolation);
studentsRoutes.post("/deleteStudentViolation", deleteStudentViolation);
studentsRoutes.post("/showStudentsAbsence", showStudentsAbsence);
studentsRoutes.post("/deleteStudentsAbsence", deleteStudentsAbsence);
studentsRoutes.post(
  "/showStudentsAndSubjectForClass",
  showStudentsAndSubjectForClass
);
studentsRoutes.post("/addStudentsMarks", addStudentsMarks);

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

studentsRoutes.post("/registerEvent", registerEvent);
studentsRoutes.post("/unRegisterEvent", unRegisterEvent);

//web&&mobile
studentsRoutes.get("/showEvents", showEvents);
