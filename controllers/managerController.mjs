import { upload } from "../config/uploadImage.mjs";
import { events, eventValidate } from "../models/events.mjs";
import asyncHandler from "express-async-handler";
export const addEvent = async (req, res) => {
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
    return res.json({
      status: true,
      message: "تم اضافة الفعالية بنجاح",
      data: result,
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
