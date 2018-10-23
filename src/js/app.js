App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

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

         $("#attendeesResults").empty();

        for (var i = 1; i <= participantsCount; i++) {

          attendanceInstance.participants(i).then(function (attendee) {
                var id = attendee[0];
                var name = attendee[1];
                var present = attendee[2];
                var absent = attendee[3];
                var dn = attendee[4];
                var result = 0;
                // Render attendee Result
                var attendeeTemplate = "<tr><td>" + id + "</td><td>" + name + "</td><td>" + present + "</td><td>" + absent + "</td><td>" + dn + "</td><td>" + result + "</td><td><button type=\"button\" class=\"btn btn-success\">P</button><button type=\"button\" style='margin-left: 5px;' class=\"btn btn-danger\">A</button><button type=\"button\"  style='margin-left: 5px;' class=\"btn btn-warning\">D/N</button></td></tr>";
                $("#attendeesResults").append(attendeeTemplate);

            });
        }


      //return attendanceInstance.voters(App.account);
    }).then(function(hasVoted) {
      // Do not allow a user to vote
      if(hasVoted) {
        $('form').hide();
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.log(error);
    });
  },

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
