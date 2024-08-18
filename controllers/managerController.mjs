import { upload } from "../config/uploadImage.mjs";
import { Classes } from "../models/Classes.mjs";
import { events, eventValidate } from "../models/events.mjs";
import asyncHandler from "express-async-handler";
import { User } from "../models/User.mjs";
import { teaching_requests } from "../models/teaching_requests.mjs";
import { emp_requests } from "../models/emp_requests.mjs";
import { Students } from "../models/Students.mjs";
import { notification } from "../config/notification.mjs";

export const addEvent = async (req, res, next) => {
  try {
    const { error } = eventValidate(req.body);
    if (error) {
      return res.status(500).json({
        message: error?.message,
      });
    }
    if (!req.user_id) {
      return res.status(500).json({
        message: "حدث خطأ",
      });
    }
    if (req.files?.length > 0) {
      const { id } = await upload(req.files[0]);

      if (id) {
        req.body.photo = `https://drive.google.com/thumbnail?id=${id}&sz=s100`;
      }
    }
    const event = new events({
      ...req.body,
      admin_added: req.user_id,
      number_of_registrants: 0,
    });

    const result = await event.save();

    const students = await Students.find();
    const stu = students.map((i) => i.token).filter((i) => i != null);
    const resp = await notification(
      req,
      res,
      next,
      "تم اضافة فعالية جديدة اطلع عليها  ",
      "فعالية جديدة ",
      stu
    );

    return res.json({
      status: true,
      message: "تم اضافة الفعالية بنجاح",
      data: result,
      resp,
    });
  } catch (error) {
    return res.status(500).json({
      message: error?.message,
    });
  }
};
export const deleteEvent = asyncHandler(async (req, res) => {
  const data = await events.findByIdAndDelete(req.body.id);
  if (!data) {
    return res.json({
      status: false,
      message: "حدث خطأ ما",
    });
  }
  return res.json({
    status: true,
    message: "تم الحذف بنجاح",
  });
});

export const addAdminForClass = asyncHandler(async (req, res) => {
  if (!req.body.class_id || !req.body.admin_id) {
    return res.status(500).json({
      message: "حدث خطأ",
    });
  }
  const data = await Classes.findByIdAndUpdate(req.body?.class_id, {
    $set: { admin: req.body.admin_id },
  });
  return res.json({
    status: true,
    data,
  });
});
export const showAdminForClasses = asyncHandler(async (req, res) => {
  const users = (await User.find().populate("role_id")).filter(
    (i) => i.role_id.name === "موجه"
  );

  let data = [];
  await Promise.all(
    users.map(async (i) => {
      let da = await Classes.find({ admin: i._id });
      data.push({ admin: i, classes: da });
    })
  );
  return res.json({
    status: true,
    data,
  });
});
export const showClassesWithOutAdmin = asyncHandler(async (req, res) => {
  let data = await Classes.find({ admin: { $exists: false } });

  return res.json({
    status: true,
    data,
  });
});
export const deleteAdminForClass = asyncHandler(async (req, res) => {
  const data = await Classes.findByIdAndUpdate(req.body?.id, {
    $unset: { admin: "" },
  });
  if (!data) {
    return res.json({
      status: false,
      message: "حدث خطأ ما",
    });
  }

  return res.json({
    status: true,
    message: "تم الحذف بنجاح",
  });
});

export const approveTeachRequest = asyncHandler(async (req, res) => {
  const result = await teaching_requests.findByIdAndUpdate(req.body.id, {
    $set: {
      approve: true,
      adminNote: req.body.note,
    },
  });
  return res.json({ status: true, message: "تم التعديل" });
});
export const approveEmbRequest = asyncHandler(async (req, res) => {
  const result = await emp_requests.findByIdAndUpdate(req.body.id, {
    $set: {
      approve: true,
      adminNote: req.body.note,
    },
  });
  return res.json({ status: true, message: "تم التعديل" });
});
