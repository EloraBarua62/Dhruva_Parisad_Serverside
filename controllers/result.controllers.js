const Result = require("../models/Result");
const School = require("../models/School");
const { responseReturn } = require("../utils/response");
const jwt = require("jsonwebtoken");

class resultControllers {
  // Controller: Exam result display
  display = async (req, res) => {
    try {
      const resultList = await Result.find().sort({ "studentInfo.roll": 1 });
      const resultInfo = [];
      resultList.forEach((element) => {
        let { studentInfo, writtenPractical, _id } = element;
        let { id, roll, ...otherInfo } = studentInfo;
        studentInfo = { ...otherInfo, roll };

        // const {roll, student_name, school, subjectYear} = studentInfo;

        const updatedResult = [];
        writtenPractical.forEach((marks) => {
          const { written, practical, total, grade, excellence } = marks;
          updatedResult.push({
            written,
            practical,
            total,
            grade,
            excellence,
          });
        });
        writtenPractical = [...updatedResult];
        resultInfo.push({ studentInfo, writtenPractical, _id });
      });
      responseReturn(res, 201, {
        resultInfo,
        message: "Result data loaded successfully",
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  school_result_display = async (req, res) => {
    const token = req?.cookies?.accessToken;
    const data = jwt.verify(token, process.env.SECRET_KEY);
    const email = data.email;
    const school_code = parseInt(req.params.code);

    try {
      const schoolFound = await School.findOne({ school_code });
      if (!schoolFound) {
        responseReturn(res, 400, {
          error: "School Code is incorrect",
        });
      } else if (schoolFound && schoolFound?.principalInfo?.email !== email) {
        responseReturn(res, 400, {
          error: "Your are not permitted to access the result",
        });
      } else {
        const resultInfo = await Result.find({
          "studentInfo.school_code": school_code,
        }).sort({ "studentInfo.roll": 1 });
        responseReturn(res, 201, {
          resultInfo,
          message: "Result data loaded successfully",
        });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  student_result_display = async (req, res) => {
    const token = req?.cookies?.accessToken;
    const data = jwt.verify(token, process.env.SECRET_KEY);
    const email = data.email;
    const roll = parseInt(req.params.roll);

    try {
      const studentResultInfo = await Result.findOne({
        "studentInfo.email": email,
        "studentInfo.roll": roll,
      });

      console.log(studentResultInfo)
      if (studentResultInfo) {
        responseReturn(res, 201, {
          studentResultInfo,
          message: "Result data loaded successfully",
        });
      } else {
        responseReturn(res, 400, {
          error: "Your student roll is incorrect, Try again",
        });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  result_update = async (req, res) => {
    const id = req.params.id;
    const { writtenPractical } = req.body;
    let array = writtenPractical;

    for (let index = 0; index < array.length; index++) {
      let obj = array[index];
      let value = obj.written + obj.practical;
      obj = { ...obj, total: value };
      array[index] = obj;
    }

    try {
      const resultUpdate = await Result.updateOne(
        { _id: id },
        { $set: { writtenPractical: array } }
      );
      // console.log(resultUpdate);
      const resultInfo = await Result.findOne({ _id: id });
      const result = resultInfo.writtenPractical;
      const updatedResult = [];
      for (let index = 0; index < result.length; index++) {
        const { written, practical, total, grade, excellence } = result[index];
        updatedResult.push({ written, practical, total, grade, excellence });
      }

      responseReturn(res, 201, {
        updatedResult,
        message: "Result data updated successfully",
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
}

module.exports = new resultControllers();
