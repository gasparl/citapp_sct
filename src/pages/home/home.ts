import { Component, ViewChild, ElementRef } from "@angular/core";
import { Slides, Content, AlertController } from 'ionic-angular';
import { NavController, NavParams } from "ionic-angular";
import { Network } from '@ionic-native/network';
import { EmailComposer } from "@ionic-native/email-composer";
import { Platform } from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { PopoverController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { DataShareProvider } from '../../providers/data-share/data-share';
import { CitProvider } from '../../providers/cit/cit';
import { TranslationProvider } from '../../providers/translations/translations';
import { DomSanitizer } from '@angular/platform-browser';
import { Clipboard } from '@ionic-native/clipboard/';
import { ScreenOrientation } from '@ionic-native/screen-orientation';


@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  @ViewChild(Slides) slides: Slides;
  @ViewChild(Content) cntent_temp: Content;
  canv_temp: ElementRef;
  @ViewChild('thecanvas') set content(content: ElementRef) {
    if (content !== undefined) {
      this.citP.canvas = content;
      this.citP.image_width = Math.floor(window.innerHeight * 0.62);
      this.citP.canvas.nativeElement.width = this.citP.image_width;
      this.citP.canvas.nativeElement.height = this.citP.image_width;
      this.citP.ctx = this.citP.canvas.nativeElement.getContext('2d');
    }
  }

  // /*
  to_exec: any = 'this.';
  mycl: any;
  onChange(ee) {
    if (ee.keyCode === 13) {
      console.log(eval(this.to_exec));
      this.mycl = JSON.stringify(eval(this.to_exec));
    }
  }
  //*/

  initslide: any = 0;
  cit_items: string[] = [];
  form_items: FormGroup;
  mailpost: string = "";
  pwpost: string = "";
  email_valid: boolean = false;
  email_for_pw: string = "";
  consentset: any[] = [];
  img_dict: any = {};
  on_device: boolean;
  submit_failed: boolean = false;
  consentitems: string;
  targetref_words: string[] = JSON.parse(JSON.stringify(this.trP.targetref_words_orig[this.trP.lang]));
  nontargref_words: string[] = JSON.parse(JSON.stringify(this.trP.nontargref_words_orig[this.trP.lang]));

  constructor(
    public navCtrl: NavController,
    private emailComposer: EmailComposer,
    private clipboard: Clipboard,
    public platform: Platform,
    public formBuilder: FormBuilder,
    private network: Network,
    public popoverCtrl: PopoverController,
    public http: HttpClient,
    public dataShare: DataShareProvider,
    public citP: CitProvider,
    public trP: TranslationProvider,
    protected _sanitizer: DomSanitizer,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private screenOrientation: ScreenOrientation
  ) {
    this.dataShare.storage.get('result').then((cntent) => {
      if (cntent) {
        this.citP.cit_results = cntent;
        this.citP.switch_divs('div_results');
      }
    });
  }
  internet_on: boolean = false;
  checknet: any;
  ionViewDidLoad() {
    this.citP.content = this.cntent_temp;
    this.platform.ready().then(() => {
      this.on_device = this.platform.is("cordova");
      if (this.on_device) {
        this.checknet = setInterval(() => {
          if (this.network.type) {
            if (this.network.type != "none") {
              this.internet_on = true;
            } else {
              this.internet_on = false;
            }
          }
        }, 500);
        this.citP.statusBar.hide();
        this.citP.navigationBar.hideNavigationBar();
        this.citP.navigationBar.setUp(true);
        this.citP.backgroundMode.enable();
        this.citP.backgroundMode.setDefaults({
          title: "Concealed Information Test App active",
          text: "",
          silent: true
        });
        this.citP.path = this.citP.file.externalDataDirectory;
      }
    });
  }

  san_html(html) {
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

  dictitems = function(dict) {
    try {
      let ordered_vals = [];
      Object.keys(dict).sort().reverse().forEach((akey) => {
        ordered_vals.push({ 'k': akey, 'v': dict[akey] });
      });
      return ordered_vals;
    } catch {
      console.log("Failed to get dictionary values.");
      return []
    }
  }

  show_imgs() {
    if (Object.keys(this.img_dict).length !== 0) {
      Object.keys(this.img_dict).map((dkey) => {
        if (!dkey.includes('_img')) {
          this.display_thumbnail(dkey)
        }
      });
    }
  }

  settings_storage = function(datapost) {
    console.log('settings_storage starts...');
    if (datapost == 'yes') {
      datapost = JSON.stringify({
        'subject_id': this.citP.subj_id,
        'cit_version': this.citP.cit_type,
        'num_of_blocks': this.citP.num_of_blocks,
        'timelimit': this.citP.response_timelimit_main,
        'isi_min': this.citP.isi_delay_minmax[0],
        'isi_max': this.citP.isi_delay_minmax[1],
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
    let themail;
    if (datapost == "sendpass") {
      themail = this.email_for_pw;
    } else {
      themail = this.mailpost;
      this.email_valid = false;
    }
    this.http.post('https://homepage.univie.ac.at/gaspar.lukacs/x_citapp/x_citapp_storage.php', JSON.stringify({
      email_post: themail,
      pw_post: this.pwpost,
      data_post: datapost
    }), { responseType: "text" }).subscribe((response) => {
      console.log(response);
      let feed;
      if (response.slice(0, 7) == 'victory') {
        document.getElementById("storefeed_id").style.color = 'green';
        response = response.slice(7)
        if (response.slice(0, 6) == 'insert') {
          response = response.slice(6)
          feed = "Data saved in database.";
        } else if (response.slice(0, 6) == 'update') {
          response = response.slice(6)
          feed = "Data updated in database.";
        } else if (response.slice(0, 6) == 'loaded') {
          response = response.slice(6)
          feed = this.load_settings(response);
        } else if (response.slice(0, 5) == 'Email') {
          feed = response;
          this.email_valid = false;
        }
      } else {
        if (response.slice(0, 6) == 'pwfail') {
          response = response.slice(6);
          if (/\S+@\S+\.\S+/.test(this.mailpost)) {
            this.email_valid = true;
            this.email_for_pw = themail;
          }
        }
        document.getElementById("storefeed_id").style.color = 'red';
        feed = 'Error. ' + response;
      }
      document.getElementById("storefeed_id").innerHTML = feed + "<br><br>";
    },
      err => {
        console.log('Request failed: ', err);
        document.getElementById("storefeed_id").style.color = 'red';
        let feed = 'Could not connect to server. ' + err.message;
        document.getElementById("storefeed_id").innerHTML = feed + "<br><br>";
      });
  }

  valid_chars(event: any) {
    const pattern = /[a-zA-Z0-9_]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
  valid_chars2(event: any) {
    const pattern = /[a-zA-Z0-9_@.!]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  mails: string = '';
  emails_input(event: any) {
    const pattern = /[a-zA-Z0-9\s;_@.!]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
  // mails_sending: string = '';
  // checkmail() {
  //   let mailsarray = this.mails.split(";");
  //   this.mails_sending = '';
  //   mailsarray.map((ml) => {
  //     if (/\S+@\S+\.\S+/.test(ml)) {
  //       this.mails_sending = this.mails_sending + '; ' + ml.trim();
  //     }
  //   })
  //   this.mails_sending = this.mails_sending.substr(2)
  // }

  sendviaapp() {
    let email = {
      to: this.mails,
      cc: "",
      subject: "CITapp data " + this.citP.cit_results.file_name,
      body: "",
      attachments: [
        this.citP.path + this.citP.cit_results.file_name
      ]
    };
    this.emailComposer.open(email);
  }

  to_clipboard() {
    this.clipboard.copy(this.citP.cit_results.cit_data);
    try {
      document.getElementById("copyfeed_id").innerHTML = 'CIT result data copied to clipboard.';
      setTimeout(() => {
        document.getElementById("copyfeed_id").innerHTML = '&nbsp;';
      }, 3000);
    } catch { }
  }

  texttrans: boolean = true;
  change_texttrans() {
    if (this.texttrans === true) {
      document.documentElement.style.setProperty('--inputcase', 'uppercase');
    } else {
      document.documentElement.style.setProperty('--inputcase', 'none');
    }
  };


  seg_values: string[] = ['main', 'fillers', 'settings', 'autofill', 'start'];

  add_img(img_key, filename) {
    this.img_dict[img_key] = filename;
    this.image_names();
    this.img_dict[img_key + '_img'] = this.dataShare.stored_images[filename];
    this.display_thumbnail(img_key);
  }

  display_thumbnail(img_key) {
    let img = new Image;
    img.style.height = "9vw";
    img.id = img_key + '_img';
    img.src = this.img_dict[img.id];
    try {
      let img_elem = document.getElementById(img.id);
      img_elem.parentNode.removeChild(img_elem);
    } catch { }
    let element = document.getElementById(img_key);
    element.appendChild(img);
  }

  remove_img_el(parent_id) {
    if (this.img_dict[parent_id] !== undefined) {
      this.img_dict[parent_id] = '';
      this.image_names();
      let img_elem: HTMLImageElement = document.querySelector('#' + parent_id + '_img');
      img_elem.src = '';
      img_elem.parentNode.removeChild(img_elem);
      delete this.img_dict[parent_id];
      delete this.img_dict[parent_id + '_img'];
    }
  }

  image_names() {
    this.cit_items[0] = (this.img_dict.target === undefined) ? this.cit_items[0] : this.img_dict.target;
    this.cit_items[1] = (this.img_dict.probe1 === undefined) ? this.cit_items[1] : this.img_dict.probe1;
    this.cit_items[2] = (this.img_dict.probe2 === undefined) ? this.cit_items[2] : this.img_dict.probe2;
    this.cit_items[3] = (this.img_dict.probe3 === undefined) ? this.cit_items[3] : this.img_dict.probe3;
    this.cit_items[4] = (this.img_dict.probe4 === undefined) ? this.cit_items[4] : this.img_dict.probe4;
    this.cit_items[5] = (this.img_dict.probe5 === undefined) ? this.cit_items[5] : this.img_dict.probe5;
    this.targetref_words[0] = (this.img_dict.filler1 === undefined) ? this.targetref_words[0] : this.img_dict.filler1;
    this.targetref_words[1] = (this.img_dict.filler2 === undefined) ? this.targetref_words[1] : this.img_dict.filler2;
    this.targetref_words[2] = (this.img_dict.filler3 === undefined) ? this.targetref_words[2] : this.img_dict.filler3;
    this.nontargref_words[0] = (this.img_dict.filler4 === undefined) ? this.nontargref_words[0] : this.img_dict.filler4;
    this.nontargref_words[1] = (this.img_dict.filler5 === undefined) ? this.nontargref_words[1] : this.img_dict.filler5;
    this.nontargref_words[2] = (this.img_dict.filler6 === undefined) ? this.nontargref_words[2] : this.img_dict.filler6;
    this.nontargref_words[3] = (this.img_dict.filler7 === undefined) ? this.nontargref_words[3] : this.img_dict.filler7;
    this.nontargref_words[4] = (this.img_dict.filler8 === undefined) ? this.nontargref_words[4] : this.img_dict.filler8;
    this.nontargref_words[5] = (this.img_dict.filler9 === undefined) ? this.nontargref_words[5] : this.img_dict.filler9;
  }


  load_settings(loaded_data) {
    try {
      let data_dict = JSON.parse(loaded_data);
      this.citP.subj_id = data_dict.subject_id || this.citP.subj_id;
      this.citP.cit_type = data_dict.cit_version || this.citP.cit_type;
      this.citP.num_of_blocks = data_dict.num_of_blocks || this.citP.num_of_blocks;
      this.citP.response_timelimit_main = data_dict.timelimit || this.citP.response_timelimit_main;
      this.citP.isi_delay_minmax[0] = data_dict.isi_min || this.citP.isi_delay_minmax[0];
      this.citP.isi_delay_minmax[1] = data_dict.isi_max || this.citP.isi_delay_minmax[1];
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
      return ("Data loaded from database");
    } catch (e) {
      document.getElementById("storefeed_id").style.color = 'red';
      return ("Error: stored data is not in proper (JSON) format.");
    }
  };

  save_on_citstart: boolean = true;
  duplicates: string = '';
  initials() {
    let allitems = JSON.parse(JSON.stringify(this.cit_items.concat(this.targetref_words, this.nontargref_words)));
    allitems = allitems.filter(item => item !== null);
    let dupls = allitems.reduce((acc, v, i, arr) => arr.indexOf(v) !== i && acc.indexOf(v) === -1 ? acc.concat(v) : acc, [])
    dupls = dupls.filter(item => item !== '');
    if (dupls.length > 0) {
      this.duplicates = '"' + dupls.join('", "') + '"';
    } else {
      this.duplicates = '';
      if (!this.form_items.valid) {
        this.submit_failed = true;
        // for TESTING:
        console.log('testing');
        this.auto_img();
      } else {
        clearInterval(this.checknet);
        if (this.texttrans === true) {
          this.cit_items = this.cit_items.map(w => w.toUpperCase())
          this.targetref_words = this.targetref_words.map(w => w.toUpperCase())
          this.nontargref_words = this.nontargref_words.map(w => w.toUpperCase())
        }
        this.citP.cit_type = parseInt(this.citP.cit_type);
        this.citP.num_of_blocks = parseInt(this.citP.num_of_blocks);

        this.init_cit(99);
        if (this.on_device) {
          this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY);
        }
      }
    }
  }

  start_test() {
    this.citP.switch_divs('div_settings')
    if (this.on_device) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }
  }
  init_cit(chosen) {
    this.citP.consented = chosen;
    this.create_stim_base();
    this.to_img();
  }

  async to_img() {
    await Promise.all(this.citP.stim_base.map(async (dict) => {
      if (dict['imgurl'] !== null) {
        this.citP.task_images[dict['item']] = await this.imgurl(dict['imgurl']);
      }
      delete dict['imgurl'];
    }));
    await Promise.all(this.citP.targetrefs.map(async (dict) => {
      if (dict['imgurl'] !== null) {
        this.citP.task_images[dict['item']] = await this.imgurl(dict['imgurl']);
      }
      delete dict['imgurl'];
    }));
    await Promise.all(this.citP.nontargrefs.map(async (dict) => {
      if (dict['imgurl'] !== null) {
        this.citP.task_images[dict['item']] = await this.imgurl(dict['imgurl']);
      }
      delete dict['imgurl'];
    }));
    this.citP.set_block_texts();
    this.citP.task_start();
    this.citP.nextblock();
  }

  imgurl(base64) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.onload = () => resolve(img);
      img.src = base64;
    })
  }


  default_fillers() {
    Object.keys(this.img_dict).map((key) => {
      if (key.slice(0, 6) === 'filler') {
        this.remove_img_el(key);
      }
    });
    this.targetref_words = JSON.parse(JSON.stringify(this.trP.targetref_words_orig[this.trP.lang]));
    this.nontargref_words = JSON.parse(JSON.stringify(this.trP.nontargref_words_orig[this.trP.lang]));
  }
  default_core() {
    Object.keys(this.img_dict).map((key) => {
      if (key.slice(0, 6) === 'target' || key.slice(0, 5) === 'probe') {
        this.remove_img_el(key);
      }
    });
    this.cit_items.map((x, i) => this.cit_items[i] = '');
    this.citP.subj_id = '';
  }
  default_settings() {
    this.texttrans = true;
    this.citP.cit_type = 0;
    this.citP.num_of_blocks = 1;
    this.citP.isi_delay_minmax = [300, 700];
    this.citP.response_timelimit_main = 900;
    this.trP.lang = 'en';
    this.mails = '';
  }


  auto_img() {
    let feed;
    let added = [];
    if (Object.keys(this.dataShare.stored_images).length === 0) {
      feed = 'No images are loaded.'
    } else {
      let all_ids = ['target', 'probe1', 'probe2', 'probe3', 'probe4', 'probe5', 'filler1', 'filler2', 'filler3', 'filler4', 'filler5', 'filler6', 'filler7', 'filler8', 'filler9'];
      Object.keys(this.dataShare.stored_images).map((filename) => {
        all_ids.map((img_id) => {
          if (filename.includes(img_id)) {
            this.add_img(img_id, filename)
            added.push(filename);
          }
        });
      });
      if (added.length === 0) {
        feed = 'No image names match the item names.'
      } else {
        document.getElementById("imgfeed_id").style.color = 'green';
        feed = 'Images added. (' + added.length + ' images: ' + added.join(', ') + '.)';
      }
    }
    try {
      document.getElementById("imgfeed_id").innerHTML = feed;
      setTimeout(() => {
        document.getElementById("imgfeed_id").innerHTML = '';
      }, 3000);
    } catch { }
  }

  // item generation

  create_stim_base() {
    this.citP.blocknum = 1;
    this.citP.stim_base = [];
    this.citP.the_targets = [];
    this.citP.the_nontargs = [];
    this.citP.the_probes = [];
    this.citP.targetrefs = [];
    this.citP.nontargrefs = [];
    this.citP.task_images = {};
    this.citP.all_rts = {
      "probe1": [],
      "probe2": [],
      "probe3": [],
      "probe4": [],
      "probe5": [],
      "targetflr": [],
      "nontargflr": [],
      "target": []
    };
    var items_array = JSON.parse(JSON.stringify(this.cit_items));
    items_array.forEach((item, num) => {
      let tempdict: any = {
        'item': item,
        'cat': 'main'
      }
      if (0 === num) {
        tempdict.type = "target";
        if (Object.keys(this.img_dict).indexOf('target') !== -1) {
          tempdict.mode = 'image';
          tempdict.imgurl = this.img_dict['target_img'];
        } else {
          tempdict.mode = 'text';
          tempdict.imgurl = null;
        }
        this.citP.the_targets.push(tempdict);
      } else {
        tempdict.type = "probe" + num;
        if (Object.keys(this.img_dict).indexOf('probe' + num) !== -1) {
          tempdict.mode = 'image';
          tempdict.imgurl = this.img_dict["probe" + num + '_img'];
        } else {
          tempdict.mode = 'text';
          tempdict.imgurl = null;
        }
        this.citP.the_nontargs.push(tempdict);
      }
      if (!(this.citP.cit_type === 2 && tempdict.type === "target")) {
        this.citP.stim_base.push(tempdict);
      }
    });

    this.targetref_words.forEach((ref_item, num) => {
      let tempdict: any = {
        'item': ref_item,
        'type': 'targetflr' + num,
        'cat': 'filler'
      }
      if (Object.keys(this.img_dict).indexOf('filler' + (num + 1)) !== -1) {
        tempdict.mode = 'image';
        tempdict.imgurl = this.img_dict["filler" + (num + 1) + '_img'];
      } else {
        tempdict.mode = 'text';
        tempdict.imgurl = null;
      }
      this.citP.targetrefs.push(tempdict);
    });
    this.nontargref_words.forEach((ref_item, num) => {
      let tempdict: any = {
        'item': ref_item,
        'type': 'nontargflr' + num,
        'cat': 'filler'
      }
      if (Object.keys(this.img_dict).indexOf('filler' + (num + 4)) !== -1) {
        tempdict.mode = 'image';
        tempdict.imgurl = this.img_dict["filler" + (num + 4) + '_img'];
      } else {
        tempdict.mode = 'text';
        tempdict.imgurl = null;
      }
      this.citP.nontargrefs.push(tempdict);
    });
  }

  goto_slide(snum) {
    if (this.citP.current_menu === '') {
      this.slides.slideTo(snum);
    } else {
      this.initslide = snum;
      this.citP.current_menu = '';
    }
    this.citP.content.scrollToTop(0);
  }

  sethome() {
    this.citP.switch_divs('div_settings');
    this.citP.current_menu = 'm_testres';
    this.citP.current_segment = 'menus';
  }
}
