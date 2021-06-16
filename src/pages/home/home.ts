import { Component, ViewChild, ElementRef } from "@angular/core";
import { Slides, Content, AlertController } from 'ionic-angular';
import { NavController, NavParams } from "ionic-angular";
import { Network } from '@ionic-native/network';
import { EmailComposer } from "@ionic-native/email-composer";
import { Platform } from "ionic-angular";
import { FormBuilder } from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import { DataShareProvider } from '../../providers/data-share/data-share';
import { CitProvider } from '../../providers/cit/cit';
import { TranslationProvider } from '../../providers/translations/translations';
import { DomSanitizer } from '@angular/platform-browser';
import { Clipboard } from '@ionic-native/clipboard/';


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
      this.citP.image_width = Math.floor(window.innerHeight * 0.68);
      this.citP.canvas.nativeElement.width = this.citP.image_width;
      this.citP.canvas.nativeElement.height = this.citP.image_width;
      this.citP.ctx = this.citP.canvas.nativeElement.getContext('2d');
    }
  }

  /*
   to_exec: any = 'this.citP.';
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
    public http: HttpClient,
    public dataShare: DataShareProvider,
    public citP: CitProvider,
    public trP: TranslationProvider,
    protected _sanitizer: DomSanitizer,
    public navParams: NavParams,
    public alertCtrl: AlertController
  ) {
    this.citP.subj_id = this.citP.neat_date() + '_' + this.rchoice("CDFGHJKLMNPQRSTVWXYZ") +
      this.rchoice("AEIOU") + this.rchoice("CDFGHJKLMNPQRSTVWXYZ");
    this.dataShare.storage.get('reslts').then((cntent) => {
      if (cntent) { // && 1 < 0) {
        console.log(cntent);
        this.citP.cit_results = cntent;
        this.citP.switch_divs('div_results');
        this.citP.current_menu = 'm_testres';
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
        }
        this.dataShare.storage.get('rsltsent').then((cont_sent) => {
          // this.dataShare.storage.remove('rsltsent');
          if (cont_sent) {
            this.notsent = false;
            document.getElementById("storefeed_id").style.color = 'green';
            document.getElementById("storefeed_id").innerHTML = "Data successfully uploaded! All good.";
          }
        });
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
        if (this.notsent) {
          this.citP.screenOrientation.lock(this.citP.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
        }
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
    this.initials();
  }

  goto_menu(menu_name) {
    this.citP.current_menu = menu_name;
    this.citP.content.scrollToTop(0);
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
    }
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
  notsent: boolean = true;
  sendviaphp() {
    document.getElementById("storefeed_id").innerHTML = "Trying..."
    this.http.post('https://homepage.univie.ac.at/gaspar.lukacs/x_citapp/exp_storage.php', JSON.stringify({
      filename_post: this.citP.cit_results.file_name,
      results_post: this.citP.cit_results.cit_data
    }), { responseType: "text" }).subscribe((response) => {
      console.log(response);
      if (response.slice(0, 7) == 'written') {
        this.notsent = false;
        document.getElementById("storefeed_id").style.color = 'green';
        document.getElementById("storefeed_id").innerHTML = "Data successfully uploaded! You completed the experiment and may close this app.";
        this.dataShare.storage.set('rsltsent', 'done');
        this.citP.backgroundMode.setDefaults({
          silent: true
        })
      } else {
        document.getElementById("storefeed_id").innerHTML = 'Error. ' + response;
      }
    },
      err => {
        console.log('Request failed: ', err);
        document.getElementById("storefeed_id").innerHTML = 'Could not connect to server. ' + err.message;
      });
  }

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
    this.targetref_words = this.targetref_words.map(w => w.toUpperCase())
    this.nontargref_words = this.nontargref_words.map(w => w.toUpperCase())
    this.citP.consented = 99;
    this.create_stim_base();
  }


  cit_start() {
    if (this.on_device) {
      this.citP.screenOrientation.lock(this.citP.screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY);
    }
    this.citP.task_start();
  }

  // item generation

  words_lists: any[] = [
    [], [], [], [],
    [], [], [], []
  ];

  scale_famil: string[] = ['1 - Not at all familiar', '2 - Vaguely familiar', '3 - Rather familiar', '4 - Familiar', '5 - Very familiar'];

  qs_list: any[] = [
    ['At the moment I feel alert.'],
    ['I was very focused on the task.'],
    ['I felt very alert before the experiment.'],
    ['It was easy for me to stay focused during the experiment.'],
    ['I found this task difficult.'],
    ['I am confident I achieved the task successfully.'],
    ['I put a lot of effort into this task.'],
    ['I was motivated to complete this task successfully.'],
    ['There were no distractions around me during the experiment.'],
    ['My surrounding was noisy during the experiment.'],
    ['I am certain that I got "caught" having recognised some of the famous identities.'],
    ['I am generally more honest than other people.'],
    ['I would guess that this lie detection method is generally highly accurate.'],
    ['In everyday life, I lie easily if I have to.']
  ];

  tapnum: number = 0;
  tapcount() {
    if (this.tapnum < 3) {
      this.tapnum++;
    } else {
      this.citP.misc_ratings[14] = "9"
    }
  }

  async create_stim_base() {
    let probs = [];
    let targs = [];
    let conts = [];
    let setnumlist = this.citP.shuff([1, 2, 3, 4, 5, 6, 7, 8]);
    let setmodal = '';
    let twomods = this.citP.shuff(['img', 'txt']);
    setnumlist.forEach(function(setno, indx) {
      if (indx > 3) {
        setmodal = twomods[0];
      } else {
        setmodal = twomods[1];
      }
      probs.push('s' + setno + '_probe_' + setmodal + '.jpg');
      let irrnumlist = this.citP.shuff([1, 2, 3, 4, 5]);
      targs.push('s' + setno + '_irr_' + setmodal + irrnumlist.shift() + '.jpg');
      irrnumlist.forEach(function(irrno) {
        conts.push('s' + setno + '_irr_' + setmodal + irrno + '.jpg');
      });
    }.bind(this));

    const allimgs = JSON.parse(JSON.stringify(probs.concat(conts).concat(targs).concat(
      this.targetref_words).concat(this.nontargref_words)));

    let item_bases = [];
    probs.forEach((probe, index) => {
      let finals = [probe, targs.shift()].concat(conts.splice(0, 4));
      item_bases.push(finals);
    });

    this.citP.the_probes = probs;
    console.log("! item_bases:");
    console.log(item_bases);

    this.citP.task_images = {};
    await Promise.all(allimgs.map(async (imgname) => {
      this.citP.task_images[imgname] = await this.imgurl('../../assets/' + imgname);
    }));

    this.citP.blocknum = 1;
    this.citP.stim_bases = [
      [], [], [], [],
      [], [], [], []
    ];
    this.citP.the_targets = [
      [], [], [], [],
      [], [], [], []
    ];
    this.citP.the_nontargs = [
      [], [], [], [],
      [], [], [], []
    ];
    this.citP.targetrefs = [];
    this.citP.nontargrefs = [];
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
        tempdict.mode = 'image';
        tempdict.imgurl = null;
        if (0 === indx) {
          tempdict.type = "probe1";
          this.citP.the_nontargs[num].push(tempdict);
          this.words_lists[num].push(item);
        } else if (1 === indx) {
          tempdict.type = "target";
          this.citP.the_targets[num].push(tempdict);
        } else {
          tempdict.type = "probe" + indx;
          this.citP.the_nontargs[num].push(tempdict);
          this.words_lists[num].push(item);
        }
        this.citP.stim_bases[num].push(JSON.parse(JSON.stringify(tempdict)));
      });
      this.words_lists[num] = this.words_lists[num].sort();
    });
    console.log('stim_bases');
    console.log(JSON.parse(JSON.stringify(this.citP.stim_bases)));

    this.targetref_words.forEach((ref_item, num) => {
      let tempdict: any = {
        'item': ref_item,
        'type': 'targetflr' + num,
        'cat': 'filler'
      }
      tempdict.mode = 'image';
      tempdict.imgurl = null;
      this.citP.targetrefs.push(tempdict);
    });
    this.nontargref_words.forEach((ref_item, num) => {
      let tempdict: any = {
        'item': ref_item,
        'type': 'nontargflr' + num,
        'cat': 'filler'
      }
      tempdict.mode = 'image';
      tempdict.imgurl = null;
      this.citP.nontargrefs.push(tempdict);
    });

    this.to_img();
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
    this.citP.switch_divs('div_results');
    this.citP.current_menu = 'm_testres';
    this.citP.current_segment = 'menus';
  }


  async to_img() {
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
  }

  // load image from source URL
  imgurl(base64) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.onload = () => resolve(img);
      img.src = base64;
    })
  }
}
