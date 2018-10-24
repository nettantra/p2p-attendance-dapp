pragma solidity ^0.4.24;

contract MarkAttendance {

    struct AttendeeDetails {
        address attendance_giver;
        address attendee;
        opinion attendance_opinion;
        uint256 timestamp;
        uint256 date_of_attendance;
    }
    mapping( uint => AttendeeDetails) public attendeeDetails;
    uint public attendeeDetailsCount = 0;
    constructor() public {

    }

    // mark  attendance by Users
    function markAttendance(uint attendance_opinion,uint date) public{
        attendeeDetailsCount ++;
        attendeeDetails[attendeeDetailsCount] = AttendeeDetails(msg.sender,msg.sender,attendance_opinion,now,date);
    }

}
