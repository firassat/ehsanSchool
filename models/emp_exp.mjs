import mongoose from "mongoose";

const emp_expSchema = new mongoose.Schema({
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

export const emp_exp = mongoose.model("emp_exp", emp_expSchema);
