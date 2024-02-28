const Result = require("../models/Result");
const { responseReturn } = require("../utils/response");

class resultControllers {
  // Controller: Exam result display
  display = async (req, res) => {    
    try {
      const resultInfo = await Result.find({});
        // console.log(resultInfo);
        responseReturn(res, 201, {resultInfo,
          message: "Result data loaded successfully",
        });
      
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  result_update = async(req, res) => {
    const id = req.params.id;
    const {writtenPractical} = req.body;
    let array = writtenPractical;
    
    console.log(writtenPractical);
    
    for (let index = 0; index < array.length; index++) {
      let obj = array[index];
      let value = obj.written+ obj.practical;
      obj = {...obj, total: value};
      array[index] = obj;
      console.log(obj);
      // obj.total = obj.written + obj.practical;
    };
    
    // console.log(writtenPractical);
    // writtenPractical = writtenPractical.map((each,idx) => {...each, (total: each.written+ each.practical)});
    try {
      const resultUpdate = await Result.updateOne({_id: id},{$set: {writtenPractical: array}});
      // console.log(resultUpdate);
      // const resultInfo = await Result.find({});
      responseReturn(res, 201, {
        message: "Result data updated successfully",
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  }

  // Controller: Fetch student's details
//   details = async (req, res) => {
//     console.log("elora");
//     const studentInfo = await Student.find({});
//     console.log(studentInfo);
//     try {
//       responseReturn(res, 201, {
//         studentInfo,
//         message: "Students info loaded successfully",
//       });
//     } catch (error) {
//       responseReturn(res, 500, { error: error.message });
//     }
//   };
}

module.exports = new resultControllers();
