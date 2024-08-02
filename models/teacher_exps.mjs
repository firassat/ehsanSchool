import mongoose from "mongoose";
import Joi from "joi";

const teacher_expsSchema = new mongoose.Schema({
  work: {
    type: String,
    required: true,
  },
  work_place: {
    type: String,
    required: true,
  },
  from_date: {
    type: Date,
    required: true,
  },
  to_date: {
    type: Date,
    required: true,
  },
  years_num: {
    type: Number,
    required: true,
  },
  request_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "teaching_requests",
  },
});

export const teacher_exps = mongoose.model("teacher_exps", teacher_expsSchema);

export function validatetTeacher_exps(obj) {
  const schema = Joi.object({
    work_place: Joi.string().required(),
    work: Joi.string().required(),
    from_date: Joi.required(),
    to_date: Joi.required(),

    request_id: Joi.required(),
  })
    .unknown()
    .messages({
      "any.required": `يرجى تعبئة الحقول المطلوبة`,
    });
  return schema.validate(obj);
}
