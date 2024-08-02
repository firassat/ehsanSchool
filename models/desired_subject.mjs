import mongoose from "mongoose";
import Joi from "joi";

const desired_subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  request_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "teaching_requests",
  },
});

export const desired_subject = mongoose.model(
  "desired_subject",
  desired_subjectSchema
);
