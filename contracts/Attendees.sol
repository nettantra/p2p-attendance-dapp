pragma solidity ^0.4.24;

contract Attendees {

    // instantiation of structure
    struct AttendeesStructure {
        uint uid;
        address public_key;
        string name;
        string img_url;
    }

    address owner;

    //mapping of structure for storing the attendees
    mapping(uint => AttendeesStructure) public attendees;
    uint public attendeesCount;

    // constructor to save some attendees
    constructor() public {
        owner = msg.sender;
        addAttendee("Biswaindu", "https://amp.businessinsider.com/images/5ac518b57a74af23008b4642-750-563.jpg", 0x3b220bdD0D1C1b37AC6d434f027CC88a5b51B878);
        addAttendee("Sibabrat", "https://www.evolllution.com/wp-content/uploads/2015/03/sized_Big-Name-Universities-Must-Respond-to-Student-Expectations.jpg", 0x0c8615A3d73b0AA9342A06A3d66C5f723D63E2Ed);
        addAttendee("Smruti", "https://qph.fs.quoracdn.net/main-thumb-346046018-200-bybjsssbfqgxvocvdtdggibtjeejnmsk.jpeg", 0x9D5AeBBaf8026021ad33A27748ae7d5E94C7E891);
    }

    // modifier to add the attendee by owner only
    modifier onlyOwner{
        require(msg.sender == owner);
        _;
    }

    // add attendee to attendees mapping
    function addAttendee(string name, string img_url, address public_key) onlyOwner public {
        attendeesCount++;
        attendees[attendeesCount] = AttendeesStructure(attendeesCount, public_key, name, img_url);
    }
}

contract MarkAttendance is Attendees {

    // instantiation of structure
    struct AttendeeDetails {
        address attendance_giver;
        address attendee;
        uint attendance_opinion;
        uint256 timestamp;
        uint256 date_of_attendance;
    }

    //mapping of structure  for storing the attendeeDetails
    mapping(uint => AttendeeDetails) public attendeeDetails;
    uint public attendeeDetailsCount = 0;

    //constructor
    constructor() public {

    }

    // save mark attendance details to attendeeDetails mapping
    function markAttendance(address attendee, uint attendance_opinion, uint date) public {
        attendeeDetailsCount ++;
        attendeeDetails[attendeeDetailsCount] = AttendeeDetails(msg.sender, attendee, attendance_opinion, now, date);
    }

    function getMarkedAttendeeDetailsCount() view public returns (uint) {return attendeeDetailsCount;}

    //getter function for attendee details
    function getAttendeeDetails(uint _count, uint date) view public returns (address, uint, uint) {
        address attendee_add = attendees[_count].public_key;
        uint  doa = attendeeDetails[_count].date_of_attendance;
        uint present = 0;
        uint absent = 0;
        uint opinion = 3;
        for (uint i = 0; i <= attendeeDetailsCount; i++) {
            if (attendee_add == attendeeDetails[i].attendee && doa == attendeeDetails[i].date_of_attendance)
            {
                if (attendeeDetails[i].attendance_opinion == 1) present++;
                else if (attendeeDetails[i].attendance_opinion == 2) absent++;
            }
        }
        if (present < absent) opinion = 2;
        else if (present > absent || (present == absent && (present != 0 || absent != 0))) opinion = 1;
        return (attendee_add, opinion, date);
    }


}

contract EvaluateAttendance is MarkAttendance {

    // instantiation  of structure
    struct EvaluatedAttendee {
        address attendee_address;
        uint opinion;
        uint256 date_of_attendance;
        uint256 date_evaluated;
    }

    //mapping of structure for storing the evaluated_attendees
    mapping(uint => EvaluatedAttendee) public evaluated_attendees;
    uint public evaluateCount = 1;

    uint public r_opinion = 3;
    address public r_attendee_address;
    uint256 public r_date_of_attendance;

    // constructor
    constructor() public {
    }

    // evaluate attendance result on the basic of attendee and date
    function evaluation() public {
        for (uint i = 1; i <= attendeesCount; i++) {
            (r_attendee_address, r_opinion, r_date_of_attendance) = getAttendeeDetails(i, 1440806400);
            evaluated_attendees[evaluateCount] = EvaluatedAttendee(r_attendee_address, r_opinion, r_date_of_attendance, now);
            evaluateCount++;
        }
    }
}