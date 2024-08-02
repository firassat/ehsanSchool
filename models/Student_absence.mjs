import Joi from "joi";
import mongoose from "mongoose";

const Student_absenceSchema = new mongoose.Schema(
  {
    delay_time: {
      type: String,
    },
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Students",
    },
  },
  { timestamps: true }
);

export const Student_absence = mongoose.model(
  "Student_absence",
  Student_absenceSchema
);

export function Student_absenceValidate(obj) {
  const schema = Joi.object({
    delay_time: Joi.string(),
    student_id: Joi.string().required(),
  })
    .unknown()
    .messages({
      "any.required": `يرجى تعبئة الحقول المطلوبة`,
    });
  return schema.validate(obj);
}
