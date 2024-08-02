import mongoose from "mongoose";

const ClassesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

export const Classes = mongoose.model("Classes", ClassesSchema);
