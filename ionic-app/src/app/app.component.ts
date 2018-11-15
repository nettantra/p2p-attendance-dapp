import {Component, ViewChild} from '@angular/core';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {Nav, Platform} from 'ionic-angular';

import {Storage} from "@ionic/storage";


@Component({
  template: `
    <ion-menu [content]="content">
      <ion-header>
        <ion-toolbar>
          <ion-title>Pages</ion-title>
        </ion-toolbar>
      </ion-header>
    </ion-menu>
    <ion-nav #content [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage: any;
  @ViewChild(Nav) nav: Nav;

  pages: any[] = [
    {title: 'Mark Attendance', component: 'AttendancePage'},
    {title: 'Welcome Page', component: 'WelcomePage'}
  ]

  constructor(platform: Platform, private statusBar: StatusBar, private splashScreen: SplashScreen,
              public storage: Storage) {

    this.storage.get('auth_key').then((key) => {
      if (key) this.rootPage = "AttendancePage";
      else this.rootPage = "WelcomePage";
    });
    platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }
}
