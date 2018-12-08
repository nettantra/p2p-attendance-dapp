pragma solidity ^0.4.24;

contract Attendees {

    // instantiation of structure
    struct AttendeesStructure {
        uint256 uid;
        address public_key;
        string name;
        string about;
        string img_url;
        uint256 status; // 1 = Active 2 = deleted
    }

    address owner;

    //mapping of structure for storing the attendees
    mapping(uint256 => AttendeesStructure) public attendees;
    uint256 public attendeesCount;

    //1540944000
    // constructor to save some attendees
    constructor() public {
        owner = msg.sender;
        addAttendee("Devadutta Sahoo", "CEO/CTO", "https://img.theweek.in/content/dam/week/news/entertainment/images/2018/3/13/amitabh-bachchan-salil-bera.jpg", 0xE4b5d53BDe0Ea9948cCe22cA6411F70b28E38f41, 1);
        addAttendee("Swetansu Mohapatra", "Application Developer", "http://stat2.bollywoodhungama.in/wp-content/uploads/2017/05/Sanjay-Dutt-walks-out-of-Total-Dhamaal.jpg", 0xaaaBe0cf13cd5A722561c293602851714D2e593d, 1);
        addAttendee("Pitabas Behera", "Managing Director", "https://s3.india.com/wp-content/uploads/2017/06/Aamir-Khan.jpg", 0x3590415CD6596Da5015CD2810e5F5Ac04E6D7A77, 1);
        addAttendee("Sanjeev Nanda", "Human Resources", "https://img.etimg.com/thumb/height-480,width-640,imgsize-9960,msid-56595593/.jpg", 0x79e32f46b4C1fC8EDE6465Bd17E2D64CE4a2A41b, 1);
        addAttendee("Prabina Parichha", "Application Trainee", "http://2.bp.blogspot.com/__5vnMiF3qLg/TO-0BpSXIhI/AAAAAAAAC-U/nHbC0PrtvHI/s1600/Genelia%252BDsouza%252Bcute.jpg", 0x1CC4ffc74a149b6aACA316e80235f7D62f161b20, 1);
        addAttendee("SmrutiRekha Panda", "Content Writer", "https://s3.india.com/wp-content/uploads/2017/08/ileana-d-cruz-6.png", 0x1AaED6720B2e7Cb215b8b22870153C53EACf4A85, 1);
        addAttendee("Sibabrat Swain", "Application Developer", "http://cdn.persiangig.com/preview/7tb5eZgr3W/large/6106.jpg", 0x669D42d970F7ab357fEe9615283ef34FaFAd9f14, 1);
        addAttendee("Biswaindu Parida", "Content Writer", "https://cdn1.thr.com/sites/default/files/imagecache/scale_crop_768_433/2016/11/anil_kapoor_-_getty_-_h_-_2016.jpg", 0x97E290c59bc4EB459e4911c0e56ba8ef668F8FF9, 1);
    }

    // modifier to add the attendee by owner only
    modifier onlyOwner{
        require(msg.sender == owner);
        _;
    }

    // add attendee to attendees mapping
    function addAttendee(string _name, string _about, string _img_url, address _public_key, uint256 status) onlyOwner public {
        attendeesCount++;
        attendees[attendeesCount] = AttendeesStructure(attendeesCount, _public_key, _name, _about, _img_url, status);
    }

    // authenticate users
    function authenticateUser(address _user_add) public view returns (bool) {
        for (uint256 i = 1; i <= attendeesCount; i++) {
            if (attendees[i].public_key == _user_add && attendees[i].status == 1) return true;
        }
        return false;
    }

    // for updating attendee
    function updateAttendee(address _user_add, string _name, string _about, string _image, uint256 status) public {
        for (uint256 i = 1; i <= attendeesCount; i++) {
            if (attendees[i].public_key == _user_add) {
                attendees[i] = AttendeesStructure(i, _user_add, _name, _about, _image, status);
            }
        }
    }

    function changeStatusEmployee(address _employeeAdd, uint256 status) onlyOwner public returns (bool) {
        for (uint256 i = 1; i <= attendeesCount; i++) {
            if (attendees[i].public_key == _employeeAdd) {
                attendees[i].status = status;
//                attendees[i].public_key = 0*0;
                return true;
            }
        }
        return false;
    }

}

contract MarkAttendance is Attendees {

    // instantiation of structure
    struct AttendeeDetails {
        address attendance_giver;
        address attendee;
        uint256 attendance_opinion;
        uint256 timestamp;
        uint256 date_of_attendance;
    }

    //mapping of structure  for storing the attendeeDetails
    mapping(uint256 => AttendeeDetails) public attendeeDetails;
    uint256 public attendeeDetailsCount;

    //constructor
    constructor() public {

    }

    // save mark attendance details to attendeeDetails mapping
    function markAttendance(address _attendee, uint256 _attendance_opinion, uint256 _date) public {
        attendeeDetailsCount ++;
        attendeeDetails[attendeeDetailsCount] = AttendeeDetails(msg.sender, _attendee, _attendance_opinion, now, _date);
    }

    // fetter function for attendee details count
    function getMarkedAttendeeDetailsCount() public view returns (uint256) {return attendeeDetailsCount;}

    //getter function for attendee details
    function getAttendeeDetails(uint256 _count, uint256 _date) public view returns (address, uint256, uint256) {
        address attendee_add = attendees[_count].public_key;
        uint256 doa = attendeeDetails[_count].date_of_attendance;
        uint256 present = 0;
        uint256 absent = 0;
        uint256 opinion = 3;
        for (uint256 i = 1; i <= attendeeDetailsCount; i++) {
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

    // validate marking attendance
    function validateAttendance(address _attendee, uint256 _date) public view returns (bool){
        for (uint256 i = 1; i <= attendeeDetailsCount; i++) {
            if (attendeeDetails[i].attendance_giver == msg.sender && attendeeDetails[i].attendee == _attendee && attendeeDetails[i].date_of_attendance == _date) {
                return true;
            }
        }
        return false;
    }
}

contract EvaluateAttendance is MarkAttendance {

    // instantiation  of structure
    struct EvaluatedAttendee {
        address attendee_address;
        uint256 opinion;
        uint256 date_of_attendance;
        uint256 date_evaluated;
    }

    //mapping of structure for storing the evaluated_attendees
    mapping(uint256 => EvaluatedAttendee) public evaluated_attendees;
    uint256 public evaluateCount;

    uint256 public r_opinion = 3;
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
        for (uint256 i = 1; i <= attendeesCount; i++) {
            (r_attendee_address, r_opinion, r_date_of_attendance) = getAttendeeDetails(i, _date);
            evaluated_attendees[evaluateCount] = EvaluatedAttendee(r_attendee_address, r_opinion, r_date_of_attendance, now);
            evaluateCount++;
        }
    }

    // for getting attendance result as per date and address
    function attendanceResult(uint256 _date, address _addr) public view returns (uint256) {
        uint256 present = 0;
        uint256 absent = 0;
        uint256 opinion = 3;
        for (uint256 i = 1; i <= attendeeDetailsCount; i++) {
            if (_addr == attendeeDetails[i].attendee && attendeeDetails[i].date_of_attendance == _date)
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