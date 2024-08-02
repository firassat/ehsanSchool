import mongoose from "mongoose";
import Joi from "joi";
const teaching_requestsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    request_type_id: {
      type: Number,
      required: true,
    },
    birth_date: {
      type: Date,
      required: true,
    },
    birth_city: {
      type: String,
      required: true,
    },
    academic_qualification: {
      type: String,
      required: true,
    },
    issuing_authority: {
      type: String,
      required: true,
    },
    acquisition_year: {
      type: String,
      required: true,
    },
    study_place: {
      type: String,
      required: true,
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
      default: "663d21d4977d6f592c1c6124",
      ref: "request_type",
    },
    nationality_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Nationalities",
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

export const teaching_requests = mongoose.model(
  "teaching_requests",
  teaching_requestsSchema
);

export function validateTeachingRequests(obj) {
  const schema = Joi.object({
    name: Joi.string().required(),
    request_type_id: Joi.string(),
    birth_date: Joi.required(),
    birth_city: Joi.string().required(),
    academic_qualification: Joi.string().required(),
    issuing_authority: Joi.string().required(),
    acquisition_year: Joi.required(),
    study_place: Joi.string().required(),
    address: Joi.string().required(),
    tele_num: Joi.string().required(),
    mobile_num: Joi.string().required(),
    rating: Joi.number(),
    nationality_id: Joi.required(),
    social_status_id: Joi.required(),
    military_service_id: Joi.required(),
  })
    .unknown()
    .messages({
      "any.required": `يرجى تعبئة الحقول المطلوبة`,
    });
  return schema.validate(obj);
}
