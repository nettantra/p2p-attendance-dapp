import {Component} from '@angular/core';
import {IonicPage, MenuController, NavController, AlertController, ToastController} from 'ionic-angular';
import {EthereumApiProvider} from "../../providers/ethereum-api/ethereum-api";
import {Storage} from "@ionic/storage";


/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
 */
@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})

export class WelcomePage {

  //slide properties
  myStyle: object = {};
  myParams: object = {};
  width: number = 100;
  height: number = 100;

  /*class properties*/
  owner_address: any;

  constructor(public navCtrl: NavController, public menu: MenuController,
              private alertCtrl: AlertController, public toastCtrl: ToastController, private eap: EthereumApiProvider,
              public storage: Storage) {

    // storage.remove('auth_key');
    // storage.remove('user_type');
    // storage.remove('attendance_date');
    this.menu.swipeEnable(false);

    this.myStyle = {
      'position': 'fixed',
      'width': '100%',
      'height': '100%',
      'z-index': -1,
      'top': 0,
      'left': 0,
      'right': 0,
      'bottom': 0,
    }

    this.myParams = {
      particles: {
        number: {
          value: 200,
          density: {
            value_area: 1000
          }
        },
        color: {
          value: '#000'
        },
        shape: {
          type: 'circle',
        },
        line_linked: {
          color: '#000',
          distance: 100
        },
        opacity: {
          value: 0.9
        }

      },
      interactivity: {
        onclick: {
          enable: true,
        }
      }
    }

    // get block info
    this.eap.getBlockInfo()
      .then((value) => {
        // @ts-ignore
        this.owner_address = value.fromAccount;
      }).catch(function (error) {
    });
  }

  login() {
    this.navCtrl.push('LoginPage');
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }

  // sign in  into app alert popup
  signInToBlock() {
    let alert = this.alertCtrl.create({
      title: 'Login',
      enableBackdropDismiss: false,
      cssClass: 'alertCustomCss',
      inputs: [
        {
          name: 'user_address',
          placeholder: 'enter account address'
        },

      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
          }
        },
        {
          text: 'Login',
          handler: data => {
            this.authentication(data.user_address);
          }
        }
      ]
    });
    alert.present();
  }

  // authenticate user method
  authentication(user_add) {

    this.owner_address = '0x25bA673A96acadD7A02f4c5834Ba80C1AF6b7758'
    if (user_add.toLowerCase() == this.owner_address.toLowerCase()) {
      this.storage.set('user_type', "admin").then((value: any) => {
        return this.navCtrl.setRoot('AdminHomePage');
      });
    } else {
      this.eap.authenticationUser(user_add).then((data) => {
        // @ts-ignore
        if (data.status == 200) {
          this.eap.getBlockInfo();
          this.storage.set('auth_key', user_add);
          this.storage.set('user_type', "user");
          this.navCtrl.setRoot('AttendancePage', {
            user_add: user_add
          });
        } else {
          // @ts-ignore
          let toast_error = this.toastCtrl.create({message: data.msg, duration: 2000, position: 'bottom'});
          toast_error.present();
        }
      }).catch(function (error) {
        let toast_error = this.toastCtrl.create({
          message: "Please try again after some time .",
          duration: 2000,
          position: 'bottom'
        });
        toast_error.present();
      });
    }
  }

}
