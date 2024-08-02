import Joi from "joi";
import mongoose from "mongoose";

const Student_violationSchema = new mongoose.Schema(
  {
    description: {
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

export const Student_violation = mongoose.model(
  "Student_violation",
  Student_violationSchema
);

export function Student_violationValidate(obj) {
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
