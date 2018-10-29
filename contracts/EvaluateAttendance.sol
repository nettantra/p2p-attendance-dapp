pragma solidity ^0.4.24;


contract EvaluateAttendance {
    // instantiation  of structure
    struct EvalutedAttendee {
        address attendee_address;
        uint opinion;
        uint256 date_evaluated;
        string date_of_attendance;
    }

    //mapping of structure  for storing the participants
    mapping(uint => EvalutedAttendee) public evaluted_attendees;
    uint public evaluteCount;

    // constructor
    constructor() public {}

    // add a new participant to Participant structure
    function addAttendee(address attendee_address,uint opinion,string date_of_attendance) public {
        evaluteCount++;
        evaluted_attendees[evaluteCount] = EvalutedAttendee(attendee_address,opinion, now, date_of_attendance);
    }

}