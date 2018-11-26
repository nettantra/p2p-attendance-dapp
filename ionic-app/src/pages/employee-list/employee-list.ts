import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {EthereumApiProvider} from "../../providers/ethereum-api/ethereum-api";


/**
 * Generated class for the EmployeeListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-employee-list',
  templateUrl: 'employee-list.html',
})
export class EmployeeListPage {
  currentEmployees: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public eap: EthereumApiProvider) {
    this.currentEmployees = this.eap.getAllAttendee();
  }

  ionViewDidLoad() {

  }

  // add a new employee
  addEmployee() {
    this.navCtrl.push('AdminAddEmployeePage');
  }

  // open employee details
  openEmployee(employee) {
    this.navCtrl.push('EmployeeDetailPage', {
      employee: employee
    });
  }

  deleteEmployee() {

  }

  // search employee
  searchEmployee(ev) {
    if (ev.altKey == false) this.currentEmployees = this.eap.getAllAttendee(); else {
      let val = ev.target.value;
      if (!val || !val.trim()) this.currentEmployees = this.eap.getAllAttendee();
      this.currentEmployees = this.eap.getAllAttendee({
        name: val
      })
    }
  }

  // edit employee
  editEmployee(count) {
    this.navCtrl.push('AdminEditEmployeePage', {
      employee: this.currentEmployees[count]
    });
  }

}
