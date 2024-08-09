import { Classes } from "../models/Classes.mjs";
import { User } from "../models/User.mjs";
import { Social_statuses } from "../models/Social_statuses.mjs";
import { Military_services } from "../models/Military_services.mjs";
import { Nationalities } from "../models/Nationalities.mjs";
import { Sectors } from "../models/Sectors.mjs";
import asyncHandler from "express-async-handler";
import { Rol } from "../models/Rol.mjs";
import { validateWeekSchedule, WeekSchedule } from "../models/WeekSchedule.mjs";
import { ExamSchedule, validateExamSchedule } from "../models/ExamSchedule.mjs";

export const showClasses = asyncHandler(async (req, res) => {
  const result = await Classes.find();
  return res.json({ status: true, classes: result });
});
export const showStatuses = asyncHandler(async (req, res) => {
  const result = await Social_statuses.find();
  return res.json({ status: true, result: result });
});
export const showMServices = asyncHandler(async (req, res) => {
  const result = await Military_services.find();
  return res.json({ status: true, result: result });
});
export const showNats = asyncHandler(async (req, res) => {
  const result = await Nationalities.find();
  return res.json({ status: true, Nationalities: result });
});
export const showSectors = asyncHandler(async (req, res) => {
  const result = await Sectors.find();
  return res.json({ status: true, sectors: result });
});
export const showRoles = asyncHandler(async (req, res) => {
  const result = await Rol.find();
  return res.json({ status: true, sectors: result });
});
export const showPendingAccounts = asyncHandler(async (req, res) => {
  const result = await User.find({ approved: 0 }).populate("role_id", "name");
  return res.json({ status: true, users: result });
});
export const approveAccounts = asyncHandler(async (req, res) => {
  const result = await User.findByIdAndUpdate(req.params.id, {
    $set: {
      approved: 1,
    },
  });
  return res.json({ status: true, message: "none" });
});
export const deletePendingAccount = asyncHandler(async (req, res) => {
  const result = await User.findByIdAndDelete(req.params.id);
  return res.json({ status: true, message: "none" });
});

//WeekSchedule
export const addWeekSchedule = async (req, res) => {
  try {
    const { error } = validateWeekSchedule(req.body);
    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
    const data = await WeekSchedule.find({
      day: req.body.day,
      order: req.body.order,
      class_id: req.body.class_id,
    });
    if (!data.length > 0) {
      const schedule = await new WeekSchedule(req.body).save();
      return res.json({
        status: true,
        message: "تم اضافة اليوم بنجاح",
        data: schedule,
      });
    } else {
      const schedule = await WeekSchedule.findByIdAndUpdate(
        data[0]?._id,
        {
          $set: req.body,
        },
        { new: true }
      );
      return res.json({
        status: true,
        message: "تم تعديل اليوم بنجاح",
        data: schedule,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const showWeekSchedule = asyncHandler(async (req, res) => {
  const result = await WeekSchedule.find({
    class_id: req.body.class_id,
    day: req.body.day,
  });
  if (!result) {
    return res.status(400).json({
      status: false,
      message: "حدث خطأ ما",
    });
  }
  return res.json({ status: true, data: result });
});
export const deleteWeekSchedule = asyncHandler(async (req, res) => {
  const result = await WeekSchedule.findByIdAndDelete(req.body.id);
  if (!result) {
    return res.status(400).json({
      status: false,
      message: "حدث خطأ ما",
    });
  }
  return res.json({ status: true, message: "تم الحذف بنجاح" });
});
export const addExamSchedule = async (req, res) => {
  try {
    const { error } = validateExamSchedule(req.body);
    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
    const className = await Classes.findById(req.body.class_id);

    const schedule = await new ExamSchedule({
      name: req.body.name,
      date: req.body.date,
      time: req.body.time,
      class: className.name,
    }).save();
    return res.json({
      status: true,
      message: "تم اضافة اليوم بنجاح",
      data: schedule,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const showExamSchedule = asyncHandler(async (req, res) => {
  const className = await Classes.findById(req.body.class_id);
  const result = await ExamSchedule.find({
    class: className.name,
  });
  if (!result) {
    return res.status(400).json({
      status: false,
      message: "حدث خطأ ما",
    });
  }
  return res.json({ status: true, data: result });
});
export const deleteExamSchedule = asyncHandler(async (req, res) => {
  const result = await ExamSchedule.findByIdAndDelete(req.body.id);
  if (!result) {
    return res.status(400).json({
      status: false,
      message: "حدث خطأ ما",
    });
  }
  return res.json({ status: true, message: "تم الحذف بنجاح" });
});
