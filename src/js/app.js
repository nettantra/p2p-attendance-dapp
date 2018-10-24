candidates = [];
App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
    console.log(App.web3Provider);
  },

  initContract: function() {
    $.getJSON("Participants.json", function(participant) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Participants = TruffleContract(participant);
      // Connect provider to interact with contract
      App.contracts.Participants.setProvider(App.web3Provider);

      return App.render();
    });
  },


  render: function() {
    var attendanceInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();


    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Account: " + account);
      }
    });

    // Load contract data
    App.contracts.Participants.deployed().then(function(instance) {
      attendanceInstance = instance;
      return attendanceInstance.participantsCount();
    }).then(function(participantsCount) {

         // $(".slidesAppend").empty();

        for (var i = 1; i <= participantsCount; i++) {

          attendanceInstance.participants(i).then(function (attendee) {

                var id = attendee[0];
                var name = attendee[1];
                var present = attendee[2];
                var absent = attendee[3];
                var dn = attendee[4];
                var result = 0;
                // Render attendee Result
              var attendeeTemplate = '<div class="mySlides "> <div class="text">Mr. Sammer</div><div class="numbertext">1 / 3</div> <img  style="width: 106%; height: 300px"  src="https://amp.businessinsider.com/images/5ac518b57a74af23008b4642-750-563.jpg"> </div>';
              // $(".slidesAppend").html(attendeeTemplate);

            });
        }

    }).then(function() {
      loader.hide(),content.show();
    }).catch(function(error) {
      console.log(error);
    });
  },
    registerAttendance: function (employeeId=0,attendanceType=0,) {
        if(!employeeId || !attendanceType)  return false;
        App.contracts.Participants.deployed().then(function (contractInstacne) {

          /* contractInstacne.attendeeDetailsCount().then(function (c) {
               registerAttendanceCount = c.c[0];
          });
*/

        /*   console.log(registerAttendanceCount);
          for(var i = 0 ; i < registerAttendanceCount; i++){
            console.log("me");
          }*/
          // console.log(contractInstacne.attendeeDetails(1));
             contractInstacne.registerAttendance(employeeId,attendanceType,{from : App.account});

        }).catch(function(error) {
            console.log(error);
        });
    }


};

$(function() {
  $(window).load(function() {
    App.init();
  });

});

function nextCandidate(){
    console.log(candidates);
}


