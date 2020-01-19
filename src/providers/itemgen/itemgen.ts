import { Injectable } from '@angular/core';

@Injectable()
export class ItemgenProvider {
  stim_base_p: any[];
  constructor() { }

  // stimulus sequence generation

  randomdigit(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  shuffle(arr) {
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

  filler_items(targetrefs, nontargrefs) {
    console.log('filler_items()');
    var blck_itms_temp = JSON.parse(JSON.stringify(targetrefs.concat(nontargrefs, targetrefs, nontargrefs))); // fillers x2
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
        'item': '-',
        'type': '-'
      }]; // dummy dict to the end
      var stim_dicts_f_d = stim_dicts_f.concat(dummy_dict);
      stim_dicts_f_d.forEach((f_item, f_index) => {
        if (!this.diginto_dict(stim_dicts_f, f_index, 'item', 4).includes(dict_item.item)) {
          good_indexes.push(f_index); // if fine, do add as good index
        }
      });
      if (good_indexes.length == 0) {
        console.log('no good_indexes - count', safecount);
        blck_itms_temp = this.shuffle(blck_itms_temp); // reshuffle
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
    var blck_itms_temp = JSON.parse(JSON.stringify(targetrefs.concat(nontargrefs))); // get fillers
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
        'item': '-',
        'type': '-'
      }]; // dummy dict to the end; if the item is to be inserted to the end, there is no following dict that could cause an unwanted repetition

      var stim_dicts_f_d = stim_dicts_f.concat(dummy_dict);
      stim_dicts_f_d.forEach((f_item, f_index) => {
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

  main_sequences(block_stim_base) {
    var items_ordered = [];
    var prev_last = ''; // prev order is the item order of the previous trial sequence
    for (var i = 0; i < 18; i++) { // each i represents a sequence of 6 trials
      var item_order_temp = JSON.parse(JSON.stringify(block_stim_base)); // create a temporary item order, this represents the item order WITHIN one trial sequence
      item_order_temp = this.shuffle(item_order_temp); // this.shuffle this
      if (prev_last == item_order_temp[0].item) { // if the last one of the previous block is the first of this one
        var cutout = item_order_temp.splice(0, 1)[0]; // cut the element at index 'from'
        item_order_temp.splice(this.randomdigit(1, item_order_temp.length - 1), 0, cutout);
      }
      items_ordered.push(JSON.parse(JSON.stringify(item_order_temp))); // make this the item order for this trial sequence
      prev_last = item_order_temp[item_order_temp.length - 1].item;
    }
    return (items_ordered);
  }

  main_items(block_stim_base) {
    return this.shuffle(block_stim_base);
  }

  zip: any = (...rows) => [...rows[0]].map((_, c) => rows.map(row => row[c]));

  filler_randomized(targetrefs, nontargrefs) { // 6 possible filler orders
    var targetrefs_perm = this.shuffle(this.permute(JSON.parse(JSON.stringify(targetrefs)))); // 3 x 2 = 6 arrangements
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
    var filler_lists = [];

    this.zip(targetrefs_perm, nontargrefs_perm).forEach((perm_pair) => {
      var trefs = perm_pair[0];
      var ntrefs = perm_pair[1];
      var lst_temp = JSON.parse(JSON.stringify(ntrefs));
      var nums = this.range(0, trefs.length + ntrefs.length);
      var insert_locs = [];
      this.range(0, trefs.length).forEach((i) => {
        var new_rand = this.rchoice(nums);
        insert_locs.push(new_rand);
        nums = nums.filter(n => Math.abs(n - new_rand) > 1);
      });
      insert_locs.sort();
      insert_locs.forEach((loc) => {
        lst_temp.splice(loc, 0, trefs.pop());
      });
      filler_lists.push(JSON.parse(JSON.stringify(lst_temp)));
    });
    return (filler_lists);
  }

  add_fillers(block_stim_base, targetrefs, nontargrefs) {
    // First we want to assign which items get an filler. We want each item to get an filler in half (9) of the trials. In addition, we want half of the items in one trial sequence (3) to have an filler. Thus we make 9 permutations of yes/no.
    var yesno_perm = this.permute(['y', 'y', 'y', 'n', 'n', 'n']).map(ar => JSON.stringify(ar)).filter((itm, idx, arr) => arr.indexOf(itm) === idx).map(str => JSON.parse(str));
    yesno_perm = this.shuffle(yesno_perm);
    var options = yesno_perm.slice(0, 9);
    var blck_rev = []; // create an empty list for the reversed block
    options.forEach((opt) => {
      var optz_new = this.range(0, 6);
      opt.forEach((item, index) => {
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
    blck1 = this.shuffle(blck1); // 6 lists (each with 9 possible orders of y/n), with 3 exact reversed
    blck2 = this.shuffle(blck2); // 6 lists (each with 9 possible orders of y/n), with 3 exact reversed
    blck3 = this.shuffle(blck3); // 6 lists (each with 9 possible orders of y/n), with 3 exact reversed
    //create final block
    var blck_fin = blck1.concat(blck2, blck3);
    var item_assignment = {};
    JSON.parse(JSON.stringify(block_stim_base)).forEach((dct, indx) => { //assign the yes/nos to the items
      item_assignment[dct.item] = blck_fin.map(a => a[indx]); // combine them to create an filler assignment for all 18 trial sequences and assign them to the dict
    });
    //  We then need to decide which filler is shown thus we make a list
    var filler_lists = this.filler_randomized(targetrefs, nontargrefs); // randomize 6 lists of filler items
    var filler_per_main = {};
    JSON.parse(JSON.stringify(block_stim_base)).forEach((dct) => {
      filler_per_main[dct.item] = filler_lists.shift();
    });
    // now insert the fillers
    var final_item_order = [];
    this.main_sequences(block_stim_base).forEach((trial_seq, t_indx) => { // trial sequence represents the order in which the x amount of items are presented within one sequence (n=6) of trials
      var final_temp = [];
      trial_seq.forEach((item, i_indx) => { // item represents each individual trial
        if (item_assignment[item.item][t_indx] == "y") { // check if the item should get an filler
          // pick the right filler
          // then we should delete this element so filler so we use pop
          final_temp.push(filler_per_main[item.item].shift()); // append the filler to our item order
        }
        final_temp.push(item); // append the item to our item order
      });
      final_item_order.push(JSON.parse(JSON.stringify(final_temp))); // create final item order list
    });
    return ([].concat.apply([], final_item_order));
  }

  fulltest_items(targetrefs, nontargrefs, baseset) {
    console.log('fulltest_items()');
    return (this.add_fillers(baseset, targetrefs, nontargrefs));
  }
  
}
