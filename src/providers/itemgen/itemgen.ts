import { Injectable } from '@angular/core';

@Injectable()
export class ItemgenProvider {
  stim_base_p: any;
  constructor() { }

  // stimulus sequence generation

  randomdigit(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  shuffle(array) {
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

  rchoice(array) {
    return array[Math.floor(array.length * Math.random())];
  }

  range(start, end) {
    var r = [];
    for (var i = start; i < end; i++) {
      r.push(i);
    }
    return r;
  }

  permute(to_permutate) {
    var length = to_permutate.length,
      result = [to_permutate.slice()],
      c = new Array(length).fill(0),
      i = 1,
      k, p;
    while (i < length) {
      if (c[i] < i) {
        k = i % 2 && c[i];
        p = to_permutate[i];
        to_permutate[i] = to_permutate[k];
        to_permutate[k] = p;
        ++c[i];
        i = 1;
        result.push(to_permutate.slice());
      } else {
        c[i] = 0;
        ++i;
      }
    }
    return result;
  }

  inducer_items(targetrefs, nontargrefs) {
    console.log('inducer_items()');
    var blck_itms_temp = JSON.parse(JSON.stringify(targetrefs.concat(nontargrefs, targetrefs, nontargrefs))); // inducers x2
    blck_itms_temp = this.shuffle(blck_itms_temp); // this.shuffle it, why not
    var safecount = 0; // just to not freeze the app if sth goes wrong
    var stim_dicts_f = []; // in here the final list of dictionary items is collected, one by one
    while (blck_itms_temp.length > 0) { // stop if all items from blck_itms_temp were use up
      var dict_item = blck_itms_temp[0];
      safecount++;
      if (safecount > 911) {
        console.log('break due to unfeasable safecount');
        break;
      }
      var good_indexes = []; // will collect the indexes where the dict item may be inserted
      var dummy_dict = [{
        'word': '-',
        'type': '-'
      }]; // dummy dict to the end
      var stim_dicts_f_d = stim_dicts_f.concat(dummy_dict);
      stim_dicts_f_d.forEach(function(f_item, f_index) {
        if (!this.diginto_dict(stim_dicts_f, f_index, 'word', 4).includes(dict_item.word)) {
          good_indexes.push(f_index); // if fine, do add as good index
        }
      });
      if (good_indexes.length == 0) {
        console.log('no good_indexes - count', safecount);
        blck_itms_temp = this.shuffle(blck_itms_temp); // rethis.shuffle
      } else { // if there are good places, choose one randomly, insert the new item, and remove it from blck_itms_temp
        stim_dicts_f.splice(this.rchoice(good_indexes), 0, blck_itms_temp.shift());
      }
    }
    return (stim_dicts_f); // return final list (for blck_items var assignment)
  }

  diginto_dict(dcts, indx, key_name, min_dstnc) {
    var strt;
    if (indx - min_dstnc < 0) { // if starting index is negative, it counts from the end of the list; thats no good
      strt = 0; // so if negative, we just set it to 0
    } else {
      strt = indx - min_dstnc; // if not negative, it can remain the same
    }
    let all_vals = dcts.slice(strt, indx + min_dstnc).map(a => a[key_name]);
    return (all_vals); // return all values for the specified dict key within the specified distance (from the specified dictionary)
  }

  practice_items(targetrefs, nontargrefs) {
    console.log('practice_items()');
    var blck_itms_temp = JSON.parse(JSON.stringify(targetrefs.concat(nontargrefs))); // get inducers
    JSON.parse(JSON.stringify(this.stim_base_p)).forEach(function(cat) {
      blck_itms_temp = blck_itms_temp.concat(JSON.parse(JSON.stringify(cat))); // add all other items
    });
    blck_itms_temp = this.shuffle(blck_itms_temp); // this.shuffle it, why not
    // below the pseudorandomization to avoid close repetition of similar items (same item type)
    var safecount = 0; // just to not freeze the app if sth goes wrong
    var stim_dicts_f = []; // in here the final list of dictionary items is collected, one by one
    while (blck_itms_temp.length > 0) { // stop if all items from blck_itms_temp were use up (added to stim_dicts_f and removed with pop() )
      var dict_item = blck_itms_temp[0]; // assign first dictionary item as separate variable; for easier access below
      safecount += 1;
      if (safecount > 911) {
        console.log('break due to unfeasable safecount');
        break;
      }
      var good_indexes = []; // will collect the indexes where the dict item may be inserted
      var dummy_dict = [{
        'word': '-',
        'type': '-'
      }]; // dummy dict to the end; if the item is to be inserted to the end, there is no following dict that could cause an unwanted repetition

      var stim_dicts_f_d = stim_dicts_f.concat(dummy_dict);
      stim_dicts_f_d.forEach(function(f_item, f_index) {
        if (!this.diginto_dict(stim_dicts_f, f_index, 'type', 1).includes(dict_item.type)) {
          good_indexes.push(f_index); // if fine, do add as good index
        }
      });
      if (good_indexes.length == 0) {
        console.log('no good_indexes - count', safecount);
        blck_itms_temp = this.shuffle(blck_itms_temp); // rethis.shuffle
      } else { // if there are good places, choose one randomly, insert the new item, and remove it from blck_itms_temp
        stim_dicts_f.splice(this.rchoice(good_indexes), 0, blck_itms_temp.shift());
      }
    }
    return (stim_dicts_f); // return final list (for blck_items var assignment)
  }

  main_items(block_stim_base) {
    var item_order = [];
    var prev_last = ''; // prev order is the item order of the previous trial sequence
    for (var i = 0; i < 18; i++) { // each i represents a sequence of 6 trials
      var item_order_temp = JSON.parse(JSON.stringify(block_stim_base)); // create a temporary item order, this represents the item order WITHIN one trial sequence
      item_order_temp = this.shuffle(item_order_temp); // this.shuffle this
      if (prev_last == item_order_temp[0].word) { // if the last one of the previous block is the first of this one
        var cutout = item_order_temp.splice(0, 1)[0]; // cut the element at index 'from'
        item_order_temp.splice(this.randomdigit(1, 5), 0, cutout);
      }
      item_order.push(JSON.parse(JSON.stringify(item_order_temp))); // make this the item order for this trial sequence
      prev_last = item_order_temp[item_order_temp.length - 1].word;
    }
    return (item_order);
  }

  zip: any = (...rows) => [...rows[0]].map((_, c) => rows.map(row => row[c]));

  inducer_randomized(targetrefs, nontargrefs) { // 6 possible inducer orders
    var targetrefs_perm = this.shuffle(this.permute(targetrefs)); // 3 x 2 = 6 arrangements
    var nontarg_temp = JSON.parse(JSON.stringify(nontargrefs));
    nontarg_temp = this.shuffle(nontarg_temp);
    var nontargrefs_perm1 = this.permute(nontarg_temp.slice(0, 3)); // 3 x 2 = 6
    var nontargrefs_perm2 = this.permute(nontarg_temp.slice(3, 6)); // 3 x 2 = 6
    var nontargrefs_perm = [];
    for (var i = 0; i < 3; i++) { // 6/2 = 3
      nontargrefs_perm.push(nontargrefs_perm1.shift().concat(nontargrefs_perm2.shift()));
      nontargrefs_perm.push(nontargrefs_perm2.shift().concat(nontargrefs_perm1.shift()));
    }
    nontargrefs_perm = this.shuffle(nontargrefs_perm); // another 6 arrangements
    var inducer_lists = [];

    this.zip(targetrefs_perm, nontargrefs_perm).forEach(function(perm_pair) {
      var trefs = perm_pair[0];
      var ntrefs = perm_pair[1];
      var lst_temp = JSON.parse(JSON.stringify(ntrefs));
      var nums = this.range(0, trefs.length + ntrefs.length);
      var insert_locs = [];
      this.range(0, trefs.length).forEach(function(i) {
        var new_rand = this.rchoice(nums);
        insert_locs.push(new_rand);
        nums = nums.filter(n => Math.abs(n - new_rand) > 1);
      });
      insert_locs.sort();
      insert_locs.forEach(function(loc) {
        lst_temp.splice(loc, 0, trefs.pop());
      });
      inducer_lists.push(JSON.parse(JSON.stringify(lst_temp)));
    });
    return (inducer_lists);
  }

  add_inducers(block_stim_base, targetrefs, nontargrefs) {
    // First we want to assign which words get an inducer. We want each word to get an inducer in half (9) of the trials. In addition, we want half of the words in one trial sequence (3) to have an inducer. Thus we make 9 permutations of yes/no.
    var yesno_perm = this.permute(['y', 'y', 'y', 'n', 'n', 'n']).map(ar => JSON.stringify(ar)).filter((itm, idx, arr) => arr.indexOf(itm) === idx).map(str => JSON.parse(str));
    yesno_perm = this.shuffle(yesno_perm);
    var options = yesno_perm.slice(0, 9);
    var blck_rev = []; // create an empty list for the reversed block
    options.forEach(function(opt) {
      var optz_new = this.range(0, 6);
      opt.forEach(function(item, index) {
        if (item == "n") {
          optz_new[index] = "y";
        } else {
          optz_new[index] = "n";
        }
      });
      blck_rev.push(JSON.parse(JSON.stringify(optz_new))); // everytime add the current reversed line to the reversed block
    });
    var blck1 = options.slice(0, 3).concat(blck_rev.slice(0, 3)); // because we wanna split them up in 3 we create blcks of 6 which are each  time 3 lines and then the reverse of those 3 lines
    var blck2 = options.slice(3, 6).concat(blck_rev.slice(3, 6));
    var blck3 = options.slice(6, 9).concat(blck_rev.slice(6, 9));
    blck1 = this.shuffle(blck1);
    blck2 = this.shuffle(blck2);
    blck3 = this.shuffle(blck3);
    //create final block
    var blck_fin = blck1.concat(blck2, blck3);
    var word_assignment = {};
    block_stim_base.forEach(function(dct, indx) { //assign the yes/nos to the words
      word_assignment[dct.word] = blck_fin.map(a => a[indx]); // combine them to create an inducer assignment for all 18 trial sequences and assign them to the dict
    });
    //  We then need to decide which inducer is shown thus we make a list
    var inducer_lists = this.inducer_randomized(targetrefs, nontargrefs); // randomize 6 lists of inducer words
    var inducer_per_main = {};
    block_stim_base.forEach(function(dct) {
      inducer_per_main[dct.word] = inducer_lists.shift();
    });
    // now insert the inducers
    var final_item_order = [];
    this.main_items(block_stim_base).forEach(function(trial_seq, t_indx) { // trial sequence represents the order in which the x amount of words are presented within one sequence (n=6) of trials
      var final_temp = [];
      trial_seq.forEach(function(item, i_indx) { // item represents each individual word (or trial)
        if (word_assignment[item.word][t_indx] == "y") { // check if the word should get an inducer
          // pick the right inducer
          // then we should delete this element so inducer so we use pop
          final_temp.push(inducer_per_main[item.word].shift()); // append the inducer to our item order
        }
        final_temp.push(item); // append the item to our item order
      });
      final_item_order.push(JSON.parse(JSON.stringify(final_temp))); // create final item order list
    });
    return ([].concat.apply([], final_item_order));
  }

  fulltest_items(targetrefs, nontargrefs) {
    console.log('fulltest_items()');
    return (this.add_inducers(this.stim_base_p.pop(0), targetrefs, nontargrefs));
  }
}
