var Participants = artifacts.require("./Participants.sol");

contract("Participants",function (accounts) {

    var participantInstance;
    // check the total number of participants
    it("initialised with three participants",function () {
       return  Participants.deployed().then(function(instance) {
           return instance.participantsCount();
       }).then(function (count) {
           assert.equal(count,3);
       });
    });

    // for checking the values are same or not
    it("it initialises the participants with the correct values ",function () {
        return  Participants.deployed().then(function(instance) {
            participantInstance=instance;
            return participantInstance.participants(1);
        }).then(function (participant) {
            assert.equal(participant[0],1,"Contains the correct id");
            assert.equal(participant[1],"Biswaindu","Contains the correct name");
            assert.equal(participant[2],0,"Contains the correct attendance count ");
            return participantInstance.participants(2);
        }).then(function (participant) {
            assert.equal(participant[0],2,"Contains the correct id");
            assert.equal(participant[1],"Sibabrat","Contains the correct name");
            assert.equal(participant[2],0,"Contains the correct attendance count ");
        });
    });
});
