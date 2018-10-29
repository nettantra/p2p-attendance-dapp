pragma solidity ^0.4.24;

import "./MarkAttendance.sol";

contract EvaluateAttendance is MarkAttendance {

    // instantiation  of structure
    struct EvaluatedAttendee {
        address attendee_address;
        uint opinion;
        string date_of_attendance;
        uint256 date_evaluated;
    }

    uint public r_opinion = 3;
    address public r_attendee_address;
    string public r_date_of_attendance = "";

    //mapping of structure for storing the evaluated_attendees
    mapping(uint => EvaluatedAttendee) public evaluated_attendees;
    uint public evaluateCount = 0;


    // constructor
    constructor() public {
    }

    // evaluate attendance result on the basic of attendee and date
    function evaluation() public {
        for (uint i = 1; i <= attendeeDetailsCount; i++) {
            (r_attendee_address, r_opinion, r_date_of_attendance) = getAttendeeDetails(i, "29/11/2018");
            evaluateCount++;
            evaluated_attendees[evaluateCount] = EvaluatedAttendee(r_attendee_address, r_opinion, r_date_of_attendance, now);
        }
    }

    // check if exist
    function validEvaluationDetails() view public returns (bool) {
        for (uint i = 1; i <= evaluateCount; i++) {
            if (evaluated_attendees[i].attendee_address == r_attendee_address) return false;
        }
        return true;
    }

}