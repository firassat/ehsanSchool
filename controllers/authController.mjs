import {
  User,
  validateLoginUser,
  validateRigisterUser,
} from "../models/User.mjs";
import { Rol } from "../models/Rol.mjs";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 *   @desc   register
 *   @route  /rigester
 *   @method Post
 *   @access puplic
 */
export const userRegister = asyncHandler(async (req, res) => {
  const { error } = validateRigisterUser(req.body);
  if (error) {
    return res.status(500).json(error);
  }
  let user = await User.findOne({ email: req.body.email });
  if (user) res.json({ message: "هذا الايميل مسجل بالفعل" });

  const salt = await bcrypt.genSalt(5);
  req.body.password = await bcrypt.hash(req.body.password, salt);

  user = new User({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
    role_id: req.body.role_id,
  });
  const result = await user.save();
  const access_token = jwt.sign({ id: user.id }, process.env.SECRTKEY);
  const { password, ...other } = result._doc;
  return res.json({
    ...other,
    access_token,
    message: "حسابك تحت المراجعة",
  });
});

/**
 *   @desc   login
 *   @route  /login
 *   @method Post
 *   @access puplic
 */
export const userLogin = asyncHandler(async (req, res) => {
  const { error } = validateLoginUser(req.body);
  if (error) {
    return res.json(error);
  }
  let user = await User.findOne({ email: req.body.email }).populate(
    "role_id",
    "name"
  );
  if (!user) res.json({ message: "اسم المستخدم او كلمة المرور غير صحيحة" });
  const isPasswordMatch = bcrypt.compare(req.body.password, user.password);
  if (!isPasswordMatch)
    res.json({ message: "اسم المستخدم او كلمة المرور غير صحيحة" });

  const access_token = jwt.sign(
    { id: user.id, role_id: user.role_id._id },
    process.env.SECRTKEY
  );
  const { password, ...other } = user._doc;
  return res.json({ ...other, access_token });
});

/**
 *   @desc   logout
 *   @route  /logout
 *   @method Post
 *   @access puplic
 */
export const userLogout = asyncHandler(async (req, res) => {
  return res.json({ message: "loggedout" });
});
