import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IonicPage, NavController, NavParams, ToastController, ViewController} from 'ionic-angular';
import {EthereumApiProvider} from "../../providers/ethereum-api/ethereum-api";

@IonicPage()
@Component({
  selector: 'page-admin-add-employee',
  templateUrl: 'admin-add-employee.html',
})
export class AdminAddEmployeePage {

  isReadyToSave: boolean;
  form: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
              formBuilder: FormBuilder, public eap: EthereumApiProvider, private toastCtrl: ToastController) {

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
  }

  // cancel adding new attendee
  cancelAdding() {
    this.viewCtrl.dismiss();

  }

  saveEmployee() {
    if (!this.form.valid) {
      return;
    }
    this.eap.authenticationUser(this.form.value.address).then((res) => {
      // @ts-ignore
      if (!res.result) {
        this.eap.addNewEmployee(this.form.value).then((res)=>{
          // @ts-ignore
          if(res.serializedTx) {
            // @ts-ignore
            this.eap.sendRawTransactions(res.serializedTx);
          }
        }).catch((err)=>console.log(err));
        this.viewCtrl.dismiss(this.form.value);
      } else {
        let toast = this.toastCtrl.create({
          message: 'Address already have taken',
          duration: 2000,
          position: 'bottom'
        });
        toast.present();
      }
    });
  }

}
