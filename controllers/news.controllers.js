const formidable = require("formidable");
const News = require("../models/News");
const { responseReturn } = require("../utils/response");
const cloudinary = require("cloudinary").v2;

class newsControllers {
  // Controller: Exam registration
  publish = async (req, res) => {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        responseReturn(res, 404, { error: "someting error" });
      } else {
        let { news_title, news_details, imp_date, imp_msg, exam_date } = fields;
        let { imageShow } = files;

        news_title = news_title[0];
        news_details = news_details[0];
        imp_date = imp_date[0];
        imp_msg = imp_msg[0];
        exam_date = exam_date[0];
        imageShow = imageShow[0];

        cloudinary.config({
          cloud_name: process.env.cloud_name,
          api_key: process.env.api_key,
          api_secret: process.env.api_secret,
          secure: true,
        });

        try {
          const result = await cloudinary.uploader.upload(imageShow.filepath, {
            folder: "dhruva_parishad",
          });

          const createNews = await News.create({
            news_title,
            news_details,
            imp_date,
            imp_msg,
            exam_date,
            imageShow: result.url,
          });
          responseReturn(res, 201, {
            message: "News successfully Posted",
          });
        } catch (error) {
          responseReturn(res, 500, { error: error.message });
        }
      }
    });
  };

  all_news = async (req, res) => {
    try {
      const count = parseInt(req.query.count);
      console.log(count)
      const newsList = await News.find().sort({ updatedAt: -1 }).limit(count);

      console.log(newsList)
      responseReturn(res, 201, {
        newsList,
        message: "News list loaded successfully",
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
}

module.exports = new newsControllers();
