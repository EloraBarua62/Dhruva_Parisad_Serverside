const Result = require("../models/Result");
const { responseReturn } = require("../utils/response");

class resultControllers {
  // Controller: Exam result display
  display = async (req, res) => {
    try {
      const resultList = await Result.find({});
      const resultInfo = [];
      resultList.forEach((element) => {
        let { studentInfo, writtenPractical, _id } = element;
        let { id, roll, ...otherInfo } = studentInfo;
        studentInfo = { ...otherInfo, roll };
        console.log(otherInfo, roll,id)
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
        // for (let index = 0; index < writtenPractical.length; index++) {
        //   const { written, practical, total, grade, excellence } =
        //     writtenPractical[index];
        //   updatedResult.push({
        //     written,
        //     practical,
        //     total,
        //     grade,
        //     excellence,
        //   });
        // }
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

  result_update = async (req, res) => {
    const id = req.params.id;
    const { writtenPractical } = req.body;
    let array = writtenPractical;

    // console.log(writtenPractical);

    for (let index = 0; index < array.length; index++) {
      let obj = array[index];
      let value = obj.written + obj.practical;
      obj = { ...obj, total: value };
      array[index] = obj;
      // console.log(obj);
      // obj.total = obj.written + obj.practical;
    }

    // console.log(writtenPractical);
    // writtenPractical = writtenPractical.map((each,idx) => {...each, (total: each.written+ each.practical)});
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
      console.log(updatedResult);
      responseReturn(res, 201, {
        updatedResult,
        message: "Result data updated successfully",
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

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
