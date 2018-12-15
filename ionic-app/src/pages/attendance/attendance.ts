import {Component, ViewChild} from '@angular/core';
import {Nav, IonicPage, MenuController, NavController, ToastController, NavParams} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {EthereumApiProvider} from "../../providers/ethereum-api/ethereum-api";
import {CountdownComponent, CountdownModule} from 'ngx-countdown';

@IonicPage()
@Component({
  selector: 'page-attendance',
  templateUrl: 'attendance.html'
})

export class AttendancePage {

  @ViewChild(Nav) nav: Nav;
  @ViewChild(CountdownComponent) counter: CountdownComponent;
  side_status: boolean = false;

  attendee_name: string = "";
  attendee_about: string = "";
  attendee_img: string = "";
  attendeeId: string = "";
  attendeeAddress: string = "";
  todayDate: string = "";
  slide_num: number = 1;
  attendeesCount: number = 1;
  icon_status_p: boolean = false;
  icon_status_a: boolean = false;
  storageForValidation: any = [];
  refreshBtn: boolean = true;
  refreshLoader: boolean = false;
  attendanceMarker: string = "";

  // for page count
  page_count: number = 0;
  page_count_show: string = "(1/5)";
  max_page_count: number = 5;

  // for random number
  possible_attendee_num: any = [];
  total_attendee_count: number = 0;
  random_num: 0;

  // start from  here
  spinner: boolean = false;
  no_access: boolean = false;
  time_left:number = 10;

  constructor(public navParams: NavParams, public navCtrl: NavController, public menu: MenuController,
              private toastCtrl: ToastController,
              public storage: Storage, private eap: EthereumApiProvider) {
    this.menu.swipeEnable(false);

    this.findDate();
    this.storage.get('auth_key').then((key) => {
      if (!key) {
        storage.remove('auth_key');
        navCtrl.setRoot('WelcomePage');
      }
      this.attendanceMarker = key;
    });


  }

  ionViewDidLoad() {
    this.spinner = true;
    setTimeout(() => {
      this.eap.getTotalNumberAttendee(this.attendanceMarker).then((total_attendee) => {
        // @ts-ignore
        if (total_attendee.status == 400) this.logoutUser();
        this.total_attendee_count = total_attendee.result;
        if (this.total_attendee_count < 5) this.max_page_count = this.total_attendee_count;
        for (let i = 0; i < this.total_attendee_count; i++) {
          this.possible_attendee_num.push(i);
        }
      });

      this.storage.get('attendance_date').then((prev_date) => {
        if (prev_date != this.eap.dateInSeconds()) {
          this.storageForValidation = [];
          this.storage.set('attendee_address', this.storageForValidation);
          return this.attendeeLoad();
        } else {
          this.spinner = false;
          this.no_access = true;
        }
      });
    }, 2000);
  }

  // attendeeLoad
  attendeeLoad(slide_num = 1) {
    if (this.max_page_count >= this.slide_num) {
      this.random_num = this.possible_attendee_num[Math.floor(Math.random() * this.possible_attendee_num.length)];
      this.eap.talkToContract(slide_num, this.random_num)
        .then(value => {
          this.spinner = false;
          this.side_status = true;
          // @ts-ignore
          let slidedata = value.attendee_details;
          // @ts-ignore
          this.attendeesCount = value.total_attendee_count;
          this.attendeeId = (slidedata[0]);
          this.attendeeAddress = (slidedata[1]);
          this.attendee_name = (slidedata[2]);
          this.attendee_about = (slidedata[3]);
          this.attendee_img = (slidedata[4]);

          this.slide_num++;
          this.page_count++;
          this.page_count_show = "(" + this.page_count + "/" + this.max_page_count + ")"
          let index = this.possible_attendee_num.indexOf(this.random_num);
          if (index !== -1) this.possible_attendee_num.splice(index, 1);

        }).catch(function (error) {
      });
    } else {
      this.side_status = false;
      this.no_access = true;
      this.storage.set('attendance_date', this.eap.dateInSeconds());
    }
  }

  // load next attendee randomly
  showSlideSkip() {
    this.icon_status_a = false;
    this.icon_status_p = false;
    this.spinner = true;
    this.side_status = false;

    setTimeout(() => {
      this.spinner = false;
      this.side_status = true;
      this.attendeeLoad(this.slide_num);
      this.time_left= 10;
    }, 60000);
  }


  onlySkip() {
    this.icon_status_a = false;
    this.icon_status_p = false;
    this.spinner = true;
    this.side_status = false;

    setTimeout(() => {
      this.spinner = false;
      this.side_status = true;
      this.attendeeLoad(this.slide_num);
      this.time_left= 10;
    }, 2000);
  }



  // mark attendance and save opinion
  markAttendance(opinion = 0) {
    this.storage.set('attendance_date', this.eap.dateInSeconds());
    let that = this;
    if (!opinion) return false;
    let date = this.eap.dateInSeconds();
    this.storage.get('attendee_address').then((attendees) => {
      let status = attendees.includes(that.attendeeAddress);
      if (!status) {
        if (opinion == 1) {
          this.icon_status_p = true;
          let toast = this.toastCtrl.create({
            message: 'You have registered present ',
            duration: 3000,
            position: 'bottom'
          });
          toast.present();

        } else {
          this.icon_status_a = true;
          let toast = this.toastCtrl.create({
            message: 'You have registered absent',
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
        }
        this.storageForValidation.push(that.attendeeAddress);
        this.storage.set('attendee_address', this.storageForValidation);
        this.eap.markAttendance(that.attendeeAddress, opinion, date, this.attendanceMarker)
          .then((res) => {
            this.eap.sendRawTransactions(res);
          }).catch(function (error) {
          console.log(error);
        })
        setTimeout(() => this.showSlideSkip(), 3000);
      } else {
        let toast = this.toastCtrl.create({message: 'You can not do this', duration: 2000, position: 'bottom'});
        toast.present();
      }
    });
  }

  // refresh attendee
  refreshAttendee() {
    this.refreshBtn = false;
    this.refreshLoader = true;
    setTimeout(() => {
      this.refreshBtn = true;
      this.refreshLoader = false;
      this.navCtrl.setRoot(this.navCtrl.getActive().component);
    }, 1000);

  }

  // find date
  findDate() {
    let today = new Date();
    this.todayDate = today.toDateString();
  }

  // for attendee logout
  logoutUser() {
    this.storage.remove('auth_key').then(() => {
      this.navCtrl.setRoot('WelcomePage');
    }).catch(function (error) {
      // console.log(error);
    })
  }

  // show timer
  onFinished(){
    console.log("finished");
    this.onlySkip();
  }

}
