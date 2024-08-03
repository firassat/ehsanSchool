import mongoose from "mongoose";

const ClassesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

export const Classes = mongoose.model("Classes", ClassesSchema);
