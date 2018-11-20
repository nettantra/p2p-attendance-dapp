import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {EthereumApiProvider} from "../../providers/ethereum-api/ethereum-api";

@IonicPage()
@Component({
  selector: 'page-employee-detail',
  templateUrl: 'employee-detail.html',
})
export class EmployeeDetailPage {
  employee: any;
  todayDate: any;
  showEmployeeReport: boolean = false;
  loader: boolean = true;
  attendanceReport: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public eap: EthereumApiProvider) {
    this.employee = navParams.get('employee');
    let today = new Date();
    this.todayDate = today.toDateString();
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.loader = false;
      this.showEmployeeReport = true;
      this.eap.getAttendanceReport(this.employee[1]).then((res) => {
        this.attendanceReport = res.result;
      });
    }, 100);
  }

  // for more details page
  moreResult() {
    let that = this;
    this.navCtrl.push('CompleteAttendanceDetailsPage', {
      employeeDetails:that.employee
    });


  }

}
