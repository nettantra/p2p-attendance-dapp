import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * Generated class for the CompleteAttendanceDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-complete-attendance-details',
  templateUrl: 'complete-attendance-details.html',
})
export class CompleteAttendanceDetailsPage {

  employeeDetailsIndividual: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.employeeDetailsIndividual = navParams.get('employeeDetails');
    console.log(this.employeeDetailsIndividual);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CompleteAttendanceDetailsPage');
  }

}
