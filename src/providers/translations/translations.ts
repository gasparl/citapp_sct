import { Injectable } from '@angular/core';

@Injectable()
export class TranslationProvider {
  lang: string = 'en';
  constructor() { }

  blck_texts: any = {
    'en': (targs, nontargs, trefs, nontrefs, cittype) => {
      let numprac: string;
      let thetexts: string[] = [''];
      if (cittype == 1) {
        numprac = 'three';
      } else {
        numprac = 'two';
      }
      let intro = 'During the test, various items will appear in the middle of the screen. You have to categorize each item by touching a button on the left or another button on the right. ';
      let intro_end = 'There will be ' + numprac + ' short practice rounds.';
      let inducers_instructions =
        '</br></br>Touch the <i>right</i> button when you see any of the following items:<br>' + trefs + 'Touch the <i>left</i> button when you see any other item. These other items are:<br>' + nontrefs;
      let main_instruction = 'Touch the <i>right</i> button when you see the following target item:<br>' +
        targs +
        '<br>Touch the <i>left</i> button when you see any other item. These other items are:<br>' +
        nontargs +
        '</br></br>In this practice round, you will have a lot of time to choose each response, but <b>you must respond to each item correctly</b>. If you choose an incorrect response (or not give response for over 10 seconds), you will have to repeat this practice round.';
      // 0: fillers & target, 1: fillers (no target), 2: standard CIT
      if (cittype !== 1) {
        thetexts.push(
          '<span id="feedback_id1">' + intro + intro_end + '</br></br>In this first practice round, you have to categorize two kinds of items. ' + inducers_instructions +
          'In each category, you need at least 80% correct responses in time, otherwise you have to repeat this practice round.</span>');
        if (cittype === 0) {
          thetexts.push("<span id='feedback_id2'>In this second practice round, you have to categorize the main test items. " + main_instruction + '</span>');
          thetexts.push(
            "<span id='feedback_id3'>In this third and last practice round all items are present. You again have to respond fast, but a certain rate of error is allowed. The task is the same, touch the <i>left</i> button when you see the following item: " + targs + trefs + "<br>Touch the <i>right</i> button for everything else.</span>");
        } else {
          thetexts.push('<span id="feedback_id2">In this second and last practice round, you also have to categorize the main test items: ' + nontargs + '. These all have to be categorized by touching the <i>left</i> button.</span>');
        }
      } else {
        targs = '';
        thetexts.push(intro + main_instruction + intro_end);
        thetexts.push("<span id='feedback_id3'>Now, in this second and last practice round, you have to respond fast, but a certain rate of error is allowed. The task is the same, touch the <i>left</i> button when you see the following item: " + targs + trefs + "<br>Touch the <i>right</i> button for everything else.</span>");
      }

      thetexts.push(
        "Now begins the actual test. The task is the same, touch the <i>left</i> button when you see the following items: " + targs + trefs + "<br>Touch the <i>right</i> button for everything else.<br><br>Try to be as accurate and as fast as possible.");
      return thetexts;
    }
  }

}
