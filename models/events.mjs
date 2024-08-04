import Joi from "joi";
import mongoose from "mongoose";

const eventsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
  },
  number_of_registrants: {
    type: Number,
  },
  description: {
    type: String,
  },
  admin_added: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

export const events = mongoose.model("events", eventsSchema);

export function eventValidate(obj) {
  const schema = Joi.object({
    name: Joi.string().required(),
    place: Joi.string().required(),
    date: Joi.string().required(),
  })
    .unknown()
    .messages({
      "any.required": `يرجى تعبئة الحقول المطلوبة`,
    });
  return schema.validate(obj);
}
