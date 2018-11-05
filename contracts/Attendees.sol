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

    //1540944000
    // constructor to save some attendees
    constructor() public {
        owner = msg.sender;
        addAttendee("Biswaindu", "https://amp.businessinsider.com/images/5ac518b57a74af23008b4642-750-563.jpg", 0x848f3DB5C37F8a7aDdEf99704C43e544c8E18207);
        addAttendee("Sibabrat", "https://www.evolllution.com/wp-content/uploads/2015/03/sized_Big-Name-Universities-Must-Respond-to-Student-Expectations.jpg", 0xA81cD3109F53Fb5604C2c2b3f3D8debf8a1dDc49);
        addAttendee("Smruti", "https://m.blog.hu/do/dolgozzmagadon/image/student2.jpg", 0xD1bAaAA14639C468f47C89Eb9028b6d6A1007Da4);
        addAttendee("Prabina", "https://www.ldatschool.ca/wp-content/uploads/2014/02/A-teachers-journey-with-student-self-advocacy.jpg", 0x881274dBaD173E92586621fde2b2325B63ea7617);
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


    // authenticate users
    function authenticateUser(address _userAdd) public view returns (bool) {
        for(uint i = 1; i<=attendeesCount; i++){
            if(attendees[i].public_key == _userAdd) return  true ;
        }
        return false;
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
    function markAttendance(address attendee, uint attendance_opinion, uint256 date) public {
        attendeeDetailsCount ++;
        attendeeDetails[attendeeDetailsCount] = AttendeeDetails(msg.sender, attendee, attendance_opinion, now, date);
    }

    // fetter function for attendee details count
    function getMarkedAttendeeDetailsCount() public view returns (uint) {return attendeeDetailsCount;}

    //getter function for attendee details
    function getAttendeeDetails(uint _count, uint256 date) public view returns (address, uint, uint256) {
        address attendee_add = attendees[_count].public_key;
        uint256 doa = attendeeDetails[_count].date_of_attendance;
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

        if (present != 0 || absent != 0) {
            if (present < absent) opinion = 2;
            if (present > absent) opinion = 1;
            if (present == absent) opinion = 1;
        }

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
    function evaluation(uint256 date) public {
        evaluateCount = 1;
        r_opinion;
        r_date_of_attendance;
        r_attendee_address;
        for (uint i = 1; i <= attendeesCount; i++) {
            (r_attendee_address, r_opinion, r_date_of_attendance) = getAttendeeDetails(i, date);
            evaluated_attendees[evaluateCount] = EvaluatedAttendee(r_attendee_address, r_opinion, r_date_of_attendance, now);
            evaluateCount++;
        }
    }

}