import User from "../usermodule.js";
import { validationResult } from "express-validator";

//  query for search
const buildSearchQuery = (search) => {
  if (!search) return {};
  const regex = { $regex: search, $options: "i" };
  return {
    $or: [{ username: regex }, { email: regex }, { phone: regex }],
  };
};

// Create new user
export const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, email, phone, image } = req.body;
    const user = new User({ username, email, phone, image });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get list with optional search and pagination
export const listUsers = async (req, res) => {
  try {
    const { page = 1, limit = 5, search, status } = req.query;
    const query = buildSearchQuery(search);
    // by default show only active users (status true)
    if (status === undefined) {
      query.status = true;
    } else {
      query.status = status === "true";
    }

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { created_date: -1 },
    };

    const users = await User.find(query)
      .skip((options.page - 1) * options.limit)
      .limit(options.limit)
      .sort(options.sort)
      .exec();

    const total = await User.countDocuments(query);
    res.json({ data: users, total, page: options.page, limit: options.limit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single user
export const getuser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user
export const updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, email, phone, image } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, phone, image, updated_date: new Date().toISOString() },
      { new: true },
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Soft delete single user
export const softDeleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: false, updated_date: new Date().toISOString() },
      { new: true },
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User soft-deleted", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Multiple soft delete
export const softDeleteMultiple = async (req, res) => {
  try {
    const { ids } = req.body; // expect array of id strings
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "ids must be a non-empty array" });
    }
    const result = await User.updateMany(
      { _id: { $in: ids } },
      { status: false, updated_date: new Date().toISOString() },
    );
    res.json({
      message: "Users deleted",
      modifiedCount: result.nModified,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
