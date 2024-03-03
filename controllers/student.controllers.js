const Result = require("../models/Result");
const School = require("../models/School");
const Student = require("../models/Student");
const Zone = require("../models/Zone");
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
        const zone_info = await Zone.findOne({name: zone});
        const school_info = await School.findOne({ school_name: school, zone: zone });
        const total_student = await Student.countDocuments({
          school,
          zone
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


        const studentInfo = { id: createStudent._id ,roll, student_name, subjectYear, school};
        let writtenPractical= [];
        subjectYear.map((data,index) => writtenPractical.push({written: 0, practical: 0, total: 0, grade: "Null"}))
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

  // Controller: Fetch student's details
  details = async (req, res) => {
    console.log('elora')
    const studentInfo = await Student.find().sort({roll: 1});
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