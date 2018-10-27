import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import * as Web3 from 'web3';
import * as TruffleContract from 'truffle-contract';

declare let require: any;
declare let window: any;
let attendee_abi = require('../../../../build/contracts/Attendees.json');
let mark_attendee_abi = require('../../../../build/contracts/MarkAttendance.json');


@Injectable()
export class EthereumApiProvider {
  private web3Provider: null;
  candidates: any;
  attendeesAbi: any;
  AttendeeContract:any;
  side_status:boolean = true;
  constructor(public http: HttpClient) {
    this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    window.web3 = new Web3(this.web3Provider);
     this.AttendeeContract = TruffleContract(attendee_abi);
    this.AttendeeContract.setProvider(this.web3Provider);

  }


  /*
    var count =  instance.attendeesCount();
    console.log(count);
    for(let i = 1; i<=2;i++) {
    instance.attendees(i).then(function (attendee) {
      console.log(attendee);
    });
  */

// get account info
  async getAccountInfo() {
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


   showAttendee(page_num = 1) {
    let electionInstance;
    let attendee_r;
    return  new Promise((resolve, reject) => {
      this.AttendeeContract.deployed().then(function (instance) {
        electionInstance = instance;
        return instance.attendeesCount();
      }).then(function (attendeesCount) {
        electionInstance.attendees(page_num).then(function(attendee) {
          attendee_r =  attendee;
          console.log(attendee_r);
        });
        return resolve(attendee_r);
      }).catch(function (error) {
        console.log(error);
      });
    });



    // await this.AttendeeContract.deployed().then(function (instance) {
    //   electionInstance = instance;
    //   return instance.attendeesCount();
    // }).then(function (attendeesCount) {
    //     electionInstance.attendees(page_num).then(function(attendee) {
    //        attendee_r =  attendee;
    //     });
    // }).catch(function (error) {
    //   console.log(error);
    // });

   // console.log(this.candidates);
    //return this.candidates;

    /* let that = this;
     return new Promise((resolve, reject) => {
       let Attendee = TruffleContract(attendee_abi);
       Attendee.setProvider(that.web3Provider);
       Attendee.deployed().then(function (instance) {
         return instance.attendeesCount();
       }).then(function (attendeesCount) {
         return attendeesCount;
       }).catch(function (error) {
         console.log(error);
         return reject("Error in transferEther service call");
       });
     });*/
  }


}
