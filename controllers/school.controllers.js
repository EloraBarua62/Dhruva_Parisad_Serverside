const School = require("../models/School");
const Zone = require("../models/Zone");
const { responseReturn } = require("../utils/response");

class studentControllers {
  // Fetch Zone
  zone_details = async (req, res) => {
    try {
      const zoneFound = await Zone.find({});
      const zone_list = [];
      zoneFound.map((data) =>
        zone_list.push({ name: data.name, code: data.code })
      );
      console.log(zone_list);
      responseReturn(res, 201, {
        zone_list,
        message: "Zone data loaded successfully",
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
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
      const schoolFound = await School.findOne({ school_name, zone});
      if (schoolFound) {
        responseReturn(res, 404, {
          error: "School already registered, try new school",
        });
      } else {
        const total_school = await School.countDocuments({zone});
        const zone_value = await Zone.findOne({name: zone});
        const {code} = zone_value;
        const school_code = code*10 + total_school + 1;
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
        console.log(school);
        responseReturn(res, 201, {
          message: "School is registered successfully",
        });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
}

module.exports = new studentControllers();
