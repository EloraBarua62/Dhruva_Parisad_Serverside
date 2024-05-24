const { Schema, model } = require("mongoose");

const newsSchema = new Schema(
  {
    news_title: {
      type: String,
      minLength: [3, "Atleast 3 charecter"],
      maxLength: [50, "Shorten product name"],
      required: true,
    },
    news_details: {
      type: String,
      required: true,
    },
    imp_date: {
      type: String,
      required: true,
    },
    imp_msg: {
      type: String,
      required: true,
    },
    imageShow: {
      type: String,
      trim: true,
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = model("News", newsSchema);