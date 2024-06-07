const PreviousResult = require("../models/PreviousResult");
const Result = require("../models/Result");
const School = require("../models/School");
const Student = require("../models/Student");
const { responseReturn } = require("../utils/response");
const jwt = require("jsonwebtoken");

class resultControllers {
  // Controller: Exam result display
  display = async (req, res) => {
    const { page, parPage } = req.query;
    const skipPage = parseInt(parPage) * (parseInt(page) - 1);
    try {
      const resultList = await Result.find()
        .skip(skipPage)
        .limit(parPage)
        .sort({ "studentInfo.roll": 1 });

      const resultInfo = [];

      // Extracting all data
      resultList.forEach((element) => {
        let {
          studentInfo,
          writtenPractical,
          _id,
          averageLetterGrade,
          averageGradePoint,
          resultStatus,
        } = element;
        let { id, roll, ...otherInfo } = studentInfo;
        studentInfo = { ...otherInfo, id, roll };

        // Updating written praitcal number
        const updatedResult = [];
        writtenPractical.forEach((marks) => {
          const { written, practical, total, letter_grade, grade_point } =
            marks;
          updatedResult.push({
            written,
            practical,
            total,
            letter_grade,
            grade_point,
          });
        });
        writtenPractical = [...updatedResult];
        resultInfo.push({
          studentInfo,
          writtenPractical,
          _id,
          averageLetterGrade,
          averageGradePoint,
          resultStatus,
        });
      });

      // Count total number of result/student
      const totalData = await Result.countDocuments();
      responseReturn(res, 201, {
        resultInfo,
        totalData,
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

        if (resultInfo.length > 0) {
          responseReturn(res, 201, {
            resultInfo,
            message: "Result data loaded successfully",
          });
        } else {
          responseReturn(res, 400, {
            error: "No student is registered",
          });
        }
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

      // Extracting personal details
      const personalInfo = await Student.findOne({
        email: email,
        roll: roll,
      });
      const studentPersonalInfo = {
        father_name: personalInfo?.father_name,
        mother_name: personalInfo?.mother_name,
      };

      if (studentResultInfo) {
        responseReturn(res, 201, {
          studentResultInfo,
          studentPersonalInfo,
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
    let keep_written_practical_array = writtenPractical;

    // Marking system
    const total_exam_marks = [
      ["Rhyme", "Primary", 250],
      ["Patriotic Song", "Primary", 250],
      ["Rabindra Sangeet", "First", 250],
      ["Rabindra Sangeet", "Second", 350],
      ["Rabindra Sangeet", "Third", 420],
      ["Rabindra Sangeet", "Forth", 450],
      ["Rabindra Sangeet", "Fifth", 550],
      ["Rabindra Sangeet", "Sixth", 700],
      ["Rabindra Sangeet", "Seventh", 700],
      ["Rabindra Sangeet", "Eighth", 1000],
      ["Rabindra Sangeet", "Ninth", 1000],
      ["Nazrul Sangeet", "First", 250],
      ["Nazrul Sangeet", "Second", 350],
      ["Nazrul Sangeet", "Third", 420],
      ["Nazrul Sangeet", "Forth", 450],
      ["Nazrul Sangeet", "Fifth", 550],
      ["Nazrul Sangeet", "Sixth", 700],
      ["Nazrul Sangeet", "Seventh", 700],
      ["Nazrul Sangeet", "Eighth", 1000],
      ["Nazrul Sangeet", "Ninth", 1000],
      ["Folk Song", "First", 250],
      ["Folk Song", "Second", 350],
      ["Folk Song", "Third", 420],
      ["Folk Song", "Forth", 450],
      ["Folk Song", "Fifth", 550],
      ["Folk Song", "Sixth", 700],
      ["Folk Song", "Seventh", 700],
      ["Folk Song", "Eighth", 1000],
      ["Folk Song", "Ninth", 1000],
      ["Classical Music", "First", 250],
      ["Classical Music", "Second", 300],
      ["Classical Music", "Third", 350],
      ["Classical Music", "Forth", 550],
      ["Classical Music", "Fifth", 550],
      ["Classical Music", "Sixth", 700],
      ["Classical Music", "Seventh", 700],
      ["Classical Music", "Eighth", 1000],
      ["Classical Music", "Ninth", 1000],
      ["Recitation(Abrtti)", "First", 100],
      ["Recitation(Abrtti)", "Second", 100],
      ["Recitation(Abrtti)", "Third", 300],
      ["Recitation(Abrtti)", "Forth", 400],
      ["Recitation(Abrtti)", "Fifth", 300],
      ["Recitation(Abrtti)", "Sixth", 500],
      ["Recitation(Abrtti)", "Seventh", 500],
      ["Recitation(Abrtti)", "Eighth", 700],
      ["Recitation(Abrtti)", "Ninth", 700],
      ["Tabla", "First", 250],
      ["Tabla", "Second", 300],
      ["Tabla", "Third", 350],
      ["Tabla", "Forth", 550],
      ["Tabla", "Fifth", 550],
      ["Tabla", "Sixth", 700],
      ["Tabla", "Seventh", 700],
      ["Tabla", "Eighth", 800],
      ["Tabla", "Ninth", 1100],
      ["Dance", "First", 250],
      ["Dance", "Second", 300],
      ["Dance", "Third", 350],
      ["Dance", "Forth", 550],
      ["Dance", "Fifth", 550],
      ["Dance", "Sixth", 700],
      ["Dance", "Seventh", 700],
      ["Dance", "Eighth", 1000],
      ["Dance", "Ninth", 1000],
      ["Fine Arts", "First", 100],
      ["Fine Arts", "Second", 200],
      ["Fine Arts", "Third", 350],
      ["Fine Arts", "Forth", 500],
      ["Fine Arts", "Fifth", 550],
      ["Fine Arts", "Sixth", 600],
      ["Fine Arts", "Seventh", 600],
      ["Fine Arts", "Eighth", 750],
      ["Fine Arts", "Ninth", 900],
    ];

    try {
      // Find result and student info
      const resultInfo = await Result.findOne({ _id: id });

      // Subject and year of a specific student
      const sub_year = [...resultInfo.studentInfo.subjectYear];
      const sub_year_size = sub_year.length;
      var final_letter_grade = "F",
        final_grade_point = 0;

      // Update total marks, letter grade, grade point
      for (let i = 0; i < sub_year_size; i++) {
        let obj = keep_written_practical_array[i];
        const value = obj.written + obj.practical;
        var each_total_marks = 0,
          each_letter_grade = "Null",
          each_grade_point = 0;

        // Match the actual Subject & year with total_exam_marks keep_written_practical_array
        for (let j = 0; j < 74; j++) {
          if (
            sub_year[i].subject === total_exam_marks[j][0] &&
            sub_year[i].year === total_exam_marks[j][1]
          ) {
            each_total_marks = parseInt((value * 100) / total_exam_marks[j][2]);
            break;
          }
        }

        // letter grading and grading system distribution
        if (each_total_marks >= 80 && each_total_marks <= 100) {
          each_letter_grade = "A+";
          each_grade_point = 5;
        } 
        else if (each_total_marks >= 70 && each_total_marks <= 79) {
          each_letter_grade = "A";
          each_grade_point = 4;
        } 
        else if (each_total_marks >= 60 && each_total_marks <= 69) {
          each_letter_grade = "A-";
          each_grade_point = 3.5;
        } else if (each_total_marks >= 50 && each_total_marks <= 59) {
          each_letter_grade = "B";
          each_grade_point = 3;
        } else if (each_total_marks >= 40 && each_total_marks <= 49) {
          each_letter_grade = "C";
          each_grade_point = 2;
        } else if (each_total_marks >= 33 && each_total_marks <= 39) {
          each_letter_grade = "D";
          each_grade_point = 1;
        } else if (each_total_marks < 33) {
          each_letter_grade = "F";
          each_grade_point = 0;
        }

        final_grade_point += each_grade_point;
        obj = {
          ...obj,
          total: value,
          letter_grade: each_letter_grade,
          grade_point: each_grade_point,
        };
        keep_written_practical_array[i] = obj;
      }

      // Final letter grading and grading point distribution
      final_grade_point = parseFloat(final_grade_point / sub_year_size).toFixed(
        1
      );

      if (final_grade_point < 4 && final_grade_point >= 3.5) {
        final_letter_grade = "A-";
        final_grade_point = 3.5;
      }

      final_grade_point = parseInt(final_grade_point);

      if (final_grade_point == 5) {
        final_letter_grade = "A+";
      } else if (final_grade_point == 4) {
        final_letter_grade = "A";
      } else if (final_grade_point == 3) {
        final_letter_grade = "B";
      } else if (final_grade_point == 2) {
        final_letter_grade = "C";
      } else if (final_grade_point == 1) {
        final_letter_grade = "D";
      } else if (final_grade_point == 0) {
        final_letter_grade = "F";
      }

      const resultUpdate = await Result.updateOne(
        { _id: id },
        {
          $set: {
            writtenPractical: keep_written_practical_array,
            averageLetterGrade: final_letter_grade,
            averageGradePoint: final_grade_point,
          },
        }
      );

      const result = keep_written_practical_array;
      const updatedResult = [];
      for (let index = 0; index < result.length; index++) {
        const { written, practical, total, letter_grade, grade_point } =
          result[index];
        updatedResult.push({
          written,
          practical,
          total,
          letter_grade,
          grade_point,
        });
      }

      responseReturn(res, 201, {
        updatedResult,
        final_letter_grade,
        final_grade_point,
        message: "Result data updated successfully",
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  previous_result = async (req, res) => {
    const { id } = req.body;
    try {
      const studentFound = await Student.findOne({ _id: id });
      const resultFound = await Result.findOne({ "studentInfo.id": id });
      const previousResultFound = await PreviousResult.findOne({
        "personalInfo.id": id,
      });

      if (previousResultFound) {
        let keep_result = { ...previousResultFound.result };
        const year = new Date().getFullYear() + "";
        const result_history = [
          {
            roll: studentFound.roll,
            averageLetterGrade: resultFound.averageLetterGrade,
            averageGradePoint: resultFound.averageGradePoint,
          },
          ...overall_result,
        ];
        keep_result = {
          ...keep_result,
          [year]: result_history,
        };
        console.log(result_history);
        console.log(keep_result);
        const previousResultUpdate = await PreviousResult.updateOne(
          {
            _id: previousResultFound._id,
          },
          {
            $set: {
              result: keep_result,
            },
          }
        );

        if (previousResultUpdate) {
          responseReturn(res, 201, {
            message: "Data updated successfully",
          });
        } else {
          responseReturn(res, 400, {
            message: "Sorry, Data updation failed",
          });
        }
      } else {
        const student_personal_info = {
          id,
          email: studentFound.email,
          student_name: studentFound.student_name,
          father_name: studentFound.father_name,
          mother_name: studentFound.mother_name,
        };

        const year = new Date().getFullYear() + "";

        const { subjectYear } = resultFound.studentInfo;
        let written_practical = [...resultFound.writtenPractical];
        const size = written_practical.length;

        const result_history = {
          [year]: [
            {
              roll: studentFound.roll,
              averageLetterGrade: resultFound.averageLetterGrade,
              averageGradePoint: resultFound.averageGradePoint,
            },
          ],
        };

        for (let i = 0; i < size; i++) {
          let { written, practical, total, letter_grade, grade_point } =
            written_practical[i];
          let obj = {
            subject: subjectYear[i].subject,
            year: subjectYear[i].year,
            written,
            practical,
            total,
            letter_grade,
            grade_point,
          };
          // overall_result.push(obj);
          result_history[year].push(obj);
        }

        const previous_result_insert = await PreviousResult.create({
          personalInfo: student_personal_info,
          result: result_history,
        });

        const result_status_update = await Result.updateOne(
          {
            "studentInfo.id": id,
          },
          {
            $set: {
              resultStatus: "Finish",
            },
          }
        );

        if (previous_result_insert && result_status_update) {
          responseReturn(res, 201, {
            message: "Data inserted successfully",
          });
        } else {
          responseReturn(res, 400, {
            message: "Sorry, Data insertion failed",
          });
        }
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  previous_display = async(req, res) => {
    const { page, searchValue,  parPage } = req.query;
    const skipPage = parseInt(parPage) * (parseInt(page) - 1);
    try {
      let previous_result_found=[];
      if(searchValue.length > 0){
        previous_result_found = await PreviousResult.find({
          "personalInfo.email": searchValue,
        })
          .skip(skipPage)
          .limit(parPage)
        .sort({ createdAt: 1 });
      }
      else{
        previous_result_found = await PreviousResult.find()
          .skip(skipPage)
          .limit(parPage)
        .sort({ createdAt: 1 });
      }
     
      
      if (previous_result_found) {
        let final_child_array = [],
          final_parent_array = [],
          final_personal_info=[];
        const keep_previous_data = [...previous_result_found];
        const size = previous_result_found.length;

        for(let i=0 ; i<size ; i++){
          let { student_name, email, father_name, mother_name } =
            keep_previous_data[i].personalInfo; 
          let keep_result_object = keep_previous_data[i].result;
          let keys = Object.values(keep_result_object);
          final_personal_info.push({student_name, email, father_name, mother_name});
          final_child_array = [];

          const keys_size = keys.length;
          for(let j=0; j<keys_size ; j++){
            final_child_array.push(keys[j][0]);
          }
          console.log(final_child_array) 
          final_parent_array.push(final_child_array); 
    
        }
        
        console.log(final_parent_array)       
        responseReturn(res, 201, {
          final_personal_info,
          final_parent_array,
          totalData: previous_result_found.length,
          message: "Previous Result Data loaded successfully",
        });
      } else {
        responseReturn(res, 400, {
          error: "Failed to load previous data",
        });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  }
}

module.exports = new resultControllers();
