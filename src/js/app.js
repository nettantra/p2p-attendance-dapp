candidates = [];
App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    slide_num: null,
    secondContract: {},

    init: function () {
        return App.initWeb3();
    },

    initWeb3: function () {
        // TODO: refactor conditional
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        } else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
            web3 = new Web3(App.web3Provider);
        }
        return App.initContract();
        console.log(App.web3Provider);
    },

    initContract: function () {
        $.getJSON("MarkAttendance.json", function (attendee_details) {
            App.secondContract.MarkAttendance = TruffleContract(attendee_details);
            App.secondContract.MarkAttendance.setProvider(App.web3Provider);

        });
        $.getJSON("Attendees.json", function (attendee) {
            // Instantiate a new truffle contract from the artifact
            App.contracts.Attendees = TruffleContract(attendee);
            // Connect provider to interact with contract
            App.contracts.Attendees.setProvider(App.web3Provider);
            return App.render();
        });
    },


    render: function () {
        web3.eth.getCoinbase(function (err, account) {
            if (err === null) {
                App.account = account;
                $("#accountAddress").html("Account: " + account);
            }
        });
        // Load contract data
        App.contracts.Attendees.deployed().then(function (instance) {
            attendeesInstance = instance;
            return attendeesInstance.attendeesCount();
        }).then(function (attendeesCount) {
            for (var i = 1; i <= attendeesCount; i++) {
                attendeesInstance.attendees(i).then(function (attendee) {
                    candidates.push(attendee);
                });
            }
        });
    },
    markAttendance: function (attendanceType) {
        var slide_num = App.slide_num;
        App.secondContract.MarkAttendance.deployed().then(function (markAttendanceInstacne) {
            var attendee_details = candidates[slide_num];
            attendee_public_key = attendee_details[1];
            var date = changeDate();
            markAttendanceInstacne.markAttendance(attendee_public_key, attendanceType, date, {from: App.account});
        }).catch(function (error) {
            console.log(error);
        });
    }


};

$(function () {
    $(window).load(function () {
        $('.addAttendance').hide();
        $('.loadingAttendees').show();
        App.init();
        setTimeout(nextCandidate, 2000);
    });

});

function nextCandidate() {
    var uid, public_key, name, img_url;
    var slide_num = $('.mySlides').attr('slide_num');
    var slide_numInt = parseInt(slide_num, 10);
    App.slide_num = slide_numInt;
    if (candidates.length - slide_numInt == 0) {
        $('.addAttendance').hide();
        $('.loadingAttendees').hide();
        $('.showMessage').show();
    } else {
        var attendee_details = candidates[slide_numInt];
        uid = attendee_details[0].c[0];
        attendee_public_key = attendee_details[1];
        name = attendee_details[2];
        img_url = attendee_details[3];
        $('.text').html('').html(name);
        $("img.attendeeImage").attr('src', img_url);
        $('.mySlides').attr('slide_num', slide_numInt + 1);
        $('.mySlides').attr('attendee_public_key', attendee_public_key);
        $('.loadingAttendees').hide();
        $('.addAttendance').show();
    }

}


function changeDate() {
    var date = new Date();
    // Format day/month/year to two digits
    var formattedDate = ('0' + date.getDate()).slice(-2);
    var formattedMonth = ('0' + (date.getMonth() + 1)).slice(-2);
    var formattedYear = date.getFullYear().toString().substr(2, 2);
    // Combine and format date string
    var dateString = formattedDate + '/' + formattedMonth + '/' + formattedYear;
    return dateString;

}


