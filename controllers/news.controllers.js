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
      const {count} = req.query; 
      let newsList;     
      
      if(parseInt(count) === 4){
        const keep = parseInt(count);
        newsList = await News.find().sort({ updatedAt: -1 }).limit(4);
      }
      else{
       newsList = await News.find({});       
      }

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