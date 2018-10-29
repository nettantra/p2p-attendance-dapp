pragma solidity ^0.4.24;

contract MarkAttendance {

    // instantiation of structure
    struct AttendeeDetails {
        address attendance_giver;
        address attendee;
        uint attendance_opinion;
        uint256 timestamp;
        string date_of_attendance;
    }


    //mapping of structure  for storing the attendeeDetails
    mapping(uint => AttendeeDetails) public attendeeDetails;
    uint public attendeeDetailsCount = 0;

    //constructor
    constructor() public {

    }

    // save mark attendance details to attendeeDetails mapping
    function markAttendance(address attendee, uint attendance_opinion, string date) public {
        attendeeDetailsCount ++;
        attendeeDetails[attendeeDetailsCount] = AttendeeDetails(msg.sender, attendee, attendance_opinion, now, date);
    }



    //getter function for attendee details
    function getAttendeeDetails(uint _count, string date) view public returns (address, uint, string) {
        address attendee_add = attendeeDetails[_count].attendee;
        string storage doa = attendeeDetails[_count].date_of_attendance;
        uint present = 0;
        uint absent = 0;
        uint opinion = 3;
        for (uint i = 0; i <= attendeeDetailsCount; i++) {
            if (attendee_add == attendeeDetails[i].attendee && keccak256(doa) == keccak256(attendeeDetails[i].date_of_attendance))
            {
                if (attendeeDetails[i].attendance_opinion == 1) present++;
                else if (attendeeDetails[i].attendance_opinion == 2) absent++;
            }

        }
        if (present < absent) opinion = 2;
        else if (present > absent || (present == absent && (present != 0 || absent != 0)) ) opinion = 1;
        return (attendee_add, opinion, date);

    }

}
