const formidable = require("formidable");
const News = require("../models/News");
const { responseReturn } = require("../utils/response");
const ExamResultDate = require("../models/ExamResultDate");
const cloudinary = require("cloudinary").v2;

class newsControllers {
  // Controller: Exam registration
  publish = async (req, res) => {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        responseReturn(res, 404, { error: "someting error" });
      } else {
        let { news_title, news_details, imp_date, imp_msg } = fields;
        let { imageShow } = files;
        news_title = news_title[0];
        news_details = news_details[0];
        imp_date = imp_date[0];
        imp_msg = imp_msg[0];
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
            imageShow: result.url,
          });
          responseReturn(res, 201, {
            message: "News Posted successfully ",
          });
        } catch (error) {
          responseReturn(res, 500, { error: error.message });
        }
      }
    });
  };

  // News display for all user
  all_news = async (req, res) => {
    try {
      const count = parseInt(req.query.count);
      const id = process.env.exam_result_date;
      const newsList = await News.find().sort({ updatedAt: -1 }).limit(count);
      const date = await ExamResultDate.findOne({_id: id});
      console.log(date.result_date)

      responseReturn(res, 201, {
        newsList,
        important_date: { exam_date: date.exam_date, result_date: date.result_date},
        message: "News list loaded successfully",
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  // News display for admin
  admin_display = async (req, res) => {
    const { page, parPage } = req.query;
    const skipPage = parseInt(parPage) * (parseInt(page) - 1);
    try {
      const adminNewsList = await News.find()
        .skip(skipPage)
        .limit(parPage)
        .sort({ updatedAt: -1 });

      const totalData = await News.countDocuments();

      responseReturn(res, 201, {
        adminNewsList,
        totalData,
        message: "News list loaded successfully",
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  // Controller: Update info
  update_info = async (req, res) => {
    const id = req.params.id;
    const data = req.body;

    try {
      const newsFound = await News.updateOne({ _id: id }, { $set: data });
      responseReturn(res, 201, {
        newsFound,
        message: "News updated successfully",
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  // Controller: Delete Info
  delete_info = async (req, res) => {
    const id = req.params.id;
    try {
      const deleteNewsInfo = await News.deleteOne({ _id: id });

      if (deleteNewsInfo.deletedCount == 1) {
        responseReturn(res, 201, {
          message: "News details deleted successfully",
        });
      } else {
        responseReturn(res, 500, { error: error.message });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  // Controller: Update Exam and Result info
  exam_result = async (req, res) => {
    const id = process.env.exam_result_date;
    console.log(id)
    const data = req.body;

    try {
      const dateUpdated = await ExamResultDate.updateOne({ _id: id }, { $set: data });
      responseReturn(res, 201, {
        dateUpdated,
        message: "Date updated successfully",
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
}

module.exports = new newsControllers();
