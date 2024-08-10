import express from "express";
import {
  addComplaint,
  addFile,
  addStudent,
  addStudentAbsence,
  addStudentsMarks,
  addStudentViolation,
  deleteFile,
  deleteStudent,
  deleteStudentsAbsence,
  deleteStudentViolation,
  homePage,
  registerEvent,
  searchStudent,
  showClasses,
  showComplaint,
  showEvents,
  showFiles,
  showStudentAbsence,
  showStudentExamSchedule,
  showStudentFiles,
  showStudentMarks,
  showStudentMarks2,
  showStudentProfile,
  showStudentsAbsence,
  showStudentsAndSubjectForClass,
  showStudentsViolation,
  showStudentViolation,
  showStudentWeekSchedule,
  showSubjectForStudent,
  studentLogin,
  unRegisterEvent,
  webHomePage,
} from "../controllers/studentsController.mjs";
import { checkStudentId } from "../middleware/checkStudentId.mjs";
import multer from "multer";
import { checkUserId } from "../middleware/checkUserId.mjs";
const upload = multer();
export const studentsRoutes = express.Router();
//web

studentsRoutes.post("/webHomePage", webHomePage);
studentsRoutes.post("/addStudent", addStudent);
studentsRoutes.post("/searchStudent", searchStudent);
studentsRoutes.post("/deleteStudent", deleteStudent);
studentsRoutes.get("/showClasses", checkUserId, showClasses);
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
studentsRoutes.post("/addFile", upload.any(), addFile);
studentsRoutes.post("/deleteFile", deleteFile);
studentsRoutes.get("/showFiles", checkUserId, showFiles);
studentsRoutes.get("/showComplaint", showComplaint);

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
studentsRoutes.get("/showStudentMarks", checkStudentId, showStudentMarks);
studentsRoutes.get("/showStudentMarks/:id", checkStudentId, showStudentMarks2);
studentsRoutes.get(
  "/showSubjectForStudent",
  checkStudentId,
  showSubjectForStudent
);
studentsRoutes.get("/homePage", checkStudentId, homePage);
studentsRoutes.get("/showStudentFiles", checkStudentId, showStudentFiles);
studentsRoutes.get(
  "/showStudentWeekSchedule",
  checkStudentId,
  showStudentWeekSchedule
);
studentsRoutes.get(
  "/showStudentExamSchedule",
  checkStudentId,
  showStudentExamSchedule
);

//web&&mobile
studentsRoutes.get("/showEvents", showEvents);
