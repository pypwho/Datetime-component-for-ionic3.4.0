import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DateComPage } from './date-com';

@NgModule({
  declarations: [
    DateComPage,
  ],
  imports: [
    IonicPageModule.forChild(DateComPage),
  ],
  exports: [
    DateComPage
  ]
})
export class DateComPageModule {}
