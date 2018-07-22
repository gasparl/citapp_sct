import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
//import * as $ from 'jquery'
import { Storage } from "@ionic/storage";
import { EmailComposer } from "@ionic-native/email-composer";
import { Platform } from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms"; // TODO
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
  block_texts: string[] = [];
  form_items: FormGroup;
  form_dems: FormGroup;
  submit_failed: boolean = false;
  age: number;
  gender: number;

  constructor(
    public navCtrl: NavController,
    private storage: Storage,
    private emailComposer: EmailComposer,
    public platform: Platform,
    public formBuilder: FormBuilder
  ) {
    console.log("inside");
    this.cit_items = ["Gasper", "Ben", "Chris", "Daniel", "Evan", "Frank"];
    this.current_div = "task_start"; // default: set_items
    this.visib = true;
    this.email_addr = "lkcsgaspar@gmail.com";
    this.cit_data = "";

    this.form_dems = formBuilder.group({
      age: ["", AgeValidator.isValid],

      gender: [
        "",
        Validators.compose([Validators.maxLength(30), Validators.required])
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
    this.gender = this.form_dems.get("gender").value;
    this.age = this.form_dems.get("age").value;
  }

  hide() {
    console.log("hide!");
    this.visib = false;
  }

  basics() {
    this.current_div = "dems";
  }

  // laterTODO: before start, check wifi off and airplane mode - if not, "please set"
  task_start() {
    if (!this.form_dems.valid) {
      this.submit_failed = true;
      console.log("failed");
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
        subject: "CITapp data",
        body: "Testing"
      };
      this.emailComposer.open(email);
    } else {
      alert("This is a native plugin - only works on the phone.");
    }
  }
  // texts to display before blocks

  set_block_texts() {
    this.block_texts[0] = "";
    this.block_texts[1] =
      'There will be three short practice rounds, each with 15-16 items. In this first practice round, we just want to make sure that you clearly understand the task. Therefore, you will have plenty of time to choose each of your responses, just make sure you choose accurately. Here all items from different categories (countries, dates, animals) will be intermixed randomly. <b>You must respond to each item correctly.</b> If you choose an incorrect response (or not give response for over 10 seconds), you will have to repeat this practice task.<br><br>Remember: press "<b>e</b>" or "<b>i</b>" keys depending to which side the given item belongs (if needed, click <b>show full instructions again</b> to reread the details). <br><br>Click on <b>Start</b> to start the first round.';
    this.block_texts[2] =
      "Great, you passed the first practice round. In this second practice round, there will be a shorter deadline for the responses, but a certain rate of errors is allowed. Try to be as accurate and as fast as possible.<br><br>The first category will be... <br><br>Click on <b>Start</b> to start this second round.";
    this.block_texts[3] =
      "You passed the second practice round. This will be the third and last practice round. The response deadline is again shorter. The task is designed to be difficult, so don't be surprised if you make mistakes, but please do your best: <b>try to be as accurate and as fast as possible.</b><br><br>Click on <b>Start</b> to start this third round.";
    this.block_texts[4] =
      "Good job. Now begins the actual test. The task is the same. This first block tests the category of ..., so you will be again shown the related items. The evaluation will now be much less strict than in the practice phase, but these blocks cannot be repeated, so you must keep paying attention in order to perform the test validly. <b>Again: try to be as accurate and as fast as possible.</b><br><br>When you are ready, click on <b>Start</b> to start the first block of the main test.";
    this.block_texts[5] =
      "The first block is now done. The second block will test the category of ..., so the presented items will be related to ... The task is otherwise the same. <b>Again: try to be as accurate and as fast as possible.</b><br><br>When you are ready, click on <b>Start</b> to start the first block of the main test.";
    this.block_texts[6] =
      "The second block is now done. This third and final block will test the category of ..., so the presented items will be related to ... The task is otherwise still the same. <b>Again: try to be as accurate and as fast as possible.</b><br><br>When you are ready, click on <b>Start</b> to start the first block of the main test.";
  }
}

console.log("outside");
