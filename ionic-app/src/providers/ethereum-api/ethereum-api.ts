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
let result_array: any = [];
let final_array: any = [];


import * as Tx from 'ethereumjs-tx';
let CryptoJS = require('crypto-js')
let coder = require('../../../node_modules/web3/lib/solidity/coder');


//local ganache
// let evaluation_attendee_abi = require('../../../../build/contracts/EvaluateAttendance.json');
// let provider_url = 'http://localhost:7545';

// test node ropsten/rinkeby
let evaluation_attendee_abi = require('../../../contracts/EvaluateAttendance.json');
let provider_url = 'https://ropsten.infura.io/v3/d5bca90ec3084aee8abd468fdf876a92';

@Injectable()
export class EthereumApiProvider {

  private owner_account:any = "0x25bA673A96acadD7A02f4c5834Ba80C1AF6b7758";
  private owner_private_key:any = "8EBCE844C5C2B68159CDC95933B010E6CB1DEB8CB0B6FD7EC3295A15E05C627E";
  private to_contract_address:any = "0xc1bf4fb1519c8061a4e096a0d2b4c6153c9f9708";
  private account_details: any[] = [
    {
      'public_address': '0x25bA673A96acadD7A02f4c5834Ba80C1AF6b7758',
      private_key: '8EBCE844C5C2B68159CDC95933B010E6CB1DEB8CB0B6FD7EC3295A15E05C627E'
    },
    {
      'public_address': '0xE4b5d53BDe0Ea9948cCe22cA6411F70b28E38f41',
      private_key: '2B3B808D1C3B8DD4A40F927071ED9B08C24D51E5E14E956721B932CDA2137547'
    },
    {
      'public_address': '0xaaaBe0cf13cd5A722561c293602851714D2e593d',
      private_key: '02F9D2029E86DB5987DB75F80D6CF5083DB8A7C6E71DD43CA3726B49E7CF3AC9'
    },
    {
      'public_address': '0x3590415CD6596Da5015CD2810e5F5Ac04E6D7A77',
      private_key: '8B20F56DA512B7CE2C3BE503AABA9FD4FF831E25F2EF37E70307EDE811701D79'
    },
    {
      'public_address': '0x79e32f46b4C1fC8EDE6465Bd17E2D64CE4a2A41b',
      private_key: 'D05FABE2EDDB3F79B269ADD9DF99D6056DE9159BBB73136F0C5E8EC9D7D4C4A1'
    },
    {
      'public_address': '0x1CC4ffc74a149b6aACA316e80235f7D62f161b20',
      private_key: 'EF038B766290AE1365339B5428241459A199BADF8B4B5FE2A61D5BCA097F812B'
    },
    {
      'public_address': '0x1AaED6720B2e7Cb215b8b22870153C53EACf4A85',
      private_key: 'DDA22498F925BD328AEF97273AC16752548B3AA86DA62A09A7CF4DBA79FA5938'
    },
    {
      'public_address': '0x669D42d970F7ab357fEe9615283ef34FaFAd9f14',
      private_key: '60E34CA1EE665F1C0E0C1BA06E1F34EC2F89B038CC4C65160696AB96336DEC2B'
    },
    {
      'public_address': '0x97E290c59bc4EB459e4911c0e56ba8ef668F8FF9',
      private_key: '08A8786E3B3E71467578A9773943BA630B6C730F0B117118AB9646A4C066A5C4'
    },
    {
      'public_address': '0xDb26649299feA466F6663903d121f398e4dfe48d',
      private_key: '5155D75022F101E99C4AA363E8FE1834243DC7680FFC7188700E40512B975C54'
    }

  ]

  private web3Provider: null;
  EvaluationAttendeeContract: any;
  attendanceMarker: string = "";

