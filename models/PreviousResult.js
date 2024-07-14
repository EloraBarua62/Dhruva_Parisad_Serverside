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
      school: {
        type: String,
        trim: true,
        required: true,
      },
      school_code: {
        type: Number,
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

previousResultSchema.index({
  student_name: 'text'
});

module.exports = model("previousResult", previousResultSchema);