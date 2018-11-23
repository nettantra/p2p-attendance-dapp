import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import * as Web3 from 'web3';
import * as TruffleContract from 'truffle-contract';
import {Storage} from "@ionic/storage";
import {Observable} from "rxjs";

declare let require: any;
declare let window: any;
let employees: any = [];
let accountOwner: '0x0';

//local ganache
let evaluation_attendee_abi = require('../../../../build/contracts/EvaluateAttendance.json');
let provider_url = 'http://localhost:7545';

// test node ropsten/rinkeby
// let evaluation_attendee_abi = require('../../../contracts/EvaluateAttendance.json');
// let provider_url = 'https://ropsten.infura.io/v3/fade1c96c8c14e5f8f3131a5343cea1f';


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

    // all the employee list
    employees = [];
    let evaluationInstance;
    this.EvaluationAttendeeContract.deployed().then(function (instance) {
      evaluationInstance = instance;
      return evaluationInstance.attendeesCount();
    }).then(function (attendeesCount) {
      for (let i = 1; i <= attendeesCount; i++) {
        evaluationInstance.attendees(i).then(function (attendee) {
          employees.push(attendee);
        }).catch(function (err) {
          console.log(err);
        })
      }
    }).catch(function (err) {
      console.log(err);
    });

    this.getBlockInfo();
  }

  ionViewDidLoad() {
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
              accountOwner = account;
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
    let evaluationInstance;
    if (slide_num <= max_attendee) {
      return await new Promise((resolve, reject) => {
        this.EvaluationAttendeeContract.deployed().then(function (instance) {
          evaluationInstance = instance;
          return instance.attendeesCount();
        }).then(function (attendeesCount) {
          evaluationInstance.attendees(random_num).then(function (attendee) {
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

  //event to get all the employees
  getAllAttendee(params?: any) {
    if (!params) {
      return employees;
    }
    return employees.filter((employee) => {
      for (let key in params) {
        let field = employee[2];
        if (field && params) {
          if (typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
            return employee;
          } else if (field == params[key]) {
            return employee;
          }
        } else return employees;
      }
      return null;
    });
  }

  //event to  add new employee
  addNewEmployee(params?: any) {
    if (!params) {
      return employees;
    }
    // add attendee to local memory in array
    let that = this;
    let EvaluateInstance;
    this.EvaluationAttendeeContract.deployed().then(function (instance) {
      EvaluateInstance = instance;
      return EvaluateInstance.attendeesCount()
        .then(function (count) {
          employees.push([Number(count) + 1, params.address, params.name, params.designation, params.image]);
        })
    });

    // add attendee to blocks
    new Promise((resolve, reject) => {
      this.EvaluationAttendeeContract.deployed().then(function (instance) {
        instance.addAttendee(params.name, params.designation, params.image, params.address, {
          from: accountOwner,
          gas: 4700000
        });
        resolve({result: true});
      }).catch(function (error) {
        console.log(error);
      });
    });
    return employees;
  }

  // async event to get attendance result of employee
  async getAttendanceReport(params?: any) {
    if (!params) {
      return "Nothing"
    }
    // evaluation process
    new Promise((resolve, reject) => {
      this.EvaluationAttendeeContract.deployed().then((instance) => {
        return instance.evaluation(this.dateInSeconds(), {
          from: accountOwner,
          gas: 4700000
        }).then(function (res) {
          console.log(res);
          resolve({result: true});
        }).catch(function (err) {
          console.log(err);
        });
      }).catch(function (error) {
        console.log(error);
      });
    });
    let evaluationInstance;
    return await new Promise((resolve, reject) => {
      this.EvaluationAttendeeContract.deployed().then(function (instance) {
        evaluationInstance = instance;
        return evaluationInstance.evaluateCount()
          .then(function (evaluationCount) {
            for (let i = 1; i < evaluationCount; i++) {
              evaluationInstance.evaluated_attendees(i).then(function (attendee_res) {
                if (attendee_res[0].toLowerCase() == params.toLowerCase()) {
                  console.log(attendee_res[0], attendee_res[1], params.toLowerCase())
                  if (parseInt(attendee_res[1]) == 2)
                    return resolve({result: "A"});
                  else if (parseInt(attendee_res[1]) == 1)
                    return resolve({result: "P"});
                  else return resolve({result: "N/A"});
                }
              }).catch(function (err) {
                console.log(err);
              })
            }
          })
      }).catch(function (error) {
        console.log(error);
      });
    });
  }

  // get complete attendance report
  moreAttendanceResult(address,pagination_limit) {
    return new Observable((observer) => {
      for (let i = 0; i < pagination_limit; i++) {
        observer.next(this.getResult(this.dateInSeconds() - (86400000 * i), address))
      }
    });
  }

  // get result by date and address
  getResult(date, address) {
    return new Promise((resolve, reject) => {
      this.EvaluationAttendeeContract.deployed().then((instance) => {
        return instance.attendanceResult(date, address).then(function (res) {
          resolve({attendance: res.toString(), date: date});
        }).catch(function (err) {
          resolve({attendance: 0, date: date});
        });
      }).catch(function (error) {
        resolve({attendance: 0, date: date});
      });
    });
  }

  // get seconds from date
  dateInSeconds() {
    let date = new Date();
    let formattedDate = ('0' + date.getDate()).slice(-2);
    let formattedMonth = ('0' + (date.getMonth() + 1)).slice(-2);
    let formattedYear = date.getFullYear().toString();
    let dateString = formattedYear + '-' + formattedMonth + '-' + formattedDate;
    let d = new Date(dateString);
    let seconds = d.getTime();
    return seconds;
  }

  // get date from seconds
  secondsInDate(seconds) {
    let date = new Date(seconds);
    let day = date.toDateString();
    return day;
  }

}
