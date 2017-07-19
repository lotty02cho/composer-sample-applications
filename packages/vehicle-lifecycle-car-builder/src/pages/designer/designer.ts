import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-designer',
  templateUrl: 'designer.html'
})
export class DesignerPage {
  cars: Object[];

  constructor(public navController: NavController) {
    this.cars = [{
      name: 'Black',
      image: 'black.jpg',
      zoom: 'cover'
    }, {
      name: 'Normal',
      image: 'normal.jpeg',
      zoom: 'cover'
    }, {
      name: 'york',
      image: 'york.jpg',
      zoom: 'cover'
    }]
  }

}
