pragma solidity ^0.4.24;

contract Participants {

    // instation of structure
    struct Participant {
        uint id;
        string name;
        uint present;
        uint absent;
        uint dn;
        uint256 time;
    }

    //mapping of strAZucture for storing the participants
    mapping( uint => Participant) public participants;
    uint public participantsCount;

    // store account who has registered
    mapping(address => bool) public users;

    // constructor
    constructor() public {
        addParticipant("Biswaindu");
        addParticipant("Sibabrat");
        addParticipant("Smruti1");
    }

    // add a new participant to Participant structure
    function addParticipant(string name) private {
        participantsCount++;
        participants[participantsCount] = Participant(participantsCount,name,0,0,0,now);

    }


    // register attendance by Users
    function registerAttendance(uint employeeId, uint attendanceType) public{

        // record that attendee has registered attendance
        // msg.sender message is the metadata and sender is the account who is registering the attendance


        //check if the address is note registered  before
        require(!users[msg.sender]);
        // require a valid participants
        require(employeeId > 0 &&  attendanceType > 0 && attendanceType < 4 && employeeId <= participantsCount);

        users[msg.sender] = true;

        // update candidate attendance
        if(attendanceType == 1)
         participants[employeeId].present ++;
        else if(attendanceType == 2)
         participants[employeeId].absent ++;
        else if (attendanceType == 3)
         participants[employeeId].dn ++;

    }
}