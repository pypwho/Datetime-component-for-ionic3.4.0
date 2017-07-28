import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import moment from 'moment';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  myDate: string = moment().format('YYYY-M-D');

  constructor(public navCtrl: NavController) {

  }

  changemyDate(date) {
    this.myDate = date;
  }

}
