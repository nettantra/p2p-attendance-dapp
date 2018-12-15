import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AttendancePage } from './attendance';
import { TranslateModule } from '@ngx-translate/core';

import { CountdownModule} from "ngx-countdown";

@NgModule({
  declarations: [
    AttendancePage,
  ],
  imports: [
    IonicPageModule.forChild(AttendancePage),
    TranslateModule.forChild(),
    CountdownModule

  ],
  exports: [
    AttendancePage
  ]
})
export class AttendancePageModule { }
