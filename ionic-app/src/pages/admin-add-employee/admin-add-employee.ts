import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-admin-add-employee',
  templateUrl: 'admin-add-employee.html',
})
export class AdminAddEmployeePage {

  isReadyToSave: boolean;

  form: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
              formBuilder: FormBuilder) {

    this.form = formBuilder.group({
      name: ['', Validators.required],
      image: ['', Validators.required],
      address: ['', Validators.required]
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminAddEmployeePage');
  }

  // cancel adding new attendee
  cancelAdding() {
    this.viewCtrl.dismiss();

  }


  saveEmployee() {
    if (!this.form.valid) {
      return;
    }
    console.log(this.form.value);
    this.viewCtrl.dismiss(this.form.value);
  }

}