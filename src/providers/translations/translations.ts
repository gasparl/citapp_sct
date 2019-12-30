import { Injectable } from '@angular/core';

@Injectable()
export class TranslationProvider {
  lang: string = 'en';
  lg_keys: string[];
  constructor() {
    this.lg_keys = Object.keys(this.lgs);
  }

  lgs: object = {
    'en': 'English',
    'cn': '中文',
    'de': 'Deutsch',
    'hu': 'Magyar',
    'jp': '日本語',
    'pl': 'Polski'
  };

  targetref_words_orig: object = {
    'en': ["FAMILIAR", "MINE", "RECOGNIZED"],
    'cn': '中文',
    'de': 'Deutsch',
    'hu': ["FELISMERT", "RELEVÁNS", "LÉNYEGES"],
    'jp': '日本語',
    'pl': 'Polski'
  };
  nontargref_words_orig: object = {
    'en': ["FOREIGN", "IRRELEVANT", "OTHER", "RANDOM", "THEIRS", "UNFAMILIAR"],
    'cn': '中文',
    'de': 'Deutsch',
    'hu': ["MELLÉKES", "LÉNYEGTELEN", "EGYÉB", "RANDOM", "MÁS", "KÖZÖMBÖS"],
    'jp': '日本語',
    'pl': 'Polski'
  };

  consent: object = {
    'en': 'With your permission, the data from the following test may be used and published for research purposes. The data will not reveal who you are, you will not be named and your identity will remain strictly confidential.',
    'cn': '中文',
    'de': 'Deutsch',
    'hu': 'Ha engedélyezed, a következő teszt adatai felhasználhatók és közzétehetők lesznek kutatási célokra. Az adatok névtelenek és nem tartalmaznak a kilétedre vezető információt. A személyazonosságod szigorúan bizalmas marad.',
    'jp': '日本語',
    'pl': 'Polski'
  };
  // "item", in case of no clear equivalent, can also be translated as "elements to be shown" or "stimuli to be shown" or similar
  consentitems_chosen: object = {
    'en': 'You also have the choice to give permission to share the data, but keep the main items (specific words or pictures) presented during the test confidential.',
    'cn': '中文',
    'de': 'Deutsch',
    'hu': 'Választhatod azt is, hogy engedélyt ad az adatok megosztására, de a teszt során bemutatott fő elemek (konkrét szavak vagy képek) nélkül.',
    'jp': '日本語',
    'pl': 'Polski'
  };
  consentitems_conf: object = {
    'en': 'A teszt során bemutatott fő elemek (konkrét szavak vagy képek) nem lesznek közzétéve.',
    'cn': '中文',
    'de': 'Deutsch',
    'hu': 'Magyar',
    'jp': '日本語',
    'pl': 'Polski'
  };
  consent_q: object = {
    'en': 'Do you give permission to share the data?',
    'cn': '中文',
    'de': 'Deutsch',
    'hu': 'Engedélyt adsz az adatok megosztására?',
    'jp': '日本語',
    'pl': 'Polski'
  };

  consent_a: object = {
    'en': ['Yes', 'Yes, but without items', 'No'],
    'cn': '中文',
    'de': 'Deutsch',
    'hu': ['Igen', 'Igen, de bemutatott elemek nélkül', 'Nem'],
    'jp': '日本語',
    'pl': 'Polski'
  };

  start: object = {
    'en': 'Start',
    'cn': '中文',
    'de': 'Deutsch',
    'hu': 'Start',
    'jp': '日本語',
    'pl': 'Polski'
  };

  show_inst: object = {
    'en': 'show instructions again',
    'cn': '中文',
    'de': 'Deutsch',
    'hu': 'utasítások újramegjelenítése',
    'jp': '日本語',
    'pl': 'Polski'
  };


  taptostart: object = {
    'en': 'TAP HERE TO START',
    'cn': '中文',
    'de': 'Deutsch',
    'hu': 'TESZT INDÍTÁSA',
    'jp': '日本語',
    'pl': 'Polski'
  };

  feedtooslo: object = {
    'en': "Too slow!",
    'cn': '中文',
    'de': 'Zu langsam!',
    'hu': 'Túl lassú!',
    'jp': '日本語',
    'pl': 'Polski'
  };
  feedwrong: object = {
    'en': "Wrong!",
    'cn': '中文',
    'de': "Falsch!",
    'hu': 'Hibás!',
    'jp': '日本語',
    'pl': 'Polski'
  };

  it_type_feed_dict: object = {
    'en': {
      targetflr: "right-side secondary items",
      nontargflr: "left-side secondary items",
      main_item: "main items [left side]",
      target: "target item [right side]"
    },
    'cn': '中文',
    'de': 'Deutsch',
    'hu': {
      targetflr: "jobb-oldali másodlagos elemek",
      nontargflr: "bal-oldali másodlagos elemek",
      main_item: "fő elemek [bal-oldal]",
      target: "cél elem [jobb-oldal]"
    },
    'jp': '日本語',
    'pl': 'Polski'
  };

