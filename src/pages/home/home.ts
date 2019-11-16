import { Component, ViewChild } from "@angular/core";
import { Content, Slides } from 'ionic-angular';
import { NavController } from "ionic-angular";
import { Storage } from "@ionic/storage";
import { File } from '@ionic-native/file';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { Clipboard } from '@ionic-native/clipboard';
import { BackgroundMode } from '@ionic-native/background-mode';
import { EmailComposer } from "@ionic-native/email-composer";
import { Platform } from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { NavigationBar } from '@ionic-native/navigation-bar';
import { Insomnia } from '@ionic-native/insomnia';
import { PopoverController } from 'ionic-angular';
import { PopoverItems } from './menupopover';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides;
  // /*
  to_exec: any;
  onChange(ee) {
    if (ee.keyCode === 13) {
      console.log(eval(this.to_exec))
    }
  }
  touchsim() {
    var info = this.trial_stim.type + " (" + this.trial_stim.word + ")";
    var rt_sim = this.randomdigit(600, 830);
    if (this.trial_stim.type == "probe") {
      rt_sim = rt_sim;// + 10;
    }
    var correct_chance1 = 1;
    var correct_chance2 = 0.95;
    var correct_chance, sim_key, corr_code, incor_code, chosen_response;
    setTimeout(function() {
      if (this.blocknum == 1) {
        correct_chance = correct_chance1;
      } else {
        correct_chance = correct_chance2;
      }
      if (this.correct_resp == "resp_a") {
        corr_code = "resp_a";
        incor_code = "resp_b";
      } else {
        corr_code = "resp_b";
        incor_code = "resp_a";
      }
      if (Math.random() < correct_chance) { // e.g. 95% correctly right key
        sim_key = corr_code;
      } else {
        sim_key = incor_code;
      }
      if (sim_key == "resp_a") {
        chosen_response = "Response: resp_a (LEFT)";
      } else {
        chosen_response = "Response: resp_b (RIGHT)";
      }
      info += "\n--len(stims): " + this.teststim.length + ", trialnum: " + this.block_trialnum + "\n";
      this.touchstart("", sim_key);
      info += chosen_response + " preset " + rt_sim + ", actual " + Math.round(performance.now() - this.start) + "\n";
      console.log(info);
    }.bind(this), rt_sim);
  }
  //*/

  cit_items: string[] = [];
  personal_feedback: string = '';
  false_delay: number = 400;
  tooslow_delay: number = 400;
  isi_delay_minmax: number[] = [300, 700];
  isi_delay: number = 99999;
  cit_type: number = 2;
  pre_cond: number = 9999;
  subj_id: string;
  response_deadline: number;
  response_deadline_main: number = 900;
  bg_color: string = "#fff";
  feed_text: string = "";
  task_instruction: string;
  current_div: string = "div_settings"; // ddd default: "div_start", div_settings, div_dems, div_cit_main, div_end
  visib: any = {};
  block_texts: string[] = [];
  form_items: FormGroup;
  submit_failed: boolean = false;
  on_device: boolean;
  teststim: any[];
  tooslow: number;
  incorrect: number;
  block_trialnum: number;
  rt_data_dict: any;
  all_main_rts: any = { "probs": [], "irrs": [] };
  trial_stim: any;
  rspns: string;
  first_correct: boolean = true;
  text_to_show: string;
  practice_repeated: any = {
    block1: 0,
    block2: 0,
    block3: 0
  };
  cit_data: string =
    "subject_id\tcit_version\tblock_number\ttrial_number\tstimulus_shown\tcategory\tstim_type\tresponse_key\trt_start\trt_end\tincorrect\ttoo_slow\tisi\tdate_in_ms\n";
  correct_resp: string = "none";
  blocknum: number = 1;
  num_of_blocks: number = 1;
  rt_start: number = 99999;
  rt_end: number = 99999;
  start: any = 0;
  listen: boolean = false;
  listn_end: boolean = false;
  it_type_feed_dict: any = {
    selfrefitem: "target-side fillers",
    otherrefitem: "nontarget-side fillers",
    main_item: "nontarget items",
    target: "target item"
  };
  practice_num: number = 5;
  basic_times: any = {};
  response_window: any;
  nums: any[];
  stim_base: any[];
  the_targets: string[] = [];
  the_probes: string[] = [];
  stimulus_text: string = "";
  path: any = "";
  f_name: string;
  to_display: string = "";
  pointev: any = {};
  versionnum: string = 'notandroid';
  targetrefs: string[] = [];
  nontargrefs: string[] = [];
  targetref_words_orig: string[] = ["FAMILIAR", "MINE", "RECOGNIZED"];
  nontargref_words_orig: string[] = ["FOREIGN", "IRRELEVANT", "OTHER", "RANDOM", "THEIRS", "UNFAMILIAR"];
  targetref_words: string[] = JSON.parse(JSON.stringify(this.targetref_words_orig));
  nontargref_words: string[] = JSON.parse(JSON.stringify(this.nontargref_words_orig));
  settings_storage: Function;
  send_stat: Function;
  mailpost: string = "";
  pwpost: string = "";

  constructor(
    public navCtrl: NavController,
    private storage: Storage,
    private emailComposer: EmailComposer,
    public platform: Platform,
    public formBuilder: FormBuilder,
    private file: File,
    private statusBar: StatusBar,
    private network: Network,
    private clipboard: Clipboard,
    private backgroundMode: BackgroundMode,
    private navigationBar: NavigationBar,
    private insomnia: Insomnia,
    public popoverCtrl: PopoverController,
    private http: HttpClient
  ) {

    this.settings_storage = function(datapost = 'sendpass') {
      console.log('settings_storage starts...');
      if (datapost == 'yes') {
        datapost = JSON.stringify({
          'subject_id': this.subj_id,
          'cit_version': this.cit_type,
          'num_of_blocks': this.num_of_blocks,
          'deadline': this.response_deadline_main,
          'isi_min': this.isi_delay_minmax[0],
          'isi_max': this.isi_delay_minmax[1],
          'target': this.cit_items[0],
          'probe1': this.cit_items[1],
          'probe2': this.cit_items[2],
          'probe3': this.cit_items[3],
          'probe4': this.cit_items[4],
          'probe5': this.cit_items[5],
          'filler1': this.targetref_words[0],
          'filler2': this.targetref_words[1],
          'filler3': this.targetref_words[2],
          'filler4': this.nontargref_words[0],
          'filler5': this.nontargref_words[1],
          'filler6': this.nontargref_words[2],
          'filler7': this.nontargref_words[3],
          'filler8': this.nontargref_words[4],
          'filler9': this.nontargref_words[5]
        });
      }
      this.http.post('https://homepage.univie.ac.at/gaspar.lukacs/x_citapp/x_citapp_storage.php', JSON.stringify({
        email_post: this.mailpost,
        pw_post: this.pwpost,
        data_post: datapost
      }), { responseType: "text" }).subscribe((response) => {
        console.log(response);
        let feed;
        if (response.slice(0, 7) == 'victory') {
          document.getElementById("feedback_id").style.color = 'green';
          response = response.slice(7)
          if (response.slice(0, 6) == 'insert') {
            response = response.slice(6)
            feed = "Data saved in database.";
          } else if (response.slice(0, 6) == 'update') {
            response = response.slice(6)
            feed = "Data updated in database.";
          } else if (response.slice(0, 6) == 'loaded') {
            response = response.slice(6)
            feed = "Data loaded from database.";
            this.load_settings(response);
          }
        } else {
          document.getElementById("feedback_id").style.color = 'red';
          feed = 'Error. ' + response;
        }
        document.getElementById("feedback_id").innerHTML = feed + "<br><br>";
      },
        err => {
          console.log('Request failed: ', err);
          document.getElementById("feedback_id").style.color = 'red';
          let feed = 'Could not connect to server. ' + err.message;
          document.getElementById("feedback_id").innerHTML = feed + "<br><br>";
        });
    }
    let test_date = "datehere";
    this.send_stat = function(datapost = 'sendpass') {
      console.log('send_stat starts...');
      this.http.post('https://homepage.univie.ac.at/gaspar.lukacs/x_citapp/x_citapp_stat.php', JSON.stringify({ "testdate": test_date }), { responseType: "text" }).subscribe((response) => {
        console.log(response);
        let feed;
        if (response == 'victory') {
          // TODO erase from storage
          console.log('Victory!!');
        } else {
          console.log('Failed SQL:' + response);
        }
      },
        err => {
          console.log('Request failed: ', err);
        });
    }
    this.send_stat();

    this.on_device = this.platform.is("cordova");
    if (this.platform.versions().android) {
      this.versionnum = this.platform.versions().android.num.toString();
    }

    this.visib.start_text = true;

    let validator_dict = {
      sub_id: [
        "",
        Validators.compose([Validators.maxLength(30),
        Validators.pattern("[a-zA-Z0-9_]*"), Validators.required])
      ]
    }

    let input_names = ['target', 'probe1', 'probe2', 'probe3', 'probe4', 'probe5', 'filler1', 'filler2', 'filler3', 'filler4', 'filler5', 'filler6', 'filler7', 'filler8', 'filler9'];
    input_names.forEach(ky => validator_dict[ky] = [
      "",
      Validators.compose([
        Validators.maxLength(30),
        Validators.required
      ])
    ]);
    this.form_items = formBuilder.group(validator_dict);

  }

  texttrans: boolean = true;
  change_texttrans() {
    if (this.texttrans === true) {
      document.documentElement.style.setProperty('--inputcase', 'uppercase');
    } else {
      document.documentElement.style.setProperty('--inputcase', 'none');
    }
    console.log(this.cit_items);
  };


  internet_on: boolean = true;
  ionViewDidLoad() {

    if (this.on_device) {

      setInterval(() => {
        if (this.network.type) {
          if (this.network.type != "none") {
            this.internet_on = true;
          } else {
            this.internet_on = false;
          }
        }
      }, 500);

      this.statusBar.hide();
      this.navigationBar.hideNavigationBar();
      this.navigationBar.setUp(true);
      this.backgroundMode.enable();
      this.backgroundMode.setDefaults({
        title: "Concealed Information Test App active",
        text: "",
        silent: true
      });
      this.path = this.file.externalDataDirectory;
    }
  }
  seg_values: string[] = ['main', 'fillers', 'settings', 'autofill', 'start'];
  current_segment: string = '';
  current_menu: string = '';
  menu_pop(myEvent) {
    let popover = this.popoverCtrl.create(PopoverItems);
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(pop_data => {
      if (pop_data != null) {
        this.current_menu = pop_data;
        this.current_segment = 'menus';
      }
    })
  }

  switch_divs(div_to_show) {
    this.current_div = div_to_show;
    Object.keys(this.pointev).forEach(ky => this.pointev[ky] = "none");
    setTimeout(function() {
      this.pointev[div_to_show] = "auto";
    }.bind(this), 300);
    this.content.scrollToTop(0);
    this.navigationBar.hideNavigationBar();
  }

  load_settings(loaded_data) {
    let data_dict = JSON.parse(loaded_data);
    this.subj_id = data_dict.subject_id || this.subj_id;
    this.cit_type = data_dict.cit_version || this.cit_type;
    this.num_of_blocks = data_dict.num_of_blocks || this.num_of_blocks;
    this.response_deadline_main = data_dict.timelimit || this.response_deadline_main;
    this.isi_delay_minmax[0] = data_dict.isi_min || this.isi_delay_minmax[0];
    this.isi_delay_minmax[1] = data_dict.isi_max || this.isi_delay_minmax[1];
    this.cit_items[0] = data_dict.target || this.cit_items[0];
    this.cit_items[1] = data_dict.probe1 || this.cit_items[1];
    this.cit_items[2] = data_dict.probe2 || this.cit_items[2];
    this.cit_items[3] = data_dict.probe3 || this.cit_items[3];
    this.cit_items[4] = data_dict.probe4 || this.cit_items[4];
    this.cit_items[5] = data_dict.probe5 || this.cit_items[5];
    this.targetref_words[0] = data_dict.filler1 || this.targetref_words[0];
    this.targetref_words[1] = data_dict.filler2 || this.targetref_words[1];
    this.targetref_words[2] = data_dict.filler3 || this.targetref_words[2];
    this.nontargref_words[0] = data_dict.filler4 || this.nontargref_words[0];
    this.nontargref_words[1] = data_dict.filler5 || this.nontargref_words[1];
    this.nontargref_words[2] = data_dict.filler6 || this.nontargref_words[2];
    this.nontargref_words[3] = data_dict.filler7 || this.nontargref_words[3];
    this.nontargref_words[4] = data_dict.filler8 || this.nontargref_words[4];
    this.nontargref_words[5] = data_dict.filler9 || this.nontargref_words[5];
  };

  initials() {
    this.settings_storage('test@email.com', 'mypass', 'somedata');
    if (!this.form_items.valid) { // TODO validation copy from form_dems in latest citapp_sp
      this.submit_failed = true;
      // for TESTING:
      console.log('testing');
      this.subj_id = "189";
    } else {
      if (this.texttrans === true) {
        this.cit_items = this.cit_items.map(w => w.toUpperCase())
        this.targetref_words = this.targetref_words.map(w => w.toUpperCase())
        this.nontargref_words = this.nontargref_words.map(w => w.toUpperCase())
      }
      this.switch_divs('div_instructions');
    }
  }



  default_fillers() {
    this.targetref_words = JSON.parse(JSON.stringify(this.targetref_words_orig));
    this.nontargref_words = JSON.parse(JSON.stringify(this.nontargref_words_orig));
  }
  default_core() {
    this.cit_items.map((x, i) => this.cit_items[i] = '');
    this.subj_id = '';
  }
  default_settings() {
    this.texttrans = true;
    this.cit_type = 2;
    this.num_of_blocks = 1;
    this.isi_delay_minmax = [300, 700];
    this.response_deadline_main = 900;
  }

  task_start() {
    this.insomnia.keepAwake();
    this.backgroundMode.setDefaults({
      text: "Test in progress!",
      silent: false
    })
    this.switch_divs("div_instructions");
  }

  inducers_instructions: string;
  the_nontargs: string[];
  targs_names: string;
  nontargs_names: string;
  set_cit_type() {
    this.inducers_instructions =
      'You have to categorize each word that appears during the test by pressing the key "E" on the left or the key "I" on the right.</br></br>Press the right ("I") key, when you see a familiar-referring word. These words are: ' + this.targetrefs + '. Press the left ("E") key, when you see an unfamiliar-referring word. These words are: ' + this.nontargrefs + '.';
    if (this.cit_type == 0) {
      // standard CIT
      this.task_instruction = 'You will see country names appearing in the middle of the screen. You have to press the key "I" to the following target country: <b>' +
        this.the_targets.sort().join("</b>, <b>").toUpperCase() +
        '</b><br>You have to press the key "E" to all other details.<br><br>';
    } else if (this.cit_type == 1) {
      // fillers (no target)
      this.task_instruction = 'Press the right ("I") key when you see the following target country: <b>' +
        this.the_targets.sort().join("</b>, <b>").toUpperCase() +
        '.</b><br>Press the left ("E") key to all other countries (<b>' +
        this.the_nontargs.sort().join("</b>, <b>").toUpperCase() +
        '</b>). </br></br>' +
        this.inducers_instructions;
    } else if (this.cit_type == 2) {
      // fillers & target
      this.task_instruction = 'Press the right ("I") key when you see the following target country: <b>' +
        this.the_targets.sort().join("</b>, <b>").toUpperCase() +
        '.</b><br>Press the left ("E") key to all other countries (<b>' +
        this.the_nontargs.sort().join("</b>, <b>").toUpperCase() +
        '</b>). </br></br>' +
        this.inducers_instructions;
    }
    this.targs_names = '<b>' + this.the_targets.sort().join("</b>, <b>").toUpperCase() + '</b>';
    this.nontargs_names = '<b>' + this.the_nontargs.sort().join("</b>, <b>").toUpperCase() + '</b>';
  }

  set_block_texts() {
    var target_reminder;
    if (this.cit_type == 1) {
      target_reminder = "";
    } else {
      target_reminder = this.stim_base[0][1].word.toUpperCase();
    }
    this.block_texts[0] = "";
    this.block_texts[1] =
      'During the experiment, various words will appear in the middle of the screen. You have to categorize each word by pressing the key "E" on the left or the key "I" on the right.</br></br>There will be three short practice rounds. In this first practice round, you have to categorize expressions that refer to familiarity or unfamiliarity. ' + this.inducers_instructions +
      '<br><br><span id="feedback_id1">In each category of words, you need to respond to at least 80% correctly and in time (within 1 second).<br><br></span><p id="chances_id"></p>';
    this.block_texts[2] =
      'Now, in this second practice round, we just want to see that you clearly understand the task. Therefore, you will have a lot of time to choose each of your responses, just make sure you choose accurately. <b>You must respond to each item correctly.</b> If you choose an incorrect response (or not give response for over 10 seconds), you will have to repeat this practice round.<br><br>If needed, click <b>show full instructions again</b> to reread the details.<span id="feedback_id2"></span><p id="chances_id"></p>';
    this.block_texts[3] =
      "<span id='feedback_id3'>You passed the second practice round. In this third and last practice round, you will again have to respond fast, but a certain rate of error is allowed. (Also, the reminder labels at the bottom will not be displayed anymore. But the task is the same.)<br><br>The task is difficult, so don't be surprised if you make mistakes, but do your best: <b>try to be as accurate and as fast as possible</b>.<br></span><p id='chances_id'></p>";
    this.block_texts[4] =
      "Good job. Now begins the actual test. The task is the same.<br><br>There will be %% blocks, with breaks in-between. <b>Again: try to be as accurate and as fast as possible.</b><br><br>When you are ready, click on <b>Start</b> to start the first block of the main test.";
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
    var mean = this.sum(array_to_avg) / array_to_avg.length;
    return mean;
  }

  //calculate sd
  sd(array_for_sd) {
    var m = this.mean(array_for_sd);
    return Math.sqrt(array_for_sd.reduce(function(sq, n) {
      return sq + Math.pow(n - m, 2);
    }, 0) / (array_for_sd.length - 1));
  };

  seconds_between_dates(startDate, endDate) {
    return Math.abs(+new Date(startDate) - +new Date(endDate)) / 1000;
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

  neat_date() {
    var m = new Date();
    return m.getFullYear() + "" +
      ("0" + (m.getMonth() + 1)).slice(-2) + "" +
      ("0" + m.getDate()).slice(-2) + "" +
      ("0" + m.getHours()).slice(-2) + "" +
      ("0" + m.getMinutes()).slice(-2) + "" +
      ("0" + m.getSeconds()).slice(-2);
  }

  first_practice_stim() {

    var basestims = [];
    this.teststim = [];
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
          this.teststim.push(stim_dict);
        }
      }, this);
    }
  }

  getAllTestStimuli_induced() {
    //same as above, but one block of the full test: 162 stimuli from each of the 3 categories
    this.teststim = this.inducersAdded(this.stim_base[this.blocknum - 4]);
  }
  inducersAdded(groupOf6) {
    var stim_162_base = this.randomDegradePlus(groupOf6);
    var inducers = this.inducersGen();
    var inducerIndex;
    var the9fills = ["%0", "%1", "%2", "#0", "#1", "#2", "*0", "*1", "*2"];
    for (var indx = 0; indx < stim_162_base.length; indx++) {
      if (stim_162_base[indx].blur == "yes") {
        inducerIndex = the9fills.indexOf(stim_162_base[indx].filler);
        stim_162_base.splice(indx, 0, inducers[inducerIndex]);
        indx++;
      }
    }
    var stim_162 = stim_162_base;
    return stim_162;
  }
  inducersGen() {
    var inducer_items = [
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
    var inducers_base = [];
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
    stim_108.push.apply(stim_108, this.randomDegrade(arrayOf6dicts));
    stim_108.push.apply(stim_108, this.randomDegrade(arrayOf6dicts));
    stim_108.push.apply(stim_108, this.randomDegrade(arrayOf6dicts));
    var possible6orders = [
      [0, 1, 2],
      [0, 2, 1],
      [1, 0, 2],
      [1, 2, 0],
      [2, 0, 1],
      [2, 1, 0]
    ];
    var orders = {};
    orders["%"] = this.shuffle(JSON.parse(JSON.stringify(possible6orders)));
    orders["#"] = this.shuffle(JSON.parse(JSON.stringify(possible6orders)));
    orders["*"] = this.shuffle(JSON.parse(JSON.stringify(possible6orders)));
    stim_108.forEach(function(item, index) {
      if (item.blur == "yes") {
        var currentFiller = item.filler;
        var wordIndex = the6words.indexOf(item.word);
        stim_108[index].filler =
          currentFiller + orders[currentFiller][wordIndex].splice(0, 1);
      }
    }, this);
    return stim_108;
  }
  randomDegrade(arrayOf6dicts) {
    // takes an array of six dictionary items, returns 36 items randomized in groups of 6, with randomly varying blur/filler attributes
    var stims_cat_base = this.shuffle(arrayOf6dicts);
    var stimuli_base36 =
      JSON.parse(JSON.stringify([stims_cat_base, stims_cat_base, stims_cat_base, stims_cat_base, stims_cat_base, stims_cat_base])); // 6x6=36 dict items
    var blurChoice = this.shuffle([0, 1, 2, 3, 4, 5]);
    var blurFirst = blurChoice.slice(0, 3); //position of items to be blurred in the first group of 6; then alternates (blur-noblur-blur-etc)
    var blurSecond = blurChoice.slice(3, 6); //position of items NOT to be blurred in the first group of 6; then alternates (noblur-blur-noblur-etc)
    var fillerChoice1 = this.shuffle([
      //randomizes the orders of the three possible fillers
      ["*", "#", "%"],
      ["%", "*", "#"],
      ["#", "%", "*"]
    ]);
    var fillerChoice2 = this.shuffle([
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
        if (this.cit_type == 2 || this.cit_type == 5) {
          // !! skip targets if targetless induced version
          groupOf6_rand.forEach(function(item_dic_rand, indx_rand6) {
            if (item_dic_rand.type == "target") {
              groupOf6_rand.splice(indx_rand6, 1);
            }
          });
        }
        groupOf6_rand = this.shuffle(groupOf6_rand);
        temp6 = [groupOf6_rand[0]];
        fail = 0;
        var leng = groupOf6_rand.length; // actually 5 if there is no target
        for (var i = 1; i < leng; i++) {
          var newDictItem = groupOf6_rand[i];
          var skip = [];
          for (var placeIndex = 0; placeIndex < temp6.length; placeIndex++) {
            var placeHolder = temp6[placeIndex];
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
            var slots = this.range(0, temp6.length + 1);
            available = slots.filter(function(valuee) {
              return skip.indexOf(valuee) === -1;
            });
          }
          if (available.length == 0) {
            fail = 1;
            break;
          }
          var destination = this.rchoice(available);
          temp6.splice(destination, 0, newDictItem);
        }
        if (temp6[0].filler == this.lastOf6filler || temp6[0].word == this.lastOf6word) {
          //the word and filler type of the last item of the previous 6 group cannot be the same as the first of the next one
          fail = 1;
        }
        if (fail == 0) {
          stimuli_36[indexOf6] = JSON.parse(JSON.stringify(temp6));
          this.lastOf6filler = temp6[temp6.length - 1].filler; //store last item's filler type
          this.lastOf6word = temp6[temp6.length - 1].word; //store last item's word
          break;
        }
      }
    }, this);
    var stim_36 = stimuli_36.map(function(n) {
      return n;
    });
    stim_36 = [].concat.apply([], stim_36);
    return stim_36;
  }

  flash_too_slow() {
    this.feed_text = "Zu langsam!";
    setTimeout(function() {
      this.feed_text = "";
      this.tooslow = 1;
      this.rspns = "x";
      this.first_prac_wrong();
      this.post_resp_hold();
    }.bind(this), this.tooslow_delay);
  }

  flash_false() {
    this.feed_text = "Falsch!";
    setTimeout(function() {
      this.feed_text = "";
      this.incorrect = 1;
      this.first_prac_wrong();
      this.post_resp_hold();
    }.bind(this), this.false_delay);
  }

  first_prac_wrong() {
    if (this.blocknum == 1) {
      this.teststim = [];
      alert(
        "Sie haben nicht richtig geantwortet. Die Übung wird nun von Neuem beginnen. Bitte lesen Sie die Anweisungen genau."
      );
      this.first_correct = false;
    }
  }

  set_cit_types() {
    var inducers_instructions =
      '<br><br>As continual reminders, there will also appear words that belong to one of the two categories (FAMILIAR or UNFAMILIAR). <br><br>Words belonging to the FAMILIAR category need the answer FAMILIAR (<i>right</i> button). These words are:<br> <b>FAMILIAR</b>, <b>RECOGNIZED</b>, <b>MINE</b><br><br>Words belonging to the UNFAMILIAR category need the answer UNFAMILIAR (<i>left</i> button). These words are:<br> <b>UNFAMILIAR</b>, <b>UNKNOWN</b>, <b>OTHER</b>, <b>THEIRS</b>, <b>THEM</b>, <b>FOREIGN</b></br></br>';
    if (this.cit_type == 0 || this.cit_type == 3) {
      // standard CIT
      this.task_instruction =
        'Antippen der <i>rechten</i> Schaltfläche bedeutet "JA, ich nehme dieses Item als relevant wahr". Antippen der <i>linken</i> Schaltfläche bedeutet "Nein, ich nehme dieses Item nicht als relevant wahr". <br> Sie werden Wörter (Vornamen, Nachnamen) sehen, die in der Mitte des Bildschirms auftauchen. Sie sollten diese wahrnehmen und mit JA auf die folgenden Details antworten: <b>' +
        this.the_targets.join("</b>, <b>").toUpperCase() +
        "</b><br/><br/>Auf alle anderen Details (andere Namen) sollten Sie mit NEIN antworten. Zur Erinnerung: Sie leugnen, irgendwelche der anderen Details als relevant für Sie wahrzunehmen, also sollten Sie auf alle mit NEIN antworten.<br/><br/>"
        ;
    } else if (this.cit_type == 1 || this.cit_type == 4) {
      // induced & target
      this.task_instruction =
        'Tapping the <i>right</i> button means that the displayed item is "FAMILIAR" to you. Tapping the <i>left</i> button means that the item is "UNFAMILIAR" to you. You will see words (forenames, surnames) appearing in the middle of the screen. You have to say FAMILIAR to the following target details: <b>' +
        this.the_targets.join("</b>, <b>").toUpperCase() +
        "</b><br><br>You have to say UNFAMILIAR to all other actual details (other forenames, surnames). Remember: you are denying that you recognize any of these other details as relevant to you, so you you have to say UNFAMILIAR to all of them. " +
        inducers_instructions
        ;
    } else if (this.cit_type == 2 || this.cit_type == 5) {
      // induced - nontarget
      this.task_instruction =
        'Tapping the <i>right</i> button means that the displayed item is "FAMILIAR" to you. Tapping the <i>left</i> button means that the item is "UNFAMILIAR" to you. You will see words (forenames, surnames) appearing in the middle of the screen. You have to say UNFAMILIAR to all these details. Remember: you are denying that you recognize any of these details as relevant to you, so you you have to say UNFAMILIAR to all of them. ' +
        inducers_instructions;
    }
  }

  item_display() {
    if (this.trial_stim.type == "target" || this.trial_stim.type == "selfrefitem") {
      this.correct_resp = "resp_b";
    } else {
      this.correct_resp = "resp_a";
    }
    this.touchsim(); // for testing -- TODOREMOVE
    requestAnimationFrame(() => {
      this.stimulus_text = this.text_to_show;
      this.start = performance.now();
      this.listen = true;
      this.response_window = setTimeout(function() {
        this.rt_start = performance.now() - this.start;
        this.listen = false;
        this.flash_too_slow();
      }.bind(this), this.response_deadline);
    });
  }
  isi() {
    this.isi_delay = this.randomdigit(1, this.isi_delay_minmax[1] - this.isi_delay_minmax[0]);
    setTimeout(function() {
      this.item_display();
    }.bind(this), this.isi_delay);
  }

  practice_eval() {
    //at least 60% on each item. if not, warn accordingly
    var is_valid = true;
    var types_failed = [];
    if (this.blocknum == 1) {
      is_valid = this.first_correct;
      this.first_correct = true;
    } else {
      for (var it_type in this.rt_data_dict) {
        var rts_correct = this.rt_data_dict[it_type].filter(function(rt_item) {
          return rt_item > 150;
        });
        var corr_ratio = rts_correct.length / this.rt_data_dict[it_type].length;
        if (corr_ratio < 0.6) {
          is_valid = false;
          types_failed.push(
            " " +
            this.it_type_feed_dict[it_type] +
            " (" +
            Math.floor(corr_ratio * 10000) / 100 +
            "% correct)"
          );
        }
      }
    }
    if (is_valid == false && this.blocknum != 1) {
      this.block_texts[this.blocknum] =
        "Sie müssen diese Übungsrunde wiederholen, da Sie zu wenige richtige Antworten gegeben haben. <br><br>Sie benötigen mindestens 60% richtige Antworten für jeden der beiden Antworttypen, jedoch gaben Sie nicht genügend richtige Antworten für folgende(n) Antworttyp(en):" +
        types_failed.join(",") +
        ".<br><br>Bitte geben Sie genaue und im Zeitlimit liegende Antworten.<br><br>";
    }
    return is_valid;
  }
  main_eval() {
    //at least 50% on each item. if not, warn accordingly. kickout below 40%
    var verylow = false;
    var types_failed = [];
    for (var it_type in this.rt_data_dict) {
      var rts_correct = this.rt_data_dict[it_type].filter(function(rt_item) {
        return rt_item > 150;
      });
      var corr_ratio = rts_correct.length / this.rt_data_dict[it_type].length;
      if (corr_ratio < 0.5) {
        verylow = true;
        types_failed.push(
          " " +
          this.it_type_feed_dict[it_type] +
          " (" +
          Math.floor(corr_ratio * 10000) / 100 +
          "% correct)"
        );
      }
    }
  }

  start_trials() {
    setTimeout(function() {
      this.next_trial()
    }.bind(this), this.isi_delay_minmax[0]);
  }
  next_trial() {
    if (this.teststim.length > 0) {
      this.tooslow = 0;
      this.incorrect = 0;
      this.rt_start = 99999;
      this.rt_end = 99999;
      this.rspns = "";
      this.trial_stim = this.teststim[0];
      this.block_trialnum++;
      this.text_to_show = this.trial_stim.word.toUpperCase();
      this.isi();
    } else {
      this.basic_times.blocks += "\nBlock " + this.blocknum + " end " + Date();
      if ((this.blocknum > 3 && this.blocknum != 6) || this.practice_eval()) {
        // if (this.blocknum == 4 || this.blocknum == 5) {
        //   this.main_eval();
        // }
        this.blocknum++;
        this.nextblock();
      } else {
        if (this.blocknum == 1) {
          this.practice_repeated.block1 += 1;
        } else if (this.blocknum == 2) {
          this.practice_repeated.block2 += 1;
        } else if (this.blocknum == 3) {
          this.practice_repeated.block3 += 1;
        } else if (this.blocknum == 6) {
          this.practice_repeated.block6 += 1;
        }
        this.nextblock();
      }
    }
  }

  post_resp_hold() {
    this.stimulus_text = "";
    setTimeout(function() {
      this.listn_end = false;
      this.add_response();
    }.bind(this), this.isi_delay_minmax[0]);
  }

  add_response() {
    var curr_type;
    var act_type = this.trial_stim.type;
    if (
      ["selfrefitem", "otherrefitem", "target"].indexOf(act_type) >= 0
    ) {
      curr_type = act_type;
    } else {
      curr_type = "main_item";
      if (this.blocknum > 3 && this.incorrect != 1 && this.tooslow != 1 && this.rt_start > 150 && this.rt_start < 800) {
        if (act_type == "probe") {
          this.all_main_rts.probs.push(this.rt_start);
        } else {
          this.all_main_rts.irrs.push(this.rt_start);
        }
      }
    }
    if (!(curr_type in this.rt_data_dict)) {
      this.rt_data_dict[curr_type] = [];
    }
    if (this.incorrect == 1 || this.tooslow == 1) {
      this.rt_data_dict[curr_type].push(-1);
    } else {
      this.rt_data_dict[curr_type].push(this.rt_start);
    }
    this.cit_data +=
      this.subj_id +
      "\t" +
      this.cit_type +
      "\t" +
      this.blocknum +
      "\t" +
      this.block_trialnum +
      "\t" +
      this.trial_stim.word +
      "\t" +
      this.trial_stim.cat +
      "\t" +
      this.trial_stim.type +
      "\t" +
      this.rspns +
      "\t" +
      this.rt_start +
      "\t" +
      this.rt_end +
      "\t" +
      this.incorrect +
      "\t" +
      this.tooslow +
      "\t" +
      (this.isi_delay + this.isi_delay_minmax[0]) +
      "\t" +
      String(new Date().getTime()) +
      "\n";
    this.teststim.shift();
    this.next_trial();
  }
  call_practice_stim() {
    //this.teststim = this.prac_teststim; TODO

    this.practice_num++;
  }
  nextblock() {
    this.bg_color = "#fff";
    if (this.blocknum <= (this.stim_base.length + 3)) {
      this.block_trialnum = 0;
      if (this.blocknum == 1) {
        this.response_deadline = 10500;
        this.first_practice_stim();
      } else if (this.blocknum == 2) {
        this.response_deadline = 2000;
        this.call_practice_stim();
      } else if (this.blocknum == 3 || this.blocknum == 6) {
        this.response_deadline = this.response_deadline_main;
        this.call_practice_stim();
      } else {
        this.response_deadline = this.response_deadline_main;
        // this.main_stim();
      }
      this.rt_data_dict = {};
      // this.switch_divs(this.div_after_instr)
    } else {
      this.basic_times.blocks += "\nBlock " + this.blocknum + " end_last " + Date();
      this.switch_divs("div_end")
      this.store_data();
    }
  }
  runblock() {
    this.basic_times.blocks += "\nBlock " + this.blocknum + " start " + Date();
    this.bg_color = "#000";
    this.switch_divs('div_cit_main')
    this.visib.start_text = true;
  }

  touchstart(ev, response_side) {
    if (this.listen === true) {
      this.rt_start = performance.now() - this.start;
      clearTimeout(this.response_window);
      this.listen = false;
      this.rspns = response_side;
      this.listn_end = true;
      if (this.rspns == this.correct_resp) {
        this.post_resp_hold();
      } else {
        this.flash_false();
      }
    }
  }
  touchend(ev, end_resp_side) {
    if (this.listn_end == true && end_resp_side == this.rspns) {
      this.rt_end = performance.now() - this.start;
      this.listn_end = false;
    }
  }


  // ITEM GENERATION


  create_stim_base() {
    //creates all stimuli (a 6-item group - 1probe,1target,4irrelevants - for each of 4 different categories) from the given item and probe words
    var stim_base_temp = [];
    var words_array = []; // TODO deepcopy
    words_array.forEach(function(word, num) {
      stim_base_temp.push({
        'word': word
      });
      if (0 === num) {
        stim_base_temp[num]["type"] = "probe";
        this.the_probes.push(stim_base_temp[num].word);
      } else if (1 == num) {
        stim_base_temp[num]["type"] = "target";
        this.the_targets.push(stim_base_temp[num].word);
      } else {
        stim_base_temp[num]["type"] = "irrelevant" + (num - 1);
      }
    }, this);
    this.stim_base = stim_base_temp;
    this.set_block_texts();
    this.set_cit_types();
  }


  store_data() {
    var dcit = (this.mean(this.all_main_rts.probs) - this.mean(this.all_main_rts.irrs)) / this.sd(this.all_main_rts.irrs);
    this.f_name =
      this.subj_id +
      "_" +
      this.pre_cond +
      "_" +
      Date.now() +
      ".txt";
    this.basic_times.finished = Date();
    this.cit_data +=
      "Loaded " +
      this.basic_times.loaded +
      " Consented " +
      this.basic_times.consented +
      " Practice_start " +
      this.basic_times.practice +
      " Finished " +
      this.basic_times.finished +
      this.basic_times.blocks +
      "\ndems_reps" +
      "\t" +
      this.practice_repeated.block1 +
      "/" +
      this.practice_repeated.block2 +
      "/" +
      this.practice_repeated.block3 +
      "/" +
      this.practice_repeated.block6 +
      "/" +
      dcit +
      "/" +
      this.versionnum +
      "\n";
    this.clipboard.copy(this.cit_data);
    this.file.writeFile(this.path, this.f_name, this.cit_data);
    var outcome;
    this.personal_feedback += (Math.ceil(dcit * 1000) / 1000).toFixed(3);
    if (dcit > 0.1) {
      outcome = " => found GUILTY (<i>d</i><sub>CIT</sub> > 0.1";
      this.personal_feedback += ". Das bedeutet, dass Ihre Reaktionszeit für Ihren Name signifikant langsamer war als für andere Namen. Somit haben wir enthüllt, dass Sie dieses Detail verheimlicht haben";
    } else {
      outcome = " => found INNOCENT (<i>d</i><sub>CIT</sub> <= 0.1";
      this.personal_feedback += ". Das bedeutet, dass Ihre Reaktionszeit für Ihren Name nicht signifikant langsamer war als für andere Namen. Somit konnten wir nicht enthüllen, dass Sie dieses Detail verheimlicht haben";
    }

    outcome += "; Pr-Irr diff ~" + Math.round(this.mean(this.all_main_rts.probs) - this.mean(this.all_main_rts.irrs)) + " ms)"
    this.to_display = "<i>d</i><sub>CIT</sub> = " + (Math.ceil(dcit * 1000) / 1000).toFixed(3) + outcome + "<br/><br/>Path to saved file:<br/>" + this.path + "<br/>" + "File name: " + this.f_name + "<br/><br/>Full data:<br/>"
    this.to_display += this.cit_data;
    this.to_display = this.to_display.replace(/\\n/g, "<br/>");
    this.backgroundMode.setDefaults({
      silent: true
    })
  }
  send_mail() {
    if (this.on_device) {
      let email = {
        to: "lkcsgaspar@gmail.com",
        cc: "melissa-kunzi@web.de",
        subject: "CITapp data " + this.subj_id + " ",
        body: "",
        attachments: [
          this.path + this.f_name
        ]
      };
      this.emailComposer.open(email);
      this.backgroundMode.setDefaults({
        silent: true
      })
      this.insomnia.allowSleepAgain()
    } else {
      console.log("These are native plugins - only works on the phone.");
    }
  }
}
