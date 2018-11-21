pragma solidity ^0.4.24;

contract Attendees {

    // instantiation of structure
    struct AttendeesStructure {
        uint uid;
        address public_key;
        string name;
        string about;
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
        addAttendee("Biswaindu", "Content Writer", "https://amp.businessinsider.com/images/5ac518b57a74af23008b4642-750-563.jpg", 0x3b220bdD0D1C1b37AC6d434f027CC88a5b51B878);
        addAttendee("Sibabrat", "Application Developer", "https://www.evolllution.com/wp-content/uploads/2015/03/sized_Big-Name-Universities-Must-Respond-to-Student-Expectations.jpg", 0x0c8615A3d73b0AA9342A06A3d66C5f723D63E2Ed);
        addAttendee("Smruti", "Content Writer", "https://m.blog.hu/do/dolgozzmagadon/image/student2.jpg", 0x9D5AeBBaf8026021ad33A27748ae7d5E94C7E891);
        addAttendee("Prabina", "Developer Trainee", "https://www.ldatschool.ca/wp-content/uploads/2014/02/A-teachers-journey-with-student-self-advocacy.jpg", 0xab70787066CDeEb7f402b7364fac3a8BD7851c8D);
        addAttendee("Dev Sir", "CTO/CEO", "https://d1ay3zqomhlmi.cloudfront.net/wp-content/uploads/2018/07/about-image.jpg", 0x54a51E5d44C35F8C175270d98fd633440f929D21);
        addAttendee("Pitabash Sir", "Software Developer", "https://d1ay3zqomhlmi.cloudfront.net/wp-content/uploads/2018/07/development-section.png", 0xfb98737a67F6f577f9b88F5496e95CB98601C3E7);
    }

    // modifier to add the attendee by owner only
    modifier onlyOwner{
        require(msg.sender == owner);
        _;
    }

    // add attendee to attendees mapping
    function addAttendee(string _name, string _about, string _img_url, address _public_key) onlyOwner public {
        attendeesCount++;
        attendees[attendeesCount] = AttendeesStructure(attendeesCount, _public_key, _name, _about, _img_url);
    }

    // authenticate users
    function authenticateUser(address _user_add) public view returns (bool) {
        for (uint i = 1; i <= attendeesCount; i++) {
            if (attendees[i].public_key == _user_add) return true;
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
    uint public attendeeDetailsCount;

    //constructor
    constructor() public {

    }

    // save mark attendance details to attendeeDetails mapping
    function markAttendance(address _attendee, uint _attendance_opinion, uint256 _date) public {
        attendeeDetailsCount ++;
        attendeeDetails[attendeeDetailsCount] = AttendeeDetails(msg.sender, _attendee, _attendance_opinion, now, _date);
    }

    // fetter function for attendee details count
    function getMarkedAttendeeDetailsCount() public view returns (uint) {return attendeeDetailsCount;}

    //getter function for attendee details
    function getAttendeeDetails(uint _count, uint256 _date) public view returns (address, uint, uint256) {
        address attendee_add = attendees[_count].public_key;
        uint256 doa = attendeeDetails[_count].date_of_attendance;
        uint present = 0;
        uint absent = 0;
        uint opinion = 3;
        for (uint i = 1; i <= attendeeDetailsCount; i++) {
            if (attendee_add == attendeeDetails[i].attendee && doa == _date)
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

        return (attendee_add, opinion, _date);
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
    uint public evaluateCount;

    uint public r_opinion = 3;
    address public r_attendee_address;
    uint256 public r_date_of_attendance;

    // constructor
    constructor() public {
    }

    // evaluate attendance result on the basic of attendee and date
    function evaluation(uint256 _date) public {
        evaluateCount = 1;
        r_opinion;
        r_date_of_attendance;
        r_attendee_address;
        for (uint i = 1; i <= attendeesCount; i++) {
            (r_attendee_address, r_opinion, r_date_of_attendance) = getAttendeeDetails(i, _date);
            evaluated_attendees[evaluateCount] = EvaluatedAttendee(r_attendee_address, r_opinion, r_date_of_attendance, now);
            evaluateCount++;
        }
    }

    // for getting attendance result as per date and address
    function attendanceResult(uint256 _date, address _addr) public  view returns (uint) {
        uint present = 0;
        uint absent = 0;
        uint opinion = 3;
        for (uint i = 1; i <= attendeeDetailsCount; i++) {
            if (_addr == attendeeDetails[i].attendee && attendeeDetails[i].date_of_attendance  == _date)
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
        return opinion;
    }

}