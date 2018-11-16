import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminAddEmployeePage } from './admin-add-employee';

@NgModule({
  declarations: [
    AdminAddEmployeePage,
  ],
  imports: [
    IonicPageModule.forChild(AdminAddEmployeePage),
  ],
})
export class AdminAddEmployeePageModule {}
