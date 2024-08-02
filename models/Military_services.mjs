import mongoose from "mongoose";

const Military_servicesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

export const Military_services = mongoose.model(
  "Military_services",
  Military_servicesSchema
);
