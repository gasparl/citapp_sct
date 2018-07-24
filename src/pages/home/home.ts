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
  experiment_title: string = "ECIT_Mobile";
  false_delay: number = 400;
  tooslow_delay: number = 400;
  isi_delay_minmax: number[] = [100, 300];
  end_url: string = "https://www.figure-eight.com/";
  all_conditions: number[] = [0, 1, 2, 3, 4, 5];
  condition: number;
  subj_id: string;
  response_deadline: number;
  response_deadline_main: number = 800;
  num_of_blocks: number = 7;
  bg_color: string = "#031116";

  cit_items: string[];
  current_div: string;
  visib: boolean;
  email_addr: string;
  block_texts: string[] = [];
  form_items: FormGroup;
  form_dems: FormGroup;
  submit_failed: boolean = false;
  age: number;
  gender: number;
  lastOf6filler: string = "none";
  lastOf6word: string = "none";
  teststim: any[];
  prac_teststim: any[];
  main_stim: any[];
  practice_stim: any[];
  tooslow: number;
  incorrect: number;
  block_trialnum: number;
  rt_data_dict: any;
  trial_stim: any;
  rspns: string;
  can_start: boolean;
  first_correct: boolean = true;
  div_after_instr: string;
  div_after_item_selection: string;
  text_to_show: string;
  practice_repeated: any = {
    block1: 0,
    block2: 0,
    block3: 0
  };
  cit_data: string =
    "subject_id\tlabel_status\tblock_number\ttrial_number\tstimulus_shown\tcategory\tstim_type\tresponse_key\trt\tincorrect\ttoo_slow\tdate_in_ms\n";
  correct_resp: string = "none";
  blocknum: number = 1;
  rt: number = 99999;
  start: any = 0;
  listen: boolean = false;
  it_type_feed_dict: any = {
    selfrefitem: "familiarity-related items",
    otherrefitem: "unfamiliarity-related items",
    main_item: "actual details (countries or animals)",
    target: "target items"
  };
  practice_chances: number = 5;
  practice_num: number = 5;
  first_blockstart: boolean = true;
  basic_times: any = {};

  num_of_failed_fin: number = 111111;
  failed_final: number = 0;

  nums: any[];

  stim_base_6: any[];
  the_targets: any[] = [];
  the_probes: any[] = [];

  items_base1: any[];
  items_base2: any[];
  true_details: any[];

  categories_base: string[] = ["countries", "months", "days", "animals"];
  categories: string[] = ["countries", "animals"];

  countrs: any[] = [
    "Afghanistan", "Belgium", "Burundi", "Chad", "Comoros", "Denmark", "Kiribati", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Moldova", "Nepal", "Palau", "Poland", "Portugal",
    "Qatar", "Romania", "Sweden", "Tuvalu", "Uganda", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
  ];
  animls: any[] = ["Alligator",
    "Badger", "Bison", "Chicken", "Chimpanzee", "Deer",
    "Dog", "Dolphin", "Donkey", "Eagle", "Falcon", "Fox", "Frog", "Gazelle", "Giraffe", "Hamster", "Jackal", "Kangaroo", "Kiwi", "Koala", "Lemur", "Leopard", "Lion", "Monkey", "Oyster", "Panda",
    "Pelican", "Penguin", "Rhinoceros", "Snake", "Spider", "Turkey", "Walrus", "Wombat", "Yak", "Zebra"
  ];

  constructor(
    public navCtrl: NavController,
    private storage: Storage,
    private emailComposer: EmailComposer,
    public platform: Platform,
    public formBuilder: FormBuilder
  ) {
    console.log("inside");
    this.cit_items = ["Gasper", "Ben", "Chris", "Daniel", "Evan", "Frank"];
    this.current_div = "set_items"; // default: set_items other: cit_main
    this.visib = true;
    this.email_addr = "lkcsgaspar@gmail.com";
    this.basic_times.loaded = Date();
    this.basic_times.blocks = "";
    this.nums = this.range(1, 32);
    this.items_base1 = [
      this.countrs.sort(),
      ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"],
      this.nums,
      this.animls.sort()
    ];

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

  initials() {
    condition = 1; // induced CIT
    basic_times.consented = Date();

    this.categories_base.forEach(function(categ, index) {
      //fills up the selection options for the categories
      var dropChoices = "";
      var catAll = items_base1[index];
      catAll.forEach(function(word) {
        dropChoices += '<option value="' + word + '">' + word + "</option>";
      });
      ["#", "#tcheck_", "#scheck_", "#fcheck_"].forEach(function(
        pre_id,
        index
      ) {
        var categ_id = pre_id + categ;
        $(categ_id).append(dropChoices);
      });
    });
    subj_id =
      rchoice("CDFGHJKLMNPQRSTVWXYZ") +
      rchoice("AEIOU") +
      rchoice("CDFGHJKLMNPQRSTVWXYZ") +
      "_" +
      $("#cf_id").val();
    dems =
      subj_id +
      "\t" +
      condition +
      "\t" +
      $("#gender").val() +
      "\t" +
      $("#age").val() +
      "\t" +
      $("#handedness").val() +
      "\t" +
      $("#country").val()
  }

  touchstart(event) {
    console.log("start:");
    console.log(performance.now());
    console.log(event.timeStamp);
  }
  touchend(event) {
    console.log("end:");
    console.log(event.timeStamp);
    console.log(event);
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

  capitalize(str1) {
    return str1.charAt(0).toUpperCase() + str1.slice(1);
  }

  sum(array_to_sum) {
    var sum = 0;
    array_to_sum.forEach(function(item) {
      sum += item;
    });
    return sum;
  }
  //calculate mean
  mean(array_to_avg) {
    var mean = sum(array_to_avg) / array_to_avg.length;
    return mean;
  }

  randomdigit(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  shuffle(array) {
    var newarr = [];
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      newarr[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return newarr;
  }

  rchoice(array) {
    return array[Math.floor(array.length * Math.random())];
  }

  range(start, end) {
    var r = [];
    for (var i = start; i < end; i++) {
      r.push(i);
    }
    return r;
  }

  first_practice_stim() {
    practice_stim();
    if (condition != 0 && condition != 3) {
      prac_teststim = prac_teststim.concat(inducersGen());
    }
    basestims = shuffle(prac_teststim);
    teststim = [];
    var stim_words = [];
    for (var i = 0; i < 2; i++) {
      var stim_types = [];
      basestims.forEach(function(stim_dict) {
        if (
          (stim_types.indexOf(stim_dict.type) == -1 ||
            stim_dict.cat == "inducer") &&
          stim_words.indexOf(stim_dict.word) == -1
        ) {
          stim_types.push(stim_dict.type);
          stim_words.push(stim_dict.word);
          teststim.push(stim_dict);
        }
      });
    }
  }

  getPracticeTestStimuli_simple() {
    //18 prac_teststim from all 4 categories (6+6+6)
    prac_teststim = [];
    stim_base.slice(0, 2).forEach(function(groupOf6) {
      var blocksOf108 = randomDegradePlus(groupOf6);
      prac_teststim.push.apply(prac_teststim, blocksOf108.slice(0, 6));
    });
  }
  getAllTestStimuli_simple() {
    //same as above, but for the full test: 3x36=108 stimuli from each of the 3 categories
    teststim = randomDegradePlus(stim_base[blocknum - 4]);
  }
  getPracticeTestStimuli_induced() {
    //27 degraded prac_teststim from all 3 categories (9+9+9)
    prac_teststim = [];
    stim_base.slice(0, 2).forEach(function(groupOf6) {
      var blocksOf162 = inducersAdded(groupOf6);
      prac_teststim.push.apply(prac_teststim, blocksOf162.slice(0, 9));
    });
  }
  getAllTestStimuli_induced() {
    //same as above, but one block of the full test: 162 stimuli from each of the 3 categories
    teststim = inducersAdded(stim_base[blocknum - 4]);
  }
  inducersAdded(groupOf6) {
    var stim_162_base = randomDegradePlus(groupOf6);
    var inducers = inducersGen();
    var inducerIndex;
    the9fills = ["%0", "%1", "%2", "#0", "#1", "#2", "*0", "*1", "*2"];
    for (var indx = 0; indx < stim_162_base.length; indx++) {
      if (stim_162_base[indx].blur == "yes") {
        inducerIndex = the9fills.indexOf(stim_162_base[indx].filler);
        stim_162_base.splice(indx, 0, inducers[inducerIndex]);
        indx++;
      }
    }
    stim_162 = stim_162_base;
    return stim_162;
  }
  inducersGen() {
    inducer_items = [
      "FAMILIAR",
      "RECOGNIZED",
      "MINE",
      "UNFAMILIAR",
      "UNKNOWN",
      "OTHER",
      "THEIRS",
      "THEM",
      "FOREIGN"
    ];
    inducers_base = [];
    inducer_items.forEach(function(word, ind) {
      inducers_base.push({
        word: word,
        cat: "inducer"
      });
      if (ind < 3) {
        inducers_base[ind].type = "selfrefitem";
      } else {
        inducers_base[ind].type = "otherrefitem";
      }
    });
    return inducers_base;
  }
  randomDegradePlus(arrayOf6dicts) {
    // using blur-noblur attributes, assigns (to blurs) a number from 1-3 for each filler type (* or # or %) in a balanced manner
    var tempCopy6 = JSON.parse(JSON.stringify(arrayOf6dicts));
    var the6words = [];
    tempCopy6.forEach(function(item) {
      the6words.push(item.word);
    });
    var stim_108 = [];
    stim_108.push.apply(stim_108, randomDegrade(arrayOf6dicts));
    stim_108.push.apply(stim_108, randomDegrade(arrayOf6dicts));
    stim_108.push.apply(stim_108, randomDegrade(arrayOf6dicts));
    possible6orders = [
      [0, 1, 2],
      [0, 2, 1],
      [1, 0, 2],
      [1, 2, 0],
      [2, 0, 1],
      [2, 1, 0]
    ];
    orders = {};
    orders["%"] = shuffle(JSON.parse(JSON.stringify(possible6orders)));
    orders["#"] = shuffle(JSON.parse(JSON.stringify(possible6orders)));
    orders["*"] = shuffle(JSON.parse(JSON.stringify(possible6orders)));
    stim_108.forEach(function(item, index) {
      if (item.blur == "yes") {
        var currentFiller = item.filler;
        var wordIndex = the6words.indexOf(item.word);
        stim_108[index].filler =
          currentFiller + orders[currentFiller][wordIndex].splice(0, 1);
      }
    });
    return stim_108;
  }
  randomDegrade(arrayOf6dicts) {
    // takes an array of six dictionary items, returns 36 items randomized in groups of 6, with randomly varying blur/filler attributes
    var stims_cat_base = shuffle(arrayOf6dicts);
    var stimuli_base36 =
      JSON.parse(JSON.stringify([stims_cat_base, stims_cat_base, stims_cat_base, stims_cat_base, stims_cat_base, stims_cat_base])); // 6x6=36 dict items
    var blurChoice = shuffle([0, 1, 2, 3, 4, 5]);
    var blurFirst = blurChoice.slice(0, 3); //position of items to be blurred in the first group of 6; then alternates (blur-noblur-blur-etc)
    var blurSecond = blurChoice.slice(3, 6); //position of items NOT to be blurred in the first group of 6; then alternates (noblur-blur-noblur-etc)
    var fillerChoice1 = shuffle([
      //randomizes the orders of the three possible fillers
      ["*", "#", "%"],
      ["%", "*", "#"],
      ["#", "%", "*"]
    ]);
    var fillerChoice2 = shuffle([
      //same again
      ["*", "#", "%"],
      ["%", "*", "#"],
      ["#", "%", "*"]
    ]);
    stimuli_base36.forEach(function(item6group, index6group) {
      // assigns the random blur and filler choices for each dict item within each group
      blurFirst.forEach(function(itemNum1, index1) {
        if (index6group % 2 == 0) {
          item6group[itemNum1].blur = "yes";
          item6group[itemNum1].filler = fillerChoice1[index6group / 2][index1];
        } else {
          item6group[itemNum1].blur = "no";
          item6group[itemNum1].filler =
            fillerChoice2[(index6group - 1) / 2][index1];
        }
      });
      blurSecond.forEach(function(itemNum2, index2) {
        if (index6group % 2 == 1) {
          item6group[itemNum2].blur = "yes";
          item6group[itemNum2].filler =
            fillerChoice1[(index6group - 1) / 2][index2];
        } else {
          item6group[itemNum2].blur = "no";
          item6group[itemNum2].filler = fillerChoice2[index6group / 2][index2];
        }
      });
    });
    var stimuli_36 = [];
    var temp6, fail;
    stimuli_base36.forEach(function(groupOf6, indexOf6) {
      //randomizes each 6-item group with restrictions regarding the sequence of the attributes (blur, filler) assigned above
      var available = [0];
      var safecount = 0;
      while (safecount < 299) {
        safecount++;
        var groupOf6_rand = groupOf6;
        if (condition == 2 || condition == 5) {
          // !! skip targets if targetless induced version
          groupOf6_rand.forEach(function(item_dic_rand, indx_rand6) {
            if (item_dic_rand.type == "target") {
              groupOf6_rand.splice(indx_rand6, 1);
            }
          });
        }
        groupOf6_rand = shuffle(groupOf6_rand);
        temp6 = [groupOf6_rand[0]];
        fail = 0;
        var leng = groupOf6_rand.length; // actually 5 if there is no target
        for (var i = 1; i < leng; i++) {
          var newDictItem = groupOf6_rand[i];
          var skip = [];
          for (placeIndex = 0; placeIndex < temp6.length; placeIndex++) {
            placeHolder = temp6[placeIndex];
            if (placeHolder.filler == newDictItem.filler) {
              //two of the same fillers never follow each other
              skip.push.apply(skip, [placeIndex, placeIndex + 1]);
            }
            if (
              placeIndex > 0 &&
              temp6[placeIndex - 1].blur == placeHolder.blur &&
              placeHolder.blur == newDictItem.blur
            ) {
              //max two blurred items beside each other
              skip.push.apply(skip, [
                placeIndex,
                placeIndex - 1,
                placeIndex + 1
              ]);
            }
            var slots = range(0, temp6.length + 1);
            available = slots.filter(function(valuee) {
              return skip.indexOf(valuee) === -1;
            });
          }
          if (available.length == 0) {
            fail = 1;
            break;
          }
          destination = rchoice(available);
          temp6.splice(destination, 0, newDictItem);
        }
        if (temp6[0].filler == lastOf6filler || temp6[0].word == lastOf6word) {
          //the word and filler type of the last item of the previous 6 group cannot be the same as the first of the next one
          fail = 1;
        }
        if (fail == 0) {
          stimuli_36[indexOf6] = JSON.parse(JSON.stringify(temp6));
          lastOf6filler = temp6[temp6.length - 1].filler; //store last item's filler type
          lastOf6word = temp6[temp6.length - 1].word; //store last item's word
          break;
        }
      }
    });
    var stim_36 = $.map(stimuli_36, function(n) {
      return n;
    });
    return stim_36;
  }

  flash_too_slow() {
    //$("#tooslow").show();
    setTimeout(function() {
      //$("#tooslow").hide();
      tooslow = 1;
      rspns = "x";
      first_prac_wrong();
      add_response();
    }, tooslow_delay);
  }

  flash_false() {
    //$("#false").show();
    setTimeout(function() {
      //$("#false").hide();
      incorrect = 1;
      first_prac_wrong();
      add_response();
    }, false_delay);
  }

  first_prac_wrong() {
    if (blocknum == 1) {
      teststim = [];
      alert(
        "You did not respond correctly. You will start this practice once again. Please read the instructions carefully."
      );
      first_correct = false;
    }
  }

  set_guilty_vs_innocent() {
    if (condition > 2) {
      div_after_item_selection = "#div_story_disp";
      $(".pre_detail").text("The criminal's ");
      $("#final_check_id").html(
        "This was the end of the lie detection test.<br><br>As a very important final check, please select below the details of the criminal as it was described in the beginning. This will confirm that you understood the instructions and remembered the crucial details."
      );
    } else {
      div_after_item_selection = "#instructions";
      $(".pre_detail").text("Your ");
      $("#final_check_id").html(
        "This is the end of the lie detection test.<br><br>As a very important final check, please select again the truly self-related details that you yourself gave in the very beginning. This will confirm that you understood the instructions and knew the crucial details."
      );
    }
  }
  set_cit_conditions() {
    var inducers_instructions =
      '<br><br>As continual reminders, there will also appear words that belong to one of the two categories (FAMILIAR or UNFAMILIAR). <br>Words belonging to the FAMILIAR category need the answer FAMILIAR ("I" key). These words are: <b>FAMILIAR</b>, <b>RECOGNIZED</b>, <b>MINE</b><br>Words belonging to the UNFAMILIAR category need the answer UNFAMILIAR ("E" key). These words are: <b>UNFAMILIAR</b>, <b>UNKNOWN</b>, <b>OTHER</b>, <b>THEIRS</b>, <b>THEM</b>, <b>FOREIGN</b></br></br>';
    if (condition == 0 || condition == 3) {
      // standard CIT
      div_after_instr = "#div_target_check";
      $("#task_instruction").html(
        'Pressing the "I" key means "YES, I recognize this item as a relevant". Pressing the "E" key means "NO, I do not recognize this item as relevant". <br> You will see words (countries, animals) appearing in the middle of the screen. You have to recognize and say YES to the following target details: <b>' +
        the_targets.join("</b>, <b>").toUpperCase() +
        "</b><br>You have to say NO to all other details. Remember: you are denying that you recognize any of the other details as relevant to you, so you you have to say NO to all of them.<br><br>"
      );
      $("#label_top").html("recognize?");
      $("#label_right").html('yes = "I"');
      $("#label_left").html('no = "E"');
      practice_stim = getPracticeTestStimuli_simple;
      main_stim = getAllTestStimuli_simple;
    } else if (condition == 1 || condition == 4) {
      // induced & target
      div_after_instr = "#div_target_check";
      $("#task_instruction").html(
        'Pressing the "I" key means that the displayed item is "FAMILIAR" to you. Pressing the "E" key means that the item is "UNFAMILIAR" to you. You will see words (countries, animals) appearing in the middle of the screen. You have to say FAMILIAR to the following target details: <b>' +
        the_targets.join("</b>, <b>").toUpperCase() +
        "</b><br>You have to say UNFAMILIAR to all other actual details (other countries, animals). Remember: you are denying that you recognize any of these other details as relevant to you, so you you have to say UNFAMILIAR to all of them. " +
        inducers_instructions
      );
      $("#label_top").html("familiar to you?");
      $("#label_right").html('familiar = "I"');
      $("#label_left").html('unfamiliar = "E"');
      practice_stim = getPracticeTestStimuli_induced;
      main_stim = getAllTestStimuli_induced;
    } else if (condition == 2 || condition == 5) {
      // induced - nontarget
      div_after_instr = "#div_cit_blockstart";
      $("#task_instruction").html(
        'Pressing the "I" key means that the displayed item is "FAMILIAR" to you. Pressing the "E" key means that the item is "UNFAMILIAR" to you. You will see words (countries, animals) appearing in the middle of the screen. You have to say UNFAMILIAR to all these details. Remember: you are denying that you recognize any of these details as relevant to you, so you you have to say UNFAMILIAR to all of them. ' +
        inducers_instructions
      );
      $("#label_top").html("familiar to you?");
      $("#label_right").html('familiar = "I"');
      $("#label_left").html('unfamiliar = "E"');
      practice_stim = getPracticeTestStimuli_induced;
      main_stim = getAllTestStimuli_induced;
    }
    if (lbls_order == "lbl2nd") {
      lbl_status = 0;
      $("#label_top").html("");
      $("#label_right").html("");
      $("#label_left").html("");
    } else {
      lbl_status = 1;
    }
  }

  item_display() {
    if (trial_stim.type == "target" || trial_stim.type == "selfrefitem") {
      correct_resp = "i";
    } else {
      correct_resp = "e";
    }
    //if (typeof key_press_sim === "function") {
    //                key_press_sim(); //remove
    //} //remove
    requestAnimationFrame(function() {
      $("#stimulus").text(text_to_show);
      start = performance.now();
      listen = true;
      response_window = setTimeout(function() {
        rt = performance.now() - start;
        listen = false;
        flash_too_slow();
      }, response_deadline);
    });
  }
  isi() {
    isi_delay = randomdigit(isi_delay_minmax[0], isi_delay_minmax[1]);
    setTimeout(function() {
      item_display();
    }, isi_delay);
  }

  practice_eval() {
    //at least 60% on each item. if not, warn accordingly
    var is_valid = true;
    var types_failed = [];
    if (blocknum == 1) {
      is_valid = first_correct;
      first_correct = true;
    } else {
      for (var it_type in rt_data_dict) {
        var rts_correct = $.grep(rt_data_dict[it_type], function(rt_item) {
          return rt_item > 150;
        });
        corr_ratio = rts_correct.length / rt_data_dict[it_type].length;
        if (corr_ratio < 0.6) {
          is_valid = false;
          types_failed.push(
            " " +
            it_type_feed_dict[it_type] +
            " (" +
            Math.floor(corr_ratio * 10000) / 100 +
            "% correct)"
          );
        }
      }
    }
    if (is_valid == false) {
      practice_chances--;
      if (practice_chances == 0) {
        end_task("z_Invalid_practice_" + blocknum + "_");
        subject_id = 0;
        blocknum = -99;
        alert(
          "You repeated this practice phase too many times. Therefore, unfortunately, you cannot continue the experiment."
        );
        window.location = end_url;
      } else {
        var feedback_text =
          "You will have to repeat this practice round, because of too few correct responses.<br><br>You need at least 60% accuracy on each item type, but you did not have enough correct responses for the following one(s):" +
          types_failed.join(",") +
          ".<br><br>Try to make responses both accurately and in time.<br><br>";
        $("#feedback_id" + blocknum).html(feedback_text);
      }
    }
    return is_valid;
  }
  main_eval() {
    //at least 50% on each item. if not, warn accordingly. kickout below 40%
    var verylow = false;
    var types_failed = [];
    for (var it_type in rt_data_dict) {
      var rts_correct = $.grep(rt_data_dict[it_type], function(rt_item) {
        return rt_item > 150;
      });
      corr_ratio = rts_correct.length / rt_data_dict[it_type].length;
      if (corr_ratio < 0.35) {
        end_task("z_Invalid_lowacc_");
        subject_id = 0;
        blocknum = -99;
        alert(
          "You had such an extremely low accuracy that is not possible if one pays attention to the task. Therefore, unfortunately, you cannot continue the experiment."
        );
        window.location = end_url;
        break;
      } else if (corr_ratio < 0.5) {
        verylow = true;
        types_failed.push(
          " " +
          it_type_feed_dict[it_type] +
          " (" +
          Math.floor(corr_ratio * 10000) / 100 +
          "% correct)"
        );
      }
    }
    if (verylow == true && blocknum > 3) {
      var feedback_text =
        "Warning: you had very low accuracy in this last block to the following item type(s):" +
        types_failed.join(",") +
        ". Please pay attention and make responses in time accurately.";
      alert(feedback_text);
    }
  }
  next_trial() {
    if (teststim.length > 0) {
      tooslow = 0;
      incorrect = 0;
      rspns = "";
      trial_stim = teststim[0];
      block_trialnum++;
      text_to_show = trial_stim.word.toUpperCase();
      isi();
    } else {
      basic_times.blocks += "\nBlock " + blocknum + " end " + Date();
      if (blocknum > 3 || practice_eval()) {
        if (blocknum == 4 || blocknum == 5) {
          main_eval();
        }
        practice_chances = 3; // give 3 chances for 2nd & 3rd practice blocks
        blocknum++;
        nextblock();
      } else {
        if (blocknum == 1) {
          practice_repeated.block1 += 1;
        } else if (blocknum == 2) {
          practice_repeated.block2 += 1;
        } else if (blocknum == 3) {
          practice_repeated.block3 += 1;
        }
        nextblock();
      }
    }
  }

  add_response() {
    $("#stimulus").text("");
    var curr_type;
    if (
      ["selfrefitem", "otherrefitem", "target"].indexOf(trial_stim.type) >= 0
    ) {
      curr_type = trial_stim.type;
    } else {
      curr_type = "main_item";
    }
    if (!(curr_type in rt_data_dict)) {
      rt_data_dict[curr_type] = [];
    }
    if (incorrect == 1 || tooslow == 1) {
      rt_data_dict[curr_type].push(-1);
    } else {
      rt_data_dict[curr_type].push(rt);
    }
    cit_data +=
      subj_id +
      "\t" +
      lbl_status +
      "\t" +
      blocknum +
      "\t" +
      block_trialnum +
      "\t" +
      trial_stim.word +
      "\t" +
      trial_stim.cat +
      "\t" +
      trial_stim.type +
      "\t" +
      rspns +
      "\t" +
      rt +
      "\t" +
      incorrect +
      "\t" +
      tooslow +
      "\t" +
      String(new Date().getTime()) +
      "\n";
    teststim.shift();
    next_trial();
  }
  call_practice_stim() {
    //takes halves of the practice stims generated
    if (practice_num % 2 == 1) {
      // generate and take first half
      practice_stim();
      teststim = prac_teststim.slice(0, Math.floor(prac_teststim.length / 2));
    } else {
      // just take second half
      teststim = prac_teststim.slice(
        Math.floor(prac_teststim.length / 2),
        prac_teststim.length
      );
    }
    practice_num++;
  }
  nextblock() {
    $("*").css("cursor", "auto");
    if (blocknum <= num_of_blocks) {
      block_trialnum = 0;
      if (blocknum == 1) {
        response_deadline = 10500;
        first_practice_stim();
      } else if (blocknum == 2) {
        response_deadline = 2000;
        call_practice_stim();
      } else if (blocknum == 3) {
        response_deadline = response_deadline_main;
        call_practice_stim();
      } else {
        if (blocknum == 6) {
          if (lbls_order == "lbl2nd") {
            lbl_status = 1;
            $("#label_top").html("familiar to you?");
            $("#label_right").html('familiar = "I"');
            $("#label_left").html('unfamiliar = "E"');
          } else {
            lbl_status = 0;
            $("#label_top").html("");
            $("#label_right").html("");
            $("#label_left").html("");
          }
        }
        response_deadline = response_deadline_main;
        main_stim();
      }
      rt_data_dict = {};
      show_blockstart();
    } else {
      basic_times.blocks += "\nBlock " + blocknum + " end_last " + Date();
      ins = "";
      $("#div_cit_main").hide();
      lighten_bg();
      $("#div_outro_check").show();
    }
  }
  show_blockstart() {
    if (practice_repeated["block" + blocknum] == 0 || blocknum > 3) {
      $("#infotext").html(block_texts[blocknum]);
    }
    if (practice_chances == 1) {
      $("#chances_id").html(
        "<b>Now you only have 1 single chance left to complete this practice round correctly!</b> Our minimum requirements are very low. If you understand the instructions clearly, and follow them carefully, you must be able to complete the task. Otherwise you will not be able to continue with this experiment."
      );
    } else {
      if (blocknum == 3) {
        $("#chances_id").html(
          "You have only <b>" +
          practice_chances +
          " chances</b> to complete this last practice round."
        );
      } else {
        $("#chances_id").html(
          "Please make sure you clearly understand the instructions before continuing with the task! You have only <b>" +
          practice_chances +
          " chances</b> to complete this practice round."
        );
      }
    }
    $("#div_cit_main").hide();
    if (first_blockstart == true) {
      first_blockstart = false;
    } else {
      $("#div_cit_blockstart").show();
    }
  }
  runblock() {
    basic_times.blocks += "\nBlock " + blocknum + " start " + Date();
    $("*").css("cursor", "none");
    $("#div_cit_blockstart").hide();
    $("#start_text").show();
    $("#div_cit_main").show();
    can_start = true;
  }
  start_trials() {
    if (can_start === true) {
      code = es.keyCode || es.which;
      if (code == 32) {
        //space
        can_start = false;
        $("#start_text").hide();
        next_trial();
      }
    }
  }

  process_resp(response_side) {
    if (listen === true) {
      rt = performance.now() - start;
      if (rt < response_deadline) {
        listen = false;
        rspns = response_side;
        clearTimeout(response_window);
        if (rspns == correct_resp) {
          add_response();
        } else {
          flash_false();
        }
      }
    }
  }

  // ITEM GENERATION

  prune() {
    //given the probe (in each of the categories), selects 8 additional items, 5 of which will later be irrelevants. None with same starting letter, and with length closest possible to the probe.
    var true_details_base = [
      $("#countries")
        .val()
        .toLowerCase(),
      "may",
      11,
      $("#animals")
        .val()
        .toLowerCase()
    ];
    true_details = [
      true_details_base[0],
      [true_details_base[1], true_details_base[2]].join(" "),
      true_details_base[3]
    ];
    var items_base2_temp = [];
    true_details_base.forEach(function(probe, index) {
      var container = items_base1[index],
        temps;
      var final8 = [probe];
      var maxdif = 0;
      if (probe[0] > -1) {
        final8.push.apply(final8, [0, 0, 0, 0, 0, 0, 0]);
      } else {
        container = $.grep(container, function(n) {
          return probe != n;
        });
        container = $.grep(container, function(n) {
          // filter if same starting character
          return probe[0] != n[0];
        });
        if (index === 0 || index === 3) {
          if (/\s/.test(probe)) {
            container = $.grep(container, function(n) {
              return /\s/.test(n);
            });
          } else {
            container = $.grep(container, function(n) {
              return !/\s/.test(n);
            });
          }
        }
        while (final8.length < 9 && maxdif < 99) {
          temps = $.grep(container, function(n) {
            return Math.abs(probe.length - n.length) <= maxdif;
          });
          if (temps.length > 0) {
            final8.push(rchoice(temps));
            container = $.grep(container, function(n) {
              return final8[final8.length - 1] !== n;
            });
            if (index === 0 || index === 3) {
              container = $.grep(container, function(n) {
                return final8[final8.length - 1][0] !== n[0];
              });
            }
          } else {
            maxdif++;
          }
        }
      }
      items_base2_temp.push(final8);
    });
    var days = range(1, 32);
    var day;
    var days_to_filt1 = [true_details_base[2]];
    items_base2_temp[1].forEach(function(month, index) {
      if (index > 0) {
        var days_to_filt2 = days_to_filt1;
        if (month == "february") {
          days_to_filt2 = days_to_filt1.concat([29, 30, 31]);
        } else {
          if (
            $.inArray(month, ["april", "june", "september", "november"]) > -1
          ) {
            days_to_filt2.push(31);
          }
        }
        var dys_temp = $.grep(days, function(a) {
          return $.inArray(a, days_to_filt2) == -1;
        });
        day = rchoice(dys_temp);
      } else {
        day = items_base2_temp[2][0];
      }
      items_base2_temp[2][index] = [month, day].join(" ");
      days_to_filt1.push(day);
    });
    items_base2_temp.splice(1, 1);
    items_base2_temp.splice(1, 1); // skip dates
    items_base2 = items_base2_temp;
  }

  select_meaningful() {
    set_guilty_vs_innocent(); // this sets instruction texts depending on guilt - unrelated to item selection
    window.countC0 = 0;
    window.countC1 = 0;
    window.words_to_filter = [[], []];
    items_base2.forEach(function(categ, index1) {
      column = categ.slice(1, 9);
      column.forEach(function(word, ind) {
        column[ind] = word.toLowerCase();
      });
      column.sort();
      column.splice(randomdigit(1, 6), 0, "None");
      column.forEach(function(word, index2) {
        var id_full = ["#wo", index1, index2].join("");
        $(id_full).text(word);
      });
    });
    $(".words0").click(function() {
      var this_word = $(this).text();
      if (this_word == "None") {
        if ($(this).hasClass("turnedon")) {
          $(this).removeClass("turnedon");
          countC0 = 0;
        } else {
          if (countC0 === 0) {
            $(this).addClass("turnedon");
            countC0 = 9;
          }
        }
      } else {
        if ($(this).hasClass("turnedon")) {
          $(this).removeClass("turnedon");
          words_to_filter[0] = $.grep(words_to_filter[0], function(a) {
            return a != this_word;
          });
          countC0--;
        } else {
          if (countC0 < 2) {
            $(this).addClass("turnedon");
            words_to_filter[0].push(this_word);
            countC0++;
          }
        }
      }
    });
    $(".words1").click(function() {
      var this_word = $(this).text();
      if (this_word == "None") {
        if ($(this).hasClass("turnedon")) {
          $(this).removeClass("turnedon");
          countC1 = 0;
        } else {
          if (countC1 === 0) {
            $(this).addClass("turnedon");
            countC1 = 9;
          }
        }
      } else {
        if ($(this).hasClass("turnedon")) {
          $(this).removeClass("turnedon");
          words_to_filter[1] = $.grep(words_to_filter[1], function(a) {
            return a != this_word;
          });
          countC1--;
        } else {
          if (countC1 < 2) {
            $(this).addClass("turnedon");
            words_to_filter[1].push(this_word);
            countC1++;
          }
        }
      }
    });
  }

  create_stim_base() {
    //creates all stimuli (a 6-item group - 1probe,1target,4irrelevants - for each of 4 different categories) from the given item and probe words
    var stim_base_temp = [[], []];
    items_base2.forEach(function(categ, index) {
      var filtered_words = $.grep(categ, function(a) {
        return $.inArray(a, words_to_filter[index]) == -1;
      });
      var words_array = [];
      if (condition < 3) {
        words_array = [filtered_words[0]].concat(
          shuffle(filtered_words.slice(1, 6))
        ); // for GUILTY
      } else {
        words_array = shuffle(filtered_words.slice(1, 7)); // for INNOCENT
      }
      words_array.forEach(function(word, num) {
        stim_base_temp[index].push({
          word: word,
          cat: categories[index]
        });
        if (0 === num) {
          stim_base_temp[index][num]["type"] = "probe";
          the_probes.push(stim_base_temp[index][num].word);
        } else if (1 == num) {
          stim_base_temp[index][num]["type"] = "target";
          the_targets.push(stim_base_temp[index][num].word);
        } else {
          stim_base_temp[index][num]["type"] = "irrelevant" + (num - 1);
        }
      });
    });
    window.stim_base = [
      stim_base_temp[0],
      stim_base_temp[1],
      stim_base_temp[0],
      stim_base_temp[1]
    ];
    set_block_texts();
    set_cit_conditions();
    store_basics();
  }

  target_check() {
    if (
      $("#tcheck_countries")
        .val()
        .toUpperCase() != the_targets[0].toUpperCase() ||
      $("#tcheck_animals")
        .val()
        .toUpperCase() != the_targets[1].toUpperCase()
    ) {
      alert("Wrong! Please check the details more carefully!");
      $("#div_target_check").hide();
      $("#instructions").show();
      $("#tcheck_countries").val("");
      $("#tcheck_animals").val("");
      $("#tcheck_months").val("");
      $("#tcheck_days").val("");
      return false;
    } else {
      div_after_instr = "#div_cit_blockstart";
      return true;
    }
  }

  story_details_check() {
    var date_inp = $("#scheck_months").val() + " " + $("#scheck_days").val();
    if (
      $("#scheck_countries")
        .val()
        .toUpperCase() != the_probes[0].toUpperCase() ||
      date_inp.toUpperCase() != the_probes[1].toUpperCase() ||
      $("#scheck_animals")
        .val()
        .toUpperCase() != the_probes[2].toUpperCase()
    ) {
      alert("Wrong! Please check the details more carefully!");
      $("#div_story_check").hide();
      $("#div_story_disp").show();
      $("#scheck_countries").val("");
      $("#scheck_animals").val("");
      $("#scheck_months").val("");
      $("#scheck_days").val("");
      return false;
    } else {
      return true;
    }
  }
  final_probe_check() {
    if (validate_form(".form_check")) {
      var multip = 1 + 999 * failed_final;
      if (
        $("#fcheck_countries")
          .val()
          .toUpperCase() != the_probes[0].toUpperCase()
      ) {
        num_of_failed_fin += 100 * multip;
      }
      if (
        $("#fcheck_animals")
          .val()
          .toUpperCase() != the_probes[1].toUpperCase()
      ) {
        num_of_failed_fin += 1 * multip;
      }
      if (
        $("#fcheck_countries")
          .val()
          .toUpperCase() != the_probes[0].toUpperCase() ||
        $("#fcheck_animals")
          .val()
          .toUpperCase() != the_probes[1].toUpperCase()
      ) {
        if (failed_final == 0) {
          failed_final = 1;
          alert("Wrong!");
          $("#final_check_feedback").html(
            "<b>Your selection was not correct! It is crucial that you select these details correctly. Please take your time and make sure you understand what you need to select. Then try to select all details correctly.</b><br>"
          );
          return false;
        } else {
          failed_final = 2;
          return true;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
  end_task(full_validity = "") {
    f_name =
      full_validity +
      experiment_title +
      "_" +
      subj_id +
      ".txt";
    basic_times.finished = Date();
    duration_full = seconds_between_dates(
      basic_times.consented,
      basic_times.finished
    );
    cit_data +=
      "Loaded " +
      basic_times.loaded +
      " Consented " +
      basic_times.consented +
      " Practice_start " +
      basic_times.practice +
      " Finished " +
      basic_times.finished +
      basic_times.blocks +
      "\nRepetitions: " +
      "\t" +
      practice_repeated.block1 +
      "\t" +
      practice_repeated.block2 +
      "\t" +
      practice_repeated.block3 +
      "\t";
    practice_all_reps =
      practice_repeated.block1 +
      practice_repeated.block2 +
      practice_repeated.block3;
    dems +=
      "\t" +
      practice_all_reps +
      "\t" +
      duration_full +
      "\t" +
      failed_final +
      "\t" +
      num_of_failed_fin +
      "\t" +
      $("#sal_country").val() +
      "\t" +
      $("#sal_animal").val() +
      "\n";
  }
}
