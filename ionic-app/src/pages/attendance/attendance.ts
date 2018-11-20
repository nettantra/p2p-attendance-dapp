import {Component, ViewChild} from '@angular/core';
import {Nav, IonicPage, MenuController, NavController, ToastController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {EthereumApiProvider} from "../../providers/ethereum-api/ethereum-api";

@IonicPage()
@Component({
  selector: 'page-attendance',
  templateUrl: 'attendance.html'
})
export class AttendancePage {
  @ViewChild(Nav) nav: Nav;
  side_status: boolean = false;
  spinner: boolean = true;
  attendee_name: string = "";
  attendee_about: string = "";
  attendee_img: string = "";
  attendeeId: string = "";
  attendeeAddress: string = "";
  todayDate: string = "";
  slide_num: number = 1;
  attendeesCount: number = 1;
  lastPageStatus: boolean = false;
  fromAccount: string = "";
  icon_status_p: boolean = false;
  icon_status_a: boolean = false;
  storageForValidation: any = [];
  no_access: boolean = false;
  refreshBtn: boolean = true;
  refreshLoader: boolean = false;
  button_name: string = "SKIP";
  attendanceMarker: string = "";

  // for page count
  page_count: number = 0;
  page_count_show: string = "(1/5)";
  max_page_count: number = 5;

  // for random number
  possible_attendee_num: any = [];
  total_attendee_count: number = 0;
  random_num: 1;
  max_attendee: number = 5;

  constructor(public navCtrl: NavController, public menu: MenuController, private toastCtrl: ToastController, public storage: Storage, private eap: EthereumApiProvider) {
    this.storage.get('auth_key').then((key) => {
      if (!key) {
        storage.remove('auth_key');
        navCtrl.setRoot('WelcomePage');
      }
      this.attendanceMarker = key;
    });
    this.accountInfo();
    this.eap.getTotalNumberAttendee().then((total_attendee) => {
      // @ts-ignore
      this.total_attendee_count = total_attendee.result;
      for (let i = 1; i <= this.total_attendee_count; i++) {
        this.possible_attendee_num.push(i);
      }
    });
    this.findDate();
    setTimeout(() => {
      this.spinner = false;
      this.storage.get('attendance_date').then((prev_date) => {
        if (prev_date != this.eap.dateInSeconds()) {
          this.side_status = true;
          this.storageForValidation = [];
          this.storage.set('attendee_address', this.storageForValidation);
        } else {
          this.no_access = true;
        }
      });
      this.attendeeLoad();
    }, 2000);
    this.menu.swipeEnable(false);
  }

  //get account info
  accountInfo() {
    this.eap.getBlockInfo()
      .then(value => {
        // @ts-ignore
        this.fromAccount = value.fromAccount;
      }).catch(function (error) {

    });
  }

  // attendeeLoad
  attendeeLoad(slide_num = 1) {
    this.random_num = this.possible_attendee_num[Math.floor(Math.random() * this.possible_attendee_num.length)];
    let index = this.possible_attendee_num.indexOf(this.random_num);
    if (index !== -1) this.possible_attendee_num.splice(index, 1);
    console.log(this.random_num);
    this.eap.talkToContract(slide_num, this.random_num, this.max_attendee)
      .then(value => {
        // @ts-ignore
        if (value.status == 200) {
          // @ts-ignore
          let slidedata = value.attendee_details;
          // @ts-ignore
          this.attendeesCount = value.total_attendee_count;
          this.slide_num++;
          if (slidedata[1].toLowerCase() != this.attendanceMarker.toLowerCase()) {
            this.page_count++;
            this.page_count_show = "(" + this.page_count + "/" + this.max_page_count + ")"
            this.attendeeId = (slidedata[0]);
            this.attendeeAddress = (slidedata[1]);
            this.attendee_name = (slidedata[2]);
            this.attendee_about = (slidedata[3]);
            this.attendee_img = (slidedata[4]);
          } else {
            this.max_attendee = 6;
            let index = this.possible_attendee_num.indexOf(this.slide_num);
            if (index !== -1) this.possible_attendee_num.splice(index, 1);
            this.attendeeLoad(this.slide_num);
          }
        } else {
          this.refreshAttendee();
        }

      }).catch(function (error) {
    });
  }

  // load next attendee randomly
  showSlideSkip() {
    this.icon_status_a = false;
    this.icon_status_p = false;
    if (this.slide_num - this.attendeesCount == 1) this.lastPageStatus = true;
    if (!this.lastPageStatus) {
      this.spinner = true;
      this.side_status = false;
      this.attendeeLoad(this.slide_num);
    } else {
      let toast = this.toastCtrl.create({
        message: 'No more attendees',
        duration: 2000,
        position: 'bottom'
      });
      toast.present();
      this.refreshAttendee();
    }
    setTimeout(() => {
      this.spinner = false;
      this.button_name = "SKIP";
      this.side_status = true;
    }, 3000);
  }

  // mark attendance and save opinion
  markAttendance(opinion = 0) {
    this.button_name = "NEXT";
    this.storage.set('attendance_date', this.eap.dateInSeconds());
    let that = this;
    if (!opinion) return false;
    let date = this.eap.dateInSeconds();

    this.storage.get('attendee_address').then((attendees) => {
      let status = attendees.includes(that.attendeeAddress);
      if (!status) {
        if (opinion == 1) {
          let toast = this.toastCtrl.create({
            message: 'You have registered present ',
            duration: 1900,
            position: 'bottom'
          });
          toast.present();
          this.icon_status_p = true;
        }
        else {
          let toast = this.toastCtrl.create({
            message: 'You have registered absent',
            duration: 1900,
            position: 'bottom'
          });
          toast.present();
          this.icon_status_a = true;
        }
        this.storageForValidation.push(that.attendeeAddress);
        this.storage.set('attendee_address', this.storageForValidation);
        this.eap.markAttendance(that.attendeeAddress, opinion, date, this.attendanceMarker);
        setTimeout(() => this.showSlideSkip(), 2000);
      } else {
        let toast = this.toastCtrl.create({message: 'You can not do this', duration: 1200, position: 'bottom'});
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
      console.log(error);
    })
  }
}
