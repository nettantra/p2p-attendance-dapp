import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminEditEmployeePage } from './admin-edit-employee';

@NgModule({
  declarations: [
    AdminEditEmployeePage,
  ],
  imports: [
    IonicPageModule.forChild(AdminEditEmployeePage),
  ],
})
export class AdminEditEmployeePageModule {}
