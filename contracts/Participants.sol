pragma solidity ^0.4.24;

contract Participants {

    // instation of structure
    struct Participant {
        uint id;
        string name;
        uint attendanceCount;
    }

    //mapping of structure for storing the participants
    mapping( uint => Participant) public participants;
    uint public participantsCount;

    // constructor
    constructor() public {
        addParticipant("Biswaindu");
        addParticipant("Sibabrat");
        addParticipant("Smruti");
    }

    // add a new participant to Participant structure
    function addParticipant(string _name) private {
        participantsCount++;
        participants[participantsCount] = Participant(participantsCount,_name,0);

    }
}