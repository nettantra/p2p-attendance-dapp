pragma solidity ^0.4.24;

contract Attendees {

    // instantiation of structure
    struct Attendees {
        uint uid;
        address public_key;
        string name;
        string img_url;
    }

    address owner;
    //mapping of structure for storing the attendees
    mapping( uint => Attendees) public attendees;
    uint public attendeesCount;

    // constructor to save some attendees
    constructor() public {
        owner = msg.sender;
        addAttendee("Biswaindu","https://amp.businessinsider.com/images/5ac518b57a74af23008b4642-750-563.jpg",0x3b220bdD0D1C1b37AC6d434f027CC88a5b51B878);
        addAttendee("Sibabrat","https://www.evolllution.com/wp-content/uploads/2015/03/sized_Big-Name-Universities-Must-Respond-to-Student-Expectations.jpg",0x0c8615A3d73b0AA9342A06A3d66C5f723D63E2Ed);
        addAttendee("Smruti","https://qph.fs.quoracdn.net/main-thumb-346046018-200-bybjsssbfqgxvocvdtdggibtjeejnmsk.jpeg",0x9D5AeBBaf8026021ad33A27748ae7d5E94C7E891);
    }

    // modifier to add the attendee by owner only 
    modifier onlyOwner{
        require(msg.sender == owner);
        _;
    }

    // add attendee to attendees mapping
    function addAttendee(string name,string img_url,address public_key) onlyOwner public {
        attendeesCount++;
        attendees[attendeesCount] = Attendees(attendeesCount,public_key,name,img_url);
    }

}