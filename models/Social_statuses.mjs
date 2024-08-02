import mongoose from "mongoose";

const Social_statusesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

export const Social_statuses = mongoose.model(
  "Social_statuses",
  Social_statusesSchema
);
