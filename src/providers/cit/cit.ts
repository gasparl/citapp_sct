import { Injectable, Component } from '@angular/core';
import { Insomnia } from '@ionic-native/insomnia';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Clipboard } from '@ionic-native/clipboard';
import { File } from '@ionic-native/file';
import { NavigationBar } from '@ionic-native/navigation-bar';
import { TranslationProvider } from '../../providers/translations/translations';

@Injectable()
export class CitProvider {
  content: any;

  // /*
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

  subj_id: string = '';
  personal_feedback: string = '';
  false_delay: number = 400;
  tooslow_delay: number = 400;
  isi_delay_minmax: number[] = [300, 700];
  isi_delay: number = 99999;
  cit_type: number = 0;
  pre_cond: number = 9999;
  response_deadline: number;
  response_deadline_main: number = 900;
  bg_color: string = "#fff";
  feed_text: string = "";
  current_div: string = "div_settings"; // ddd default: "div_start", div_settings, div_dems, div_cit_main, div_end
  visib: any = { start_text: true };
  block_texts: string[];
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
  the_nontargs: string[] = [];
  the_probes: string[] = [];
  stimulus_text: string = "";
  to_display: string = "";
  targetrefs: object[] = [];
  nontargrefs: object[] = [];
  f_name: string;
  path: any = "";

  constructor(
    private insomnia: Insomnia,
    private clipboard: Clipboard,
    public file: File,
    public navigationBar: NavigationBar,
    public backgroundMode: BackgroundMode,
    public trP: TranslationProvider) { }

  pointev: any = {};
  switch_divs(div_to_show) {
    this.current_div = div_to_show;
    Object.keys(this.pointev).forEach(ky => this.pointev[ky] = "none");
    setTimeout(function() {
      this.pointev[div_to_show] = "auto";
    }.bind(this), 300);
    this.content.scrollToTop(0);
    this.navigationBar.hideNavigationBar();
  }

  task_start() {
    this.insomnia.keepAwake();
    this.backgroundMode.setDefaults({
      text: "Test in progress!",
      silent: false
    })
    // this.switch_divs("div_instructions");
  }


  list_items(dicts) {
    let textitems = dicts.filter(dct => dct.mode === 'text').map(dct => {
      return '<li>' + dct.item + '</li>';
    }).sort().join('<br>');
    let imgitems = dicts.filter(dct => dct.mode === 'image').map(dct => {
      let props = 'style="max-height:50%;max-width:50%;vertical-align: middle;"';
      return '<li><img ' + props + ' src="' + URL.createObjectURL(dct.imgfile) + '"></li>';
    }).sort().join('<br>');
    if (textitems.length > 0 && imgitems.length > 0) {
      return '<b><ul>' + textitems + '<br>' + imgitems + '</ul></b><br>';
    } else {
      return '<b><ul>' + textitems + imgitems + '</ul></b><br>';
    }
  }

  set_block_texts() {
    let trefs = this.list_items(this.targetrefs);
    let nontrefs = this.list_items(this.nontargrefs);
    let targs = this.list_items(this.the_targets);
    let nontargs = this.list_items(this.the_nontargs);
    this.block_texts = this.trP.blck_texts[this.trP.lang](targs, nontargs, trefs, nontrefs, this.cit_type);
    this.block_text = this.block_texts[1];
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
      this.block_text =
        "Sie müssen diese Übungsrunde wiederholen, da Sie zu wenige richtige Antworten gegeben haben. <br><br>Sie benötigen mindestens 60% richtige Antworten für jeden der beiden Antworttypen, jedoch gaben Sie nicht genügend richtige Antworten für folgende(n) Antworttyp(en):" +
        types_failed.join(",") +
        ".<br><br>Bitte geben Sie genaue und im Zeitlimit liegende Antworten.<br><br><button ion-button style='text-transform: none;' (tap)='this.citP.block_text = this.citP.block_texts[this.citP.blocknum]' color='light' block>show instructions again</button>";
    }
    //;
    return is_valid;
  }

  start_trials() {
    setTimeout(function() {
      this.next_trial()
    }.bind(this), this.isi_delay_minmax[0]);
  }

  block_text: string = '';
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
        this.block_text = this.block_texts[this.blocknum];
        this.nextblock();
      } else {
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
      // refresh after ending:
      // this.navCtrl.setRoot(this.navCtrl.getActive().component);



      this.backgroundMode.setDefaults({
        silent: true
      })
      this.insomnia.allowSleepAgain()
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
}
