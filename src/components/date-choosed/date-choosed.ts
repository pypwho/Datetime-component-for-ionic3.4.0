import { Component, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { ModalController } from 'ionic-angular';

// export interface DateTimeData {
//   year ? : number;
//   month ? : number;
//   day ? : number;
// }
// export interface LocaleData {
//   monthNames ? : string[];
//   monthShortNames ? : string[];
//   dayNames ? : string[];
//   dayShortNames ? : string[];
// }

@Component({
  selector: 'date-choosed',
  templateUrl: 'date-choosed.html'
})
export class DateChoosedComponent {

  @Input() data: any;

  @Input() minDate: any;

  @Output() ionChange: EventEmitter < any > = new EventEmitter();

  // min: DateTimeData;
  // max: DateTimeData;
  //_locale: LocaleData = {};
  constructor(
    public modalCtrl: ModalController,
    public zone: NgZone
  ) {
    console.log('Hello DateChoosedComponent Component');
  }

  showDateWindow() {
    //const pickerOptions = JSON.parse(JSON.stringify(this.d));
    let profileModal = this.modalCtrl.create('DateComPage', { data: this.data, minDate: this.minDate });
    profileModal.present();
    profileModal.onDidDismiss(data => {
      if (data !== 'cancel') {
        if (this.data !== data.myDate) {
          var ionChange = this.ionChange;
          if (ionChange.observers.length > 0) {
            this.zone.run(ionChange.emit.bind(ionChange, data.myDate));
          }
        }
        this.data = data.myDate;
      }
    });
  }

}