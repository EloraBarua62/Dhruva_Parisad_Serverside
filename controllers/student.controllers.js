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
  // Controller: Exam registration for new student
  new_registration = async (req, res) => {
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
          const result = await cloudinary.uploader.upload(imageShow.filepath, {
            folder: "dhruva_parishad",
          });

          const zone_info = await Zone.findOne({ name: zone });
          const school_info = await School.findOne({
            school_name: school,
            zone: zone,
          });

          const total_student = await Student.countDocuments({
            school,
            zone,
          });

          const year = new Date().getFullYear();
          const roll =
            ((year % 1000) * 10000 + school_info.school_code) * 1000 +
            total_student +
            1;
          const createStudent = await Student.create({
            roll,
            student_name,
            father_name,
            mother_name,
            birth_date,
            phone_no,
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
        } catch (error) {
          responseReturn(res, 500, { error: 'Internal Server Error' });
        }
      }
    });
  };

  // Controller: Update exam registration for previous student
  previous_registration = async (req, res) => {
    const roll = req.params.roll;
    const { zone, school, subjectYear } = req.body;

    try {
      // Searching if this student exist,
      // if yes, then registration info update,
      // else, student should complete new registration
      const student_found = await Student.findOne({ roll: roll });
      if (student_found) {
        // Searching school info to update
        const school_info = await School.findOne({
          school_name: school,
          zone: zone,
        });

        // Searching how much student complete registration process current year
        const year = new Date().getFullYear();
        const current_year_student = await Student.countDocuments({
          zone,
          school,
          last_registration_year: year,
        });

        // Generating new roll depending on current year
        const { school_code } = school_info;
        const new_roll =
          ((year % 1000) * 10000 + school_code) * 1000 +
          current_year_student +
          1;

        // Update student info
        const student_info_updated = await Student.updateOne(
          { _id: student_found._id },
          {
            $set: {
              roll: new_roll,
              zone,
              school,
              school_code,
              subjectYear,
              last_registration_year: year,
              payment: "Unpaid",
            },
          }
        );

        // Checking if student info updated or not,
        // IF yes, result data of that student will be updated
        if (student_info_updated.modifiedCount == 1) {
          const result_info_found = await Result.findOne({
            "studentInfo.id": student_found._id,
          });

          // Keep student info from Result
          let keep_result_data = {
            ...result_info_found.studentInfo,
          };
          keep_result_data = {
            ...keep_result_data,
            subjectYear,
            roll: new_roll,
            school_code,
          };

          // Generate new written practical array for updated result
          let keepWrittenPractical = [];
          subjectYear.map((data, index) =>
            keepWrittenPractical.push({
              written: 0,
              practical: 0,
              total: 0,
              letter_grade: "Null",
              grade_point: 0,
            })
          );

          const result_info_updated = await Result.updateOne(
            { _id: result_info_found._id },
            {
              $set: {
                studentInfo: keep_result_data,
                writtenPractical: keepWrittenPractical,
                averageLetterGrade: "Null",
                averageGradePoint: 0,
                resultStatus: "Running",
              },
            }
          );

          const id = process.env.exam_result_date;
          const dateInfo = await ExamResultDate.findOne({
            _id: id,
          });

          const student_data = {
            student_name: student_found.student_name,
            father_name: student_found.father_name,
            mother_name: student_found.mother_name,
            imageShow: student_found.imageShow,
            roll: new_roll,
            school,
            subjectYear,
          };

          if (result_info_updated.modifiedCount == 1) {
            responseReturn(res, 201, {
              exam_date: dateInfo.exam_date,
              studentDetail: student_data,
              message: "Registration successfully completed",
            });
          } else {
            responseReturn(res, 400, {
              error: "Result didn't update properly",
            });
          }
        } else {
          responseReturn(res, 400, {
            error: "Student info didn't update properly",
          });
        }
      } else {
        responseReturn(res, 400, {
          error:
            "Sorry, your roll number not found. Please register as a new student",
        });
      }
    } catch (error) {
      responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  // Controller: Fetch student's details
  details = async (req, res) => {
    const { page, searchValue, searchNumber, parPage } = req.query;
    const skipPage = parseInt(parPage) * (parseInt(page) - 1);

    try {
      var studentInfo;
      const search_number = parseInt(searchNumber);

      if (searchValue.length > 0) {
        if (search_number > 0) {
          studentInfo = await Student.find({
            $text: { $search: searchValue },
            roll: search_number,
          });
        } else {
          studentInfo = await Student.find({
            $text: { $search: searchValue },
          })
            .skip(skipPage)
            .limit(parPage)
            .sort({ roll: 1 });
        }
      } else if (search_number != 0) {
        studentInfo = await Student.find({
          roll: search_number,
        });
      } else {
        studentInfo = await Student.find()
          .skip(skipPage)
          .limit(parPage)
          .sort({ roll: 1 });
      }

      const totalData = await Student.countDocuments();
      responseReturn(res, 201, {
        studentInfo,
        totalData,
        message: "Students info loaded successfully",
      });
    } catch (error) {
      responseReturn(res, 500, { error: "Internal Server Error" });
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
      responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  // Controller: Delete Info
  delete_info = async (req, res) => {
    const id = req.params.id;
    try {
      const deleteStudentInfo = await Student.deleteOne({ _id: id });
      const deleteStudentResult = await Result.deleteOne({
        "studentInfo.id": id,
      });

      if (
        deleteStudentInfo.deletedCount == 1 &&
        deleteStudentResult.deletedCount == 1
      ) {
        responseReturn(res, 201, {
          message: "Student info deleted successfully",
        });
      } else {
        responseReturn(res, 400, { error: "Failed to delete" });
      }
    } catch (error) {
      responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };
}

module.exports = new studentControllers();
