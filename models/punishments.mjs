import mongoose from "mongoose";
import Joi from "joi";

const punishmentsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  resourse: {
    type: String,
    required: true,
  },
  note: { type: String, default: null },
  date: { type: Date, required: true },

  emp_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "employees",
  },
});

export const punishments = mongoose.model("punishments", punishmentsSchema);

export function validatetpunishments(obj) {
  const schema = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().required(),
    resourse: Joi.string().required(),
    date: Joi.required(),
    emp_id: Joi.required(),
  })
    .unknown()
    .messages({
      "any.required": `يرجى تعبئة الحقول المطلوبة`,
    });
  return schema.validate(obj);
}
