import { Injectable } from '@angular/core';
import { BackgroundMode } from '@ionic-native/background-mode';
import { File } from '@ionic-native/file';
import { NavigationBar } from '@ionic-native/navigation-bar';
import { TranslationProvider } from '../../providers/translations/translations';
import { ItemgenProvider } from '../../providers/itemgen/itemgen';
import { StatusBar } from '@ionic-native/status-bar';
import { DataShareProvider } from '../../providers/data-share/data-share';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@Injectable()
export class CitProvider {
  content: any;

  /*
  touchsim() {
    var info = this.trial_stim.type + " (" + this.trial_stim.item + ")";
    var rt_sim = this.itemgenP.randomdigit(600, 830);
    var correct_chance, sim_key, corr_code, incor_code, chosen_response;
    setTimeout(function() {
      if (this.crrnt_phase === 'practice_strict') {
        correct_chance = 1;
      } else if (this.crrnt_phase === 'main') {
        correct_chance = 0.5;
      } else {
        correct_chance = 0.8; // 0.9;
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
      info += "\n--len(stims): " + this.teststim.length +
        ", blocknum: " + this.blocknum +
        ", trialnum: " + this.block_trialnum + "\n";
      this.touchstart("", sim_key);
      info += chosen_response + " preset " + rt_sim + ", actual " + Math.round(performance.now() - this.start) + "\n";
      console.log(info);

      if (this.teststim.length == 1 && this.blocknum < 18) {
        setTimeout(() => {
          this.runblock();
          setTimeout(() => {
            this.visib.start_text = false;
            this.start_trials();
          }, 1000);
        }, 3000);
      }

    }.bind(this), rt_sim);
  }
  //*/
  to_slice: number = 0; // 0 to ignore // for testing -- TODOREMOVE

  exp: string = "name_vs_face";
  subj_id: string = '';
  age: string = '';
  gender: string = '';
  speaker: string = '';
  current_div: string = "div_consent"; // ddd default: "div_consent"
  // div_consent, div_dems, div_cit_main
  consent_now: number = 0;
  current_segment: string = 'main';
  current_menu: string = '';
  false_delay: number = 400;
  tooslow_delay: number = 400;
  isi_delay_minmax: number[] = [500, 800];
  response_timelimit: number;
  response_timelimit_main: number = 1000;
  isi_delay: number = 99999;
  cit_type: any = 0;
  cittypedict: any = {
    '0': 'enhanced',
    '1': 'standard',
    '2': 'notarget'
  };
  bg_color: string = "#fff";
  feed_text: string = "";
  visib: any = { start_text: true };
  block_texts: string[];
  teststim: any[];
  tooslow: number;
  incorrect: number;
  block_trialnum: number;
  rt_data_dict: any;
  rt_item_counts: any = {};
  all_rts: object = {
    "probe1": [],
    "probe2": [],
    "probe3": [],
    "probe4": [],
    "probe5": [],
    "targetflr": [],
    "nontargflr": [],
    "target": []
  };
  trial_stim: any;
  rspns: string;
  no_prac_fail: boolean = true;
  text_to_show: string;
  cit_data: string =
    ["subject_id", "phase", "block_number", "trial_number", "stimulus_shown", "category", "stim_type", "set_number", "set_modality", "response_key", "rt_start", "rt_end", "incorrect", "too_slow", "isi", "item_count", "date_in_ms"].join('\t') + "\n";
  correct_resp: string = "none";
  blocknum: number;
  rt_start: number = 99999;
  rt_end: number = 99999;
  start: any = 0;
  listen: boolean = false;
  listn_end: boolean = false;
  response_window: any;
  stim_bases: any[];
  the_targets: any[];
  the_nontargs: any[];
  the_probes: string[];
  stimulus_text: string = "";
  to_display: string = "";
  targetrefs: object[];
  nontargrefs: object[];
  path: any = "(path not found)";
  consented: number;
  crrnt_phase: string;
  canvas;
  ctx;
  task_images: object;
  image_width: number;
  all_teststms: any[] = [];
  fam_ratings: string[] = Array(8).fill('NA');
  misc_ratings: string[] = Array(14).fill('NA');

  constructor(
    public file: File,
    public navigationBar: NavigationBar,
    public statusBar: StatusBar,
    public backgroundMode: BackgroundMode,
    public trP: TranslationProvider,
    public dataShare: DataShareProvider,
    public itemgenP: ItemgenProvider,
    public screenOrientation: ScreenOrientation
  ) {
    this.consent_now = Date.now();
  }

  pointev: any = {};
  switch_divs(div_to_show, goto = false) {
    this.current_div = div_to_show;
    Object.keys(this.pointev).forEach(ky => this.pointev[ky] = "none");
    setTimeout(() => {
      this.pointev[div_to_show] = "auto";
    }, 300);
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
    this.itemgenP.stim_base_p = JSON.parse(JSON.stringify(this.stim_bases));
    this.nextblock();
  }

