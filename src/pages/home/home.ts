import { Component, ViewChild } from "@angular/core";
import { Content } from 'ionic-angular';
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

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  @ViewChild(Content) content: Content;
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
        rt_sim = rt_sim + 10;
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

  experiment_title: string = "ECIT_Mobile";
  false_delay: number = 400;
  tooslow_delay: number = 400;
  isi_delay_minmax: number[] = [300, 600];
  isi_delay: number = 99999;
  end_url: string = "https://www.figure-eight.com/";
  all_conditions: number[] = [0, 1, 2, 3, 4, 5];
  condition: number = 0;
  cat_order: number;
  pre_cond: number = 9999;
  subj_id: string;
  response_deadline: number;
  response_deadline_main: number = 800;
  bg_color: string = "#fff";
  feed_text: string = "";
  task_instruction: string;
  true_name: string;
  true_anim: string;
  current_div: string = "set_conds"; // ddd default: "set_conds", div_dems, div_cit_main, div_end
  visib: any = {};
  block_texts: string[] = [];
  form_items: FormGroup;
  form_dems: FormGroup;
  submit_failed: boolean = false;
  on_device: boolean;
  gender: number;
  lastOf6filler: string = "none";
  lastOf6word: string = "none";
  teststim: any[];
  prac_teststim: any[];
  main_stim: any;
  practice_stim: any;
  tooslow: number;
  incorrect: number;
  block_trialnum: number;
  rt_data_dict: any;
  all_main_rts: any = { "probs": [], "irrs": [] };
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
    "subject_id\tcondition\tcateg_order\tblock_number\ttrial_number\tstimulus_shown\tcategory\tstim_type\tresponse_key\trt_start\trt_end\tincorrect\ttoo_slow\tisi\tdate_in_ms\n";
  correct_resp: string = "none";
  blocknum: number = 1;
  rt_start: number = 99999;
  rt_end: number = 99999;
  start: any = 0;
  listen: boolean = false;
  listn_end: boolean = false;
  it_type_feed_dict: any = {
    selfrefitem: "familiarity-related items",
    otherrefitem: "unfamiliarity-related items",
    main_item: "actual details (forenames or animals)",
    target: "target items"
  };
  practice_chances: number = 5;
  practice_num: number = 5;
  first_blockstart: boolean = true;
  basic_times: any = {};

  num_of_failed_fin: number = 111111;
  failed_final: number = 0;
  response_window: any;
  nums: any[];

  stim_base_6: any[];
  stim_base: any[];
  the_targets: any[] = [];
  the_probes: any[] = [];

  items_base2: any[];
  true_details: any[];

  words_to_filter: any[] = [[], []];
  targ_check_inp: string[] = ["", ""];

  categories_base: string[] = ["forenames", "months", "days", "animals"];
  categories: string[] = ["forenames", "animals"];

  countrs: any[];

  male_names: any[] = ["Nico", "Justin", "Jakob", "Gerald", "Max", "Mario", "Jürgen", "Ferdinand", "Simon", "Harald", "Andre", "Gregor", "Martin", "Julian", "Berat", "Robert", "Leonard", "Theodor", "Arthur", "Emir", "Theo", "Marcel", "Lorenz", "Moritz", "Samuel", "Stefan", "Anton", "Felix", "Herbert", "Clemens", "Gerhard", "Peter", "Sascha", "Richard", "Günther", "Ali", "Johann", "Nicolas", "Leo", "Alexander", "Emanuel", "Manfred", "Klaus", "Roland", "Laurenz", "Valentin", "Dominik", "Marvin", "Helmut", "Hamza", "Viktor", "Jonathan", "Josef", "Christoph", "Markus", "Pascal", "Maximilian", "Finn", "Mathias", "Rafael", "Roman", "Yusuf", "Manuel", "Oliver", "Rene", "Karl", "Adam", "Christopher", "Jan", "Kilian", "Michael", "Jonas", "Werner", "Kevin", "David", "Emil", "Constantin", "Noah", "Bernhard", "Bernd", "Georg", "Marco", "Florian", "Franz", "Fabio", "Wolfgang", "Thomas", "Vincent", "Christian", "Andreas", "Erik", "Johannes", "Tobias", "Benjamin", "Ben", "Sandro", "Armin", "Daniel", "Reinhard", "Benedikt", "Amir", "Gernot", "Elias", "Gabriel", "Patrik", "Andrej", "Konstantin", "Oskar", "Sebastian", "Matthias", "Fabian", "Hannes", "Paul", "Leon", "Tim", "Leopold", "Adrian"];

  fem_names: any[] = ["Sandra", "Jacqueline", "Johanna", "Celine", "Silvia", "Ecrin", "Verena", "Sofia", "Sophie", "Hira", "Cornelia", "Valerie", "Angelina", "Lina", "Miriam", "Petra", "Natalie", "Simone", "Isabella", "Hanna", "Emilia", "Melina", "Maja", "Larissa", "Anja", "Angelika", "Patricia", "Claudia", "Mia", "Birgit", "Astrid", "Bettina", "Antonia", "Jessica", "Klara", "Nina", "Elisabeth", "Janine", "Manuela", "Charlotte", "Olivia", "Christina", "Leonie", "Katharina", "Amina", "Anastasia", "Bernadette", "Mila", "Pia", "Magdalena", "Romana", "Paula", "Amelie", "Kerstin", "Ela", "Jana", "Jennifer", "Lea", "Susanne", "Sara", "Nadine", "Lara", "Jasmin", "Mira", "Ella", "Yvonne", "Marie", "Theresa", "Melanie", "Alma", "Tanja", "Alina", "Martina", "Denise", "Rebecca", "Paulina", "Franziska", "Karin", "Lena", "Ines", "Nicole", "Michelle", "Viktoria", "Chiara", "Bianca", "Stefanie", "Carina", "Linda", "Azra", "Stella", "Nora", "Flora", "Vanessa", "Teresa", "Sonja", "Tamara", "Anna", "Ana", "Andrea", "Melissa", "Lilly", "Elif", "Lisa", "Clara", "Teodora", "Kristina", "Anita", "Leonora", "Silke", "Emma", "Esila", "Daniela", "Veronika", "Elena", "Marina", "Helena", "Natascha", "Elina", "Carmen", "Alexandra", "Eva", "Barbara", "Maya", "Tina", "Valentina", "Elisa", "Sabine", "Matilda", "Doris", "Julia", "Rosa", "Laura", "Annika", "Nisa", "Iris", "Zoe", "Monika", "Selina"];

  animls: any[] = ["Nilpferd", "Falke", "Ratte", "Spinne", "Heuschrecke", "Huhn", "Schnecke", "Biene", "Schaf", "Fuchs", "Nashorn", "Tiger", "Maus", "Flamingo", "Ameise", "Schlange", "Pferd", "Gnu", "Biber", "Truthahn", "Zebra", "Elefant", "Krähe", "Hirsch", "Krokodil", "Oktopus", "Frettchen", "Lachs", "Schmetterling", "Walross", "Schwan", "Ente", "Raupe", "Gepard", "Mungo", "Bär", "Taube", "Frosch", "Hamster", "Alpaka", "Kobra", "Elch", "Hering", "Fliege", "Qualle", "Wolf", "Auster", "Gorilla", "Tapir", "Wal", "Jaguar", "Wombat", "Rabe", "Lama", "Taube", "Koala", "Dachs", "Salamander", "Pinguin", "Lemur", "Delfin", "Igel", "Opossum", "Affe", "Esel", "Gazelle", "Kröte", "Mücke", "Leopard", "Emu", "Panda", "Schwein", "Panther", "Hund", "Katze", "Wespe", "Hummer", "Eule", "Kranich", "Pelikan", "Fasan", "Faultier", "Wiesel", "Rentier", "Maulwurf", "Elster", "Adler", "Kiwi", "Bison", "Giraffe", "Papagei", "Ziege", "Schweinswale", "Siegel", "Schimpanse", "Waschbär", "Gans", "Hyäne", "Kolibri", "Mammut", "Alligator", "Stachelschwein", "Kamel", "Widder", "Fledermaus", "Antilope", "Kaninchen", "Löwe", "Känguru", "Schakal", "Krabbe", "Hai"];
  animals_sorted: any[] = JSON.parse(JSON.stringify(this.animls)).sort();
  stimulus_text: string = "";
  path: any = "";
  f_name: string;
  to_display: string = "";

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
    private backgroundMode: BackgroundMode
  ) {
    this.basic_times.loaded = Date();
    this.on_device = this.platform.is("cordova");
    this.statusBar.hide();
    this.backgroundMode.enable();
    this.backgroundMode.setDefaults({
      title: "Concealed Information Test App active",
      text: "",
      silent: true
    });
    this.path = this.file.externalDataDirectory;
    this.basic_times.blocks = "";
    this.nums = this.range(1, 32);
    this.visib.start_text = true;
    this.visib.labels = true;
    this.visib.end_data = false;

    this.form_dems = formBuilder.group({
      gender_inp: [
        "",
        Validators.compose([Validators.maxLength(30), Validators.required])
      ],
      name_inp: [
        "",
        Validators.compose([
          Validators.maxLength(30),
          Validators.pattern("[a-zA-ZÖöÜüÉéÁáÄäß]*"),
          Validators.required
        ])
      ],
      animal_inp: [
        "",
        Validators.compose([
          Validators.required
        ])
      ]
    });
  }

  initials() {
    if (this.pre_cond < 2) {
      this.condition = 0;
    } else {
      this.condition = 3;
    }
    if (this.pre_cond % 2 == 0) {
      this.cat_order = 0;
    } else {
      this.cat_order = 1;
    }
    this.basic_times.consented = Date();
    this.backgroundMode.setDefaults({
      text: "Test in progress!",
      silent: false
    })
  }

  switch_divs(div_to_show) {
    this.current_div = div_to_show;
    this.content.scrollToTop(0);
  }


  task_start() {
    if (!this.form_dems.valid) {
      this.submit_failed = true;

      // for TESTING:
      this.true_name = "Testname";
      this.gender = 1;
      this.true_anim = "Testtier"
      this.prune();
      console.log(this.stim_base);
      this.div_after_instr = "div_blockstart";
      this.nextblock(); //TODOREMOVE %%%%%% HERE THIS CORRECT
    } else {
      // todo - this may not be working?
      if (this.on_device && this.network.type) {
        if (this.network.type != "none") {
          alert("Warning: it seems you are connected to the internet. We recommend to turn it off to avoid interferences.")
        }
      } else {
        console.log("Network check - only works on the phone.");
      }
      this.true_name = this.form_dems.get("name_inp").value;
      this.gender = this.form_dems.get("gender_inp").value;
      this.true_anim = this.form_dems.get("animal_inp").value;
      this.prune();
      this.switch_divs("div_instructions");
    }
  }


  set_block_texts() {
    var target_reminder;
    if (this.condition == 2 || this.condition == 5) {
      target_reminder = ["", "", "", ""];
    } else {
      target_reminder = [
        "Remember: in this category, your target that requires a different response is <b>" +
        this.stim_base[0][1].word.toUpperCase() +
        "</b>. ",
        "Remember: in this category, your target that requires a different response is <b>" +
        this.stim_base[1][1].word.toUpperCase() +
        "</b>. ",
        "Again, your target that requires a different response is <b>" +
        //this.stim_base[2][1].word.toUpperCase() +
        "</b>. ",
        "Again, your target that requires a different response is <b>" +
        //this.stim_base[3][1].word.toUpperCase() +
        "</b>. "
      ];
    }
    this.block_texts[0] = "";
    this.block_texts[1] =
      'There will be three short practice rounds. In this first practice round, we just want to see that you clearly understand the task. Therefore, you will have a lot of time to choose each of your responses, just make sure you choose accurately. Here, all items from the two categories (forenames, animals) will be mixed together randomly. <b>You must respond to each item correctly.</b> If you choose an incorrect response (or not give response for over 10 seconds), you will have to repeat this practice round.<br><br>If needed, tap <b>show instructions again</b> to reread the details.<br><br>';
    this.block_texts[2] =
      'Great, you passed the first practice round. In this second practice round, there will be a shorter deadline for the responses, but a certain rate of errors is allowed. (Items will be first forename names, then animal names, then again forenames, etc.) Try to be as accurate and as fast as possible.<br>';
    this.block_texts[3] =
      "You passed the second practice round. This will be the third and last practice round. The response deadline is again shorter. Also, the reminder labels will not be displayed anymore, but the task is just the same.<br><br> <b>Try to be as accurate and as fast as possible</b>.<br>";
    this.block_texts[4] =
      "Good job. Now begins the actual test. The task is the same. There will be four blocks, with pauses between them. This first block tests the category of " +
      this.stim_base[0][0].cat +
      ", so you will be shown only the related items. " +
      target_reminder[0] +
      "<br><br><b>Again: try to be as accurate and as fast as possible.</b><br><br>When you are ready, click on <b>Start</b> to start the first block of the main test.";
    this.block_texts[5] =
      "The first block is now done. The second and last block will test the category of " +
      this.stim_base[1][0].cat +
      ". " +
      target_reminder[1] +
      "The task is otherwise the same. <b>Again: try to be as accurate and as fast as possible.</b>";
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

  first_practice_stim() {
    this.practice_stim();
    if (this.condition != 0 && this.condition != 3) {
      this.prac_teststim = this.prac_teststim.concat(this.inducersGen());
    }
    var basestims = this.shuffle(this.prac_teststim);
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

  getPracticeTestStimuli_simple() {
    //18 prac_teststim from all 4 categories (6+6+6)
    this.prac_teststim = [];
    this.stim_base.slice(0, 2).forEach(function(groupOf6) {
      var blocksOf108 = this.randomDegradePlus(groupOf6);
      this.prac_teststim.push.apply(this.prac_teststim, blocksOf108.slice(0, 6));
    }, this);
  }
  getAllTestStimuli_simple() {
    //same as above, but for the full test: 3x36=108 stimuli from each of the 3 categories
    this.teststim = this.randomDegradePlus(this.stim_base[this.blocknum - 4]);
  }
  getPracticeTestStimuli_induced() {
    //27 degraded prac_teststim from all 3 categories (9+9+9)
    this.prac_teststim = [];
    this.stim_base.slice(0, 2).forEach(function(groupOf6) {
      var blocksOf162 = this.inducersAdded(groupOf6);
      this.prac_teststim.push.apply(this.prac_teststim, blocksOf162.slice(0, 9));
    }, this);
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
        if (this.condition == 2 || this.condition == 5) {
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
        "You did not respond correctly. You will start this practice once again. Please read the instructions carefully."
      );
      this.first_correct = false;
    }
  }

  set_cit_conditions() {
    var inducers_instructions =
      '<br><br>As continual reminders, there will also appear words that belong to one of the two categories (FAMILIAR or UNFAMILIAR). <br><br>Words belonging to the FAMILIAR category need the answer FAMILIAR (<i>right</i> button). These words are:<br> <b>FAMILIAR</b>, <b>RECOGNIZED</b>, <b>MINE</b><br><br>Words belonging to the UNFAMILIAR category need the answer UNFAMILIAR (<i>left</i> button). These words are:<br> <b>UNFAMILIAR</b>, <b>UNKNOWN</b>, <b>OTHER</b>, <b>THEIRS</b>, <b>THEM</b>, <b>FOREIGN</b></br></br>';
    if (this.condition == 0 || this.condition == 3) {
      // standard CIT
      this.div_after_instr = "div_target_check";
      this.task_instruction =
        'Tapping the <i>right</i> button means "YES, I recognize this item as a relevant". Tapping the <i>left</i> button means "NO, I do not recognize this item as relevant". <br> You will see words (forenames, animals) appearing in the middle of the screen. You have to recognize and say YES to the following target details: <b>' +
        this.the_targets.join("</b>, <b>").toUpperCase() +
        "</b><br/><br/>You have to say NO to all other details. Remember: you are denying that you recognize any of the other details as relevant to you, so you you have to say NO to all of them.<br/><br/>"
        ;
      this.practice_stim = this.getPracticeTestStimuli_simple;
      this.main_stim = this.getAllTestStimuli_simple;
    } else if (this.condition == 1 || this.condition == 4) {
      // induced & target
      this.div_after_instr = "div_target_check";
      this.task_instruction =
        'Tapping the <i>right</i> button means that the displayed item is "FAMILIAR" to you. Tapping the <i>left</i> button means that the item is "UNFAMILIAR" to you. You will see words (forenames, animals) appearing in the middle of the screen. You have to say FAMILIAR to the following target details: <b>' +
        this.the_targets.join("</b>, <b>").toUpperCase() +
        "</b><br><br>You have to say UNFAMILIAR to all other actual details (other forenames, animals). Remember: you are denying that you recognize any of these other details as relevant to you, so you you have to say UNFAMILIAR to all of them. " +
        inducers_instructions
        ;
      this.practice_stim = this.getPracticeTestStimuli_induced;
      this.main_stim = this.getAllTestStimuli_induced;
    } else if (this.condition == 2 || this.condition == 5) {
      // induced - nontarget
      this.div_after_instr = "div_cit_blockstart";
      this.task_instruction =
        'Tapping the <i>right</i> button means that the displayed item is "FAMILIAR" to you. Tapping the <i>left</i> button means that the item is "UNFAMILIAR" to you. You will see words (forenames, animals) appearing in the middle of the screen. You have to say UNFAMILIAR to all these details. Remember: you are denying that you recognize any of these details as relevant to you, so you you have to say UNFAMILIAR to all of them. ' +
        inducers_instructions;
      this.practice_stim = this.getPracticeTestStimuli_induced;
      this.main_stim = this.getAllTestStimuli_induced;
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
        "You will have to repeat this practice round, because of too few correct responses.<br><br>You need at least 60% accuracy on each item type, but you did not have enough correct responses for the following one(s):" +
        types_failed.join(",") +
        ".<br><br>Try to make responses both accurately and in time.<br><br>";
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
    if (verylow == true && this.blocknum > 3) {
      var feedback_text =
        "Warning: you had very low accuracy in this last block to the following item type(s):" +
        types_failed.join(",") +
        ". Please pay attention and make responses in time accurately.";
      alert(feedback_text);
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
      if (this.blocknum > 3 || this.practice_eval()) {
        if (this.blocknum == 4 || this.blocknum == 5) {
          this.main_eval();
        }
        this.blocknum++;
        if (this.blocknum == 3) {
          this.visib.labels = false;
        }
        this.nextblock();
      } else {
        if (this.blocknum == 1) {
          this.practice_repeated.block1 += 1;
        } else if (this.blocknum == 2) {
          this.practice_repeated.block2 += 1;
        } else if (this.blocknum == 3) {
          this.practice_repeated.block3 += 1;
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
      this.condition +
      "\t" +
      this.cat_order +
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
    this.practice_stim();
    this.teststim = this.prac_teststim;
    // do not halve stims in this experiment's practice

    //takes halves of the practice stims generated
    /*if (this.practice_num % 2 == 1) {
      // generate and take first half
      this.practice_stim();
      this.teststim = this.prac_teststim.slice(0, Math.floor(this.prac_teststim.length / 2));
    } else {
      // just take second half
      this.teststim = this.prac_teststim.slice(
        Math.floor(this.prac_teststim.length / 2),
        this.prac_teststim.length
      );
    }
    */
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
      } else if (this.blocknum == 3) {
        this.response_deadline = this.response_deadline_main;
        this.call_practice_stim();
      } else {
        this.response_deadline = this.response_deadline_main;
        this.main_stim();
      }
      this.rt_data_dict = {};
      this.switch_divs(this.div_after_instr)
    } else {
      this.basic_times.blocks += "\nBlock " + this.blocknum + " end_last " + Date();
      this.switch_divs("div_end")
      this.store_data();
    }
  }
  runblock() {
    this.basic_times.blocks += "\nBlock " + this.blocknum + " start " + Date();
    this.bg_color = "#031116";
    this.switch_divs('div_cit_main')
    this.visib.start_text = true;
    this.can_start = true;
  }



  touchstart(ev, response_side) {
    if (this.listen === true) {
      this.rt_start = performance.now() - this.start;
      clearTimeout(this.response_window);
      this.listen = false;
      this.rspns = response_side;
      this.listn_end = true;
      if (this.rt_start < this.response_deadline) {
        if (this.rspns == this.correct_resp) {
          this.post_resp_hold();
        } else {
          this.flash_false();
        }
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

  prune() {
    //given the probe (in each of the categories), selects 8 additional items, 5 of which will later be irrelevants. None with same starting letter, and with length closest possible to the probe.
    if (this.gender == 1) {
      this.countrs = this.male_names;
    } else {
      this.countrs = this.fem_names;
    }
    this.countrs.forEach(function(item, index) {
      this.countrs[index] = item.toLowerCase();
    }, this);
    this.animls.forEach(function(item, index) {
      this.animls[index] = item.toLowerCase();
    }, this);
    var true_details_base = [
      this.true_name.toLowerCase(),
      "may",
      11,
      this.true_anim.toLowerCase()
    ];
    this.true_details = [
      true_details_base[0],
      [true_details_base[1], true_details_base[2]].join(" "),
      true_details_base[3]
    ];
    var items_base1 = [
      this.countrs,
      ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"],
      this.nums,
      this.animls
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
        container = container.filter(function(n) {
          return probe != n;
        });
        container = container.filter(function(n) {
          // filter if same starting character
          return probe[0] != n[0];
        });
        if (index === 0 || index === 3) {
          if (/\s/.test(probe.toString())) {
            container = container.filter(function(n) {
              return /\s/.test(n);
            });
          } else {
            container = container.filter(function(n) {
              return !/\s/.test(n);
            });
          }
        }
        while (final8.length < 9 && maxdif < 99) {
          temps = container.filter(function(n) {
            return Math.abs(probe.toString().length - n.length) <= maxdif;
          });
          if (temps.length > 0) {
            final8.push(temps[0]);
            container = container.filter(function(n) {
              return final8[final8.length - 1] !== n;
            });
            if (index === 0 || index === 3) {
              container = container.filter(function(n) {
                return final8[final8.length - 1][0] !== n[0];
              });
            }
          } else {
            maxdif++;
          }
        }
      }
      items_base2_temp.push(final8);
    }, this);
    var days = this.range(1, 32);
    var day;
    var days_to_filt1 = [true_details_base[2]];
    items_base2_temp[1].forEach(function(month, index) {
      if (index > 0) {
        var days_to_filt2 = days_to_filt1;
        if (month == "february") {
          days_to_filt2 = days_to_filt1.concat([29, 30, 31]);
        } else {
          if (
            ["april", "june", "september", "november"].indexOf(month) > -1
          ) {
            days_to_filt2.push(31);
          }
        }
        var dys_temp = days.filter(function(a) {
          return days_to_filt2.indexOf(a) == -1;
        });
        day = dys_temp[0];
      } else {
        day = items_base2_temp[2][0];
      }
      items_base2_temp[2][index] = [month, day].join(" ");
      days_to_filt1.push(day);
    }, this);
    items_base2_temp.splice(1, 1);
    items_base2_temp.splice(1, 1); // skip dates
    this.items_base2 = items_base2_temp;
    this.create_stim_base();
  }

  create_stim_base() {
    //creates all stimuli (a 6-item group - 1probe,1target,4irrelevants - for each of 4 different categories) from the given item and probe words
    var stim_base_temp = [[], []];
    this.items_base2.forEach(function(categ, index) {
      var filtered_words = categ.filter(function(a) {
        return this.words_to_filter[index].indexOf(a) == -1;
      }, this);
      var words_array = [];
      if (this.condition < 3) {
        words_array = [filtered_words[0]].concat(
          filtered_words.slice(1, 6)
        ); // for GUILTY
      } else {
        words_array = filtered_words.slice(1, 7); // for INNOCENT
      }
      words_array.forEach(function(word, num) {
        stim_base_temp[index].push({
          word: word,
          cat: this.categories[index]
        });
        if (0 === num) {
          stim_base_temp[index][num]["type"] = "probe";
          this.the_probes.push(stim_base_temp[index][num].word);
        } else if (1 == num) {
          stim_base_temp[index][num]["type"] = "target";
          this.the_targets.push(stim_base_temp[index][num].word);
        } else {
          stim_base_temp[index][num]["type"] = "irrelevant" + (num - 1);
        }
      }, this);
    }, this);
    if (this.cat_order == 0) {
      this.stim_base = [
        stim_base_temp[0],
        stim_base_temp[1]
      ];
    } else {
      this.stim_base = [
        stim_base_temp[1],
        stim_base_temp[0]
      ];
    }
    this.set_block_texts();
    this.set_cit_conditions();
  }

  target_check() {
    if (
      this.targ_check_inp[0].toUpperCase() != this.the_targets[0].toUpperCase() ||
      this.targ_check_inp[1].toUpperCase() != this.the_targets[1].toUpperCase()
    ) {
      alert("Wrong! Please check the details more carefully!");
      this.switch_divs("div_instructions");
      this.targ_check_inp = ["", ""];
    } else {
      this.div_after_instr = "div_blockstart";
      this.switch_divs("div_blockstart");
    }
  }


  store_data() {
    var dcit = (this.mean(this.all_main_rts.probs) - this.mean(this.all_main_rts.irrs)) / this.sd(this.all_main_rts.irrs);
    this.f_name =
      this.experiment_title +
      "_" +
      this.subj_id +
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
      "\nRepetitions" +
      "\t" +
      this.practice_repeated.block1 +
      "\t" +
      this.practice_repeated.block2 +
      "\t" +
      this.practice_repeated.block3 +
      "\t" +
      dcit +
      "\n";
    this.clipboard.copy(this.cit_data);
    this.file.writeFile(this.path, this.f_name, this.cit_data);
    var outcome;
    if (dcit > 0.1) {
        outcome = " => found GUILTY (<i>d</i><sub>CIT</sub> > 0.1";
    } else {
        outcome = " => found INNOCENT (<i>d</i><sub>CIT</sub> <= 0.1";
    }
    outcome += "; Pr-Irr diff ~" + Math.round(this.mean(this.all_main_rts.probs) - this.mean(this.all_main_rts.irrs)) + " ms)"
    this.to_display = "<i>d</i><sub>CIT</sub> = " + (Math.ceil(dcit*1000)/1000).toFixed(3) + outcome + "<br/><br/>Path to saved file:<br/>" + this.path + "<br/>" + "File name: " + this.f_name + "<br/><br/>Full data:<br/>"
    this.to_display += this.cit_data;
    this.to_display = this.to_display.replace(/\\n/g, "<br/>");
    this.backgroundMode.setDefaults({
      text: "Data stored on phone but not sent."
    })
  }
  send_mail() {
    if (this.on_device) {
      let email = {
        to: "lkcsgaspar@gmail.com",
        subject: "CITapp data " + this.subj_id + " " + this.experiment_title,
        body: "",
        attachments: [
          this.path + this.f_name
        ]
      };
      this.emailComposer.open(email);
      this.backgroundMode.setDefaults({
        silent: true
      })
    } else {
      console.log("These are native plugins - only works on the phone.");
    }
  }
}
