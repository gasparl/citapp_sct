import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";

@Injectable()
export class DataShareProvider {
  stored_images: any = {};
  the_items: any = {};
  allpossiblewords: any[] = [];
  checkboxed: any[] = [];

  constructor(public storage: Storage) {
    this.the_items = this.german_items;
    this.allpossiblewords = this.the_items.meaningful.concat(this.the_items.pseudo).sort();
  }

  chb_change(ev, item) {
    if (ev.checked) {
      this.checkboxed.push(item);
    } else {
      this.checkboxed = this.checkboxed.filter(it => it !== item);
    }
  }

  german_items = {
    'meaningful': ["vertraut", "bedeutsam", "bekannt", "verstanden", "wahrhaft", "vorhanden", "sinnvoll", "richtig", "gewusst", "geläufig"], //  "denkbar", "tatsächlich", "glaubhaft"
    'pseudo': ["rützte", "girter", "zonsig", "fensch", "schwapf", "schlink", "kraubig", "behlsam", "hokisch", "noberal", "kriesam", "besärzt", "fosisch", "brirsam", "lathaft", "breuzig", "greibig", "glätisch", "weugvoll", "redengig", "gachligt", "verkemst", "pauflich", "heiglich", "wieflich", "schlinst", "plaucklos", "staumisch", "stürsisch", "kreibisch", "tintzlich", "brunenlos", "bänelich", "schriemrig", "klotselig", "gelörnsam"]
  };

  lextale_intro_en =
    'This test consists of about 60 trials, in each of which you will see a string of letters. Your task is to decide whether this is an existing English word or not.  If you think it is an existing English word, you touch the "yes" button, and if you think it is not an existing English word, you touch the "no" button.<br/><br/>If you are sure that the word exists, even though you don’t know its exact meaning, you may still respond "yes". But if you are not sure if it is an existing word, you should respond "no".<br/><br/>In this experiment, we use British English rather than American English spelling. For example: "realise" instead of "realize"; "colour" instead of "color", and so on. Please don’t let this confuse you. This experiment is not about detecting such subtle spelling differences anyway.' +
    '<br/><br/>You have as much time as you like for each decision. This part of the experiment will take about 5 minutes.<br/><br/>If everything is clear, you can now start the experiment.';

  lextale_instructions_de =
    'Dieser Test besteht aus ungefähr 60 Durchgängen, in denen Sie jeweils eine Buchstabenreihe sehen. Ihre Aufgabe ist es, zu entscheiden, ob diese Buchstabenreihe ein existierendes deutsches Wort ist oder nicht. Falls sie glauben, dass es ein deutsches Wort ist, klicken Sie auf "ja", andernfalls auf "nein". \n\nSollten Sie sich sicher sein, dass ein Wort existiert, aber seine Bedeutung nicht kennen, können Sie trotzdem mit "ja" antworten. Sind Sie sich aber unsicher, ob das Wort überhaupt im Deutschen existiert, sollten Sie mit "nein" antworten. \n\nSie haben so viel Zeit wie Sie möchten für jede Antwort. Der Test dauert etwa 5 Minuten. \n\nWenn Sie bereit sind, können Sie selbst das Experiment starten.';

