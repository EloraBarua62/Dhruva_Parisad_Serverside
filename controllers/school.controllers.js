const Zone = require("../models/Zone");
const { responseReturn } = require("../utils/response");

class studentControllers {
    zone_details = async (req, res) => {
    try {
        const zoneFound = await Zone.find({});
        const zone_list = [];
        zoneFound.map((data) => zone_list.push({ name: data.name, code: data.code }));
        console.log(zone_list);
        responseReturn(res, 201, {
          zone_list,
          message: "Zone data loaded successfully",
        });
    } catch (error) {
        responseReturn(res, 500, { error: error.message });
    }   
}
}

module.exports = new studentControllers();