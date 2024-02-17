const {Schema, model} = require("mongoose");
const validator = require("validator");

const userSchema = new Schema(
  {
    // Field: Name
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
      required: true,
    },
    password: {
      type: String,
      validate: {
        validator: (value) => {
          validator.isStrongPassword(value, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          });
        },
        message: "Please provide a strong password",
      },
      required: true,
      select: false,
    },
    image: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["student", "principal", "admin"],
      default: "student",
    },
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);