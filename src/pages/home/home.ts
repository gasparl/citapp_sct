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
      } else {
        this.citP.subj_id = this.citP.neat_date() +
          "_" +
          this.rchoice("CDFGHJKLMNPQRSTVWXYZ") +
          this.rchoice("AEIOU") +
          this.rchoice("CDFGHJKLMNPQRSTVWXYZ");
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

  rchoice(array) {
    return array[Math.floor(array.length * Math.random())];
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


  save_on_citstart: boolean = true;
  duplicates: string = '';
  initials() {
    clearInterval(this.checknet);
    this.targetref_words = this.targetref_words.map(w => w.toUpperCase())
    this.nontargref_words = this.nontargref_words.map(w => w.toUpperCase())
    this.init_cit(99);
    if (this.on_device) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY);
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
    this.citP.set_block_texts();
    this.citP.task_start();
    this.citP.nextblock();
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

  prep_items() {
    this.dataShare.checkboxed.forEach(word => {
      let ind = this.dataShare.the_items.meaningful.indexOf(word);
      if (ind !== -1) {
        this.dataShare.the_items.meaningful.push(this.dataShare.the_items.meaningful.splice(ind, 1)[0]);
      }
    })
    this.citP.the_probes = this.dataShare.the_items.meaningful.splice(0, 4);
    this.citP.the_targets = this.dataShare.the_items.meaningful;

    this.dataShare.the_items.pseudo = this.dataShare.the_items.pseudo.filter((el) => {
      return this.dataShare.checkboxed.indexOf(el) < 0;
    });
  }

  prune() {
    //given the probe and target (in each of the categories), selects the 4 irrelevants. None with same starting letter, and with length closest possible to the probe.
    let items_base_temp = [];
    this.citP.the_probes.forEach((probe, index) => {

      let t_container = JSON.parse(JSON.stringify(this.citP.the_targets));
      let icontainer = JSON.parse(JSON.stringify(this.dataShare.the_items.pseudo));
      let finals = [probe];

      // add closest target, then closest irrs

      t_container = t_container.filter((n) => {
        // filter if same starting character
        return probe[0] != n[0];
      });

      let maxdif = 0, temps;
      while (finals.length < 2 && maxdif < 99) {
        temps = t_container.filter(function(n) {
          return Math.abs(probe.length - n.length) <= maxdif;
        });
        if (temps.length > 0) {
          finals.push(temps[0]); // nonrandom!
          t_container = t_container.filter(function(n) {
            return finals[finals.length - 1][0] !== n[0];
          });
        } else {
          maxdif++;
        }
      }
      maxdif = 0;
      while (finals.length < 6 && maxdif < 99) {
        temps = icontainer.filter(function(n) {
          return Math.abs(probe.length - n.length) <= maxdif;
        });
        if (temps.length > 0) {
          finals.push(temps[0]); // nonrandom!
          icontainer = icontainer.filter(function(n) {
            return finals[finals.length - 1][0] !== n[0];
          });
        } else {
          maxdif++;
        }
      }

      this.citP.the_targets = this.citP.the_targets.filter((el) => {
        return finals.indexOf(el) < 0;
      });
      this.dataShare.the_items.pseudo = this.dataShare.the_items.pseudo.filter((el) => {
        return finals.indexOf(el) < 0;
      });

      items_base_temp.push(finals);
    });
    console.log("! items_base_temp:");
    console.log(items_base_temp);
    return items_base_temp;
  }

  create_stim_base() {
    this.prep_items();
    let item_bases = this.prune();
    this.citP.blocknum = 1;
    this.citP.stim_bases = [[], [], [], []];
    this.citP.the_targets = [[], [], [], []];
    this.citP.the_nontargs = [[], [], [], []];
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
    item_bases.forEach((itemlist, num) => {
      itemlist.forEach((item, indx) => {
        let tempdict: any = {
          'item': item,
          'cat': 'main'
        }
        if (0 === indx) {
          tempdict.type = "probe1";
          tempdict.mode = 'text';
          tempdict.imgurl = null;
          this.citP.the_nontargs[num].push(tempdict);
        } else if (1 === indx) {
          tempdict.type = "target";
          tempdict.mode = 'text';
          tempdict.imgurl = null;
          this.citP.the_targets[num].push(tempdict);
        } else {
          tempdict.type = "probe" + num;
          this.citP.the_nontargs[num].push(tempdict);
        }
        tempdict.mode = 'text';
        tempdict.imgurl = null;

        this.citP.stim_bases[num].push(JSON.parse(JSON.stringify(tempdict)));
      });
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
