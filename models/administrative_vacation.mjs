import mongoose from "mongoose";
import Joi from "joi";

const administrative_vacationSchema = new mongoose.Schema({
  reason: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },

  date: { type: Date, required: true },

  emp_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "employees",
  },
});

export const administrative_vacation = mongoose.model(
  "administrative_vacation",
  administrative_vacationSchema
);

export function validatetadministrative_vacation(obj) {
  const schema = Joi.object({
    reason: Joi.string().required(),
    duration: Joi.string().required(),
    date: Joi.required(),

    emp_id: Joi.required(),
  })
    .unknown()
    .messages({
      "any.required": `يرجى تعبئة الحقول المطلوبة`,
    });
  return schema.validate(obj);
}
