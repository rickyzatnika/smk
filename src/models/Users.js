import mongoose from "mongoose";

const UsersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    phone: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    image: {
      type: String, // URL atau path ke gambar
    },
    role: {
      type: String,
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

mongoose.models = {};
const Users = mongoose.model("Users", UsersSchema);

export default Users;
