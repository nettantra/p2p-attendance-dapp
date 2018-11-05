import {Component} from '@angular/core';
import {IonicPage, MenuController, NavController, AlertController, ToastController} from 'ionic-angular';
import {EthereumApiProvider} from "../../providers/ethereum-api/ethereum-api";


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
              private alertCtrl: AlertController, public toast: ToastController, private eat: EthereumApiProvider) {

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
    this.eat.authenticationUser(user_add).then((data) => {
      if (data) {
        this.navCtrl.setRoot('AttendancePage');
      } else{
        let toast = this.toast.create({message: 'Not found try again', duration: 2000, position: 'bottom'});toast.present();
      }
        }).catch(function (error) {
      console.log(error);
    });
  }

}
