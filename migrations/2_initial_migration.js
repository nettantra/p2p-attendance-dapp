const Attendees = artifacts.require("Attendees");
const MarkAttendance = artifacts.require("MarkAttendance");
const EvaluateAttendance = artifacts.require("EvaluateAttendance");

module.exports = function(deployer) {
    deployer.deploy(Attendees);
    deployer.deploy(MarkAttendance);
    deployer.deploy(EvaluateAttendance);
};



