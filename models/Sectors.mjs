import mongoose from "mongoose";

const SectorsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

export const Sectors = mongoose.model("Sectors", SectorsSchema);
