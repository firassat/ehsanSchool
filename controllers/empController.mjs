import asyncHandler from "express-async-handler";
import { Nationalities } from "../models/Nationalities.mjs";
import { Social_statuses } from "../models/Social_statuses.mjs";
import { Military_services } from "../models/Military_services.mjs";
import { emp_exp } from "../models/emp_exp.mjs";
import { validatEmployees, employees } from "../models/employees.mjs";
import { validatetemp_courses, emp_courses } from "../models/emp_courses.mjs";
import {
  emp_qualifications,
  validatetemp_qualifications,
} from "../models/emp_qualifications.mjs";
import { punishments, validatetpunishments } from "../models/punishments.mjs";
import { rewards, validatetrewards } from "../models/rewards.mjs";
import {
  absences_and_vacation,
  validatetabsences_and_vacation,
} from "../models/absences_and_vacation.mjs";
import {
  administrative_vacation,
  validatetadministrative_vacation,
} from "../models/administrative_vacation.mjs";
import { upload } from "../config/uploadImage.mjs";

export const addEmp = async (req, res) => {
  try {
    if (req.files[0]) {
      const { id } = await upload(req.files[0]);

      if (id) {
        req.body.autograph_photo = `https://drive.google.com/thumbnail?id=${id}&sz=s100`;
      }
    }
    let requ;
    if (req.body?._id) {
      requ = await employees.findByIdAndUpdate(
        req.body._id,
        {
          $set: req.body,
        },
        { new: true }
      );
    } else {
      const { error } = validatEmployees(req.body);
      if (error) {
        return res.status(500).json(error);
      }
      requ = new employees(req.body);
    }
    const result = await requ.save();
    return res.json({
      status: true,
      message: "تم اضافة الموظف بنجاح",
      added_employee_id: result.id,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const showEmps = async (req, res) => {
  const result = await employees.find();
  if (!result) {
    return res.status(500).json({ message: "حدث خطأ ما" });
  }
  return res.json({ status: true, data: result });
};

export const addEmpQua = asyncHandler(async (req, res) => {
  const del = await emp_qualifications.deleteMany({
    emp_id: req.body.qua1.emp_id,
  });
  const arr = Object.entries(req.body);
  arr.map(async (i) => {
    const { error } = validatetemp_qualifications(i[1]);
    if (error) {
      return res.status(500).json(error);
    }
    const requ = new emp_qualifications(i[1]);
    const result = await requ.save();
  });

  return res.json({
    status: true,
    message: " added Successfully",
  });
});

export const addEmpcourse = asyncHandler(async (req, res) => {
  const del = await emp_courses.deleteMany({
    emp_id: req.body.cor1.emp_id,
  });
  const arr = Object.entries(req.body);
  arr.map(async (i) => {
    const { error } = validatetemp_courses(i[1]);
    if (error) {
      return res.status(500).json(error);
    }
    const requ = new emp_courses(i[1]);
    const result = await requ.save();
  });

  return res.json({
    status: true,
    message: " added Successfully",
  });
});

export const addEmpPun = asyncHandler(async (req, res) => {
  const del = await punishments.deleteMany({
    emp_id: req.body.pun1.emp_id,
  });
  const arr = Object.entries(req.body);
  arr.map(async (i) => {
    const { error } = validatetpunishments(i[1]);
    if (error) {
      return res.status(500).json(error);
    }
    const requ = new punishments(i[1]);
    const result = await requ.save();
  });

  return res.json({
    status: true,
    message: " added Successfully",
  });
});

export const addEmpRew = asyncHandler(async (req, res) => {
  const del = await rewards.deleteMany({
    emp_id: req.body.rew1.emp_id,
  });
  const arr = Object.entries(req.body);
  arr.map(async (i) => {
    const { error } = validatetrewards(i[1]);
    if (error) {
      return res.status(500).json(error);
    }
    const requ = new rewards(i[1]);
    const result = await requ.save();
  });

  return res.json({
    status: true,
    message: " added Successfully",
  });
});

export const addEmpAbs = asyncHandler(async (req, res) => {
  const del = await absences_and_vacation.deleteMany({
    emp_id: req.body.abs1.emp_id,
  });
  const arr = Object.entries(req.body);
  arr.map(async (i) => {
    const { error } = validatetabsences_and_vacation(i[1]);
    if (error) {
      return res.status(500).json(error);
    }
    const requ = new absences_and_vacation(i[1]);
    const result = await requ.save();
  });

  return res.json({
    status: true,
    message: " added Successfully",
  });
});

export const addEmpVac = asyncHandler(async (req, res) => {
  const del = await administrative_vacation.deleteMany({
    emp_id: req.body.vac1.emp_id,
  });
  const arr = Object.entries(req.body);
  arr.map(async (i) => {
    const { error } = validatetadministrative_vacation(i[1]);
    if (error) {
      return res.status(500).json(error);
    }
    const requ = new administrative_vacation(i[1]);
    const result = await requ.save();
  });

  return res.json({
    status: true,
    message: " added Successfully",
  });
});

export const showEmpData = async (req, res) => {
  const employees1 = [await employees.findById(req.params.id)];
  const emp_courses1 = await emp_courses.find({
    emp_id: req.params.id,
  });
  const emp_qualifications1 = await emp_qualifications.find({
    emp_id: req.params.id,
  });
  const punishments1 = await punishments.find({
    emp_id: req.params.id,
  });
  const rewards1 = await rewards.find({
    emp_id: req.params.id,
  });
  const absences_and_vacation1 = await absences_and_vacation.find({
    emp_id: req.params.id,
  });
  const administrative_vacation1 = await administrative_vacation.find({
    emp_id: req.params.id,
  });

  return res.json({
    status: true,
    emp_qualifications: emp_qualifications1,
    emp_courses: emp_courses1,
    punishments: punishments1,
    rewards: rewards1,
    absences_and_vacations: absences_and_vacation1,
    administrative_vacations: administrative_vacation1,
    data: employees1,
  });
};

export const searchEmp = async (req, res) => {
  const result = await employees.find({ name: { $regex: req.body.name } });

  return res.json({ status: true, message: result });
};
