import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  template: `
      <ion-list>
        <button ion-item (tap)="go_to('m_demo')">Demo</button>
        <button ion-item (tap)="go_to('m_info')">Information</button>
        <button ion-item (tap)="go_to('m_prevs')">Previous results</button>
      </ion-list>
    `
})
export class PopoverItems {
  constructor(public viewCtrl: ViewController) { }
  go_to(m_name) {
    this.viewCtrl.dismiss(m_name);
  }
}
