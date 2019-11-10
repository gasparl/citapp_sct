import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  template: `
      <ion-list>
        <button ion-item (click)="go_to()">Start new test</button>
        <button ion-item (click)="go_to()">Demo</button>
        <button ion-item (click)="go_to()">Information</button>
        <button ion-item (click)="go_to()">Previous results</button>
      </ion-list>
    `
})
export class PopoverItems {
  constructor(public viewCtrl: ViewController) { }

  go_to() {
    this.viewCtrl.dismiss();
    // slide to...
  }
}
