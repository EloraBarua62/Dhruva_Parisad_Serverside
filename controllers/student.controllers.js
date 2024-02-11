const Student = require("../models/Student");
const { responseReturn } = require("../utils/response");

class studentControllers {
  // Controller: Exam registration
  registration = async (req, res) => {
    const {
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
    } = req.body;

    try {
      const studentFound = await Student.findOne({ email });
      if (studentFound) {
        responseReturn(res, 404, {
          error: "You can not register for this exam multiple times",
        });
      } else {
        const createStudent = await Student.create({
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

        responseReturn(res, 201, {
          message: "Registration successfully completed",
        });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  // Controller: Fetch student's details
  details = async (req, res) => {
    console.log('elora')
    const studentInfo = await Student.find({});
    console.log(studentInfo)
    try {
        responseReturn(res, 201, {
          studentInfo,
          message: "Students info loaded successfully",
        });
    } catch (error) {
        responseReturn(res, 500, { error: error.message });
    }
  }
}

module.exports = new studentControllers();