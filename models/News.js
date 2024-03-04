const { Schema, model } = require("mongoose");

const newsSchema = new Schema(
  {
    news_details: {
      type: String,
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

module.exports = model("News", newsSchema);