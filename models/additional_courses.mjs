import mongoose from "mongoose";
import Joi from "joi";

const additional_coursesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  request_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "teaching_requests",
  },
});

export const additional_courses = mongoose.model(
  "additional_courses",
  additional_coursesSchema
);

export function validateAdditionalCourses(obj) {
  const schema = Joi.object({
    name: Joi.string().required(),
    request_id: Joi.required(),
  })
    .unknown()
    .messages({
      "any.required": `يرجى تعبئة الحقول المطلوبة`,
    });
  return schema.validate(obj);
}
