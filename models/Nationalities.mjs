import mongoose from "mongoose";

const NationalitiesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

export const Nationalities = mongoose.model(
  "Nationalities",
  NationalitiesSchema
);
