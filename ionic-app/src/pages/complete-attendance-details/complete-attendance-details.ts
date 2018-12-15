import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {EthereumApiProvider} from "../../providers/ethereum-api/ethereum-api";


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
  total_days_raw: any = [];
  limit: number = 5;
  presentBy: boolean = false;
  absentBy: boolean = false;
  ionIconPresentValue: string = "arrow-down";
  ionIconAbsentValue: string = "arrow-down";
  markedByPresentBy: any = [];
  markedByAbsenttBy: any = [];
  loader_p: boolean = false;
  loader_a: boolean = false;

  dynamicIndexPresent:number= -1;
  dynamicIndexAbsent:number= -1;
  loaderPresent:number= -1;
  loaderAbsent:number= -1;


  constructor(public navCtrl: NavController, public navParams: NavParams, private eap: EthereumApiProvider) {
    this.employeeDetailsIndividual = navParams.get('employeeDetails');
  }

  ionViewDidLoad() {
    this.eap.moreAttendanceResult(this.employeeDetailsIndividual[1], this.limit)
      .subscribe(msg => {
          // @ts-ignore
          msg.then((r) => {
            // console.log(r);
            if (r.attendance != 3) {
              if (r.attendance == 2) this.total_report.push("A");
              else this.total_report.push("P");
              let d = new Date(r.date);
              this.total_days.push(d.toDateString());
              this.total_days_raw.push(r.date);
            }
          })
        }, err => {
          console.error('Oops:', err.message);
        },
        () => {
          console.log(`We're done here!`);
        });
  }


  // for showing marked attendance
  markedAttendanceReport(params: any, date: any, index:number) {
    console.log(params,date,index);
    if (params) {
      if (params == 1) {
        if (this.ionIconPresentValue == "arrow-down") {
          this.loader_p = true;
          this.loaderPresent = index;
          this.markedByPresentBy = [];
          this.eap.getMarkedAttendanceBy(1, this.employeeDetailsIndividual[1], date);
          this.ionIconPresentValue = "arrow-up";
          this.presentBy = true;
          this.dynamicIndexPresent = index;
          setTimeout((res) => {
            this.eap.getDetailsByAddress()
              .subscribe(msg => {
                  // @ts-ignore
                  msg.then((r) => {
                    this.markedByPresentBy.push(r);
                  })
                }, err => {
                  console.error('Oops:', err.message);
                },
                () => {
                  console.log(`We're done here!`);
                });
            this.loader_p = false;
            this.loaderPresent = -1;
          }, 2000);
        } else if (this.ionIconPresentValue == "arrow-up") {
          this.ionIconPresentValue = "arrow-down";
          this.presentBy = false;
          this.dynamicIndexPresent = -1;
        }
      } else if (params == 2) {
        if (this.ionIconAbsentValue == "arrow-down") {
          // fetch absent by
          this.loader_a = true;
          this.loaderAbsent = index;
          this.markedByAbsenttBy = [];
          this.ionIconAbsentValue = "arrow-up";
          this.absentBy = true;
          this.dynamicIndexAbsent = index;
          this.eap.getMarkedAttendanceBy(2, this.employeeDetailsIndividual[1], date);
          setTimeout((res) => {
            this.eap.getDetailsByAddress()
              .subscribe(msg => {
                  // @ts-ignore
                  msg.then((r) => {

                    this.markedByAbsenttBy.push(r);

                  })
                }, err => {
                  console.error('Oops:', err.message);
                },
                () => {
                  console.log(`We're done here!`);
                });
            this.loader_a = false;
            this.loaderAbsent = -1;
          }, 2000);
        } else if (this.ionIconAbsentValue == "arrow-up") {
          this.ionIconAbsentValue = "arrow-down";
          this.absentBy = false;
          this.dynamicIndexAbsent = -1;
        }
      }
    }
  }

  // for pagination
  radioBtn(page_num: any) {
    this.total_days = [];
    this.total_days_raw = [];
    this.total_report = [];
    this.eap.moreAttendanceResult(this.employeeDetailsIndividual[1], page_num)
      .subscribe(msg => {
          // @ts-ignore
          msg.then((r) => {
            // console.log(r);
            if (r.attendance != 3) {
              if (r.attendance == 2) this.total_report.push("A");
              else this.total_report.push("P");
              let d = new Date(r.date);
              this.total_days.push(d.toDateString());
              this.total_days_raw.push(r.date);
            }
          })
        }, err => {
          console.error('Oops:', err.message);
        },
        () => {
          console.log(`We're done here!`);
        });
  }

}
