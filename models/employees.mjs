import mongoose from "mongoose";
import Joi from "joi";
const employeesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
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
    subject: {
      type: String,
    },
    contracted: {
      type: Boolean,
      required: true,
    },
    active: {
      type: Boolean,
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
    rest_place: {
      // مكان قيد النفوس
      type: String,
      required: true,
    },
    comp_num: {
      //عدد من يتقاضى عنهم تعويضا عائليا
      type: String,
      required: true,
    },
    nat_num: {
      //الرقم الوطني
      type: String,
      required: true,
    },
    tele_num: {
      type: String,
    },
    mobile_num: {
      type: String,
    },
    childs_num: {
      type: Number,
      required: true,
    },
    autograph_photo: {
      type: String,
    },
    work: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    AppBook_num: {
      //كتاب التعيين
      type: Number,
      required: true,
    },
    AppBook_date: {
      type: Date,
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    leave_date: {
      type: Date,
    },
    military: {
      type: Boolean,
      required: true,
    },
    military_rank: {
      type: String,
    },
    school: {
      type: String,
    },
    sector_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Sector",
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
      ref: "military_services",
    },
  },
  { timestamps: true }
);

export const employees = mongoose.model("employees", employeesSchema);

export function validatEmployees(obj) {
  const schema = Joi.object({
    name: Joi.string().required(),
    father_name: Joi.string().required(),
    mother_name: Joi.string().required(),
    autograph_photo: Joi.string(),
    nationality_id: Joi.required(),
    birth_city: Joi.string().required(),
    birth_date: Joi.required(),
    sector_id: Joi.required(),
    work: Joi.string().required(),
    from: Joi.string().required(),
    start_date: Joi.required(),
    leave_date: Joi.required(),
    address: Joi.string().required(),
    childs_num: Joi.number().required(),
    rest_place: Joi.string().required(),
    comp_num: Joi.string().required(),
    contracted: Joi.boolean().required(),
    active: Joi.boolean().required(),
    nat_num: Joi.string().required(),
    AppBook_num: Joi.number().required(),
    AppBook_date: Joi.required(),
    military: Joi.boolean().required(),
    social_status_id: Joi.string().required(),
    mobile_num: Joi.string(),
    tele_num: Joi.string(),
    military_rank: Joi.string(),
    subject: Joi.string().required(),
    school: Joi.string(),
  })
    .unknown()
    .messages({
      "any.required": `يرجى تعبئة الحقول المطلوبة`,
    });
  return schema.validate(obj);
}
