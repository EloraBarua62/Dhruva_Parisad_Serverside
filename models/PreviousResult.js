const { Schema, model, default: mongoose } = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const previousResultSchema = new Schema(
  {
    personalInfo: {
      id: {
        type: ObjectId,
        ref: "Student",
        required: true,
      },
      email: {
        type: String,
        trim: true,
        required: true,
      },
      student_name: {
        type: String,
        required: true,
      },
      father_name: {
        type: String,
        required: true,
      },
      mother_name: {
        type: String,
        required: true,
      },
    },
    result: {
      type: Object,
      required: true,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = model("previousResult", previousResultSchema);