import mongoose from "mongoose";
import Joi from "joi";

const emp_coursesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  duration: { type: String, required: true },
  date: { type: Date, required: true },

  emp_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "employees",
  },
});

export const emp_courses = mongoose.model("emp_courses", emp_coursesSchema);

export function validatetemp_courses(obj) {
  const schema = Joi.object({
    name: Joi.string().required(),
    duration: Joi.string().required(),
    type: Joi.string().required(),
    place: Joi.string().required(),
    date: Joi.required(),
    emp_id: Joi.required(),
  })
    .unknown()
    .messages({
      "any.required": `يرجى تعبئة الحقول المطلوبة`,
    });
  return schema.validate(obj);
}
