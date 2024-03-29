const School = require("../models/School");
const Zone = require("../models/Zone");
const { responseReturn } = require("../utils/response");

class schoolControllers {
  // Fetch Zone
  zone_details = async (req, res) => {
    try {
      console.log(req)
      const zoneFound = await Zone.find({});
      const zone_list = [];
      const schoolInfo = [];
      zoneFound.map((data) =>
        zone_list.push({ name: data.name, code: data.code })
      );

      const schoolfound = await School.find({});
      schoolfound.map((data) => schoolInfo.push({ name: data.school_name, zone: data.zone }));
      
      responseReturn(res, 201, {
        zone_list,
        schoolInfo,
        message: "Zone and school data loaded successfully",
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
      const schoolFound = await School.findOne({ school_name, zone });
      if (schoolFound) {
        responseReturn(res, 404, {
          error: "School already registered, try new school",
        });
      } else {
        const total_school = await School.countDocuments({ zone });
        const zone_value = await Zone.findOne({ name: zone });
        const { code } = zone_value;
        const school_code = code * 10 + total_school + 1;
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
        
        responseReturn(res, 201, {
          message: "School is registered successfully",
        });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  details = async (req, res) => {
    try {
      const zone = req.params.zone;
      
      let schoolInfo = [];
      if(zone === 'all'){
        schoolInfo = await School.find({});
      }
      else{
        const schoolfound = await School.find({ zone });
        schoolfound.map((data) => schoolInfo.push({ name: data.school_name }));
      }      
      responseReturn(res, 201, {
        schoolInfo,
        message: "School list loaded successfully",
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  update_status = async (req, res) => {
    try {
      const id = req.params.id;
      const {status} = req.body;
      console.log(id, status);
      const statusUpdate = await School.updateOne(
        { _id: id },
        { $set: { status: status } }
      );
      
      const schoolInfo = await School.findOne({_id: id});
      console.log(schoolInfo)
      responseReturn(res, 201, {
        schoolInfo: schoolInfo,
        message: "school data updated successfully",
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
}

module.exports = new schoolControllers();
