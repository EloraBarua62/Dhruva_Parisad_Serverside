const { responseReturn } = require("./response");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

module.exports.verifyToken = async (req, res, next) => {
  try {
    const token = req?.cookies?.accessToken;

    if (!token) {
      responseReturn(res, 401, {
        message: "Unauthorized access",
      });
    }
    const data = jwt.verify(token, process.env.SECRET_KEY);
    // const data = await promisify(jwt.verify)(token, process.env.SECRET_KEY);

    if (req.baseUrl === "/api/v1/school") {
      const path = req.route.path;

      if (
        path === "/registration" &&
        data.role !== "principal" &&
        data.role !== "admin"
      ) {
        responseReturn(res, 401, {
          message: "Unauthorized access",
        });
      } else if (
        (path === "/details/:zone" || path === "/update-status/:id") &&
        data.role !== "admin"
      ) {
        responseReturn(res, 401, {
          message: "Unauthorized access",
        });
      }
    } 
    else if (req.originalUrl === "/api/v1/user/principal-info" &&
      data.role !== "admin"
    ) {
      responseReturn(res, 401, {
        message: "Unauthorized access",
      });
    } 
    else if (req.baseUrl === "/api/v1/result") {
      const path = req.route.path;
      if (
        (path === "/display" ||
          path === "/previous-display" ||
          path === "/result-update/:id" ||
          path === "/previous-result") &&
        data.role !== "admin"
      ) {
        responseReturn(res, 401, {
          message: "Unauthorized access",
        });
      } else if (
        path === "/school-display/:code" &&
        data.role !== "principal"
      ) {
        responseReturn(res, 401, {
          message: "Unauthorized access",
        });
      }
    } 
    else if (req.baseUrl === "/api/v1/student") {
      const path = req.route.path;
      if (
        (path === "/update-info/:id" ||
          path === "/delete-info/:id" ||
          path === "/details") &&
        data.role !== "admin"
      ) {
        responseReturn(res, 401, {
          message: "Unauthorized access",
        });
      }
    }
    else if (req.baseUrl === "/api/v1/news") {
      const path = req.route.path;
      if (
        (path === "/admin-display" ||
          path === "/update-info/:id" ||
          path === "/delete-info/:id" ||
          path === "/exam-result") &&
        data.role !== "admin"
      ) {
        responseReturn(res, 401, {
          message: "Unauthorized access",
        });
      }
    }
    next();
  } catch (error) {
    responseReturn(res, 403, {
      message: "Forbiden access",
    });
  }
};
