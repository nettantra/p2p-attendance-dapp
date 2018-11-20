import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompleteAttendanceDetailsPage } from './complete-attendance-details';

@NgModule({
  declarations: [
    CompleteAttendanceDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(CompleteAttendanceDetailsPage),
  ],
})
export class CompleteAttendanceDetailsPageModule {}
