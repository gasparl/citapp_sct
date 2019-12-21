import { Injectable, Component } from '@angular/core';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Clipboard } from '@ionic-native/clipboard';
import { File } from '@ionic-native/file';
import { NavigationBar } from '@ionic-native/navigation-bar';
import { TranslationProvider } from '../../providers/translations/translations';
import { ItemgenProvider } from '../../providers/itemgen/itemgen';
import { StatusBar } from '@ionic-native/status-bar';

@Injectable()
export class CitProvider {
  content: any;

  // /*
  touchsim() {
    var info = this.trial_stim.type + " (" + this.trial_stim.item + ")";
    var rt_sim = this.itemgenP.randomdigit(600, 830);
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
  current_div: string = "div_settings"; // ddd default: "div_start", div_settings, div_dems, div_cit_main, div_end
  false_delay: number = 400;
  tooslow_delay: number = 400;
  isi_delay_minmax: number[] = [300, 700];
  response_timelimit: number;
  response_timelimit_main: number = 900;
  isi_delay: number = 99999;
  cit_type: any = 0;
  bg_color: string = "#fff";
  feed_text: string = "";
  visib: any = { start_text: true };
  block_texts: string[];
  teststim: any[];
  tooslow: number;
  incorrect: number;
  block_trialnum: number;
  rt_data_dict: any;
  all_main_rts: any = {
    "probe1": [],
    "probe2": [],
    "probe3": [],
    "probe4": [],
    "probe5": []
  };
  trial_stim: any;
  rspns: string;
  no_prac_fail: boolean = true;
  text_to_show: string;
  practice_repeated: any = {
    block1: 0,
    block2: 0,
    block3: 0
  };
  cit_data: string =
    ["subject_id", "cit_version", "block_number", "trial_number", "stimulus_shown", "category", "stim_type", "response_key", "rt_start", "rt_end", "incorrect", "too_slow", "isi", "date_in_ms"].join('\t') + "\n";
  correct_resp: string = "none";
  blocknum: number = 1;
  num_of_blocks: number = 1;
  rt_start: number = 99999;
  rt_end: number = 99999;
  start: any = 0;
  listen: boolean = false;
  listn_end: boolean = false;
  practice_num: number = 5;
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
  show_eval: boolean = true;
  consented: number;
  crrnt_phase: string;
  canvas;
  ctx;
  task_images: object = {};
  image_width: number;

  constructor(
    private clipboard: Clipboard,
    public file: File,
    public navigationBar: NavigationBar,
    public statusBar: StatusBar,
    public backgroundMode: BackgroundMode,
    public trP: TranslationProvider,
    public itemgenP: ItemgenProvider
  ) { }

  pointev: any = {};
  switch_divs(div_to_show) {
    this.current_div = div_to_show;
    Object.keys(this.pointev).forEach(ky => this.pointev[ky] = "none");
    setTimeout(function() {
      this.pointev[div_to_show] = "auto";
    }.bind(this), 300);
    this.navigationBar.hideNavigationBar();
    this.statusBar.hide();
    this.content.resize();
    this.content.scrollToTop(0);
  }

  task_start() {
    this.backgroundMode.setDefaults({
      text: "Test in progress!",
      silent: false
    })
    this.itemgenP.stim_base_p = JSON.parse(JSON.stringify(this.stim_base));
  }


  list_items(dicts) {
    let textitems = dicts.filter(dct => dct.mode === 'text').map(dct => {
      return '<li>' + dct.item + '</li>';
    }).sort().join('<br>');
    let imgitems = dicts.filter(dct => dct.mode === 'image').map(dct => {
      let props = 'style="max-height:50%;max-width:50%;vertical-align: middle;"';
      return '<li><img ' + props + ' src="' + this.task_images[dct.item].src + '"></li>';
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


  neat_date() {
    var m = new Date();
    return m.getFullYear() + "" +
      ("0" + (m.getMonth() + 1)).slice(-2) + "" +
      ("0" + m.getDate()).slice(-2) + "" +
      ("0" + m.getHours()).slice(-2) + "" +
      ("0" + m.getMinutes()).slice(-2) + "" +
      ("0" + m.getSeconds()).slice(-2);
  }


  flash_too_slow() {
    this.feed_text = this.trP.feedtooslo[this.trP.lang];
    setTimeout(function() {
      this.feed_text = "";
      this.tooslow = 1;
      this.rspns = "x";
      this.prac_fail();
      this.post_resp_hold();
    }.bind(this), this.tooslow_delay);
  }

  flash_false() {
    this.feed_text = this.trP.feedwrong[this.trP.lang];
    setTimeout(function() {
      this.feed_text = "";
      this.incorrect = 1;
      this.prac_fail();
      this.post_resp_hold();
    }.bind(this), this.false_delay);
  }

  prac_fail() {
    if (this.crrnt_phase === 'practice_strict') {
      this.teststim = [];
      this.no_prac_fail = false;
    }
  }

  isi() {
    this.isi_delay = this.itemgenP.randomdigit(1, this.isi_delay_minmax[1] - this.isi_delay_minmax[0]);
    setTimeout(function() {
      this.item_display();
    }.bind(this), this.isi_delay);
  }

  practice_eval(min_ratio) {
    var is_valid = true;
    var types_failed = [];
    if (this.crrnt_phase === 'practice_strict') {
      is_valid = this.no_prac_fail;
      this.no_prac_fail = true;
      if (is_valid == false) {
        this.block_text =
          this.trP.accrep_feed[this.trP.lang];
      }
    } else {
      for (var it_type in this.rt_data_dict) {
        var rts_correct = this.rt_data_dict[it_type].filter(function(rt_item) {
          return rt_item > 150;
        });
        var corr_ratio = rts_correct.length / this.rt_data_dict[it_type].length;
        if (corr_ratio < min_ratio) {
          is_valid = false;
          types_failed.push(
            " " +
            this.trP.it_type_feed_dict[this.trP.lang][it_type] +
            " (" +
            Math.floor(corr_ratio * 100) +
            this.trP.correct[this.trP.lang] + ')'
          );
        }
      }
      if (is_valid == false) {
        this.block_text =
          this.trP.acc_feed[this.trP.lang][0] + min_ratio * 100 + this.trP.acc_feed[this.trP.lang][1] +
          types_failed.join(",") +
          ".";
      }
    }
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
      this.trial_stim = this.teststim.shift();
      this.block_trialnum++;
      this.text_to_show = this.trial_stim.item;
      this.isi();
    } else {
      if ((this.blocknum > 3) || (this.blocknum == 4 && this.practice_eval(0.8)) || this.practice_eval(0.5)) {
        this.blocknum++;
        this.block_text = this.block_texts[this.blocknum];
        this.nextblock();
      } else {
        this.nextblock();
      }
    }
  }

  post_resp_hold() {
    this.ctx.clearRect(0, 0, this.image_width, this.image_width);
    this.stimulus_text = "";
    setTimeout(function() {
      this.listn_end = false;
      this.add_response();
    }.bind(this), this.isi_delay_minmax[0]);
  }

  add_response() {
    var curr_type;
    var act_type = this.trial_stim.type.replace(/[0-9]$/, '');
    if (
      ["targetflr", "nontargflr", "target"].indexOf(act_type) >= 0
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
      [this.subj_id,
      this.cit_type,
      this.blocknum,
      this.block_trialnum,
      this.trial_stim.item,
      this.trial_stim.cat,
      this.trial_stim.type,
      this.rspns,
      this.rt_start,
      this.rt_end,
      this.incorrect,
      this.tooslow,
      (this.isi_delay + this.isi_delay_minmax[0]),
      String(new Date().getTime())
      ].join('\t') +
      "\n";
    this.next_trial();
  }

  nextblock() {
    this.crrnt_phase = 'practice';
    this.bg_color = "#fff";
    if (this.blocknum <= (this.num_of_blocks + 2) ||
      (this.cit_type === 0 && this.blocknum <= (this.num_of_blocks + 3))) {
      this.block_trialnum = 0;
      // 0: fillers & target, 1: standard CIT, 2: fillers (no target)
      if (this.blocknum == 1) {
        if (this.cit_type === 1) {
          this.response_timelimit = 10000;
          this.crrnt_phase = 'practice_strict';
          this.teststim = this.itemgenP.main_items(this.stim_base);
        } else {
          this.response_timelimit = this.response_timelimit_main;
          this.teststim = this.itemgenP.filler_items(this.targetrefs, this.nontargrefs);
        }
      } else if (this.blocknum == 2) {
        if (this.cit_type === 1) {
          this.response_timelimit = this.response_timelimit_main;
          this.teststim = this.itemgenP.main_items(this.stim_base);
        } else if (this.cit_type === 2) {
          this.response_timelimit = this.response_timelimit_main;
          this.teststim = this.itemgenP.practice_items(this.targetrefs, this.nontargrefs);
        } else {
          this.response_timelimit = 10000;
          this.crrnt_phase = 'practice_strict';
          this.teststim = this.itemgenP.main_items(this.stim_base);
        }
      } else if (this.blocknum == 3 && this.cit_type === 0) {
        this.response_timelimit = this.response_timelimit_main;
        this.teststim = this.itemgenP.practice_items(this.targetrefs, this.nontargrefs);
      } else {
        this.crrnt_phase = 'main';
        this.response_timelimit = this.response_timelimit_main;
        this.teststim = this.itemgenP.fulltest_items(this.targetrefs, this.nontargrefs);
      }
      this.teststim = this.teststim.slice(0, 5); // TODO remove
      this.rt_data_dict = {};
      this.switch_divs('div_blockstart');
    } else {
      this.switch_divs('div_end')
      this.store_data();
      this.backgroundMode.setDefaults({
        silent: true
      })
    }
  }

  runblock() {
    this.bg_color = "#000000";
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
      Date.now() +
      ".txt";
    // this.clipboard.copy(this.cit_data);
    // this.file.writeFile(this.path, this.f_name, this.cit_data);

    // (Math.ceil(dcit * 1000) / 1000).toFixed(3);
    // Math.round(this.mean(this.all_main_rts.probs) - this.mean(this.all_main_rts.irrs)) + " ms)"

    this.backgroundMode.setDefaults({
      silent: true
    })
  }

  // image display

  item_display() {
    if (this.trial_stim.type === "target" || this.trial_stim.type.slice(0, 9) === "targetflr") {
      this.correct_resp = "resp_b";
    } else {
      this.correct_resp = "resp_a";
    }
    this.touchsim(); // for testing -- TODOREMOVE
    requestAnimationFrame(() => {
      if (this.trial_stim.mode === 'image') {
        this.ctx.drawImage(this.task_images[this.trial_stim.item], 0, 0);
      } else {
        this.stimulus_text = this.text_to_show;
      }
      this.start = performance.now();
      this.listen = true;
      this.response_window = setTimeout(function() {
        this.rt_start = performance.now() - this.start;
        this.listen = false;
        this.flash_too_slow();
      }.bind(this), this.response_timelimit);
    });
  }

}
