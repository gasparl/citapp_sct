import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
//import * as $ from 'jquery'
import { Storage } from "@ionic/storage";
import { EmailComposer } from "@ionic-native/email-composer";
import { Platform } from "ionic-angular";
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl
} from "@angular/forms"; // TODO
import { AgeValidator } from "./home_validation";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  cit_items: string[];
  current_div: string;
  visib: boolean;
  email_addr: string;
  cit_data: string;
  form_items: FormGroup;
  form_dems: FormGroup;
  submit_failed: boolean = false;

  constructor(
    public navCtrl: NavController,
    private storage: Storage,
    private emailComposer: EmailComposer,
    public platform: Platform,
    public formBuilder: FormBuilder
  ) {
    console.log("inside");
    this.cit_items = ["Gasper", "Ben", "Chris", "Daniel", "Evan", "Frank"];
    this.current_div = "dems"; // default: set_items
    this.visib = true;
    this.email_addr = "lkcsgaspar@gmail.com";
    this.cit_data = "";

    this.form_dems = formBuilder.group({
      age: ["", AgeValidator.isValid],

      gender: [
        "",
        Validators.compose([
          Validators.maxLength(30),
          Validators.required
        ])
      ],

      text_test: [
        "",
        Validators.compose([
          Validators.maxLength(30),
          Validators.pattern("[a-zA-ZÖöÜüÉéÁáÄäß]*"),
          Validators.required
        ])
      ]
    });
  }

  goback(event) {
    console.log("tapped!");
    console.log(performance.now());
    console.log(event);
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

  basics() {
    this.current_div = "dems";
  }

  // TODO: before start, check wifi off and airplane mode - if not, "please set"
  task_start() {
    if (!this.form_dems.valid) {
      this.submit_failed = true;
      console.log('failed');
    } else {
      this.current_div = "task_start";
      this.storage.get("cititems").then(val => {
        console.log("item listed:", val);
      });
      console.log(this.cit_items);
      var t1 = performance.now();

      setTimeout(function() {
        console.log(performance.now() - t1);
      }, 500);

      console.log("RAN");
    }
  }

  send_email() {
    console.log("send mail!");
    if (this.platform.is("cordova")) {
      let email = {
        to: this.email_addr,
        subject: "CITapp mail",
        body: "Testing"
      };
      this.emailComposer.open(email);
    } else {
      alert("This is a native plugin - only works on the phone.");
    }
  }
}

console.log("outside");
