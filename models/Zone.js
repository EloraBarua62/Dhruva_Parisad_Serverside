const { Schema, model } = require("mongoose");

const zoneSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: Number,
      required: true,
    },
    co_ordinator: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone_no: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = model("Zone", zoneSchema);
