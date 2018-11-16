import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmployeeDetailPage } from './employee-detail';

@NgModule({
  declarations: [
    EmployeeDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(EmployeeDetailPage),
  ],
})
export class EmployeeDetailPageModule {}
