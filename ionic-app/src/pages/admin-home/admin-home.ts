import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * Generated class for the AdminHomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin-home',
  templateUrl: 'admin-home.html',
})
export class AdminHomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    /*storage.get('user_type').then((type) => {
      console.log(type);
      if (type != "admin") {
        navCtrl.setRoot('WelcomePage');
      }
    }).catch(function (error) {
      console.log(error);
    })*/

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminHomePage');
  }

  /* add employee */
  addEmployee(){
    this.navCtrl.push('EmployeeListPage');
  }

  /* check result */
  checkResult(){
    this.navCtrl.push('AdminCheckResultPage')
  }

}