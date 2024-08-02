import Joi from "joi";
import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema(
  {
    type: {
      required: true,
      type: String,
    },
    description: {
      required: true,
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

export const Complaint = mongoose.model("Complaint", ComplaintSchema);

export function ComplaintValidate(obj) {
  const schema = Joi.object({
    type: Joi.string().required(),
    description: Joi.string().required(),
  })
    .unknown()
    .messages({
      "any.required": `يرجى تعبئة الحقول المطلوبة`,
    });
  return schema.validate(obj);
}
