import { upload } from "../config/uploadImage.mjs";
import { events, eventValidate } from "../models/events.mjs";

export const addEvent = async (req, res) => {
  try {
    if (req.files[0]) {
      const { id } = await upload(req.files[0]);

      if (id) {
        req.body.photo = `https://drive.google.com/thumbnail?id=${id}&sz=s100`;
      }
    }
    const { error } = eventValidate(req.body);
    if (error) {
      return res.status(500).json({
        message: error?.message,
      });
    }

    const event = new events(req.body);

    const result = await event.save();
    return res.json({
      status: true,
      message: "تم اضافة الفعالية بنجاح",
      data: result,
    });
  } catch (error) {
    if (req.files?.length > 0 ? req.files[0] : false)
      return res.status(500).json({
        message: error?.message,
      });
  }
};
