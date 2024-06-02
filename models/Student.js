const { Schema, model } = require("mongoose");
const studentControllers = require("../controllers/student.controllers");

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
    last_registration_year: {
      type: Number,
      required: true,
      default: new Date().getFullYear(),
    },
    imageShow: {
      type: String,
      trim: true,
      required: true,
    },
    payment: {
      type: String,
      enum: ["Paid", "Unpaid"],
      default: "Unpaid",
    },
  },
  { timestamps: true }
);

studentSchema.index({
  student_name: 'text'
})

module.exports = model("Student", studentSchema);