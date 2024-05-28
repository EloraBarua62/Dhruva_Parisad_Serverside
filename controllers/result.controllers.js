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
      const resultList = await Result
      .find()
      .skip(skipPage)
      .limit(parPage)
      .sort({ "studentInfo.roll": 1 });
      
      
      const resultInfo = [];
      resultList.forEach((element) => {
        let { studentInfo, writtenPractical, _id } = element;
        let { id, roll, ...otherInfo } = studentInfo;
        studentInfo = { ...otherInfo, roll };

        // const {roll, student_name, school, subjectYear} = studentInfo;

        const updatedResult = [];
        writtenPractical.forEach((marks) => {
          const { written, practical, total, letter_grade, grade_point } = marks;
          updatedResult.push({
            written,
            practical,
            total,
            letter_grade,
            grade_point,
          });
        });
        writtenPractical = [...updatedResult];
        resultInfo.push({ studentInfo, writtenPractical, _id });
      });
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
      const personalInfo = await Student.findOne({
        email: email, roll: roll,
      });

      const studentPersonalInfo = { father_name: personalInfo?.father_name , mother_name: personalInfo?.mother_name }; 
      console.log(studentResultInfo)
      console.log(studentPersonalInfo);
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
    let array = writtenPractical;

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
      ["Fine Arts", "Ninth", 900]
    ];   

    try {
      const resultInfo = await Result.findOne({ _id: id }); 
      const sub_year = [...resultInfo.studentInfo.subjectYear];

      for(let i = 0; i<sub_year.length ; i++){
        let each_total_marks = 0;
        let obj = array[index];
        let value = obj.written + obj.practical;
        let each_letter_grade = "A+", each_grade_point = 5;
        
        for(let j=0 ; j<74 ; j++){
          if(sub_year[i][0] === total_exam_marks[j][0] && sub_year[i][1] === total_exam_marks[j][1]){
              each_total_marks = (value*100) / total_exam_marks[j][2];
              break;
          }
        }

        // Grading distribution
        if(each_total_marks >= 70 && each_total_marks <= 79){
          each_letter_grade = "A";
          each_grade_point = 4;
        }
        else if(each_total_marks >= 60 && each_total_marks <= 69){
          each_letter_grade = "A-"
          each_grade_point = 3.5;
        }
        else if(each_total_marks >= 50 && each_total_marks <= 59){
          each_letter_grade = "B";
          each_grade_point = 3;
        }
        else if(each_total_marks >= 40 && each_total_marks <= 49){
          each_letter_grade = "C";
          each_grade_point = 2;
        }
        else if(each_total_marks >= 33 && each_total_marks <= 39){
          each_letter_grade = "D";
          each_grade_point = 1;
        }
        else{
          each_letter_grade = "F";
          each_grade_point = 0;
        }
        obj = { ...obj, total: value, letter_grade: each_letter_grade, grade_point: each_grade_point };
        array[index] = obj;
      }

      const resultUpdate = await Result.updateOne(
        { _id: id },
        { $set: { writtenPractical: array } }
      );
      // console.log(resultUpdate);
      
      const result = resultInfo.writtenPractical;
      const updatedResult = [];
      for (let index = 0; index < result.length; index++) {
        const { written, practical, total, letter_grade, grade_point } = result[index];
        updatedResult.push({ written, practical, total, letter_grade, grade_point });
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
