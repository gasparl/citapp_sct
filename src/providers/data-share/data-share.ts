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


}
