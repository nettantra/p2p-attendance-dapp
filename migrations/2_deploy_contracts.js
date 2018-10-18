var Attendance = artifacts.require("./Attendance.sol");
var EvaluatedAttendance = artifacts.require("./EvaluatedAttendance.sol");
var RegisteredAttendance = artifacts.require("./RegisteredAttendance.sol");

module.exports = function(deployer) {
  deployer.deploy(Attendance);
  deployer.deploy(EvaluatedAttendance);
  deployer.deploy(RegisteredAttendance);
};
