pragma solidity ^0.4.24;

contract Participants {

    // instation of structure
    struct Participant {
        uint id;
        string name;
        uint present;
        uint absent;
        uint dn;
        uint256 time;
    }

    // structure when registering attendance
    struct AttendeeDetails {
        uint employeeId;
        address userAddress;
        uint256 registerTime;
    }


    //mapping of strAZucture for storing the participants
    mapping( uint => Participant) public participants;
    uint public participantsCount;

    mapping( uint => AttendeeDetails) public attendeeDetails;
    uint public attendeeDetailsCount = 0;

    // effective result
    mapping(uint  => bool) public effectiveResult;

    // constructor
    constructor() public {
        addParticipant("Biswaindu");
        addParticipant("Sibabrat");
        addParticipant("Smruti1");
    }

    // add a new participant to Participant structure
    function addParticipant(string name) private {
        participantsCount++;
        participants[participantsCount] = Participant(participantsCount,name,0,0,0,now);
    }

    // register attendance by Users
    function registerAttendance(uint employeeId, uint attendanceType) public{
        // validate attendee and attendance
        require(validAttendance(employeeId,msg.sender,attendanceType));
        //updated or saved data into Blocks
        attendeeDetailsCount ++;
        attendeeDetails[attendeeDetailsCount] = AttendeeDetails(employeeId,msg.sender,now);
        // update candidate attendance
        if(attendanceType == 1) participants[employeeId].present ++;
        else if(attendanceType == 2) participants[employeeId].absent ++;
        else if (attendanceType == 3) participants[employeeId].dn ++;
    }

    // calculate effective Attendance
    function effectiveAttendance(uint employeeId) public{
      effectiveResult[employeeId] = (participants[employeeId].present - participants[employeeId].absent) > 0 ;
    }

    // to validate the attendance
    function validAttendance(uint employeeId,address attendeeAddress,uint attendanceType) view public returns (bool) {
       bool emp_id_validation = (employeeId > 0 &&  attendanceType > 0 && attendanceType < 4 && employeeId <= participantsCount);
        if(emp_id_validation){
            for (uint i = 1; i <= attendeeDetailsCount; i++) {
                if(!(employeeId == attendeeDetails[i].employeeId && msg.sender == attendeeDetails[i].userAddress)) return  true;
            }
        }
        return false;
    }

}