import mongoose from "mongoose";
import Joi from "joi";
const emp_requestsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    birth_date: {
      type: Date,
      required: true,
    },

    academic_qualification: {
      type: String,
      required: true,
    },
    current_work: {
      type: String,
      required: true,
    },
    wanted_work: {
      type: String,
      required: true,
    },
    identity_photo: {
      type: String,
    },
    certificate_photo: {
      type: String,
    },
    management_opinion: {
      type: String,
    },
    manager: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    tele_num: {
      type: String,
      required: true,
    },
    mobile_num: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
    },
    request_type_id: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "request_type",
    },

    social_status_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Social_statuses",
    },
    military_service_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Military_services",
    },
  },
  { timestamps: true }
);

export const emp_requests = mongoose.model("emp_requests", emp_requestsSchema);

export function validatEempRequests(obj) {
  const schema = Joi.object({
    name: Joi.string().required(),
    request_type_id: Joi.string(),
    birth_date: Joi.required(),

    academic_qualification: Joi.string().required(),
    current_work: Joi.string().required(),
    wanted_work: Joi.required(),
    address: Joi.string().required(),
    tele_num: Joi.string().required(),
    mobile_num: Joi.string().required(),
    rating: Joi.number(),

    social_status_id: Joi.required(),
    military_service_id: Joi.required(),
  })
    .unknown()
    .messages({
      "any.required": `يرجى تعبئة الحقول المطلوبة`,
    });
  return schema.validate(obj);
}
