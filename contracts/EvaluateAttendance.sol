pragma solidity ^0.4.24;

contract EvaluateAttendance {

    // instantiation  of structure
    struct EvaluatedAttendee {
        address attendee_address;
        uint opinion;
        uint256 date_evaluated;
        string date_of_attendance;
    }

    //mapping of structure for storing the evaluated_attendees
    mapping(uint => EvaluatedAttendee) public evaluated_attendees;
    uint public evaluateCount;

    // constructor
    constructor() public {}

    // add evaluated attendees to evaluated_attendees mapping
    function addAttendee(address attendee_address,uint opinion,string date_of_attendance) public {
        evaluateCount++;
        evaluated_attendees[evaluateCount] = EvaluatedAttendee(attendee_address,opinion, now, date_of_attendance);
    }

}