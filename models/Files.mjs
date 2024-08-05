import Joi from "joi";
import mongoose from "mongoose";

const FilesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
    },
    classes_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Classes",
      },
    ],
    subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Subjects",
    },
  },
  { timestamps: true }
);

export const Files = mongoose.model("Files", FilesSchema);

export function FilesValidate(obj) {
  const schema = Joi.object({
    name: Joi.string().required(),
    subject_id: Joi.string().required(),

    classes_id: Joi.required(),
  })
    .unknown()
    .messages({
      "any.required": `يرجى تعبئة الحقول المطلوبة`,
    });
  return schema.validate(obj);
}
