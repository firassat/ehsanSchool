import Joi from "joi";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Rol",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);

export function validateRigisterUser(obj) {
  const schema = Joi.object({
    email: Joi.string().email().required().trim(),
    password: Joi.string().required(),
    name: Joi.string().required(),
    role_id: Joi.required(),
  });
  return schema.validate(obj);
}
export function validateLoginUser(obj) {
  const schema = Joi.object({
    email: Joi.string().email().required().trim().messages({
      "string.email": `يرجى ادخال ايميل صالح`,
      "any.required": `هذا الحقل مطلوب`,
    }),
    password: Joi.string().required(),
  });
  return schema.validate(obj);
}
export function validateUpdateUser(obj) {
  const schema = Joi.object({
    email: Joi.string().email().trim(),
    password: Joi.string(),
  });
  return schema.validate(obj);
}
