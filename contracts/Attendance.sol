pragma solidity ^0.4.2;

contract Attendance {
    // Model an Attendee

    struct Attendee {
        uint public id;
        string public name;
        uint public present;
        uint public absent;
        }

    struct AttendanceRegister {
        unit public date;
        uint public month;
        string public finalattendace;
        }

   

    

    // Store accounts of employees who will mark attendees as present or absent
    mapping(address => bool) public attendancetakers;
    // Store Attendee
    // Fetch Attendee
    mapping(uint => Attendee) public attendees;
    // Store Attendees Count
    uint public attendeesCount;

    // attendance event
    event markedEvent (
        uint indexed _attendeeId
    );

    function Attendance () public {
        addAttendee("Attendee 1");
        addAttendee("Attendee 2");
    }

    function addAttendee (string _name) private {
        attendeesCount ++;
        attendees[attendeesCount] = Attendee(attendeesCount, _name, 0,0);
    }


}

}
