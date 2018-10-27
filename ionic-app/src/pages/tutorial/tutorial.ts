import {Component} from '@angular/core';
import {IonicPage, MenuController, NavController, Platform} from 'ionic-angular';
import * as Web3 from 'web3';
import * as TruffleContract from 'truffle-contract';


declare let require: any;
declare let window: any;
let attendee_abi = require('../../../../build/contracts/Attendees.json');
let mark_attendee_abi = require('../../../../build/contracts/MarkAttendance.json');


export interface Slide {
  title: string;
  description: string;
  image: string;
}

@IonicPage()
@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})
export class TutorialPage {
  private web3Provider: null;
  AttendeeContract: any;
  side_status: boolean = true;
  attendee_name: string = "";
  attendee_img: string = "";
  attendeeId: string = "";
  attendeeAddress: string = "";
  todayDate:string = "";
  slide_num:number = 1;
  attendeesCount:number = 1;
  lastPageStatus:boolean=false;
  constructor(public navCtrl: NavController, public menu: MenuController,
              public platform: Platform) {
    this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    window.web3 = new Web3(this.web3Provider);
    this.AttendeeContract = TruffleContract(attendee_abi);
    this.AttendeeContract.setProvider(this.web3Provider);
   this.attendeeLoad(1);
   this.findDate();
  }

  // attendeeLoad
  attendeeLoad(page_num =1){
    this.talkToContratc(page_num)
      .then(value => {
        // @ts-ignore
        let slidedata = value.attendee_details ;
        // @ts-ignore
        this.attendeesCount = value.total_attendee_count ;

        this.attendeeId =(slidedata[0]);
        this.attendeeAddress =(slidedata[1]);
        this.attendee_name =(slidedata[2]);
        this.attendee_img =(slidedata[3]);
        this.slide_num++;
      }).catch(function (error) {

    });
  }
  // asynch event to talk to blocks
  async talkToContratc(page_num) {
    let electionInstance;
    let attendee_r;
    return await new Promise((resolve, reject) => {
      this.AttendeeContract.deployed().then(function (instance) {
        electionInstance = instance;
        return instance.attendeesCount();
      }).then(function (attendeesCount) {
        electionInstance.attendees(page_num).then(function (attendee) {
          console.log(attendeesCount);
          return resolve({attendee_details:attendee,total_attendee_count:attendeesCount});
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
  findDate(){
    let today = new Date();
    this.todayDate = "Date :- " + today.toDateString();
  }

  // mark attendance and save opinion
  markAttendance(){

  }

}
