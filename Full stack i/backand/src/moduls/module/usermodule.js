import mongoose from "mongoose";

const { Schema } = mongoose;

const userschema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    created_date: {
      type: String,
      default: () => new Date().toISOString(),
    },
    updated_date: {
      type: String,
      default: () => new Date().toISOString(),
    },
  },
  {
    timestamps: {
      createdAt: "created_date",
      updatedAt: "updated_date",
    },
  },
);

// export module
const User = mongoose.model("User", userschema);


export default User;