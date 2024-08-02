import mongoose from "mongoose";

const SectionsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

export const Sections = mongoose.model("Sections", SectionsSchema);
