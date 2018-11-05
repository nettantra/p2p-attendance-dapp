import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import * as Web3 from 'web3';
import * as TruffleContract from 'truffle-contract';
declare let require: any;
declare let window: any;
let attendee_abi = require('../../../contracts/Attendees.json');
let mark_attendee_abi = require('../../../contracts/MarkAttendance.json');
let evaluation_attendee_abi = require('../../../contracts/EvaluateAttendance.json');


@Injectable()
export class EthereumApiProvider {
  private web3Provider: null;
  candidates: any;
  attendeesAbi: any;
  AttendeeContract: any;
  MarkAttendeeContract: any;
  EvaluationAttendeeContract: any;
  side_status: boolean = true;

  // 'http://localhost:7545' //'https://ropsten.infura.io/v3/fade1c96c8c14e5f8f3131a5343cea1f'
  constructor(public http: HttpClient) {
    this.web3Provider = new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/fade1c96c8c14e5f8f3131a5343cea1f');
    window.web3 = new Web3(this.web3Provider);
    this.AttendeeContract = TruffleContract(attendee_abi);
    this.AttendeeContract.setProvider(this.web3Provider);
    this.MarkAttendeeContract = TruffleContract(mark_attendee_abi);
    this.MarkAttendeeContract.setProvider(this.web3Provider);
    this.EvaluationAttendeeContract = TruffleContract(evaluation_attendee_abi);
    this.EvaluationAttendeeContract.setProvider(this.web3Provider);
    console.log(this.EvaluationAttendeeContract);
  }

  accountInfo() {
    this.getBlockInfo()
      .then(value => {
        // @ts-ignore
        return value.fromAccount;
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

  // async event to talk to blocks
  async talkToContract(slide_num) {
    let electionInstance;
    return await new Promise((resolve, reject) => {
      this.EvaluationAttendeeContract.deployed().then(function (instance) {
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

  // async event to authenticate users
  async authenticationUser(user_address) {
    return await new Promise((resolve, reject) => {
      this.EvaluationAttendeeContract.deployed().then(function (instance) {
        return instance.authenticateUser(user_address);
      }).then(function (status) {
        return resolve({result: status});
      })
        .catch(function (error) {
          console.log(error);
        });
    });
  }

}
