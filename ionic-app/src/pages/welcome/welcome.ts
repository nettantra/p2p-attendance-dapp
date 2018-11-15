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

  myStyle: object = {};
  myParams: object = {};
  width: number = 100;
  height: number = 100;


  constructor(public navCtrl: NavController, public menu: MenuController,
              private alertCtrl: AlertController, public toastCtrl: ToastController, private eap: EthereumApiProvider,
              public storage: Storage) {

    storage.remove('auth_key');
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
          value: '#fff'
        },
        shape: {
          type: 'circle',
        },
        line_linked: {
          color: '#fff',
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
  }

  login() {
    this.navCtrl.push('LoginPage');
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }

  signInToBlock() {
    let alert = this.alertCtrl.create({
      title: 'Login',
      enableBackdropDismiss:false,
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
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Login',
          handler: data => {
            this.autnetications(data.user_address);
          }
        }
      ]
    });
    alert.present();
  }

  autnetications(user_add) {
    this.eap.authenticationUser(user_add).then((data) => {
      // @ts-ignore
      if (data.status == 200) {
        this.storage.set('auth_key', user_add);
        this.navCtrl.setRoot('AttendancePage');
      }else {
        // @ts-ignore
        let toast_error = this.toastCtrl.create({message: data.msg, duration: 2000, position: 'bottom'});
        toast_error.present();
      }
    }).catch(function (error) {
      let toast_error = this.toastCtrl.create({message: "Please try again after some time .", duration: 2000, position: 'bottom'});
      toast_error.present();
    });
  }

}
