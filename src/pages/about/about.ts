import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CategoryData } from './mock';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
	@ViewChild('rightScroll', { read: ElementRef }) rightScroll: ElementRef;
	private dataList = CategoryData;
	private currentCategoryIndex = 0;

  constructor(public navCtrl: NavController) {
  }

  ionViewDidLoad(){
  	let scrollEle = this.rightScroll.nativeElement.firstElementChild;
  	console.log(scrollEle);
  	let that = this;
  	scrollEle.addEventListener('scroll', (ev) => {
  		that.bindscroll(ev, that);
  	}, false)
  }

  // 监听滑动，控制左侧栏选中状态
  bindscroll(event:any, that) {
    let containViewBottom;
    let categoryItem;
    let categoryLength = that.dataList.length;
    if (categoryLength === 0 || categoryLength === 1) {
      return;
    }
    async function f(that) {
      
      containViewBottom = that.rightScroll.nativeElement.getBoundingClientRect().bottom;
      let item = { index: undefined, isbreak: false };
        for (let i = 0; i < categoryLength; i++) {

        	let cateBot = document.getElementById('category_' + i).getBoundingClientRect()
        	if (!item.isbreak && cateBot.top < 50) {
              item = { index: i, isbreak: false };
            }
            if (cateBot.top < containViewBottom && cateBot.top > 50) {
              item = { index: i, isbreak: true };
            }
            if (item.isbreak || i === categoryLength - 1) {
              categoryItem = item;
              break;
            }
        }
      let index = categoryItem.index;
      if (index !== undefined && index !== that.currentCategoryIndex) {
        that.currentCategoryIndex = index
      }
    }
    f(this);
  }

  //点击分类项
  scrollToIndex(index) {
  	this.currentCategoryIndex = index;
  	document.getElementById('category_' + index).scrollIntoView();
  	//this.rightScroll.nativeElement.scrollIntoView('#category_' + index);
  }

}
