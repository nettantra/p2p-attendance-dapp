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
    mapping( uint => AttendeeDetails) public attendeeDetails;
    uint public attendeeDetailsCount = 0;

    //constructor
    constructor() public {

    }

     // save mark attendance details to attendeeDetails mapping
    function markAttendance(address attendee,uint attendance_opinion,string date) public {
        attendeeDetailsCount ++;
        attendeeDetails[attendeeDetailsCount] = AttendeeDetails(msg.sender,attendee,attendance_opinion,now,date);
    }


}
