import mongoose from "mongoose";
import Joi from "joi";

const absences_and_vacationSchema = new mongoose.Schema({
  reason: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },

  from: { type: Date, required: true },
  to: { type: Date, required: true },

  emp_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "employees",
  },
});

export const absences_and_vacation = mongoose.model(
  "absences_and_vacation",
  absences_and_vacationSchema
);

export function validatetabsences_and_vacation(obj) {
  const schema = Joi.object({
    reason: Joi.string().required(),
    duration: Joi.string().required(),
    from: Joi.required(),
    to: Joi.required(),
    emp_id: Joi.required(),
  })
    .unknown()
    .messages({
      "any.required": `يرجى تعبئة الحقول المطلوبة`,
    });
  return schema.validate(obj);
}
