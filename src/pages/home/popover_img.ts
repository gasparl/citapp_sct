import { Component } from '@angular/core';
import { ViewController, AlertController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { DataShareProvider } from '../../providers/data-share/data-share';
import { Storage } from "@ionic/storage";

@Component({
  template: `
      <ion-list id='po_list_id'>
        <div style="padding: 16px;text-align:center;">
          <label for="img_up_id" ion-button color='light' style="text-transform:none;" block>
            Load image(s)
          </label>
          <input multiple type="file" (change)="load_img($event);" accept="image/*" capture="camera" id="img_up_id" hidden />
        </div>
        <span *ngIf='objkeys(dataShare.stored_images).length !== 0' style="font-size:90%;text-align:center;font-weight:bold;padding-left: 16px;padding-right: 16px;">
          SELECT (OR REMOVE) IMAGE:
          <hr style='border:white;' />
        </span>
        <ion-row style='padding-right:16px;' *ngFor="let img_name of objkeys(dataShare.stored_images)">
          <ion-col style='max-width: 80%;'>
            <button ion-item (tap)="img_select(img_name)">
              {{img_name}}
            </button>
          </ion-col>
          <ion-col style='width: 1%;'>
            <button ion-button style='float:right;' type="button" icon-only (tap)="img_remove(img_name)" color='danger'>
              <ion-icon name="trash"></ion-icon>
            </button>
          </ion-col>
        </ion-row>
        <div *ngIf='objkeys(dataShare.stored_images).length > 1' style="padding-left: 16px;padding-right: 16px;padding-top: 16px;text-align:center;">
            <button ion-button color='danger' style="text-transform:none;padding-left: 16px;padding-right: 16px;" type="button" icon-only (tap)="img_removeall()">
              REMOVE ALL
            </button>
        </div>
      </ion-list>
    `
})
export class PopoverImg {
  constructor(public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public dataShare: DataShareProvider,
    public storage: Storage) { }

  objkeys = function(dict) {
    try {
      return Object.keys(dict).sort();
    } catch {
      console.log("Failed to get dictionary keys.");
      return []
    }
  }

  async load_img(event) {
    let files = event.target.files;
    for (const file of files) {
      if (/image\/.*/.test(file.type)) {
        const result = await this.toBase64(file).catch(e => e);
        if (result instanceof Error) {
          console.log('Error converting file to string: ', result.message);
          return;
        }
        this.dataShare.stored_images[file.name] = result;
      }
    };
    this.storage.set('imgs', this.dataShare.stored_images);
    if (files.length === 1 && /image\/.*/.test(files[0].type)) {
      this.img_select(files[0].name)
    }
  };

  toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  img_remove(inp) {
    delete this.dataShare.stored_images[inp];
    this.storage.set('imgs', this.dataShare.stored_images);
  }
  img_select(inp) {
    this.viewCtrl.dismiss(inp);
  }

  img_removeall() {
    let alert = this.alertCtrl.create({
      title: 'Confirm removal',
      message: 'Do you want to remove all images?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Remove',
          handler: () => {
            this.dataShare.stored_images = {};
            this.storage.set('imgs', this.dataShare.stored_images);
          }
        }
      ]
    });
    alert.present();
  }
}
