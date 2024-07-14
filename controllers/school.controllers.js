const School = require("../models/School");
const User = require("../models/User");
const Zone = require("../models/Zone");
const { responseReturn } = require("../utils/response");

class schoolControllers {
  // Fetch Zone
  zone_details = async (req, res) => {
    try {
      const zoneFound = await Zone.find({});
      const zone_list = [];
      const schoolInfo = [];
      zoneFound.map((data) =>
        zone_list.push({ name: data.name, code: data.code })
      );

      const schoolfound = await School.find({ status: "confirmed" });
      schoolfound.map((data) =>
        schoolInfo.push({ name: data.school_name, zone: data.zone })
      );

      responseReturn(res, 201, {
        zone_list,
        schoolInfo,
        message: "Zone and school data loaded successfully",
      });
    } catch (error) {
      responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  //  School Registration according to zone
  registration = async (req, res) => {
    const {
      school_name,
      zone,
      location,
      registration_no,
      principal,
      email,
      phone_no,
    } = req.body;
    try {
      const schoolFound = await School.findOne({ school_name, zone });
      if (schoolFound) {
        responseReturn(res, 404, {
          error: "School already registered, try new school",
        });
      } else {
        const total_school = await School.countDocuments({ zone });
        const zone_value = await Zone.findOne({ name: zone });
        const { code } = zone_value;
        const school_code = code * 1000 + total_school + 1;
        const principalInfo = { name: principal, email };
        const data = {
          school_name,
          zone,
          location,
          registration_no,
          school_code,
          phone_no,
          principalInfo,
        };
        const school = await School.create(data);
        if (school) {
          responseReturn(res, 201, {
            message: "School is registered successfully",
          });
        } else {
          responseReturn(res, 400, {
            error: "Failed to register",
          });
        }
      }
    } catch (error) {
      responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  // School Information display
  display = async (req, res) => {
    const { page, parPage } = req.query;
    const skipPage = parseInt(parPage) * (parseInt(page) - 1);
    try {
      const schoolList = await School.find()
        .skip(skipPage)
        .limit(parPage)
        .sort({ school_code: 1 });

      const totalData = await School.countDocuments();
      responseReturn(res, 201, {
        schoolList,
        totalData,
        message: "School data loaded successfully",
      });
    } catch (error) {
      responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  details = async (req, res) => {
    try {
      const zone = req.params.zone;

      let schoolInfo = [];
      if (zone === "all") {
        schoolInfo = await School.find({});
      } else {
        const schoolfound = await School.find({ zone });
        schoolfound.map((data) => schoolInfo.push({ name: data.school_name }));
      }
      responseReturn(res, 201, {
        schoolInfo,
        message: "School list loaded successfully",
      });
    } catch (error) {
      responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  update_status = async (req, res) => {
    try {
      const id = req.params.id;
      const { status } = req.body;

      const statusUpdate = await School.updateOne(
        { _id: id },
        { $set: { status: status } }
      );

      const schoolInfo = await School.findOne({ _id: id });

      responseReturn(res, 201, {
        schoolInfo: schoolInfo,
        message: "school data updated successfully",
      });
    } catch (error) {
      responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  delete_info = async (req, res) => {
    try {
      const id = req.params.id;
      const schoolDelete = await School.deleteOne({ _id: id });

      if (schoolDelete.deletedCount === 1) {
        responseReturn(res, 201, {
          message: "school data deleted successfully",
        });
      } else {
        responseReturn(res, 400, { error: "Failed to delete" });
      }
    } catch (error) {
      responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };
}

module.exports = new schoolControllers();
