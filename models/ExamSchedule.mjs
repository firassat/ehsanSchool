import Joi from "joi";
import mongoose from "mongoose";

const ExamScheduleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
});

export const ExamSchedule = mongoose.model("ExamSchedule", ExamScheduleSchema);

export function validateExamSchedule(obj) {
  const schema = Joi.object({
    time: Joi.string().required(),
    date: Joi.string().required(),
    name: Joi.string().required(),
    class_id: Joi.required(),
  });
  return schema.validate(obj);
}
