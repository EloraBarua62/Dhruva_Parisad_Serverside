const News = require("../models/News");
const { responseReturn } = require("../utils/response");

class newsControllers {
  // Controller: Exam registration
  publish = async (req, res) => {
    try {
      const { news_title, news_details, imageShow } = req.body;
      const createNews = await News.create({
        news_title,
        news_details,
        imageShow,
      });
      // console.log(news_title, news_details);
      responseReturn(res, 201, {
        message: "News successfully Posted",
      });
      // console.log(createNews)
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  all_news = async (req, res) => {
    try {
      const newsList = await News.find({});
      // console.log(newsList);
      responseReturn(res, 201, {
        newsList,
        message: "News list loaded successfully",
      });
      // console.log(createNews)
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
}

module.exports = new newsControllers();