  shuff(arr) {
    let array = JSON.parse(JSON.stringify((arr)));
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

  list_items(dicts) {
    let textitems = dicts.filter(dct => dct.mode === 'text').map(dct => {
      return '<li>' + dct.item + '</li>';
    }).sort().join('<br>');

    let imgitems = this.shuff(dicts.filter(dct => dct.mode === 'image').map(dct => {
      let props = 'style="max-height:30%;max-width:30%;vertical-align: middle;"';
      return '<li><img ' + props + ' src="' + this.task_images[dct.item].src + '"></li>';
    })).join('<br>');

    if (textitems.length > 0 && imgitems.length > 0) {
      return '<b><ul>' + textitems + '<br>' + imgitems + '</ul></b><br>';
    } else {
      return '<b><ul>' + textitems + imgitems + '</ul></b><br>';
    }
  }

  set_block_texts() {
    let trefs = this.list_items(this.targetrefs);
    let nontrefs = this.list_items(this.nontargrefs);
    let targs = [
      this.list_items(this.the_targets[0]),
      this.list_items(this.the_targets[1]),
      this.list_items(this.the_targets[2]),
      this.list_items(this.the_targets[3]),
      this.list_items(this.the_targets[4]),
      this.list_items(this.the_targets[5]),
      this.list_items(this.the_targets[6]),
      this.list_items(this.the_targets[7])
    ];
    let nontargs = [
      this.list_items(this.the_nontargs[0]),
      this.list_items(this.the_nontargs[1]),
      this.list_items(this.the_nontargs[2]),
      this.list_items(this.the_nontargs[3]),
      this.list_items(this.the_nontargs[4]),
      this.list_items(this.the_nontargs[5]),
      this.list_items(this.the_nontargs[6]),
      this.list_items(this.the_nontargs[7])
    ];
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
  sd_pooled(var1, var2) {
    let n1 = var1.length
    let n2 = var2.length
    let nom = (n1 - 1) * (this.sd(var1) ** 2) + (n2 - 1) * (this.sd(var2) ** 2)
    return Math.sqrt(nom / (n1 + n2 - 2))
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

  prac3_rep: number = 0;
  practice_eval() {
    let min_ratio;
    var is_valid = true;
    var types_failed = [];
    if (this.crrnt_phase === 'practice_strict') {
      is_valid = this.no_prac_fail;
      this.no_prac_fail = true;
      if (is_valid == false) {
        this.block_text = '<span></span>' +
          this.trP.accrep_feed[this.trP.lang];
      }
    } else {
      if (this.blocknum === 3) {
        if (this.prac3_rep == 0) {
          this.prac3_rep++;
        } else {
          return true;
        }
        min_ratio = 0.5
      } else {
        min_ratio = 0.8
      }
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
        this.block_text = '<span></span>' +
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
      if ((this.blocknum > 3 && this.blocknum % 2 === 0) || this.practice_eval()) {
        this.blocknum++;
        if (this.blocknum > 18) {
          this.bg_color = "#fff";
          //this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
          this.switch_divs('div_quests')
        } else {
          this.block_text = this.block_texts[this.blocknum];
          this.nextblock();
        }
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
    let curr_type, curr_itemcount;
    let act_type = this.trial_stim.type.replace(/[0-9]$/, '');
    if (
      ["targetflr", "nontargflr", "target"].indexOf(act_type) >= 0
    ) {
      curr_type = act_type;
    } else {
      curr_type = "main_item";
    }
    if (this.crrnt_phase == 'main') {
      if (!(this.trial_stim.item in this.rt_item_counts)) {
        this.rt_item_counts[this.trial_stim.item] = 0;
      }
      this.rt_item_counts[this.trial_stim.item]++;
      curr_itemcount = this.rt_item_counts[this.trial_stim.item];
    } else {
      curr_itemcount = 'NA';
    }
    if (!(curr_type in this.rt_data_dict)) {
      this.rt_data_dict[curr_type] = [];
    }
    if (this.incorrect == 1 || this.tooslow == 1) {
      this.rt_data_dict[curr_type].push(-1);
    } else {
      this.rt_data_dict[curr_type].push(this.rt_start);
    }
    if (
      ["targetflr", "nontargflr", "target"].indexOf(act_type) === -1
    ) {
      curr_type = this.trial_stim.type;
    }
    if (this.crrnt_phase == 'main') {
      if (this.rt_start <= 150) {
        this.all_rts[curr_type].push(-2);
      } else if (this.tooslow === 1 || this.rt_start > this.response_timelimit_main) {
        this.all_rts[curr_type].push(-1);
      } else if (this.incorrect === 1) {
        this.all_rts[curr_type].push(0);
      } else {
        this.all_rts[curr_type].push(this.rt_start);
      }
    }
    this.cit_data +=
      [this.subj_id,
      this.crrnt_phase,
      this.blocknum,
      this.block_trialnum,
      this.trial_stim.item,
      this.trial_stim.cat,
      this.trial_stim.type,
      this.block_type[0],
      this.block_type[1],
      this.rspns,
      this.rt_start,
      this.rt_end,
      this.incorrect,
      this.tooslow,
      (this.isi_delay + this.isi_delay_minmax[0]),
        curr_itemcount,
      String(new Date().getTime())
      ].join('\t') +
      "\n";
    this.next_trial();
  }

  block_type: string[] = ['NA', 'NA'];

  nextblock() {
    this.crrnt_phase = 'practice';
    this.bg_color = "#fff";
    this.block_trialnum = 0;
    this.block_type = ['NA', 'NA'];
    // 0: fillers & target, 1: standard CIT, 2: fillers (no target)
    if (this.blocknum == 1) {
      this.stim_bases.forEach((baseset) => {
        this.all_teststms.push(this.itemgenP.fulltest_items(this.targetrefs, this.nontargrefs, baseset));
      });
      this.response_timelimit = this.response_timelimit_main;
      this.teststim = this.itemgenP.filler_items(this.targetrefs, this.nontargrefs);
    } else if (this.blocknum == 2) {
      this.response_timelimit = 10000;
      this.crrnt_phase = 'practice_strict';
      this.teststim = this.itemgenP.main_items(this.stim_bases[0]);
    } else if (this.blocknum == 3) {
      this.response_timelimit = this.response_timelimit_main;
      this.teststim = this.itemgenP.practice_items(this.targetrefs, this.nontargrefs);
    } else if (this.blocknum % 2 !== 0) {
      this.response_timelimit = 10000;
      this.crrnt_phase = 'practice_strict';
      this.teststim = this.itemgenP.main_items(this.stim_bases[(this.blocknum - 3) / 2]);
    } else {
      this.crrnt_phase = 'main';
      this.response_timelimit = this.response_timelimit_main;
      this.teststim = this.all_teststms.shift();
    }
    if (this.blocknum !== 1) {
      let exitem = this.teststim.filter(dct => dct.cat != "filler")[0].item;
      console.log(exitem);
      let thismod;
      if (exitem.includes('_img')) {
        thismod = 'face';
      } else {
        thismod = 'name';
      }
      this.block_type = [exitem.slice(1, 2), thismod];
    }
    if (this.to_slice !== 0) {
      this.teststim = this.teststim.slice(0, this.to_slice);
    }
    this.rt_data_dict = {};
    this.switch_divs('div_blockstart');
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

  // DATA STORING

  store_data() {
    this.get_results();
    //this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY);
    this.file.writeFile(this.path, this.cit_results.file_name, this.cit_results.cit_data).then(value => {
      this.switch_divs('div_results');
      this.current_menu = 'm_sendin';
      this.current_segment = 'menus';
    }, reason => {
      this.cit_results.file_nam_disp = this.cit_results.file_name + ' There was an error saving this file. Data data can still be retrieved by copying it to the clipboard. Error: ' + reason;
      this.switch_divs('div_results');
      this.current_menu = 'm_sendin';
      this.current_segment = 'menus';
    });
  }

  cit_results: any = {
    "probe1": {},
    "probe2": {},
    "probe3": {},
    "probe4": {},
    "probe5": {},
    "ar_overall": '',
    'subj_id': '',
    'cit_data': '',
    'date': '',
    'file_name': '',
    'file_nam_disp': ''
  };
  stored_results: any = {};
  get_results() {
    this.cit_results = {
      "probe1": {},
      "probe2": {},
      "probe3": {},
      "probe4": {},
      "probe5": {}
    };
    let allmain = [];
    Object.keys(this.cit_results).forEach((dkey) => {
      let probe = this.all_rts[dkey];
      allmain = allmain.concat(probe);
      let irrs = [];
      Object.keys(this.cit_results).forEach((dkey2) => {
        if (dkey !== dkey2) {
          irrs = irrs.concat(this.all_rts[dkey2])
        }
      });
      // -1 tooslow, 0 incorrect
      this.cit_results[dkey].acc_probe = probe.filter(x => x > 1).length / probe.filter(x => x !== -2).length;
      this.cit_results[dkey].acc_irr = irrs.filter(x => x > 1).length / irrs.filter(x => x !== -2).length;
      this.cit_results[dkey].acc_p_vs_i = this.cit_results[dkey].acc_probe - this.cit_results[dkey].acc_irr;
      let rts_prob = probe.filter(x => x > 1);
      let rts_irr = irrs.filter(x => x > 1);
      if (probe.length > 2 && irrs.length > 2) {
        this.cit_results[dkey].rt_probe = this.mean(rts_prob);
        this.cit_results[dkey].rt_probe_sd = this.sd(rts_prob);
        this.cit_results[dkey].rt_irr = this.mean(rts_irr);
        this.cit_results[dkey].rt_irr_sd = this.sd(rts_irr);
        this.cit_results[dkey].rt_p_vs_i = this.mean(rts_prob) - this.mean(rts_irr);
        this.cit_results[dkey].dcit = (this.mean(rts_prob) - this.mean(rts_irr)) / this.sd_pooled(rts_prob, rts_irr);
      } else {
        this.cit_results[dkey].rt_probe = 'NA';
        this.cit_results[dkey].rt_probe_sd = 'NA';
        this.cit_results[dkey].rt_irr = 'NA';
        this.cit_results[dkey].rt_irr_sd = 'NA';
        this.cit_results[dkey].dcit = 'NA';
      }
      Object.keys(this.cit_results[dkey]).forEach((subkey) => {
        if (!isNaN(this.cit_results[dkey][subkey])) {
          if (subkey.slice(0, 3) === 'rt_') {
            this.cit_results[dkey][subkey] = (Math.round(this.cit_results[dkey][subkey] * 10) / 10).toFixed(1);
          } else if (subkey.slice(0, 4) === 'dcit') {
            this.cit_results[dkey][subkey] = (Math.round(this.cit_results[dkey][subkey] * 100) / 100).toFixed(2);
          } else {
            this.cit_results[dkey][subkey] = (Math.round(this.cit_results[dkey][subkey] * 1000) / 10).toFixed(1);
          }
          this.cit_results[dkey][subkey] = this.cit_results[dkey][subkey].replace('-', '−');
        } else {
          this.cit_results[dkey][subkey] = 'NA';
        }
      });
    });
    let ar_names = {
      'mains': 'main items (all probes) ',
      'target': 'target ',
      'targetflr': 'target fillers ',
      'nontargflr': 'nontarget fillers '
    };
    let ars = [];
    ['mains', 'target', 'targetflr', 'nontargflr'].map((dkey) => {
      let the_ar = NaN;
      if (dkey == 'mains') {
        the_ar = allmain.filter(x => x > 1).length / allmain.length;
      } else if (Object.keys(this.all_rts).indexOf(dkey) >= 0) {
        the_ar = this.all_rts[dkey].filter(x => x > 1).length / this.all_rts[dkey].length;
      }
      if (!isNaN(the_ar)) {
        ars.push(ar_names[dkey] + (Math.ceil(the_ar * 1000) / 10).toFixed(1) + '%');
      }
    })
    this.cit_results.ar_overall = ars.join(', ');

    this.cit_results.subj_id = this.subj_id;

    let duration_full = Math.round((Date.now() - this.consent_now) / 600) / 100;

    this.cit_data += 'dems\t' + [
      'subject_id',
      'exp',
      'gender',
      'age',
      'probes',
      'probe_familiarity',
      'ratings',
      'full_dur'
    ].join('/') +
      '\t' + [
        this.subj_id,
        this.exp,
        this.gender,
        this.age,
        this.the_probes.join('|'),
        this.fam_ratings.join('|'),
        this.misc_ratings.join('|'),
        duration_full
      ].join('/');
    this.cit_results.cit_data = this.cit_data;
    let cdate = new Date();
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    this.cit_results.date = ("0" + cdate.getDate()).slice(-2) + " " +
      months[cdate.getMonth()] + " " +
      cdate.getFullYear() + " " +
      ("0" + cdate.getHours()).slice(-2) + ":" +
      ("0" + cdate.getMinutes()).slice(-2);

    this.cit_results.file_name = this.exp + '_' + this.subj_id + '.txt';
    this.cit_results.file_nam_disp = this.cit_results.file_name;
    this.dataShare.storage.set('reslts', this.cit_results);
  }

  // display

  item_display() {
    if (this.trial_stim.type === "target" || this.trial_stim.type.slice(0, 9) === "targetflr") {
      this.correct_resp = "resp_b";
    } else {
      this.correct_resp = "resp_a";
    }
    //this.touchsim(); // for testing -- TODOREMOVE
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.ctx.drawImage(this.task_images[this.trial_stim.item], 0, 0, this.image_width, this.image_width);
        // if (this.trial_stim.mode === 'image') {
        //   this.ctx.drawImage(this.task_images[this.trial_stim.item], 0, 0, this.image_width, this.image_width);
        // } else {
        //   this.stimulus_text = this.text_to_show;
        // }
        this.start = performance.now();
        this.listen = true;
        this.response_window = setTimeout(function() {
          this.rt_start = performance.now() - this.start;
          this.listen = false;
          this.flash_too_slow();
        }.bind(this), this.response_timelimit);
      });
    });
  }

}
