import mongoose from "mongoose";

const previous_subjectSchema = new mongoose.Schema({
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

export const previous_subject = mongoose.model(
  "previous_subject",
  previous_subjectSchema
);
