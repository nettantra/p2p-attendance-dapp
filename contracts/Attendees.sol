pragma solidity ^0.4.24;

contract Attendees {

    // instation of structure
    struct Attendees {
        uint uid;
        address public_key;
        string name;
        string img_url;
    }

    //mapping of strAZucture for storing the participants
    mapping( uint => Attendees) public attendees;
    uint public attendeesCount;

    // constructor
    constructor() public {
        addAttendee("Biswaindu","https://amp.businessinsider.com/images/5ac518b57a74af23008b4642-750-563.jpg");
        addAttendee("Sibabrat","https://www.evolllution.com/wp-content/uploads/2015/03/sized_Big-Name-Universities-Must-Respond-to-Student-Expectations.jpg");
    }

    // add a new participant to Participant structure
    function addAttendee(string name,string img_url) public {
        attendeesCount++;
        attendees[attendeesCount] = Attendees(attendeesCount,msg.sender,name,img_url);
    }

}