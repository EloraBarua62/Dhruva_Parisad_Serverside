const Result = require("../models/Result");
const School = require("../models/School");
const Student = require("../models/Student");
const Zone = require("../models/Zone");
const formidable = require("formidable");
const { responseReturn } = require("../utils/response");
const News = require("../models/News");
const ExamResultDate = require("../models/ExamResultDate");
const cloudinary = require("cloudinary").v2;
// const mongoose = require("mongoose");

class studentControllers {
  // Controller: Exam registration
  registration = async (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        responseReturn(res, 404, { error: "someting error" });
      } else {
        let {
          student_name,
          father_name,
          mother_name,
          birth_date,
          phone_no,
          email,
          zone,
          school,
          subjectYear,
        } = fields;

        let { imageShow } = files;

        student_name = student_name[0];
        father_name = father_name[0];
        mother_name = mother_name[0];
        birth_date = birth_date[0];
        phone_no = phone_no[0];
        email = email[0];
        zone = zone[0];
        school = school[0];
        subjectYear = JSON.parse(subjectYear);
        imageShow = imageShow[0];

        cloudinary.config({
          cloud_name: process.env.cloud_name,
          api_key: process.env.api_key,
          api_secret: process.env.api_secret,
          secure: true,
        });
        try {
          const studentFound = await Student.findOne({ email });
          if (studentFound) {
            responseReturn(res, 404, {
              error: "You can not register for this exam multiple times",
            });
          } else {
            const result = await cloudinary.uploader.upload(
              imageShow.filepath,
              {
                folder: "dhruva_parishad",
              }
            );

            console.log(result);
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
              school_code: school_info.school_code,
              imageShow: result.url,
              subjectYear,
            });

            const studentInfo = {
              id: createStudent._id,
              roll,
              student_name,
              subjectYear,
              email,
              school_code: school_info.school_code,
            };
            let writtenPractical = [];
            subjectYear.map((data, index) =>
              writtenPractical.push({
                written: 0,
                practical: 0,
                total: 0,
                letter_grade: "Null",
                grade_point: 0,
              })
            );
            const studentResult = await Result.create({
              studentInfo,
              writtenPractical,
            });

            const id = process.env.exam_result_date;
              
            const dateInfo = await ExamResultDate.findOne({
              _id: id,
            });
            responseReturn(res, 201, {
              exam_date: dateInfo.exam_date,
              studentDetail: createStudent,
              message: "Registration successfully completed",
            });
          }
        } catch (error) {
          responseReturn(res, 500, { error: error.message });
        }
      }
    });
  };

  // Controller: Fetch student's details
  details = async (req, res) => {
    const { page, parPage } = req.query;
    const skipPage = parseInt(parPage) * (parseInt(page) - 1);

    try {
      const studentInfo = await Student.find()
        .skip(skipPage)
        .limit(parPage)
        .sort({ roll: 1 });

      const totalData = await Student.countDocuments();

      responseReturn(res, 201, {
        studentInfo,
        totalData,
        message: "Students info loaded successfully",
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  // Controller: Update info
  update_info = async (req, res) => {
    const id = req.params.id;
    const data = req.body;

    try {
      const studentFound = await Student.updateOne({ _id: id }, { $set: data });
      responseReturn(res, 201, {
        studentFound,
        message: "Student info updated successfully",
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  
  // Controller: Delete Info
  delete_info = async (req, res) => {
    const id = req.params.id;
    try {
      const deleteStudentInfo = await Student.deleteOne({ _id: id });
      const deleteStudentResult = await Result.deleteOne({
        "studentInfo.id": id
      });
      
      if (
        deleteStudentInfo.deletedCount == 1 &&
        deleteStudentResult.deletedCount == 1
      ) {
        responseReturn(res, 201, {
          message: "Student info deleted successfully",
        });
      } else {
        responseReturn(res, 500, { error: error.message });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
}

module.exports = new studentControllers();
