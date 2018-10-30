import {Component} from '@angular/core';
import {IonicPage, MenuController, NavController} from 'ionic-angular';
import * as Web3 from 'web3';
import * as TruffleContract from 'truffle-contract';

declare let require: any;
declare let window: any;
let attendee_abi = require('../../../../build/contracts/Attendees.json');
let mark_attendee_abi = require('../../../../build/contracts/MarkAttendance.json');

@IonicPage()
@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})
export class TutorialPage {
  private web3Provider: null;
  AttendeeContract: any;
  MarkAttendeeContract: any;
  side_status: boolean = true;
  attendee_name: string = "";
  attendee_img: string = "";
  attendeeId: string = "";
  attendeeAddress: string = "";
  todayDate: string = "";
  slide_num: number = 1;
  attendeesCount: number = 1;
  lastPageStatus: boolean = false;
  fromAccount: string = "";
  rand: number;

  constructor(public navCtrl: NavController, public menu: MenuController) {
    this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    window.web3 = new Web3(this.web3Provider);
    this.AttendeeContract = TruffleContract(attendee_abi);
    this.AttendeeContract.setProvider(this.web3Provider);
    this.MarkAttendeeContract = TruffleContract(mark_attendee_abi);
    this.MarkAttendeeContract.setProvider(this.web3Provider);

    this.accountInfo();
    this.attendeeLoad(1);
    this.findDate();

  }

  //get account info
  accountInfo() {
    this.getBlockInfo()
      .then(value => {
        // @ts-ignore
        this.fromAccount = value.fromAccount;
      }).catch(function (error) {

    });
  }

  // get block info
  async getBlockInfo() {
    return await new Promise((resolve, reject) => {
      window.web3.eth.getCoinbase(function (err, account) {
        if (err === null) {
          window.web3.eth.getBalance(account, function (err, balance) {
            if (err === null) {
              return resolve({fromAccount: account, balance: (window.web3.fromWei(balance, "ether")).toNumber()});
            } else {
              return reject({fromAccount: "error", balance: 0});
            }
          });
        }
      });
    });
  }

  // attendeeLoad
  attendeeLoad(slide_num = 1) {
    this.talkToContract(slide_num)
      .then(value => {
        // @ts-ignore
        let slidedata = value.attendee_details;
        // @ts-ignore
        this.attendeesCount = value.total_attendee_count;
        this.attendeeId = (slidedata[0]);
        this.attendeeAddress = (slidedata[1]);
        this.attendee_name = (slidedata[2]);
        this.attendee_img = (slidedata[3]);
        this.slide_num++;
      }).catch(function (error) {

    });
  }

  // asynch event to talk to blocks
  async talkToContract(slide_num) {
    let electionInstance;
    return await new Promise((resolve, reject) => {
      this.AttendeeContract.deployed().then(function (instance) {
        electionInstance = instance;
        return instance.attendeesCount();
      }).then(function (attendeesCount) {
        electionInstance.attendees(slide_num).then(function (attendee) {
          return resolve({attendee_details: attendee, total_attendee_count: attendeesCount});
        });
      }).catch(function (error) {
        console.log(error);
      });
    });
  }

  // load next attendee randomly
  showSlideSkip() {
    if (this.slide_num - this.attendeesCount == 1) this.lastPageStatus = true;
    if (!this.lastPageStatus) this.attendeeLoad(this.slide_num);
  }

  // find date
  findDate() {
    let today = new Date();
    this.todayDate = "Date :- " + today.toDateString();
  }

  changeDate() {

   /* let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1; //January is 0!
    let yyyy = today.getFullYear();

    if(dd<10) {
      // @ts-ignore
      dd = '0'+dd;
    }

    if(mm<10) {
      // @ts-ignore
      mm = '0'+mm;
    }

    // @ts-ignore
    today = yyyy + '-' + mm + '-' + dd;
    let date_ = new Date(today);
    let seconds = date_.getTime() / 1000;
*/

    let date = new Date();
    let formattedDate = ('0' + date.getDate()).slice(-2);
    let formattedMonth = ('0' + (date.getMonth() + 1)).slice(-2);
    let formattedYear = date.getFullYear().toString();
    let dateString = formattedYear + '-' + formattedMonth + '-' + formattedDate;
    let date_format = new Date(dateString);
    let seconds = date_format.getTime() / 1000
    return seconds;

  }

  // mark attendance and save opinion
  markAttendance(opinion = 0) {
    let that = this;
    if (!opinion) return false;
    let date = this.changeDate();
    console.log(this.web3Provider);
    this.MarkAttendeeContract.deployed().then(function (markAttendanceInstacne) {
      markAttendanceInstacne.markAttendance(that.attendeeAddress, opinion, date, {from: that.fromAccount},
        {from: that.fromAccount, gas: 4700000});
    }).catch(function (error) {
      console.log(error);
    });
  }

  async createRandomNumber() {
    let number_array = [];
    for (let i = 2; i <= this.attendeesCount; i++) {
      number_array.push(this.attendeesCount);
    }
    let rand = await number_array[Math.floor(Math.random() * number_array.length)];
    this.rand = rand;
  }
}
