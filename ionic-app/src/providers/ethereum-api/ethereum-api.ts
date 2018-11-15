import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import * as Web3 from 'web3';
import * as TruffleContract from 'truffle-contract';
import {Storage} from "@ionic/storage";

declare let require: any;
declare let window: any;

//local ganache
// let evaluation_attendee_abi = require('../../../../build/contracts/EvaluateAttendance.json');
// let provider_url = 'http://localhost:7545';

// test node ropsten/rinkeby
let evaluation_attendee_abi = require('../../../contracts/EvaluateAttendance.json');
let provider_url = 'https://ropsten.infura.io/v3/fade1c96c8c14e5f8f3131a5343cea1f';


@Injectable()
export class EthereumApiProvider {
  private web3Provider: null;
  EvaluationAttendeeContract: any;
  attendanceMarker: string = "";

  constructor(public http: HttpClient, public storage: Storage) {
    this.web3Provider = new Web3.providers.HttpProvider(provider_url);
    window.web3 = new Web3(this.web3Provider);
    this.EvaluationAttendeeContract = TruffleContract(evaluation_attendee_abi);
    this.EvaluationAttendeeContract.setProvider(this.web3Provider);
    this.storage.get('auth_key').then((key) => {
      if (typeof key != "undefined") this.attendanceMarker = key;
    });

  }

  // async event to get total number of attendee
  async getTotalNumberAttendee() {
    return await new Promise((resolve, reject) => {
      this.EvaluationAttendeeContract.deployed().then(function (instance) {
        return instance.attendeesCount()
          .then((count) => {
            return resolve({result: count.toString()});
          })
      }).catch(function (error) {
        console.log(error);
      });
    });
  }

  // async get block info
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

  // async event to talk to blocks
  async talkToContract(slide_num, random_num = 1, max_attendee = 5) {
    // console.log(random_num);
    let electionInstance;
    if (slide_num <= max_attendee) {
      return await new Promise((resolve, reject) => {
        this.EvaluationAttendeeContract.deployed().then(function (instance) {
          electionInstance = instance;
          return instance.attendeesCount();
        }).then(function (attendeesCount) {
          electionInstance.attendees(random_num).then(function (attendee) {
            return resolve({attendee_details: attendee, total_attendee_count: attendeesCount, status: 200});
          });
        }).catch(function (error) {
          console.log(error);
        });
      });
    } else {
      return await new Promise((resolve, reject) => {
        return resolve({attendee_details: '', total_attendee_count: '', status: 400});
      });
    }
  }

  // for mark attendance
  async markAttendance(attendeeAddress, opinion, date, fromAccount) {
    return await new Promise((resolve, reject) => {
      this.EvaluationAttendeeContract.deployed().then(function (instance) {
        instance.markAttendance(attendeeAddress, opinion, date, {
          from: fromAccount,
          gas: 4700000
        });
        return resolve({result: true});
      }).catch(function (error) {
        console.log(error);
      });
    });
  }

  // async event to authenticate users
  async authenticationUser(user_address) {
    return await new Promise((resolve, reject) => {
      this.EvaluationAttendeeContract.deployed().then(function (instance) {
        console.log(instance);
        return instance.authenticateUser(user_address);
      }).then(function (status) {
        if (status) return resolve({result: status, status: 200, msg: "Successfully SignedIn"});
        else return resolve({result: status, status: 201, msg: "Not found try again"});
      })
        .catch(function (error) {
          return resolve({result: status, status: 400, msg: "Not a valid address"});
        });
    });
  }

}
