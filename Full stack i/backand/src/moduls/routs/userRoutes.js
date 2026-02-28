import express from "express";
import {
  createUser,
  listUsers,
  getUser,
  updateUser,
  softDeleteUser,
  softDeleteMultiple,
} from "../controllar/usercontrollr.js";
import { body, query } from "express-validator";

const router = express.Router();

// common validation for create/update
const userValidation = [
  body("username")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("username is required"),
  body("email").isEmail().withMessage("must be a valid email"),
  body("phone")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("phone is required")
    .isLength({ min: 7, max: 15 })
    .withMessage("phone should be 7-15 chars"),
  body("image")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("image url is required"),
];

// create user
router.post("/", userValidation, createUser);

// list with pagination and search
router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1 }).toInt(),
    query("search").optional().isString(),
    query("status").optional().isBoolean().toBoolean(),
  ],
  listUsers,
);

// single read
router.get("/:id", getUser);

// update
router.put("/:id", userValidation, updateUser);

// soft delete one
router.delete("/:id", softDeleteUser);

// multiple soft Delate
router.post("/delete-multiple", softDeleteMultiple);

export default router;
