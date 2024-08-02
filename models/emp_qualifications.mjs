import mongoose from "mongoose";
import Joi from "joi";

const emp_qualificationsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  resource: {
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

export const emp_qualifications = mongoose.model(
  "emp_qualifications",
  emp_qualificationsSchema
);

export function validatetemp_qualifications(obj) {
  const schema = Joi.object({
    name: Joi.string().required(),
    resource: Joi.string().required(),
    date: Joi.required(),
    emp_id: Joi.required(),
  })
    .unknown()
    .messages({
      "any.required": `يرجى تعبئة الحقول المطلوبة`,
    });
  return schema.validate(obj);
}
