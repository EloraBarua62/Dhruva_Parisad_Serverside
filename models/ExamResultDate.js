const { Schema, model } = require("mongoose");

const examResultDateSchema = new Schema(
  {
    exam_date: {
      type: String,
      default: "",
    },
    result_date: {
      type: String,
      default: "",
    }
  },
  { timestamps: true }
);

module.exports = model("ExamResultDate", examResultDateSchema);