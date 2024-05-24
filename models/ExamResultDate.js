const { Schema, model } = require("mongoose");

const examResultDateSchema = new Schema(
  {
    exam_date: {
      type: Date,
      trim: true,
      required: true,
    },
    result_date: {
      type: Date,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("ExamResultDate", examResultDateSchema);