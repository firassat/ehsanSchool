import mongoose from "mongoose";
import Joi from "joi";
const StudentsSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
    },
    birth_date: {
      type: Date,
      required: true,
    },
    birth_place: {
      type: String,
      required: true,
    },
    join_date: {
      type: String,
      required: true,
    },

    father_name: {
      type: String,
      required: true,
    },
    mother_name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },

    tele_num: {
      type: String,
    },
    mobile_num: {
      type: String,
    },

    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Classes",
    },
  },
  { timestamps: true }
);

export const Students = mongoose.model("Students", StudentsSchema);

export function validateStudents(obj) {
  const schema = Joi.object({
    full_name: Joi.string().required(),
    father_name: Joi.string().required(),
    mother_name: Joi.string().required(),
    birth_place: Joi.string().required(),
    birth_date: Joi.required(),
    join_date: Joi.required(),
    address: Joi.string().required(),
    class_id: Joi.string().required(),

    mobile_num: Joi.string(),
    tele_num: Joi.string(),
  })
    .unknown()
    .messages({
      "any.required": `يرجى تعبئة الحقول المطلوبة`,
    });
  return schema.validate(obj);
}