  lextale_items_en = [{ 'word': 'platery', 'wstatus': 0, 'dummy': 1 },
  { 'word': 'denial', 'wstatus': 1, 'dummy': 1 },
  { 'word': 'generic', 'wstatus': 1, 'dummy': 1 },
  { 'word': 'mensible', 'wstatus': 0, 'dummy': 0 },
  { 'word': 'scornful', 'wstatus': 1, 'dummy': 0 },
  { 'word': 'stoutly', 'wstatus': 1, 'dummy': 0 },
  { 'word': 'ablaze', 'wstatus': 1, 'dummy': 0 },
  { 'word': 'kermshaw', 'wstatus': 0, 'dummy': 0 },
  { 'word': 'moonlit', 'wstatus': 1, 'dummy': 0 },
  { 'word': 'lofty', 'wstatus': 1, 'dummy': 0 },
  { 'word': 'hurricane', 'wstatus': 1, 'dummy': 0 },
  { 'word': 'flaw', 'wstatus': 1, 'dummy': 0 },
  { 'word': 'alberation', 'wstatus': 0, 'dummy': 0 },
  { 'word': 'unkempt', 'wstatus': 1, 'dummy': 0 },
  { 'word': 'breeding', 'wstatus': 1, 'dummy': 0 },
  { 'word': 'festivity', 'wstatus': 1, 'dummy': 0 },
  { 'word': 'screech', 'wstatus': 1, 'dummy': 0 },
  { 'word': 'savoury', 'wstatus': 1, 'dummy': 0 },
  { 'word': 'plaudate', 'wstatus': 0, 'dummy': 0 },
  { 'word': 'shin', 'wstatus': 1, 'dummy': 0 },
  { 'word': 'fluid', 'wstatus': 1, 'dummy': 0 },
  { 'word': 'spaunch', 'wstatus': 0, 'dummy': 0 },
  { 'word': 'allied', 'wstatus': 1, 'dummy': 0 },
  { 'word': 'slain', 'wstatus': 1, 'dummy': 0 },
  { 'word': 'recipient', 'wstatus': 1, 'dummy': 0 },
  { 'word': 'exprate', 'wstatus': 0, 'dummy': 0 },
  { 'word': 'eloquence', 'wstatus': 1, 'dummy': 0 },
  { 'word': 'cleanliness', 'wstatus': 1, 'dummy': 0 },
  { 'word': 'dispatch', 'wstatus': 1, 'dummy': 0 },
  { 'word': 'rebondicate', 'wstatus': 0, 'dummy': 0 },
  { 'word': 'ingenious', 'wstatus': 1, 'dummy': 0 },
  { 'word': 'bewitch', 'wstatus': 1, 'dummy': 0 },
  { 'word': 'skave', 'wstatus': 0, 'dummy': 0 },
  { 'word': 'plaintively', 'wstatus': 1, 'dummy': 0 },
  { 'word': 'kilp', 'wstatus': 0, 'dummy': 0 },
  { 'word': 'interfate', 'wstatus': 0, 'dummy': 0 },
  { 'word': 'hasty', 'wstatus': 1, 'dummy': 0 },
  { 'word': 'lengthy', 'wstatus': 1, 'dummy': 0 },
  { 'word': 'fray', 'wstatus': 1, 'dummy': 0 },
  { 'word': 'crumper', 'wstatus': 0, 'dummy': 0 },
  { 'word': 'upkeep', 'wstatus': 1, 'dummy': 0 },
  { 'word': 'majestic', 'wstatus': 1, 'dummy': 0 },
  { 'word': 'magrity', 'wstatus': 0, 'dummy': 0 },
  { 'word': 'nourishment', 'wstatus': 1, 'dummy': 0 },
  { 'word': 'abergy', 'wstatus': 0, 'dummy': 0 },
  { 'word': 'proom', 'wstatus': 0, 'dummy': 0 },
  { 'word': 'turmoil', 'wstatus': 1, 'dummy': 0 },
  { 'word': 'carbohydrate', 'wstatus': 1, 'dummy': 0 },
  { 'word': 'scholar', 'wstatus': 1, 'dummy': 0 },
  { 'word': 'turtle', 'wstatus': 1, 'dummy': 0 },
  { 'word': 'fellick', 'wstatus': 0, 'dummy': 0 },
  { 'word': 'destription', 'wstatus': 0, 'dummy': 0 },
  { 'word': 'cylinder', 'wstatus': 1, 'dummy': 0 },
  { 'word': 'censorship', 'wstatus': 1, 'dummy': 0 },
  { 'word': 'celestial', 'wstatus': 1, 'dummy': 0 },
  { 'word': 'rascal', 'wstatus': 1, 'dummy': 0 },
  { 'word': 'purrage', 'wstatus': 0, 'dummy': 0 },
  { 'word': 'pulsh', 'wstatus': 0, 'dummy': 0 },
  { 'word': 'muddy', 'wstatus': 1, 'dummy': 0 },
  { 'word': 'quirty', 'wstatus': 0, 'dummy': 0 },
  { 'word': 'pudour', 'wstatus': 0, 'dummy': 0 },
  { 'word': 'listless', 'wstatus': 1, 'dummy': 0 },
  { 'word': 'wrought', 'wstatus': 1, 'dummy': 0 }];


