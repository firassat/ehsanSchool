import {
  validateAdditionalCourses,
  additional_courses,
} from "../models/additional_courses.mjs";
import {
  teaching_requests,
  validateTeachingRequests,
} from "../models/teaching_requests.mjs";
import { emp_requests, validatEempRequests } from "../models/emp_requests.mjs";
import { desired_subject } from "../models/desired_subject.mjs";
import { previous_subject } from "../models/previous_subject.mjs";
import {
  teacher_exps,
  validatetTeacher_exps,
} from "../models/teacher_exps.mjs";
import asyncHandler from "express-async-handler";
import { Nationalities } from "../models/Nationalities.mjs";
import { Social_statuses } from "../models/Social_statuses.mjs";
import { Military_services } from "../models/Military_services.mjs";
import { emp_exp } from "../models/emp_exp.mjs";
import fs from "fs";
import { upload } from "../config/uploadImage.mjs";
export const addTeachingRequest = asyncHandler(async (req, res) => {
  const { error } = validateTeachingRequests(req.body);
  if (error) {
    return res.status(500).json(error);
  }
  const requ = new teaching_requests(req.body);
  const result = await requ.save();
  return res.json({
    status: true,
    message: "request added Successfully",
    added_request_id: result.id,
  });
});

export const addTCourse = asyncHandler(async (req, res) => {
  const { error } = validateAdditionalCourses(req.body);
  if (error) {
    return res.status(500).json(error);
  }
  const requ = new additional_courses(req.body);
  const result = await requ.save();
  return res.json({
    status: true,
    message: "request added Successfully",
  });
});

export const addDSub = asyncHandler(async (req, res) => {
  const { error } = validateAdditionalCourses(req.body);
  if (error) {
    return res.status(500).json(error);
  }
  const requ = new desired_subject(req.body);
  const result = await requ.save();
  return res.json({
    status: true,
    message: "request added Successfully",
  });
});

export const addPSub = asyncHandler(async (req, res) => {
  const { error } = validateAdditionalCourses(req.body);
  if (error) {
    return res.status(500).json(error);
  }
  const requ = new previous_subject(req.body);
  const result = await requ.save();
  return res.json({
    status: true,
    message: "request added Successfully",
  });
});

export const addTexp = asyncHandler(async (req, res) => {
  const { error } = validatetTeacher_exps(req.body);
  if (error) {
    return res.status(500).json(error);
  }
  const date2 = new Date(req.body.to_date);
  const date1 = new Date(req.body.from_date);
  var diff = (date2.getTime() - date1.getTime()) / 1000;
  diff /= 60 * 60 * 24 * 7 * 4;
  const years_num = Math.abs(Math.round(diff / 12));
  req.body.years_num = years_num;

  const requ = new teacher_exps(req.body);
  const result = await requ.save();
  return res.json({
    status: true,
    message: "request added Successfully",
  });
});

export const showTreqs = asyncHandler(async (req, res) => {
  const result = await teaching_requests
    .find()
    .populate(["nationality_id", "social_status_id", "military_service_id"]);
  return res.json({ status: true, subjects: result });
});

export const addEmpRequest = async (req, res) => {
  try {
    const { error } = validatEempRequests(req.body);
    if (error) {
      return res.status(500).json(error);
    }
    if (req.files[0]) {
      const { id } = await upload(req.files[0]);

      if (id) {
        req.body.certificate_photo = `https://drive.google.com/thumbnail?id=${id}&sz=s300`;
      }
    }
    if (req.files[1]) {
      const { id } = await upload(req.files[1]);

      if (id) {
        req.body.identity_photo = `https://drive.google.com/thumbnail?id=${id}&sz=300`;
      }
    }

    const requ = new emp_requests(req.body);

    const result = await requ.save();
    return res.json({
      status: true,
      message: "request added Successfully",
      added_request_id: result.id,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const addECourse = asyncHandler(async (req, res) => {
  const { error } = validateAdditionalCourses(req.body);
  if (error) {
    return res.status(500).json(error);
  }
  const requ = new additional_courses(req.body);
  const result = await requ.save();
  return res.json({
    status: true,
    message: "request added Successfully",
  });
});

export const addEexp = asyncHandler(async (req, res) => {
  const { error } = validateAdditionalCourses(req.body);
  if (error) {
    return res.status(500).json(error);
  }

  const requ = new emp_exp(req.body);
  const result = await requ.save();
  return res.json({
    status: true,
    message: "request added Successfully",
  });
});

export const showEreqs = asyncHandler(async (req, res) => {
  const result = await emp_requests
    .find()
    .populate(["social_status_id", "military_service_id"]);
  return res.json({ status: true, subjects: result });
});

export const showReqData = asyncHandler(async (req, res) => {
  if (req.body.type == 1) {
    const result = await teaching_requests
      .findOne({ _id: req.body.id })
      .populate(["nationality_id", "social_status_id", "military_service_id"]);
    const data = {
      request_id: result._id,
      name: result.name,
      birth_date: result.birth_date,
      birth_city: result.birth_city,
      academic_qualification: result.academic_qualification,
      issuing_authority: result.issuing_authority,
      acquisition_year: result.acquisition_year,
      study_place: result.study_place,
      address: result.address,
      tele_num: result.tele_num,
      mobile_num: result.mobile_num,
      rating: result.rating,
      approve: result.approve,
      social_status: result.social_status_id.name,
      military_service: result.military_service_id.name,
      nationality: result.nationality_id.name,
      created_at: result.created_at,
    };
    const previous_subject1 = await previous_subject.find({
      request_id: req.body.id,
    });
    const desired_subject1 = await desired_subject.find({
      request_id: req.body.id,
    });
    const additional_course1 = await additional_courses.find({
      request_id: req.body.id,
    });
    const teacher_exp1 = await teacher_exps.find({
      request_id: req.body.id,
    });
    return res.json({
      status: true,
      data: data,
      previous_subject: previous_subject1,
      additional_course: additional_course1,
      desired_subject: desired_subject1,
      teacher_exp: teacher_exp1,
    });
  } else if (req.body.type == 2) {
    const result = await emp_requests
      .findOne({ _id: req.body.id })
      .populate(["social_status_id", "military_service_id"]);

    const data = {
      request_id: result._id,
      name: result.name,
      birth_date: result.birth_date,
      identity_photo: result.identity_photo,
      certificate_photo: result.certificate_photo,
      academic_qualification: result.academic_qualification,
      issuing_authority: result.issuing_authority,
      acquisition_year: result.acquisition_year,
      study_place: result.study_place,
      address: result.address,
      tele_num: result.tele_num,
      mobile_num: result.mobile_num,
      rating: result.rating,
      approve: result.approve,
      social_status: result.social_status_id.name,
      military_service: result.military_service_id.name,
    };

    const additional_course1 = await additional_courses.find({
      request_id: req.body.id,
    });
    const teacher_exp1 = await emp_exp.find({
      request_id: req.body.id,
    });
    return res.json({
      status: true,
      data: data,
      skills_and_courses: additional_course1,
      experiences: teacher_exp1,
    });
  }
});
