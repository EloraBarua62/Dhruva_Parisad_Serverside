const { responseReturn } = require("../utils/response");

class newsControllers {
  // Controller: Exam registration
  publish = async (req, res) => {
    const {
      news_title,
      news_details,
      imageShow,
    } = req.body;

    try {
      const studentFound = await Student.findOne({ email });
      if (studentFound) {
        responseReturn(res, 404, {
          error: "You can not register for this exam multiple times",
        });
      } else {
        const zone_info = await Zone.findOne({ name: zone });
        const school_info = await School.findOne({
          school_name: school,
          zone: zone,
        });
        const total_student = await Student.countDocuments({
          school,
          zone,
        });
        // console.log(zone_info, school_info, total_student)
        const roll =
          (zone_info.code * 1000 + school_info.school_code) * 10000 +
          total_student +
          1;

        const createStudent = await Student.create({
          roll,
          student_name,
          father_name,
          mother_name,
          birth_date,
          phone_no,
          email,
          zone,
          school,
          imageShow,
          subjectYear,
        });

        const studentInfo = {
          id: createStudent._id,
          roll,
          student_name,
          subjectYear,
          school,
        };
        let writtenPractical = [];
        subjectYear.map((data, index) =>
          writtenPractical.push({
            written: 0,
            practical: 0,
            total: 0,
            grade: "Null",
          })
        );
        const studentResult = await Result.create({
          studentInfo,
          writtenPractical,
        });
        responseReturn(res, 201, {
          message: "Registration successfully completed",
        });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
}

module.exports = new newsControllers();