  lextale_items_de = [{
    'word': "WOLLE",
    'wstatus': 1,
    'dummy': 1
  },
  {
    'word': "TERMITÄT",
    'wstatus': 0,
    'dummy': 1
  },
  {
    'word': "ENORM",
    'wstatus': 1,
    'dummy': 1
  },
  {
    'word': "WELSTBAR",
    'wstatus': 0,
    'dummy': 0
  },
  {
    'word': "REUEVOLL",
    'wstatus': 1,
    'dummy': 0
  },
  {
    'word': "ZUOBERST",
    'wstatus': 1,
    'dummy': 0
  },
  {
    'word': "RUPPIG",
    'wstatus': 1,
    'dummy': 0
  },
  {
    'word': "PETURAT",
    'wstatus': 0,
    'dummy': 0
  },
  {
    'word': "KLAGLOS",
    'wstatus': 1,
    'dummy': 0
  },
  {
    'word': "ZUGIG",
    'wstatus': 1,
    'dummy': 0
  },
  {
    'word': "TURBULENZ",
    'wstatus': 1,
    'dummy': 0
  },
  {
    'word': "ZEHE",
    'wstatus': 1,
    'dummy': 0
  },
  {
    'word': "DEGERATION",
    'wstatus': 0,
    'dummy': 0
  },
  {
    'word': "UNTIEF",
    'wstatus': 1,
    'dummy': 0
  },
  {
    'word': "ZÜCHTUNG",
    'wstatus': 1,
    'dummy': 0
  },
  {
    'word': "PENSIONAT",
    'wstatus': 1,
    'dummy': 0
  },
  {
    'word': "ZAPFEN",
    'wstatus': 1,
    'dummy': 0
  },
  {
    'word': "STAKSIG",
    'wstatus': 1,
    'dummy': 0
  },
  {
    'word': "STALMEN",
    'wstatus': 0,
    'dummy': 0
  },
  {
    'word': "MALZ",
    'wstatus': 1,
    'dummy': 0
  },
  {
    'word': "FEIGE",
    'wstatus': 1,
    'dummy': 0
  },
  {
    'word': "FÜRREN",
    'wstatus': 0,
    'dummy': 0
  },
  {
    'word': "RASEND",
    'wstatus': 1,
    'dummy': 0
  },
  {
    'word': "FEIST",
    'wstatus': 1,
    'dummy': 0
  },
  {
    'word': "KLEMPNER",
    'wstatus': 1,
    'dummy': 0
  },
  {
    'word': "AUSREBEN",
    'wstatus': 0,
    'dummy': 0
  },
  {
    'word': "KANNIBALE",
    'wstatus': 1,
    'dummy': 0
  },
  {
    'word': "SCHWACHHEIT",
    'wstatus': 1,
    'dummy': 0
  },
  {
    'word': "ERBARMEN",
    'wstatus': 1,
    'dummy': 0
  },
  {
    'word': "VERMASTIGEN",
    'wstatus': 0,
    'dummy': 0
  },
  {
    'word': "SUBVERSIV",
    'wstatus': 1,
    'dummy': 0
  },
  {
    'word': "SATTELN",
    'wstatus': 1,
    'dummy': 0
  },
  {
    'word': "PLANG",
    'wstatus': 0,
    'dummy': 0
  },
  {
    'word': "EIMERWEISE",
    'wstatus': 1,
    'dummy': 0
  },
  {
    'word': "SCHEIL",
    'wstatus': 0,
    'dummy': 0
  },
  {
    'word': "STOCKFEST",
    'wstatus': 0,
    'dummy': 0
  },
  {
    'word': "MEHLIG",
    'wstatus': 1,
    'dummy': 0
  },
  {
    'word': "DÄMMRIG",
    'wstatus': 1,
    'dummy': 0
  },
  {
    'word': "GAREN",
    'wstatus': 1,
    'dummy': 0
  },
  {
    'word': "TRACHTER",
    'wstatus': 0,
    'dummy': 0
  },
  {
    'word': "ANPROBE",
    'wstatus': 1,
    'dummy': 0
  },
  {
    'word': "MONSTRÖS",
    'wstatus': 1,
    'dummy': 0
  },
  {
    'word': "SONITÄT",
    'wstatus': 0,
    'dummy': 0
  },
  {
    'word': "SPEICHERUNG",
    'wstatus': 1,
    'dummy': 0
  },
  {
    'word': "MALODIE",
    'wstatus': 0,
    'dummy': 0
  },
  {
    'word': "NARKE",
    'wstatus': 0,
    'dummy': 0
  },
  {
    'word': "STRÄHNE",
    'wstatus': 1,
    'dummy': 0
  },
  {
    'word': "DESTILLATION",
    'wstatus': 1,
    'dummy': 0
  },
  {
    'word': "LEUCHTE",
    'wstatus': 1,
    'dummy': 0
  },
  {
    'word': "FLINTE",
    'wstatus': 1,
    'dummy': 0
  },
  {
    'word': "MACKEL",
    'wstatus': 0,
    'dummy': 0
  },
  {
    'word': "ENTSACHTUNG",
    'wstatus': 0,
    'dummy': 0
  },
  {
    'word': "GEOGRAPH",
    'wstatus': 1,
    'dummy': 0
  },
  {
    'word': "SUMMIERUNG",
    'wstatus': 1,
    'dummy': 0
  },
  {
    'word': "WAGHALSIG",
    'wstatus': 1,
    'dummy': 0
  },
  {
    'word': "ZIERDE",
    'wstatus': 1,
    'dummy': 0
  },
  {
    'word': "FAUNIK",
    'wstatus': 0,
    'dummy': 0
  },
  {
    'word': "LUDAL",
    'wstatus': 0,
    'dummy': 0
  },
  {
    'word': "KLAMM",
    'wstatus': 1,
    'dummy': 0
  },
  {
    'word': "DRAUNIG",
    'wstatus': 0,
    'dummy': 0
  },
  {
    'word': "FLISTOR",
    'wstatus': 0,
    'dummy': 0
  },
  {
    'word': "UNSTETIG",
    'wstatus': 1,
    'dummy': 0
  },
  {
    'word': "HERZIG",
    'wstatus': 1,
    'dummy': 0
  }
  ];
}
