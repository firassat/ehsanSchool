import mongoose from "mongoose";

const SubjectsSchema = new mongoose.Schema({
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

export const Subjects = mongoose.model("Subjects", SubjectsSchema);
