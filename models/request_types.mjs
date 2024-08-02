import mongoose from "mongoose";

const request_typesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

export const request_types = mongoose.model(
  "request_types",
  request_typesSchema
);
