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
    var country_for_disp = capitalize(the_probes[0]);
    countrs_orig.forEach(function(countr, index) {
      if (countr.toLowerCase() == the_probes[0]) {
        country_for_disp = countr;
      }
    });
    if (condition == 2 || condition == 5) {
      target_reminder = ["", "", "", ""];
    } else {
      target_reminder = [
        "Remember: in this category, your target that requires a different response is <b>" +
          stim_base[0][1].word.toUpperCase() +
          "</b>. ",
        "Remember: in this category, your target that requires a different response is <b>" +
          stim_base[1][1].word.toUpperCase() +
          "</b>. ",
        "Again, your target that requires a different response is <b>" +
          stim_base[2][1].word.toUpperCase() +
          "</b>. ",
        "Again, your target that requires a different response is <b>" +
          stim_base[3][1].word.toUpperCase() +
          "</b>. "
      ];
    }
    block_texts[0] = "";
    block_texts[1] =
      'There will be three short practice rounds. In this first practice round, we just want to see that you clearly understand the task. Therefore, you will have a lot of time to choose each of your responses, just make sure you choose accurately. Here, all items from the two categories (countries, animals) will be mixed together randomly. <b>You must respond to each item correctly.</b> If you choose an incorrect response (or not give response for over 10 seconds), you will have to repeat this practice round.<br><br>Remember: press "<b>E</b>" or "<b>I</b>" keys depending on the category to which the given item belongs. If needed, click <b>show full instructions again</b> to reread the details.<br><br><p id="chances_id"></p>';
    block_texts[2] =
      '<span id="feedback_id2">Great, you passed the first practice round. In this second practice round, there will be a shorter deadline for the responses, but a certain rate of errors is allowed. (Items will be first country names, then animal names, then again countries, etc.) Try to be as accurate and as fast as possible.<br><br></span><p id="chances_id"></p>';
    block_texts[3] =
      "<span id='feedback_id3'>You passed the second practice round. This will be the third and last practice round. The response deadline is again shorter.<br><br>The task is designed to be difficult, so don't be surprised if you make mistakes, but do your best: <b>try to be as accurate and as fast as possible</b>.<br></span><p id='chances_id'></p>";
    block_texts[4] =
      "Good job. Now begins the actual test. The task is the same. There will be four blocks, with pauses between them. This first block tests the category of " +
      stim_base[0][0].cat +
      ", so you will be shown only the related items. " +
      target_reminder[0] +
      "<br><br>The minimum accuracy will now be much less strict than in the practice phase, but these blocks cannot be repeated, so you must keep paying attention in order to perform the test validly. <b>Again: try to be as accurate and as fast as possible.</b><br><br>When you are ready, click on <b>Start</b> to start the first block of the main test.";
    block_texts[5] =
      "The first block is now done. The second block will test the category of " +
      stim_base[1][0].cat +
      ". " +
      target_reminder[1] +
      "The task is otherwise the same. <b>Again: try to be as accurate and as fast as possible.</b>";
    block_texts[6] =
      "The second block is now done. This third block will again test the category of " +
      stim_base[2][0].cat +
      ". " +
      target_reminder[2] +
      " <b>Again: try to be as accurate and as fast as possible.</b>";
    block_texts[7] =
      "The third block is now done. This fourth and final block will again test the category of " +
      stim_base[3][0].cat +
      ". " +
      target_reminder[3] +
      " The task is otherwise still the same. <b>Again: try to be as accurate and as fast as possible.</b>";
  }
}

console.log("outside");
