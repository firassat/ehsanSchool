import mongoose from "mongoose";
import Joi from "joi";
const MarksSchema = new mongoose.Schema(
  {
    mark: {
      type: Number,
      required: true,
    },
    full_mark: {
      type: Number,
      required: true,
    },
    subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Subject",
    },
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Students",
    },
    type: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Marks = mongoose.model("Marks", MarksSchema);

export function marksValidate(obj) {
  const schema = Joi.object({
    subject_id: Joi.required(),
    full_mark: Joi.required(),
    type: Joi.string().valid("مذاكرة", "شفهي", "امتحان").required(),
  })
    .unknown()
    .messages({
      "any.required": `يرجى تعبئة الحقول المطلوبة`,
    });
  return schema.validate(obj);
}
