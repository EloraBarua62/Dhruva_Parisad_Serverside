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
    const writtenPractical = req.body;
    console.log(writtenPractical)
    try {
      const resultUpdate = await Result.updateOne({_id: id},{$set: {writtenPractical: writtenPractical}});
      console.log(resultUpdate);
      const resultInfo = await Result.find({});
      responseReturn(res, 201, {
        resultInfo: resultInfo,
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
