import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {EthereumApiProvider} from "../../providers/ethereum-api/ethereum-api";
import {Observable} from "rxjs";

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
  report: string = "N/A";
  total_report: any = [];
  total_days: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private eap: EthereumApiProvider) {
    this.employeeDetailsIndividual = navParams.get('employeeDetails');
    console.log(this.employeeDetailsIndividual);
  }

  ionViewDidLoad() {

    this.eap.moreAttendanceResult(this.employeeDetailsIndividual[1])
      .subscribe(msg => {
          // @ts-ignore
          msg.then((r) => {
            if (r.attendance != 3) {
              if (r.attendance == 2) this.total_report.push("A");
              else this.total_report.push("P");
              let d = new Date(r.date);
              this.total_days.push(d.toDateString());
            }
          })
        }, err => {
          console.error('Oops:', err.message);
        },
        () => {
          console.log(`We're done here!`);
        });


    /* this.eap.try(this.employeeDetailsIndividual[1]).then((res) => {
       // @ts-ignore
       console.log(res.data);
     });*/


  }


}
