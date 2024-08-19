import mongoose from "mongoose";

const ClassItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    price: {
      type: Number,
    },
  },
  {
    _id: false,
  }
);

const RaceClassesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    classes: {
      type: [ClassItemSchema],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

mongoose.models = {};
const RaceClasses = mongoose.model("RaceClasses", RaceClassesSchema);

export default RaceClasses;
