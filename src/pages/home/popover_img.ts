import { Component } from '@angular/core';
import { ViewController, AlertController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { DataShareProvider } from '../../providers/data-share/data-share';
import { Storage } from "@ionic/storage";
import { ImagePicker } from '@ionic-native/image-picker/';

@Component({
  template: `
      <ion-list id='po_list_id'>

        <div style="padding: 16px;text-align:center;">
          <button ion-button (click)="load_img()" color='light' style="text-transform:none;" block>Load image(s)</button>
        </div>

        <span *ngIf='objkeys(dataShare.stored_images).length !== 0' style="font-size:90%;text-align:center;font-weight:bold;padding-left: 16px;padding-right: 16px;">
          SELECT (OR REMOVE) IMAGE:
          <hr style='border:white;' />
        </span>

        <ion-row style='padding-right:16px;' *ngFor="let img_name of objkeys(dataShare.stored_images)">
          <ion-col>
            <button ion-item (tap)="img_select(img_name)">
              {{img_name}}
            </button>
          </ion-col>
          <ion-col>
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
    public storage: Storage,
    private imagePicker: ImagePicker) { }

  files: any[];
  objkeys = function(dict) {
    try {
      return Object.keys(dict).sort();
    } catch {
      console.log("Failed to get dictionary keys.");
      return []
    }
  }

  load_img2(event) {
    console.log("TRY")
    //this.files = event.target.files;

    let options = {
      width: 200,
      quality: 25,
      outputType: 1
    };
    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
        console.log(results);
        this.dataShare.stored_images.push('data:image/jpeg;base64,' + results[i]);
      }
    }, (err) => {
      console.log(err);
    });


    console.log("this was finally executed")
    this.storage.set('imgs', this.dataShare.stored_images);
    if (this.files.length === 1) {
      this.img_select(this.files[0].name)
    }
  };

  images = [];
  public items: Array<{ images: string; }> = [];
  load_img() {
    this.imagePicker.hasReadPermission()
      .then(res => {
        if (res) {
          this.openGallery();
        } else {
          this.imagePicker.requestReadPermission()
            .then(res => {
              if (res === 'ok') {
                this.openGallery();
              }
            })
        }
      })
      .catch(error => console.log(error));
  }
  openGallery() {
    let options = {
      maximumImagesCount: 10,
      correctOrientation: true,
      quality: 30,
      width: 100,
      height: 100,
      allowEdit: true,
      outputType: 1,
    }
    this.imagePicker.getPictures(options)
      .then(file => {
        //this.images = new Array(file.length);
        for (let i = 0; i < file.length; i++) {
          //this.images[i] = 'data:image/jpeg;base64,' + file[i]
          this.images.push('data:image/jpeg;base64,' + file[i]);
        }
      });
  }


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
