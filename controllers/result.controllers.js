const Result = require("../models/Result");
const { responseReturn } = require("../utils/response");

class resultControllers {
  // Controller: Exam result display
  display = async (req, res) => {
    
    try {
      const resultInfo = await Result.find({});
        console.log(resultInfo);
        responseReturn(res, 201, {resultInfo,
          message: "Result data loaded successfully",
        });
      
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  result_update = async(req, res) => {
    console.log(req.body)
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
