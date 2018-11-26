import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController, ViewController} from 'ionic-angular';
import {EthereumApiProvider} from "../../providers/ethereum-api/ethereum-api";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

/**
 * Generated class for the AdminEditEmployeePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin-edit-employee',
  templateUrl: 'admin-edit-employee.html',
})
export class AdminEditEmployeePage {

  isReadyToSave: boolean;
  form: FormGroup;
  employee_details: any;
  isDisabled: boolean = true;

  employee: {
    name: string, about: string, image: string, account_address: string
  } = {
    name: '',
    about: '',
    image: '',
    account_address: ''
  };


  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
              formBuilder: FormBuilder, public eap: EthereumApiProvider, private toastCtrl: ToastController) {
    this.employee_details = navParams.get('employee');
    this.employee.name = this.employee_details[2];
    this.employee.about = this.employee_details[3];
    this.employee.image = this.employee_details[4];
    this.employee.account_address = this.employee_details[1];
    this.form = formBuilder.group({
      name: ['', Validators.required],
      designation: ['', Validators.required],
      image: ['', Validators.required],
      address: ['', Validators.required]
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad AdminEditEmployeePage');
  }

  cancelEditing() {
    this.viewCtrl.dismiss();
  }

  // edit items
  editEmployee() {
    this.eap.editEmployee(this.form.value)
      .then((res) => {
        // console.log(res);
      }).catch((error) => {
      // console.log(error);
    })
    this.viewCtrl.dismiss();
  }
}
