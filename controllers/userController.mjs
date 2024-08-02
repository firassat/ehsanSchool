import { Classes } from "../models/Classes.mjs";
import { User } from "../models/User.mjs";
import { Social_statuses } from "../models/Social_statuses.mjs";
import { Military_services } from "../models/Military_services.mjs";
import { Nationalities } from "../models/Nationalities.mjs";
import { Sectors } from "../models/Sectors.mjs";
import asyncHandler from "express-async-handler";
import { Rol } from "../models/Rol.mjs";

export const showClasses = asyncHandler(async (req, res) => {
  const result = await Classes.find();
  return res.json({ status: true, classes: result });
});
export const showStatuses = asyncHandler(async (req, res) => {
  const result = await Social_statuses.find();
  return res.json({ status: true, result: result });
});
export const showMServices = asyncHandler(async (req, res) => {
  const result = await Military_services.find();
  return res.json({ status: true, result: result });
});
export const showNats = asyncHandler(async (req, res) => {
  const result = await Nationalities.find();
  return res.json({ status: true, Nationalities: result });
});
export const showSectors = asyncHandler(async (req, res) => {
  const result = await Sectors.find();
  return res.json({ status: true, sectors: result });
});
export const showRoles = asyncHandler(async (req, res) => {
  const result = await Rol.find();
  return res.json({ status: true, sectors: result });
});

export const showPendingAccounts = asyncHandler(async (req, res) => {
  const result = await User.find({ approved: 0 }).populate("role_id", "name");
  return res.json({ status: true, users: result });
});

export const approveAccounts = asyncHandler(async (req, res) => {
  const result = await User.findByIdAndUpdate(req.params.id, {
    $set: {
      approved: 1,
    },
  });
  return res.json({ status: true, message: "none" });
});
export const deletePendingAccount = asyncHandler(async (req, res) => {
  const result = await User.findByIdAndDelete(req.params.id);
  return res.json({ status: true, message: "none" });
});
