import mongoose from "mongoose";

const RolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

export const Rol = mongoose.model("Rol", RolSchema);
