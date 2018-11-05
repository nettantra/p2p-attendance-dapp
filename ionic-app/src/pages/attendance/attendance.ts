import {Component, ViewChild} from '@angular/core';
import {Nav, IonicPage, MenuController, NavController, ToastController, LoadingController} from 'ionic-angular';
import * as Web3 from 'web3';
import * as TruffleContract from 'truffle-contract';
import {Storage} from '@ionic/storage';

declare let require: any;
declare let window: any;
let attendee_abi = require('../../../contracts/Attendees.json');
let mark_attendee_abi = require('../../../contracts/MarkAttendance.json');
let evaluation_attendee_abi = require('../../../contracts/EvaluateAttendance.json');

@IonicPage()
@Component({
  selector: 'page-attendance',
  templateUrl: 'attendance.html'
})
export class AttendancePage {

  @ViewChild(Nav) nav: Nav;

  private web3Provider: null;
  AttendeeContract: any;
  MarkAttendeeContract: any;
  EvaluationAttendeeContract: any;
  side_status: boolean = false;
  spinner: boolean = true;
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
  icon_status_p: boolean = false;
  icon_status_a: boolean = false;
  storageForValidation: any = [];
  no_access: boolean = false;
  refreshBtn: boolean = true;
  refreshLoader: boolean = false;
  button_name: string = "SKIP";
  constructor(public navCtrl: NavController, public menu: MenuController, private toastCtrl: ToastController,
              public loadingCtrl: LoadingController, public storage: Storage) {
    this.menu.swipeEnable(false);
    this.web3Provider = new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/fade1c96c8c14e5f8f3131a5343cea1f');
    window.web3 = new Web3(this.web3Provider);
    this.AttendeeContract = TruffleContract(attendee_abi);
    this.AttendeeContract.setProvider(this.web3Provider);
    this.MarkAttendeeContract = TruffleContract(mark_attendee_abi);
    this.MarkAttendeeContract.setProvider(this.web3Provider);
    this.EvaluationAttendeeContract = TruffleContract(evaluation_attendee_abi);
    this.EvaluationAttendeeContract.setProvider(this.web3Provider);
    this.storage.remove('attendance_date');
    this.accountInfo();
    this.attendeeLoad(1);
    this.findDate();
    setTimeout(() => {
      this.spinner = false;
      this.storage.get('attendance_date').then((prev_date) => {
        if (prev_date != this.changeDate()) {
          this.side_status = true;
          this.storageForValidation = [];
          this.storage.set('attendee_address', this.storageForValidation);
        } else {
          this.no_access = true;
        }
      });

    }, 2000);

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

  // async event to talk to blocks
  async talkToContract(slide_num) {
    let electionInstance;
    return await new Promise((resolve, reject) => {
      this.EvaluationAttendeeContract.deployed().then(function (instance) {
        electionInstance = instance;
        console.log(instance);
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
    this.icon_status_a = false;
    this.icon_status_p = false;
    if (this.slide_num - this.attendeesCount == 1) this.lastPageStatus = true;
    if (!this.lastPageStatus) {
      this.spinner = true;
      this.side_status = false;
      this.attendeeLoad(this.slide_num);
    } else {
      let toast = this.toastCtrl.create({
        message: 'No more attendees',
        duration: 2000,
        position: 'bottom'
      });
      toast.present();
      this.refreshAttendee();
    }
    setTimeout(() => {
      this.spinner = false;
      this.button_name = "SKIP";
      this.side_status = true;
    }, 1000);
  }

  // find date
  findDate() {
    let today = new Date();
    this.todayDate = "Date :- " + today.toDateString();
  }

  changeDate() {
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
    this.button_name = "NEXT";
    this.storage.set('attendance_date', this.changeDate());
    let that = this;
    if (!opinion) return false;
    let date = this.changeDate();

    this.storage.get('attendee_address').then((attendees) => {
      console.log(attendees);
      let status = attendees.includes(that.attendeeAddress);
      console.log(status);
      if (!status) {
        if (opinion == 1) {
          let toast = this.toastCtrl.create({
            message: 'You have registered present ',
            duration: 1900,
            position: 'bottom'
          });
          toast.present();
          this.icon_status_p = true;
        }
        else {
          let toast = this.toastCtrl.create({
            message: 'You have registered absent',
            duration: 1900,
            position: 'bottom'
          });
          toast.present();
          this.icon_status_a = true;
        }
        console.log(this.web3Provider, that.attendeeAddress, opinion, that.fromAccount);
        this.storageForValidation.push(that.attendeeAddress);
        this.storage.set('attendee_address', this.storageForValidation);
        this.EvaluationAttendeeContract.deployed().then(function (markAttendanceInstacne) {
          markAttendanceInstacne.markAttendance(that.attendeeAddress, opinion, date, {
            from: that.fromAccount,
            gas: 4700000
          });
        }).catch(function (error) {
          console.log(error);
        });
        setTimeout(() => this.showSlideSkip(), 2000);
      } else {
        let toast = this.toastCtrl.create({message: 'You can not do this', duration: 1200, position: 'bottom'});
        toast.present();
      }
    });


  }

  refreshAttendee() {
    this.refreshBtn = false;
    this.refreshLoader = true;
    setTimeout(() => {
      this.refreshBtn = true;
      this.refreshLoader = false;
      this.navCtrl.setRoot(this.navCtrl.getActive().component);
    }, 1000);

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
