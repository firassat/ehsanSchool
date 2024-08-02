import { Sections } from "../models/Sections.mjs";
import { Classes } from "../models/Classes.mjs";
import { Students, validateStudents } from "../models/Students.mjs";
import asyncHandler from "express-async-handler";
import {
  Student_absence,
  Student_absenceValidate,
} from "../models/Student_absence.mjs";
import {
  Student_violation,
  Student_violationValidate,
} from "../models/Student_violation.mjs";
import { events } from "../models/events.mjs";
import jwt from "jsonwebtoken";
import { checkStudentId } from "../middleware/checkStudentId.mjs";
import { Complaint, ComplaintValidate } from "../models/Complaint.mjs";

//web
export const showSections = asyncHandler(async (req, res) => {
  const result = await Sections.find();
  return res.json({ status: true, data: result });
});
export const showClasses = asyncHandler(async (req, res) => {
  const result = await Classes.find();
  return res.json({ status: true, data: result });
});
export const addStudent = async (req, res) => {
  try {
    const { error } = validateStudents(req.body);
    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
    const student = new Students(req.body);

    const result = await student.save();
    return res.json({
      status: true,
      message: "تم اضافة الطالب بنجاح",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const addStudentAbsence = async (req, res) => {
  try {
    const { error } = Student_absenceValidate(req.body);
    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
    const absence = new Student_absence(req.body);

    const result = await absence.save();
    return res.json({
      status: true,
      message: "تم اضافة التأخير بنجاح",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const addStudentViolation = async (req, res) => {
  try {
    const { error } = Student_violationValidate(req.body);
    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
    const absence = new Student_violation(req.body);

    const result = await absence.save();
    return res.json({
      status: true,
      message: "تم اضافة المخالفة بنجاح",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//mobile
export const studentLogin = asyncHandler(async (req, res) => {
  if (!req.body?.id) {
    return res.json({ message: "ادخل الرمز" });
  }
  let student = await Students.findById(req.body.id).populate([
    "section_id",
    "class_id",
  ]);
  if (!student) res.json({ message: "الرمز غير صحيح" });

  const access_token = jwt.sign({ id: student.id }, process.env.SECRTKEY);
  return res.json({ data: student, token: access_token });
});
export const showStudentProfile = asyncHandler(async (req, res) => {
  const data = await Students.findById(req.student_id).populate([
    "section_id",
    "class_id",
  ]);
  return res.json({
    status: true,
    data: data,
  });
});
export const showStudentViolation = asyncHandler(async (req, res) => {
  const data = await Student_violation.find({
    student_id: req.student_id,
  });
  return res.json({
    status: true,
    data: data,
  });
});
export const showStudentAbsence = asyncHandler(async (req, res) => {
  const delay = await Student_absence.find({
    student_id: req.student_id,
    delay_time: { $exists: true },
  });
  const absence = await Student_absence.find({
    student_id: req.student_id,
    delay_time: { $exists: false },
  });

  return res.json({
    status: true,
    delay: delay,
    absence: absence,
  });
});
export const showEvents = asyncHandler(async (req, res) => {
  const result = await events.find();
  return res.json({ status: true, data: result });
});
export const addComplaint = async (req, res) => {
  try {
    const { error } = ComplaintValidate(req.body);
    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
    req.body.student_id = req.student_id;
    const complaint = new Complaint(req.body);

    const result = await complaint.save();
    return res.json({
      status: true,
      message: "تم اضافة الشكوى بنجاح",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const registerEvent = asyncHandler(async (req, res) => {
  const event = await events.findById(req.body.id);
  const result = await events.findByIdAndUpdate(req.body.id, {
    $set: {
      number_of_registrants: event.number_of_registrants
        ? event.number_of_registrants + 1
        : 1,
    },
  });
  const event2 = {
    ...result._doc,
    number_of_registrants: event.number_of_registrants
      ? event.number_of_registrants + 1
      : 1,
  };
  return res.json({ status: true, data: event2 });
});
export const unRegisterEvent = asyncHandler(async (req, res) => {
  const event = await events.findById(req.body.id);
  const result = await events.findByIdAndUpdate(req.body.id, {
    $set: {
      number_of_registrants: event.number_of_registrants
        ? event.number_of_registrants - 1
        : 0,
    },
  });
  const event2 = {
    ...result._doc,
    number_of_registrants: event.number_of_registrants
      ? event.number_of_registrants - 1
      : 0,
  };
  return res.json({ status: true, data: event2 });
});
