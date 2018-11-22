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
  attendanceReport: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public eap: EthereumApiProvider) {
    this.employee = navParams.get('employee');
  }

  ionViewDidLoad() {
    /*    this.eap.getAttendanceReport(this.employee[1]).then((res) => {
          // @ts-ignore
          this.attendanceReport = res.result;
          this.showEmployeeReport = true;
        });  */

    setTimeout((time) => {

      this.eap.getResult(this.eap.dateInSeconds(), this.employee[1]).then((res) => {
        // @ts-ignore
        if (res.attendance == 1) this.attendanceReport = "P";
        else { // @ts-ignore
          // @ts-ignore
          if (res.attendance == 2) this.attendanceReport = "A";
          else this.attendanceReport = "N/A";
        }

        // @ts-ignore
        this.todayDate = this.eap.secondsInDate(res.date);
        this.showEmployeeReport = true;
      });

    }, 1000)
  }

  // for more details page
  moreResult() {
    let that = this;
    this.navCtrl.push('CompleteAttendanceDetailsPage', {
      employeeDetails: that.employee
    });

  }

}
