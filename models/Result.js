const { Schema, model, default: mongoose } = require("mongoose");
const {ObjectId} = mongoose.Schema.Types;

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
      school: {
        type: String,
        required: true,
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
        grade: {
            type: String,
            default: "Null"
        },
        excellence: {
          type: Array,
          default: [],
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Result", resultSchema);