  constructor(public http: HttpClient, public storage: Storage) {
    this.web3Provider = new Web3.providers.HttpProvider(provider_url);
    window.web3_ = new Web3(this.web3Provider);
    this.EvaluationAttendeeContract = TruffleContract(evaluation_attendee_abi);
    this.EvaluationAttendeeContract.setProvider(this.web3Provider);
    // window.web3.eth.defaultAccount = '0x25bA673A96acadD7A02f4c5834Ba80C1AF6b7758';
    this.storage.get('auth_key').then((key) => {
      console.log(key);
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
          if (attendee[5] == 1) employees.push(attendee);
          // console.log(attendee);
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
  async getTotalNumberAttendee(user_add: string) {
    if (!user_add) return {result: "", status: 400, msg: "LoginId Not Found"};

    final_array = [];
    employees.forEach(function (employee) {
      if (employee[1].toLowerCase() != user_add.toLowerCase()) final_array.push(employee)
    });
    if (typeof final_array != 'undefined') return {result: final_array.length, status: 200, msg: "Data fetched"};
    else return {result: "", status: 401, msg: "No data found"};
  }

  // async get block info
  async getBlockInfo() {
    return await new Promise((resolve, reject) => {
      window.web3_.eth.getCoinbase(function (err, account) {
        if (err === null) {
          window.web3_.eth.getBalance(account, function (err, balance) {
            if (err === null) {
              accountOwner = account;
              return resolve({fromAccount: account, balance: (window.web3_.fromWei(balance, "ether")).toNumber()});
            } else {
              return reject({fromAccount: "error", balance: 0});
            }
          });
        }
      });
    });
  }

  // async event to talk to blocks
  async talkToContract(slide_num, random_num = 1) {
    return {attendee_details: final_array[random_num]};
  }

  // for mark attendance
  async markAttendance(attendeeAddress, opinion, date, fromAccount) {
    let pvt_key = this.account_details.find(item => item.public_address === fromAccount).private_key;
    if (!pvt_key && !attendeeAddress && !opinion && !date && !fromAccount) {
      return await new Promise((resolve, reject) => {
        return resolve(false);
      });
    }
    let that = this;
    let evaluationContract;
    return await new Promise((resolve, reject) => {
      this.EvaluationAttendeeContract.deployed().then(function (instance) {
        evaluationContract = instance;
        return evaluationContract.validateAttendance(attendeeAddress, date, {from: fromAccount, gas: 4700000})
          .then((res) => {
            if (!res) {
              let account = fromAccount;
              let nonce = that.getNonce(fromAccount);
              let myPrivateKey = pvt_key;
              console.log(nonce,fromAccount,myPrivateKey);
              let privateKey = new Buffer(myPrivateKey, 'hex');
              let functionName = 'markAttendance';
              let types = ['address', 'uint256', 'uint256'];
              let args = [attendeeAddress, opinion, date]; //1543968000000
              let fullName = functionName + '(' + types.join() + ')';
              let signature = CryptoJS.SHA3(fullName, {outputLength: 256}).toString(CryptoJS.enc.Hex).slice(0, 8);
              let dataHex = signature + coder.encodeParams(types, args);
              let data = '0x' + dataHex;
              // let nonce = web3.toHex();
              let gasPrice = window.web3_.toHex(500000000000); // 500 Gwei
              let gasLimitHex = window.web3_.toHex(6000000);

              let rawTx = {
                'nonce': nonce,
                'gasPrice': gasPrice,
                'gasLimit': gasLimitHex,
                'from': account,
                'to': this.to_contract_address, //0x10847e8e0c704e610e5ae6971990c26a01d55cac
                'data': data,
                // 'value': window.web3_.toHex(window.web3_.toWei("0.5", "ether")),
              }
              let tx = new Tx(rawTx);
              tx.sign(privateKey);
              tx.serialize();
              console.log(tx.validate());
              let serializedTx = '0x' + tx.serialize().toString('hex');
              console.log(serializedTx);
              return resolve(serializedTx);
            }
          }).catch((error) => {
            resolve(false);
          })
      }).catch(function (error) {
        resolve(false);
      });
    });
  }

  // get nonce value
  getNonce(account) {
    return window.web3_.toHex(window.web3_.eth.getTransactionCount(account));
  }

  // send raw transaction
  async sendRawTransactions(serializedTx) {
    await window.web3_.eth.sendRawTransaction(serializedTx, function (err, txHash) {
      console.log(err, txHash)
    })
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
      return new Promise((resolve, reject) => {
        return resolve({'serializedTx': "", employees: employees});
      });
    }
    // add attendee to local memory in array
    let EvaluateInstance;
    this.EvaluationAttendeeContract.deployed().then(function (instance) {
      EvaluateInstance = instance;
      return EvaluateInstance.attendeesCount()
        .then(function (count) {
          employees.push([Number(count) + 1, params.address, params.name, params.designation, params.image, 1]);
        })
    });

    let that = this;
    return new Promise((resolve, reject) => {
      let account = this.owner_account;
      let nonce = that.getNonce(account);
      let myPrivateKey = this.owner_private_key;
      let privateKey = new Buffer(myPrivateKey, 'hex');
      let functionName = 'addAttendee';
      let types = ['string', 'string', 'string', 'address', 'uint256'];
      let args = [params.name, params.designation, params.image, params.address, 1];
      let fullName = functionName + '(' + types.join() + ')';
      let signature = CryptoJS.SHA3(fullName, {outputLength: 256}).toString(CryptoJS.enc.Hex).slice(0, 8);
      let dataHex = signature + coder.encodeParams(types, args);
      let data = '0x' + dataHex;
      // let nonce = web3.toHex();
      let gasPrice = window.web3_.toHex(500000000000); // 500 Gwei
      let gasLimitHex = window.web3_.toHex(6000000);

      let rawTx = {
        'nonce': nonce,
        'gasPrice': gasPrice,
        'gasLimit': gasLimitHex,
        'from': account,
        'to': this.to_contract_address,
        'data': data,
        // 'value': window.web3_.toHex(window.web3_.toWei("0.5", "ether")),
      }
      let tx = new Tx(rawTx);
      tx.sign(privateKey);
      tx.serialize();
      console.log(tx.validate());
      let serializedTx = '0x' + tx.serialize().toString('hex');
      return resolve({'serializedTx': serializedTx, employees: employees});
    }).catch((error) => {
      return new Error();
    })

  }

  // for edit employee
  editEmployee(params?: any) {
    if (!params) {
      return new Promise((resolve, reject) => {
        return resolve({'serializedTx': "", employees: employees});
      });
    }
    employees.forEach(function (employee) {
      if (employee[1] == params.address) {
        employee[1] = params.address;
        employee[2] = params.name;
        employee[3] = params.designation;
        employee[4] = params.image;
      }
    });

    let that = this;
    return new Promise((resolve, reject) => {
      let account = this.owner_account;
      let nonce = that.getNonce(account);
      let myPrivateKey = this.owner_private_key;
      let privateKey = new Buffer(myPrivateKey, 'hex');
      let functionName = 'updateAttendee';
      let types = ['address', 'string', 'string', 'string', 'uint256'];
      let args = [params.address, params.name, params.designation, params.image, 1];
      let fullName = functionName + '(' + types.join() + ')';
      let signature = CryptoJS.SHA3(fullName, {outputLength: 256}).toString(CryptoJS.enc.Hex).slice(0, 8);
      let dataHex = signature + coder.encodeParams(types, args);
      let data = '0x' + dataHex;
      // let nonce = web3.toHex();
      let gasPrice = window.web3_.toHex(500000000000); // 500 Gwei
      let gasLimitHex = window.web3_.toHex(6000000);

      let rawTx = {
        'nonce': nonce,
        'gasPrice': gasPrice,
        'gasLimit': gasLimitHex,
        'from': account,
        'to': this.to_contract_address,
        'data': data,
        // 'value': window.web3_.toHex(window.web3_.toWei("0.5", "ether")),
      }
      let tx = new Tx(rawTx);
      tx.sign(privateKey);
      tx.serialize();
      console.log(tx.validate());
      let serializedTx = '0x' + tx.serialize().toString('hex');
      console.log(serializedTx);
      return resolve({'serializedTx': serializedTx, employees: employees});

    });


  }

  async deleteEmployee(index?: any, emp_addr?: any, status?: any) {
    if (!emp_addr && !status) {
      return new Promise((resolve, reject) => {
        return resolve(false);
      });
    }

    let that = this;
    return new Promise((resolve, reject) => {
      let account = this.owner_account;
      let nonce = that.getNonce(account);
      console.log(nonce);
      let myPrivateKey = this.owner_private_key;
      let privateKey = new Buffer(myPrivateKey, 'hex');
      let functionName = 'changeStatusEmployee';
      let types = ['address', 'uint256'];
      let args = [emp_addr, status];
      let fullName = functionName + '(' + types.join() + ')';
      let signature = CryptoJS.SHA3(fullName, {outputLength: 256}).toString(CryptoJS.enc.Hex).slice(0, 8);
      let dataHex = signature + coder.encodeParams(types, args);
      let data = '0x' + dataHex;
      let gasPrice = window.web3_.toHex(500000000000); // 500 Gwei
      let gasLimitHex = window.web3_.toHex(6000000);

      let rawTx = {
        'nonce': nonce,
        'gasPrice': gasPrice,
        'gasLimit': gasLimitHex,
        'from': account,
        'to': this.to_contract_address,
        'data': data,
        // 'value': window.web3_.toHex(window.web3_.toWei("0.5", "ether")),
        'chainId': '0x03'
      }
      let tx = new Tx(rawTx);
      tx.sign(privateKey);
      tx.serialize();
      console.log(tx.validate());
      let serializedTx = '0x' + tx.serialize().toString('hex');
      console.log(serializedTx);
      employees.splice(index, 1);
      return resolve(serializedTx);
    });


  }

  // get complete attendance report
  moreAttendanceResult(address, pagination_limit) {
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
    return d.getTime();
  }

  // get date from seconds
  secondsInDate(seconds) {
    let date = new Date(seconds);
    return date.toDateString();
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
          from: this.owner_account,
          gas: 4700000
        }).then(function (res) {
          // console.log(res);
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
                  // console.log(attendee_res[0], attendee_res[1], params.toLowerCase())
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

  // get attendance  giver result
  async getMarkedAttendanceBy(status: any, employeeAddress: any, date: any) {
    if (!status) {
      return new Observable((observer) => {
        observer.next(false)
      });
    }
    result_array = [];
    // fetch attendance  giver
    let EvaluateInstance;
    await new Promise((resolve, reject) => {
      this.EvaluationAttendeeContract.deployed().then((instance) => {
        EvaluateInstance = instance;
        return EvaluateInstance.attendeeDetailsCount()
          .then((markedAttendanceCount) => {
            for (let i = 1; i <= markedAttendanceCount; i++) {
              EvaluateInstance.attendeeDetails(i).then(function (attendanceResult) {
                console.log(attendanceResult);
                if (attendanceResult[1] == employeeAddress && attendanceResult[4] == date && status == attendanceResult[2]) {
                  result_array.push(attendanceResult[0]);
                }
              });
            }
            resolve(result_array);
          })
      });
    });
  }

  // fet the attendee details by their address
  getDetailsByAddress() {
    return new Observable((observer) => {
      for (let i = 0; i < result_array.length; i++) {
        observer.next(this.getDetailsHelper(result_array[i]))
      }
    });
  }

  // get details heper
  getDetailsHelper(employee_addr) {
    let EvaluateInstance;
    return new Promise((resolve, reject) => {
      this.EvaluationAttendeeContract.deployed().then((instance) => {
        EvaluateInstance = instance;
        return EvaluateInstance.attendeesCount()
          .then(function (attendeesCount) {
            for (let i = 1; i <= attendeesCount; i++) {
              EvaluateInstance.attendees(i).then(function (attendee) {
                if (attendee[1] == employee_addr) resolve({name: attendee[2], image: attendee[4]});
              });
            }
          }).catch(function (err) {
            resolve({name: "", image: ""});
          });
      }).catch(function (error) {
        resolve({name: "", image: ""});
      });
    });

  }

}
