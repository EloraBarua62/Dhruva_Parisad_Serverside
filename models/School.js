const { Schema, model, default: mongoose } = require("mongoose");
const validator = require("validator");

const schoolSchema = new Schema(
  {
    school_name: {
      type: String,
      required: true,
    },
    zone: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    registration_no: {
      type: String,
      required: true,
    },
    school_code: {
      type: Number,
      required: true,
    },
    phone_no: {
      type: String,
      required: true,
    },
    principalInfo: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"],
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "blocked"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = model("School", schoolSchema);
