App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasMarked: false,

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
  },

  initContract: function() {
    $.getJSON("Attendance.json", function(attendance) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Attendance = TruffleContract(attendance);
      // Connect provider to interact with contract
      App.contracts.Attendance.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.Attendance.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.markedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
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
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    App.contracts.Attendance.deployed().then(function(instance) {
      attendanceInstance = instance;
      return attendanceInstance.attendeesCount();
    }).then(function(attendeesCount) {
      var attendeesResults = $("#attendeesResults");
      attendeesResults.empty();

      var attendeesSelect = $('#attendeesSelect');
      attendeesSelect.empty();

      for (var i = 1; i <= attendeesCount; i++) {
        attendanceInstance.attendees(i).then(function(attendee) {
          var id = attendee[0];
          var name = attendee[1];
          var present = attendee[2];
          var absent = attendee[3];


          // Render attendee Result
          var attendeeTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + present + "</td><td>" + absent + "</td></tr>"
          attendeesResults.append(attendeeTemplate);

          // Render attendee ballot option
          var attendeeOption = "<option value='" + id + "' >" + name + "</ option>"
          attendeesSelect.append(attendeeOption);
        });
      }
      return attendanceInstance.employees(App.account);
    }).then(function(hasMarked) {
      // Do not allow a user to vote
      if(hasMarked) {
        $('form').hide();
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  mark: function(status) {
    var attendeeId = $('#attendeesSelect').val();
    App.contracts.Attendance.deployed().then(function(instance) {
      if(status == "present")
        return instance.markpresent(attendeeId, { from: App.account })
      else if(status == "absent")
        return instance.markabsent(attendeeId, { from: App.account })
    }).then(function(result) {
      // Wait for attendance to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  }





};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
