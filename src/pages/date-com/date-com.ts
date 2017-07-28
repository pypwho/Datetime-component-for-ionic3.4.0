import { Component, QueryList, ViewChildren, Renderer, ElementRef, EventEmitter, Output } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, PickerColumnCmp, Picker, PickerOptions, Config, BlockerDelegate, PickerColumnOption } from 'ionic-angular';

import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-date-com',
  templateUrl: 'date-com.html',
})
export class DateComPage {
  static KEY_ENTER: number = 13;
  static KEY_ESCAPE: number = 27;

  d: PickerOptions = { columns: [], buttons: [] };
  myDate: string;
  myDateY: number;
  myDateM: number;
  myDateD: number;
  minDate: string = moment([2000, 1, 1]).format('YYYY-M-D');
  type: string;
  picker: any;
  @ViewChildren(PickerColumnCmp) cols: QueryList < PickerColumnCmp > ;
  @Output() ionChange: EventEmitter < any > = new EventEmitter();
  mode: string;
  gestureBlocker: BlockerDelegate;
  lastClick: number;
  id: number;
  enabled: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public config: Config,
    public elementRef: ElementRef,
    //public gestureCtrl: GestureController,
    public renderer: Renderer) {
    this.myDate = this.navParams.get('data') || moment().format('YYYY-M-D');
    this.refreshType();
    this.minDate = this.navParams.get('minDate') || this.minDate;
    //this.gestureBlocker = gestureCtrl.createBlocker(BLOCK_ALL);
    this.mode = config.get('mode');
    renderer.setElementClass(elementRef.nativeElement, `picker-${this.mode}`, true);
    // if (this.d.cssClass) {
    //   this.d.cssClass.split(' ').forEach(cssClass => {
    //     renderer.setElementClass(elementRef.nativeElement, cssClass, true);
    //   });
    // }
    this.id = (++pickerIds);
    this.lastClick = 0;
    this.createColumns();
  };

  ionViewWillLoad() {
    // normalize the data
    // let data = this.d;

    // data.buttons = data.buttons.map(button => {
    //   if (this.isString(button)) {
    //     return { text: button };
    //   }
    //   if (button.role) {
    //     button.cssRole = `picker-toolbar-${button.role}`;
    //   }
    //   return button;
    // });

    // // clean up dat data
    // data.columns = data.columns.map(column => {
    //   if (!this.isPresent(column.options)) {
    //     column.options = [];
    //   }
    //   column.selectedIndex = column.selectedIndex || 0;
    //   column.options = column.options.map(inputOpt => {
    //     let opt: PickerColumnOption = {
    //       text: '',
    //       value: '',
    //       disabled: inputOpt.disabled,
    //     };

    //     if (this.isPresent(inputOpt)) {
    //       if (this.isString(inputOpt) || this.isNumber(inputOpt)) {
    //         opt.text = inputOpt.toString();
    //         opt.value = inputOpt;

    //       } else {
    //         opt.text = this.isPresent(inputOpt.text) ? inputOpt.text : inputOpt.value;
    //         opt.value = this.isPresent(inputOpt.value) ? inputOpt.value : inputOpt.text;
    //       }
    //     }

    //     return opt;
    //   });
    //   return column;
    // });
  }

  ionViewDidLoad() {
    this.refresh();
  }

  // ionViewWillEnter() {
  //   this.gestureBlocker.block();
  // }

  // ionViewDidLeave() {
  //   this.gestureBlocker.unblock();
  // }

  ionViewDidEnter() {
    let focusableEle = this.elementRef.nativeElement.querySelector('button');
    if (focusableEle) {
      focusableEle.focus();
    }
    this.enabled = true;
  }

  dismissDateFilter() {
    this.viewCtrl.dismiss('cancel');
  }

  applyDateFilters() {
    this.viewCtrl.dismiss({ myDate: this.myDate });
  }

  _colChange() {
    let picker = < Picker > this.viewCtrl;
    picker.ionChange = new EventEmitter < any > ();
    picker.ionChange.emit(this.getSelected());
    this.cols.forEach(column => {
      column.refresh();
    });
  }

  refresh() {
    this.cols.forEach(column => {
      column.refresh();
      column.lastIndex = -1
    });
  }

  getSelected(): any {
    let selected: {
      [k: string]: any
    } = {};
    this.d.columns.forEach((col, index) => {
      let selectedColumn = col.options[col.selectedIndex];
      selected[col.name] = {
        text: selectedColumn ? selectedColumn.text : null,
        value: selectedColumn ? selectedColumn.value : null,
        columnIndex: index,
      };
    });
    if (selected.year.value + '' !== (this.myDateY + '')) {
      //修改年份，需要刷新月和日
      //this.createMonth(selected.year.value + '', moment(this.minDate).format('YYYY'), moment().format('YYYY'));
      this.createDays(selected.year.value + '', selected.month.value + '');
    } else if (selected.month.value + '' !== (this.myDateM + '')) {
      this.createDays(selected.year.value + '', selected.month.value + '');
    }
    if (this.type === 'Y') {
      this.myDate = selected.year.value
    } else if (this.type === 'M') {
      this.myDate = selected.year.value + '-' + selected.month.value;
    } else {
      this.myDate = selected.year.value + '-' + selected.month.value + '-' + this.d.columns[2].options[this.d.columns[2].selectedIndex].value || selected.days.value;
    }
    this.refreshType();
    return selected;
  }

  // @HostListener('body:keyup', ['$event'])
  // _keyUp(ev: KeyboardEvent) {
  //   if (this.enabled && this.viewCtrl.isLast()) {
  //     if (ev.keyCode === DateComPage.KEY_ENTER) {
  //       if (this.lastClick + 1000 < Date.now()) {
  //         // do not fire this click if there recently was already a click
  //         // this can happen when the button has focus and used the enter
  //         // key to click the button. However, both the click handler and
  //         // this keyup event will fire, so only allow one of them to go.
  //         console.debug('picker, enter button');
  //         let button = this.d.buttons[this.d.buttons.length - 1];
  //         this.btnClick(button);
  //       }

  //     } else if (ev.keyCode === DateComPage.KEY_ESCAPE) {
  //       console.debug('picker, escape button');
  //       this.bdClick();
  //     }
  //   }
  // }

  // isPresent(val: any): val is any {
  //   return val !== undefined && val !== null;
  // }
  // isNumber(val: any): val is number {
  //   return typeof val === 'number';
  // }
  // isString(val: any): val is string {
  //   return typeof val === 'string';
  // }

  // btnClick(button: any) {
  //   if (!this.enabled) {
  //     return;
  //   }

  //   // keep the time of the most recent button click
  //   this.lastClick = Date.now();

  //   let shouldDismiss = true;

  //   if (button.handler) {
  //     // a handler has been provided, execute it
  //     // pass the handler the values from the inputs
  //     if (button.handler(this.getSelected()) === false) {
  //       // if the return value of the handler is false then do not dismiss
  //       shouldDismiss = false;
  //     }
  //   }

  //   if (shouldDismiss) {
  //     this.dismiss(button.role);
  //   }
  // }

  // bdClick() {
  //   if (this.enabled && this.d.enableBackdropDismiss) {
  //     let cancelBtn = this.d.buttons.find(b => b.role === 'cancel');
  //     if (cancelBtn) {
  //       this.btnClick(cancelBtn);
  //     } else {
  //       this.dismiss('backdrop');
  //     }
  //   }
  // }

  dismiss(role: string): Promise < any > {
    return this.viewCtrl.dismiss(this.getSelected(), role);
  }

  choosedType(type: string) {
    this.type = type;
    this.refreshMyDate();
    this.refreshType();
    this.divyColumns();
  }

  createColumns() {
    this.d.columns.length = 0;
    let minYear: string = this.minDate.slice(0, 4);
    let maxYear: string = moment().format('YYYY');
    let myYear: string = this.myDateY + '';
    let myMonth: string = this.myDateM + '';
    this.d.columns[0] = {};
    this.d.columns[0].options = [];
    this.d.columns[0].name = 'year';
    this.d.columns[1] = {};
    this.d.columns[1].options = [];
    this.d.columns[1].name = 'month';
    this.d.columns[2] = {};
    this.d.columns[2].options = [];
    this.d.columns[2].name = 'days';
    // if (this.type === 'Y') {
    //   this.createYear(minYear, maxYear);
    // } else if (this.type === 'M') {
    //   this.createYear(minYear, maxYear);
    //   this.createMonth(myYear, minYear, maxYear);
    // } else {
    this.createYear(minYear, maxYear);
    this.createMonth(myYear, minYear, maxYear);
    this.createDays(myYear, myMonth);
    //}
    this.divyColumns();
  }

  createYear(minYear: string, maxYear: string) {
    let myYear: number = this.myDateY;
    let yearOptions: any = [];
    for (let i = +minYear; i <= +maxYear; i++) {
      yearOptions.push({
        text: i,
        value: i,
        disabled: false
      })
      if (+myYear === i) {
        this.d.columns[0].selectedIndex = i - (+minYear);
      }
    }
    this.d.columns[0].options = yearOptions;
    this.d.columns[0].selectedIndex = this.d.columns[0].selectedIndex || 0;
  }

  createMonth(year: string, minYear: string, maxYear: string) {
    let myMonthIndex: number = this.myDateM - 1;
    let selectMonthIndex = myMonthIndex || this.d.columns[1].selectedIndex || 0;
    //let minMonth: string = moment(this.minDate).format('M');
    //let maxMonth = moment().format('M');
    let monthOption: any = [];
    if (this.d.columns[1].options.length === 0) {
      for (let k: number = 1; k <= 12; k++) {
        monthOption.push({
          text: k,
          value: k,
          disabled: false
        })
      }
      this.d.columns[1].options = monthOption;
    }
    // if (+year === +minYear) { //最小年份时
    //   for (let i: number = 0; i < +minMonth - 1; i++) { //月份是从 minMonth~12, 1~minMonth不可见
    //     this.d.columns[1].options[i].disabled = true;
    //   }
    //   for (let j: number = +minMonth - 1; j < 12; j++) {
    //     this.d.columns[1].options[j].disabled = false;
    //   }
    // } else if (+year === +maxYear) { //月份显示1~maxMonth
    //   for (let a: number = 0; a < +maxMonth; a++) {
    //     this.d.columns[1].options[a].disabled = false;
    //   }
    //   for (let b: number = +maxMonth; b < 12; b++) {
    //     this.d.columns[1].options[b].disabled = true;
    //   }
    // } else {
    //   for (let e: number = 1; e < 12; e++) {
    //     this.d.columns[1].options[e].disabled = false;
    //   }
    // }
    this.divyColumns();
    this.d.columns[1].selectedIndex = selectMonthIndex;
  }

  createDays(year: string, month: string) {
    let myDayIndex: number = this.myDateD - 1;
    let daySelectedIndex = myDayIndex || this.d.columns[2].selectedIndex || 0;
    let dayNum = moment([+year, +month - 1]).daysInMonth();
    if (this.d.columns[2].options.length === 0) {
      let daysOption: any = [];
      for (let i: number = 1; i <= 31; i++) {
        daysOption.push({
          text: i,
          value: i,
          disabled: false
        })
      }
      this.d.columns[2].options = daysOption;
    }
    //  else {
    //   if (dayNum > this.d.columns[2].options.length) {
    //     for (let i: number = this.d.columns[2].options.length; i <= dayNum; i++) {
    //       this.d.columns[2].options[i] = < PickerColumnOption > [{
    //         text: i,
    //         value: i,
    //         disabled: false
    //       }]
    //     }
    //   }
    // }
    for (let i: number = 0; i < dayNum; i++) {
      this.d.columns[2].options[i].disabled = false;
    }
    for (let j: number = dayNum; j < 31; j++) {
      this.d.columns[2].options[j].disabled = true;
    }
    if (dayNum <= daySelectedIndex) {
      this.d.columns[2].selectedIndex = dayNum - 1;
    } else {
      this.d.columns[2].selectedIndex = daySelectedIndex;
    }
  }

  divyColumns() {
    const pickerColumns = this.d.columns;
    if (this.type === 'Y') {
      pickerColumns[0].align = 'center';
      pickerColumns[0].columnWidth = '30%';
      pickerColumns[1].columnWidth = '0px';
      pickerColumns[2].columnWidth = '0px';
    } else if (this.type === 'M') {
      pickerColumns[0].align = 'right';
      pickerColumns[1].align = 'left';
      pickerColumns[0].columnWidth = '30%';
      pickerColumns[1].columnWidth = '30%';
      pickerColumns[2].columnWidth = '0px';
    } else {
      pickerColumns[0].align = 'right';
      pickerColumns[1].align = 'center'
      pickerColumns[2].align = 'left';
      pickerColumns[0].columnWidth = '30%';
      pickerColumns[1].columnWidth = '30%';
      pickerColumns[2].columnWidth = '30%';
    }
  }

  // ngOnDestroy() {
  //   this.assert(this.gestureBlocker.blocked === false, 'gesture blocker must be already unblocked');
  //   this.gestureBlocker.destroy();
  // }

  assert(actual: any, reason: string) {
    if (!actual) {
      let message = 'IONIC ASSERT: ' + reason;
      console.error(message);
      debugger; // tslint:disable-line
      throw new Error(message);
    }
  }

  refreshType() {
    let dateString = this.myDate + '';
    let indexOne = dateString.indexOf('-');
    let indexTwo = dateString.indexOf('-', 5);
    if (indexOne > 0) {
      if (indexTwo > 5) {
        this.type = 'D';
        this.myDateY = +dateString.slice(0, indexOne);
        this.myDateM = +dateString.slice(indexOne + 1, indexTwo);
        this.myDateD = +dateString.slice(indexTwo + 1, dateString.length);
      } else {
        this.type = 'M';
        this.myDateY = +dateString.slice(0, indexOne);
        this.myDateM = +dateString.slice(indexOne + 1, dateString.length);
      }
    } else {
      this.type = 'Y';
      this.myDateY = +dateString;
    }
  }

  refreshMyDate() {
    if (this.type === 'Y') {
      this.myDate = this.d.columns[0].options[this.d.columns[0].selectedIndex].value;
    } else if (this.type === 'M') {
      this.myDate = this.d.columns[0].options[this.d.columns[0].selectedIndex].value + '-' + this.d.columns[1].options[this.d.columns[1].selectedIndex].value;
    } else {
      this.myDate = this.d.columns[0].options[this.d.columns[0].selectedIndex].value + '-' + this.d.columns[1].options[this.d.columns[1].selectedIndex].value + '-' + this.d.columns[2].options[this.d.columns[2].selectedIndex].value;
    }
  }
}

let pickerIds = -1;