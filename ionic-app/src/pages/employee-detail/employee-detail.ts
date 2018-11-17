import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * Generated class for the EmployeeDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.employee = navParams.get('employee');
    console.log(this.employee['name']);
    let today = new Date();
    this.todayDate = today.toDateString();

  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.loader = false;
      this.showEmployeeReport = true;
      console.log('ionViewDidLoad EmployeeDetailPage');
    }, 2000);
  }

}
