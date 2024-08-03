import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Classes",
  },
});

export const Subject = mongoose.model("Subject", SubjectSchema);
