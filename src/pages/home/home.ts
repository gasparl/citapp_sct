import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
//import * as $ from 'jquery'
import { Storage } from "@ionic/storage";
import { EmailComposer } from "@ionic-native/email-composer";
import {Platform} from 'ionic-angular';

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  cit_items: string[];
  current_div: string;
  visib: boolean;
  email_addr: string;

  constructor(
    public navCtrl: NavController,
    private storage: Storage,
    private emailComposer: EmailComposer,
    public platform:Platform
  ) {
    console.log("inside");
    this.cit_items = ["Gasper", "Ben", "Chris", "Daniel", "Evan", "Frank"];
    this.current_div = "set_items";
    this.visib = true;
    this.email_addr = "";
  }

  goback(event) {
    console.log("tapped!");
    console.log(Date.now());
    console.log(event);
    console.log(Date.now());
    this.current_div = "set_items";
  }

  saving() {
    console.log("saving!");
    this.storage.set("cititems", this.cit_items);
  }

  hide() {
    console.log("hide!");
    this.visib = false;
  }

  // TODO: before start, check wifi off and airplane mode - if not, "please set"
  task_start() {
    this.current_div = "task_start";
    this.storage.get("cititems").then(val => {
      console.log("item listed:", val);
    });
    console.log(this.cit_items);
    var now = function() {
      return new Date().getTime();
    };
    var t1 = now();

    setTimeout(function() {
      console.log(now() - t1);
    }, 500);

    console.log("RAN");
  }

  send_email() {
      console.log("send mail!")
     if (this.platform.is('cordova')) {

        this.emailComposer.isAvailable().then((available: boolean) => {
          if (available) {
              let email = {
                to: this.email_addr,
                subject: "CITapp mail",
                body: "Testing"
              };


          } else {
              console.log("not available!")

          }

          this.emailComposer.open(email);
        });
    } else { alert("This is a native plugin - only works on the phone.") }



  }
}

console.log("outside");
