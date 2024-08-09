import Joi from "joi";
import mongoose from "mongoose";

const WeekScheduleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  teacher: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  day: {
    type: String,
    required: true,
  },
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Classes",
  },
});

export const WeekSchedule = mongoose.model("WeekSchedule", WeekScheduleSchema);

export function validateWeekSchedule(obj) {
  const schema = Joi.object({
    day: Joi.string()
      .required()
      .valid("الاحد", "الاثنين", "الثلاثاء", "الاربعاء", "الخميس"),
    teacher: Joi.string().required(),
    name: Joi.string().required(),
    order: Joi.required(),
    class_id: Joi.required(),
  });
  return schema.validate(obj);
}
