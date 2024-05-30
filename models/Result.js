const { Schema, model, default: mongoose } = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const resultSchema = new Schema(
  {
    studentInfo: {
      student_name: {
        type: String,
        required: true,
      },
      subjectYear: {
        type: Array,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      school_code: {
        type: Number,
        required: true,
      },
      roll: {
        type: Number,
        required: true,
        unique: true,
      },
      id: {
        type: ObjectId,
        ref: "Student",
        required: true,
      },
    },
    writtenPractical: [
      {
        written: {
          type: Number,
          required: true,
          default: 0,
        },
        practical: {
          type: Number,
          required: true,
          default: 0,
        },
        total: {
          type: Number,
          required: true,
          default: 0,
        },
        letter_grade: {
          type: String,
          default: "Null",
        },
        grade_point: {
          type: Number,
          default: 0,
        },
      },
    ],
    averageLetterGrade: {
      type: String,
      default: "Null",
    },
    averageGradePoint: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = model("Result", resultSchema);
