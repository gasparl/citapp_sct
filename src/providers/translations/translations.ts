import { Injectable } from '@angular/core';

@Injectable()
export class TranslationProvider {
  lang: string = 'hu';
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
    'en': ["FAMILIAR", "MINE", "RECOGNIZED"], // these words are not to be translated literally one by one. The translations should always try to find the simplest, clearest words that relate to relevance, familiarity, recognition, importance. (The English "MINE" is actually not the best, but it's good to also have a shorter word and this fits there.)
    'cn': '中文',
    'de': ["VERTRAUT", "MEIN", "RELEVANT"],
    'hu': ["ÉRTELMES", "FELISMERT", "IGAZI"],
    'jp': '日本語',
    'pl': ["ZNANE", "ISTOTNE", "ZNACZĄCE"]
  };

  nontargref_words_orig: object = {
    'en': ["FOREIGN", "IRRELEVANT", "OTHER", "RANDOM", "THEIRS", "UNFAMILIAR"], // these should have the meaning opposite of  relevance, familiarity, importance
    'cn': '中文',
    'de': ["IRRELEVANT", "FREMD", "UNBEKANNT", "ANDERE", "SONSTIGES", "UNVERTRAUT"],
    'hu': ["SEMMIS", "VALÓTLAN", "HALANDZSA", "ISMERETLEN", "HAMIS", "ZAGYVA"],
    'jp': '日本語',
    'pl': ["OBCE", "NIEISTOTNE", "INNE", "PRZYPADKOWE", "OBOJĘTNE", "NIEZNANE"]
  };

  consent: object = {
    'en': 'With your permission, the data from the following test may be used and published for research purposes. The data will not reveal who you are, you will not be named and your identity will remain strictly confidential.',
    'cn': '中文',
    'de': 'Mit Ihrer Zustimmung dürfen die Daten aus dem folgenden Test zu Forschungszwecken verwendet und veröffentlicht werden. Die Daten geben keinen Aufschluss darüber, wer Sie sind, Sie werden nicht namentlich genannt und Ihre Identität wird streng vertraulich behandelt.',
    'hu': 'Ha engedélyezed, a következő teszt adatai felhasználhatók és közzétehetők lesznek kutatási célokra. Az adatok névtelenek és nem tartalmaznak a kilétedre vezető információt. A személyazonosságod szigorúan bizalmas marad.',
    'jp': '日本語',
    'pl': 'Za Twoją zgodą dane z poniższego testu mogą być wykorzystane i opublikowane do celów badawczych. Dane te nie będą zawierały Twojego imienia i nazwiska, a Twoja tożsamość pozostanie ściśle poufna.'
  };
  // "item", in case of no clear equivalent, can also be translated as "elements to be shown" or "stimuli to be shown" or similar
  consentitems_chosen: object = {
    'en': 'You also have the choice to give permission to share the data, but keep the main items (specific words or pictures) presented during the test confidential.',
    'cn': '中文',
    'de': 'Sie haben auch die Möglichkeit, das Teilen der Daten zu erlauben, aber die zentralen Elemente (bestimmte Wörter oder Bilder), die während des Tests präsentiert werden, vertraulich zu behandeln.',
    'hu': 'Választhatod azt is, hogy engedélyt ad az adatok megosztására, de a teszt során bemutatott fő elemek (konkrét szavak vagy képek) nélkül.',
    'jp': '日本語',
    'pl': 'Masz również możliwość udzielenia zgody na udostępnienie danych z jednoczesnym zachowaniem poufności elementów głównych (słów lub obrazów) przedstawionych podczas testu.'
  };
  consentitems_conf: object = {
    'en': 'The main items presented in the test (specific words or pictures) will also remain confidential.',
    'cn': '中文',
    'de': 'Die zentralen Elemente des Tests (bestimmte Wörter oder Bilder) werden ebenso vertraulich behandelt.',
    'hu': 'A teszt során bemutatott fő elemek (konkrét szavak vagy képek) nem lesznek közzétéve.',
    'jp': '日本語',
    'pl': 'Elementy główne (słowa lub obrazy) przedstawione podczas testu również pozostaną poufne.'
  };
  consent_q: object = {
    'en': 'Do you give permission to share the data?',
    'cn': '中文',
    'de': 'Erlauben Sie das Teilen Ihrer Daten?',
    'hu': 'Engedélyt adsz az adatok megosztására?',
    'jp': '日本語',
    'pl': 'Czy udzielasz zgody na udostępnienie danych?'
  };

  consent_a: object = {
    'en': ['Yes', 'Yes, but without items', 'No'],
    'cn': '中文',
    'de': ['Ja', 'Ja, aber ohne zentrale Elemente', 'Nein'],
    'hu': ['Igen', 'Igen, de bemutatott elemek nélkül', 'Nem'],
    'jp': '日本語',
    'pl': ['Tak', 'Tak, z wyłączeniem elementów testowych', 'Nie']
  };

  start: object = {
    'en': 'Start',
    'cn': '中文',
    'de': 'Start',
    'hu': 'Start',
    'jp': '日本語',
    'pl': 'Rozpocznij'
  };

  show_inst: object = {
    'en': 'show instructions again',
    'cn': '中文',
    'de': 'Instruktionen erneut anzeigen',
    'hu': 'utasítások újramegjelenítése',
    'jp': '日本語',
    'pl': 'pokaż ponownie instrukcję'
  };


  taptostart: object = {
    'en': 'TAP HERE TO START', // it can also just be "start test" (should not be long; to be displayed in a small area)
    'cn': '中文',
    'de': 'TEST STARTEN',
    'hu': 'TESZT INDÍTÁSA',
    'jp': '日本語',
    'pl': 'ROZPOCZNIJ TEST'
  };

  feedtooslo: object = {
    'en': "Too slow!",
    'cn': '中文',
    'de': 'Zu langsam!',
    'hu': 'Túl lassú!',
    'jp': '日本語',
    'pl': 'Zbyt wolno!'
  };
  feedwrong: object = {
    'en': "Wrong!",
    'cn': '中文',
    'de': "Falsch!",
    'hu': 'Hibás!',
    'jp': '日本語',
    'pl': 'Źle!'
  };

  it_type_feed_dict: object = {
    'en': {
      targetflr: "secondary items to be categorized to the right side",
      nontargflr: "secondary items to be categorized to the left side",
      main_item: "main items [to be categorized to the left side]", //
      target: "target item [to be categorized to the right side]"
    },
    'cn': '中文',
    'de': {
      targetflr: "zusätzliche Elemente [rechts zu kategorisieren]",
      nontargflr: "zusätzliche Elemente [links zu kategorisieren]",
      main_item: "zentrale Elemente [links zu kategorisieren]",
      target: "zentrales Zielelement [rechts zu kategorisieren]"
    },
    'hu': {
      targetflr: "jobb oldalra kategórizálandó másodlagos elemek",
      nontargflr: "bal oldalra kategórizálandó másodlagos elemek",
      main_item: "fő elemek [bal oldalra kategórizálandó]",
      target: "cél elem [jobb oldalra kategórizálandó]"
    },
    'jp': '日本語',
    'pl': {
      targetflr: "elementy drugorzędne do przyporządkowania na prawo",
      nontargflr: "elementy drugorzędne do przyporządkowania na lewo",
      main_item: "elementy główne [do przyporządkowania na lewo]",
      target: "element docelowy [do przyporządkowania na prawo]"
    }
  };

  correct: object = {
    'en': "% correct",
    'cn': '中文',
    'de': '% korrekt',
    'hu': '% helyes',
    'jp': '日本語',
    'pl': '%'
  };
  accrep_feed: object = {
    'en': 'You will have to repeat this practice round due to a wrong response (or too much waiting).',
    'cn': '中文',
    'de': 'Sie müssen die Übungsrunde wegen einer falschen (oder zu langsamen) Antwort wiederholen.',
    'hu': 'Meg kell ismételned ezt a gyakorló feladatot egy hibás válasz (vagy túl hosszú várakozás) miatt.',
    'jp': '日本語',
    'pl': 'Musisz powtórzyć tę rundę treningową z powodu niepoprawnej odpowiedzi lub braku odpowiedzi.'
  };
  acc_feed: object = {
    'en': ['You will have to repeat this practice round, because of too few correct responses.</b><br><br>You need at least ', "% accuracy on each item category, but you did not have enough correct responses for the following one(s):"],
    'cn': '中文',
    'de': ['Sie müssen die Übungsrunde wegen zu weniger korrekter Antworten wiederholen.</b><br><br>Sie benötigen mindestens ', "% richtige Anworten pro Elementkategorie, aber für diese Kategorie(n) hatten Sie zu viele Fehler:"],
    'hu': ['Meg kell ismételned ezt a gyakorló feldatatot, mivel túl kevés helyes választ adtál.</b><br><br>Legalább ', "% pontosság szükséges minden elem kategóriában, de nem adtál elég helyes választ a következő kategóriá(k)ban:"],
    'jp': '日本語',
    'pl': ['Musisz powtórzyć tę rundę treningową z powodu zbyt małej liczby poprawnych odpowiedzi.</b><br><br>Dla każdego typu elementów konieczne jest uzyskanie co najmniej ', "% poprawnych odpowiedzi. Nie udało Ci się uzyskać wystarczającej liczby poprawnych odpowiedzi dla następujących elementów:"]
  };

  cit_completed: object = {
    'en': 'Test completed.',
    'cn': '中文',
    'de': 'Test abgeschlossen.',
    'hu': 'A teszt véget ért.',
    'jp': '日本語',
    'pl': 'Koniec testu.'
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
      let intro_end = 'There will be ' + numprac + ' short practice rounds. ';
      let inducers_instructions =
        '</br></br>Touch the <i>right</i> button when you see any of the following items:<br>' + trefs + 'Touch the <i>left</i> button when you see any other item. These other items are:<br>' + nontrefs;
      let main_instruction = 'Touch the <i>right</i> button when you see the following target item:<br>' +
        targs[0] +
        'Touch the <i>left</i> button when you see any other item. These other items are:<br>' +
        nontargs[0];
      let main_end = 'In this practice round, you will have a lot of time to choose each response, but <b>you must respond to each item correctly</b>. If you choose an incorrect response (or not give response for over 10 seconds), you will have to repeat the practice round.';
      // 0: fillers & target, 1: standard CIT, 2: fillers (no target)

      thetexts.push(
        '<span id="feedback_id1">' + intro + intro_end + '</br></br>In the first practice round, you have to categorize two kinds of items. ' + inducers_instructions +
        'There is a certain time limit for making each response. Please try to be both fast and accurate. In each category, you need at least 80% correct responses in time, otherwise you have to repeat the practice round.</span>');
      thetexts.push("<span id='feedback_id2'>In the second practice round, you have to categorize the main test items. The aim of the entire test will be to show whether or not one of these main items is recognized by you. " + main_instruction + main_end + '</span>');
      let ittypes = [
        this.it_type_feed_dict['en'].main_item,
        this.it_type_feed_dict['en'].target,
        this.it_type_feed_dict['en'].nontargflr,
        this.it_type_feed_dict['en'].targetflr
      ].join(', ');
      thetexts.push(
        "<span id='feedback_id3'>In the third and last practice round all items are present (" + ittypes + "). You again have to respond fast, but a certain number of errors is allowed. The task is the same. Touch the <i>right</i> button when you see the following items:<br>" + targs[0].replace('<br>', '') + trefs + "Touch the <i>left</i> button for everything else.</span>");

      thetexts.push(
        "Now the actual test begins. The task is the same. Touch the <i>right</i> button when you see the following items:<br>" + targs[0].replace('<br>', '') + trefs + "Touch the <i>left</i> button for everything else.<br><br>Try to be both accurate and fast.");

      // repetitions (3 next probes)

      [1, 2, 3].forEach(pnum => {
        thetexts.push(
          'The main items will now be replaced with new ones. Touch the <i>right</i> button when you see the following target item:<br>' +
          targs[pnum] +
          'Touch the <i>left</i> button when you see any other item. These other items are:<br>' +
          nontargs[pnum] + 'Before continuing, there will be a short practice round to get used to these words. Again, you will have a lot of time to choose each response, but <b>you must respond to each item correctly</b>, otherwise you will have to repeat the practice round.');
        thetexts.push(
          "Well done. The next block begins. The task is the same. Touch the <i>right</i> button when you see the following items:<br>" + targs[pnum].replace('<br>', '') + trefs + "Touch the <i>left</i> button for everything else.<br><br>Try to be both accurate and fast.");
      })
      return thetexts;
    },
    'hu': (targs, nontargs, trefs, nontrefs, cittype) => {
      let numprac: string;
      let thetexts: string[] = [''];
      if (cittype == 0) {
        numprac = 'három';
      } else {
        numprac = 'két';
      }
      console.log(targs);
      let intro = 'A teszt során különféle elemek (szavak) jelennek meg egyesével a képernyő közepén. Két érintőgomb lesz látható az érintőképernyőn: egy baloldalt, és egy jobboldalt. Az bal oldali vagy a jobb oldali gomb megérintésével kell kategorizálni minden elemet. ';
      let intro_end = 'Először ' + numprac + ' rövid gyakorló feladat jön. ';
      let inducers_instructions =
        '</br></br>Válaszd a <i>jobb oldali</i> gombot ha a következő elemek bármelyike jelenik meg:<br>' + trefs + 'Válaszd a <i>bal oldali</i> gombot ha bármely más elem jelenik meg. Ezek az elemek:<br>' + nontrefs;
      let main_instruction = 'Válaszd a <i>jobb oldali</i> gombot ha az alábbi "cél" elem jelenik meg:<br>' +
        targs[0] +
        'Válaszd a <i>bal oldali</i> gombot ha bármely más elem jelenik meg. Ezek az elemek:<br>' +
        nontargs[0];
      let main_end = 'A következő gyakorló feladatban sok időd van kiválasztani a helyes érintőgombot, de <b>minden elemre helyes választ kell adnod</b>. Ha hibás választ adsz (vagy nem adsz választ több mint 10 másodpercig), meg kell ismételned ezt a gyakorló feladatot. ';
      // 0: fillers & target, 1: standard CIT, 2: fillers (no target)
      thetexts.push(
        '<span id="feedback_id1">' + intro + intro_end + '</br></br>Az első gyakorló feladat során két fajta elemet kell kategorizálnod. ' + inducers_instructions +
        'Egy adott időn belül kell adni minden választ. Próbálj gyors és ugyanakkor pontos is lenni. Minden kategóriában legalább 80% helyes válasz szükséges, másképp meg kell ismételned a gyakorló feladatot.</span>');
      thetexts.push("<span id='feedback_id2'>A második gyakorlófeladat során a fő teszt elemeket kell kategorizálnod. Az egész teszt célja az lesz, hogy kimutassuk, felismered-e az egyikét ezeknek a fő elemeknek. " + main_instruction + main_end + '</span>');
      let ittypes = [
        this.it_type_feed_dict['hu'].main_item,
        this.it_type_feed_dict['hu'].target,
        this.it_type_feed_dict['hu'].nontargflr,
        this.it_type_feed_dict['hu'].targetflr
      ].join(', ');
      thetexts.push(
        "<span id='feedback_id3'>A harmadik és utolsó gyakorlófeladat az összes elemet tartalmazza (" + ittypes + "). Ismét gyorsan kell választ adnod, de egy bizonyos számú hiba megengedett. A feladat ugyanaz. Válaszd a <i>jobb oldali</i> gombot ha a következő elemek bármelyike jelenik meg:<br>" + targs[0].replace('<br>', '') + trefs + "Válaszd a <i>bal oldali</i> gombot ha bármely más elem jelenik meg.</span>");
      thetexts.push(
        "Most következik az éles teszt. A feladat ugyanaz. Válaszd a <i>jobb oldali</i> gombot ha az alábbi elemek bármelyike jelenik meg:<br>" + targs[0].replace('<br>', '') + trefs + "Válaszd a <i>bal oldali</i> gombot ha bármely más elem jelenik meg.<br><br>Probálj pontos és gyors lenni.");

      [1, 2, 3].forEach(pnum => {
        thetexts.push(
          'Most más fő elemek következnek. Válaszd a <i>jobb oldali</i> gombot ha az alábbi "cél" elem jelenik meg:<br>' +
          targs[pnum] +
          'Válaszd a <i>bal oldali</i> gombot ha bármely más elem jelenik meg. Ezek az elemek:<br>' +
          nontargs[pnum] + 'Egy rövid gyakorlófeladat következik, hogy hozzászokj az új szavakhoz. Megint sok időd van kiválasztani a helyes érintőgombot, de <b>minden elemre helyes választ kell adnod</b>, különben meg kell ismételned ezt a gyakorlófeladatot.');
        thetexts.push(
          "Rendben. A következő szakasz kezdődik. A feladat ugyanaz. Válaszd a <i>jobb oldali</i> gombot ha a következő elemek bármelyike jelenik meg:<br>" + targs[pnum].replace('<br>', '') + trefs + "Válaszd a <i>bal oldali</i> gombot ha bármely más elem jelenik meg.</span>");
      })
      return thetexts;
    }
  }
}
