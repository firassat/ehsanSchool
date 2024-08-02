import express from "express";
import {
  showStatuses,
  showMServices,
  showNats,
  showSectors,
  showRoles,
} from "../controllers/userController.mjs";

export const user = express.Router();

user.get("/showStatuses", showStatuses);
user.get("/showMServices", showMServices);
user.get("/showNats", showNats);
user.get("/showSectors", showSectors);
user.get("/showRoles", showRoles);
