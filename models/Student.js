const { Schema, model } = require("mongoose");

const studentSchema = new Schema(
  {
    roll: {
      type: Number,
      required: true,
      unique: true,
    },
    student_name: {
      type: String,
      trim: true,
      required: true,
    },
    father_name: {
      type: String,
      trim: true,
      required: true,
    },
    mother_name: {
      type: String,
      trim: true,
      required: true,
    },
    birth_date: {
      type: Date,
      trim: true,
      required: true,
    },
    phone_no: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
    },
    zone: {
      type: String,
      trim: true,
      required: true,
    },
    school: {
      type: String,
      trim: true,
      required: true,
    },
    school_code: {
      type: Number,
      required: true,
    },
    subjectYear: {
      type: Array,
      trim: true,
      required: true,
    },
    imageShow: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Student", studentSchema);