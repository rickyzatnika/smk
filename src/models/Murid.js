import mongoose from "mongoose";

const MuridSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    ttl: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    school: {
      type: String,
      required: true,
    },
    parentName: {
      type: String,
      required: true,
    },
    parentJob: {
      type: String,
      required: true,
    },
    // Mengubah menjadi array of strings
    img: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

mongoose.models = {};
const Murid = mongoose.model("Murid", MuridSchema);

export default Murid;