  correct: object = {
    'en': "% correct",
    'cn': '中文',
    'de': '% korrekt',
    'hu': '% helyes',
    'jp': '日本語',
    'pl': 'Polski'
  };
  accrep_feed: object = {
    'en': 'You will have to repeat this practice round due to a wrong response (or too much waiting).',
    'cn': '中文',
    'de': 'Deutsch',
    'hu': 'Meg kell ismételned ezt a gyakorló feladatot egy hibás válasz (vagy túl hosszú várakozás) miatt.',
    'jp': '日本語',
    'pl': 'Polski'
  };
  acc_feed: object = {
    'en': ['You will have to repeat this practice round, because of too few correct responses.</b><br><br>You need at least ', "% accuracy on each item category, but you did not have enough correct responses for the following one(s):"],
    'cn': '中文',
    'de': 'Deutsch',
    'hu': ['Meg kell ismételned ezt a gyakorló feldatatot, mivel túl kevés helyes választ adtál.</b><br><br>Legalább ', "% pontosság szükséges minden elem kategóriában, de nem adtál elég helyes választ a következő kategóriá(k)ban:"],
    'jp': '日本語',
    'pl': 'Polski'
  };

  cit_completed: object = {
    'en': 'Test completed',
    'cn': '中文',
    'de': 'Deutsch',
    'hu': 'A teszt véget ért.',
    'jp': '日本語',
    'pl': 'Polski'
  };

  blck_texts: any = {
    'en': (targs, nontargs, trefs, nontrefs, cittype) => {
      let numprac: string;
      let thetexts: string[] = [''];
      if (cittype == 0) {
        numprac = 'three';
      } else {
        numprac = 'two';
      }
      let intro = 'During the test, various items will appear in the middle of the screen. There will be two buttons displayed on the screen: one on the left side and one on the right side. You have to categorize each item by touching the left button or the right button. '; // In English it seems unnecessary, but in other languages, it is often better to clarify that the items appear "one by one". It may also be worthwhile to somehow make it clearer that the "buttons" are just touchscreen surfaces.
      let intro_end = 'There will be ' + numprac + ' short practice rounds.';
      let inducers_instructions =
        '</br></br>Touch the <i>right</i> button when you see any of the following items:<br>' + trefs + 'Touch the <i>left</i> button when you see any other item. These other items are:<br>' + nontrefs;
      let main_instruction = 'Touch the <i>right</i> button when you see the following target item:<br>' +
        targs +
        'Touch the <i>left</i> button when you see any other item. These other items are:<br>' +
        nontargs +
        'In this practice round, you will have a lot of time to choose each response, but <b>you must respond to each item correctly</b>. If you choose an incorrect response (or not give response for over 10 seconds), you will have to repeat the practice round. ';
      // 0: fillers & target, 1: standard CIT, 2: fillers (no target)
      if (cittype !== 1) {
        thetexts.push(
          '<span id="feedback_id1">' + intro + intro_end + '</br></br>In the first practice round, you have to categorize two kinds of items. ' + inducers_instructions +
          'There is a certain time limit for making each response. Please try to be both fast and accurate. In each category, you need at least 80% correct responses in time, otherwise you have to repeat the practice round.</span>');
        if (cittype === 0) {
          thetexts.push("<span id='feedback_id2'>In the second practice round, you have to categorize the main test items. The aim of the entire test will be to show whether or not one of these main items is recognized by you. " + main_instruction + '</span>');
          let ittypes = [this.it_type_feed_dict['en'].nontargflr, this.it_type_feed_dict['en'].targetflr,
          this.it_type_feed_dict['en'].main_item,
          this.it_type_feed_dict['en'].target].join(', ');
          thetexts.push(
            "<span id='feedback_id3'>In the third and last practice round all items are present (" + ittypes + "). You again have to respond fast, but a certain number of errors is allowed. The task is the same. Touch the <i>right</i> button when you see the following items: " + targs.replace('<br>', '') + trefs + "Touch the <i>left</i> button for everything else.</span>");
        } else {
          thetexts.push('<span id="feedback_id2">In the second and last practice round, you also have to categorize the main test items. The aim of the entire test will be to show whether or not one of these main items is recognized by you. These are: ' + nontargs + 'These all have to be categorized by touching the <i>left</i> button. You again need at least 80% accuracy for the previous item categories (left-side and right-side secondary items), as well as for this new category (main items).</span>');
          targs = '';
        }
        thetexts.push(
          "Now the actual test begins. The task is the same. Touch the <i>right</i> button when you see the following items: " + targs.replace('<br>', '') + trefs + "Touch the <i>left</i> button for everything else.<br><br>Try to be both accurate and fast.");
      } else {
        trefs = '';
        thetexts.push(intro + main_instruction + intro_end);
        thetexts.push("<span id='feedback_id2'>Now, in this second and last practice round, you have to respond fast, but a certain rate of error is allowed. The task is the same. Touch the <i>right</i> button when you see the following item: " + targs + "Touch the <i>left</i> button for everything else.</span>");
        thetexts.push(
          "Now the actual test begins. The task is the same. Touch the <i>right</i> button when you see the following item: " + targs + "Touch the <i>left</i> button for everything else.<br><br>Try to be both accurate and fast.");
      }
      return thetexts;
    },
    'cn': '中文',
    'de': 'Deutsch',
    'hu': (targs, nontargs, trefs, nontrefs, cittype) => {
      let numprac: string;
      let thetexts: string[] = [''];
      if (cittype == 0) {
        numprac = 'három';
      } else {
        numprac = 'két';
      }
      let intro = 'A teszt során különféle elemek ("stimulusok", akár szöveg akár kép) jelennek meg egyesével a képernyő közepén. Két érintőgomb lesz látható az érintőképernyőn: egy baloldalt, és egy jobboldalt. Az bal oldali vagy a jobb oldali gomb megérintésével kell kategorizálni minden elemet. ';
      let intro_end = 'Először ' + numprac + ' rövid gyakorló feladat jön.';
      let inducers_instructions =
        '</br></br>Válaszd a <i>jobb oldali</i> gombot ha a következő elemek bármelyike jelenik meg:<br>' + trefs + 'Válaszd a <i>bal oldali</i> gombot ha bármely más elem jelenik meg. Ezek az elemek:<br>' + nontrefs;
      let main_instruction = 'Válaszd a <i>jobb oldali</i> gombot ha az alábbi "cél" elem jelenik meg:<br>' +
        targs +
        'Válaszd a <i>bal oldali</i> gombot ha bármely más elem jelenik meg. Ezek az elemek:<br>' +
        nontargs +
        'A következő gyakorló feladatban sok időd van kiválasztani a helyes érintőgombot, de <b>minden elemre helyes választ kell adnod</b>. Ha hibás választ adsz (vagy nem adsz választ több mint 10 másodpercig), meg kell ismételned ezt a gyakorló feladatot. ';
      // 0: fillers & target, 1: standard CIT, 2: fillers (no target)
      if (cittype !== 1) {
        thetexts.push(
          '<span id="feedback_id1">' + intro + intro_end + '</br></br>Az első gyakorló feladat során két fajta elemet kell kategorizálnod. ' + inducers_instructions +
          'Egy adott időn belül kell adni minden választ. Próbálj gyors és ugyanakkor pontos is lenni. Minden kategóriában legalább 80% helyes válasz szükséges, másképp meg kell ismételned a gyakorló feladatot.</span>');
        if (cittype === 0) {
          thetexts.push("<span id='feedback_id2'>In the second practice round, you have to categorize the main test items. The aim of the entire test will be to show whether or not one of these main items is recognized by you. " + main_instruction + '</span>');
          let ittypes = [this.it_type_feed_dict['en'].nontargflr, this.it_type_feed_dict['en'].targetflr,
          this.it_type_feed_dict['en'].main_item,
          this.it_type_feed_dict['en'].target].join(', ');
          thetexts.push(
            "<span id='feedback_id3'>In the third and last practice round all items are present (" + ittypes + "). You again have to respond fast, but a certain number of errors is allowed. The task is the same. Touch the <i>right</i> button when you see the following items: " + targs.replace('<br>', '') + trefs + "Touch the <i>left</i> button for everything else.</span>");
        } else {
          thetexts.push('<span id="feedback_id2">In the second and last practice round, you also have to categorize the main test items. The aim of the entire test will be to show whether or not one of these main items is recognized by you. These are: ' + nontargs + 'These all have to be categorized by touching the <i>left</i> button. You again need at least 80% accuracy for the previous item categories (left-side and right-side secondary items), as well as for this new category (main items).</span>');
          targs = '';
        }
        thetexts.push(
          "Now the actual test begins. The task is the same. Touch the <i>right</i> button when you see the following items: " + targs.replace('<br>', '') + trefs + "Touch the <i>left</i> button for everything else.<br><br>Try to be both accurate and fast.");
      } else {
        trefs = '';
        thetexts.push(intro + main_instruction + intro_end);
        thetexts.push("<span id='feedback_id2'>A következő, utolsó gyakorló feladatban gyorsan kell választ adnod, de egy bizonyos számú hibás (vagy túl lassú) válasz megengedett. A feladat ugyanaz. Válaszd a <i>jobb oldali</i> gombot ha az alábbi elem jelenik meg:<br>" + targs + "Válaszd a <i>bal oldali</i> gombot ha bármely más elem jelenik meg.</span>");
        thetexts.push(
          "Most következik az éles teszt. A feladat ugyanaz. Válaszd a <i>jobb oldali</i> gombot ha az alábbi elem jelenik meg:<br>" + targs +         "Válaszd a <i>bal oldali</i> gombot ha bármely más elem jelenik meg.<br><br>Probálj pontos és gyors lenni.");
      }
      return thetexts;
    },
    'jp': '日本語',
    'pl': 'Polski'
  }

}
