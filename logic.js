///////////////////
// imports
///////////////////
import fs from 'fs';  // for reading from files 

///////////////////
// globals
///////////////////
// document tags to display compare values
let ss = document.getElementById("hcOut");

///////////////////
// classes
///////////////////
// NOTE: the leafs will all be "Char" obj's while rest of the nodes in the tree will be "Node's"

// node object for the binary tree which keeps track of a letters frequency
class Node {
    constructor(l, r) {
        // left and right child of the current node
        // NOTE: r.freq >= l.freq
        this.left = l;  // 0
        this.right = r;  // 1
        // frequency of left and right childs
        this.freq = l.freq + r.freq;
    }
}

// holds a character and it's frequency
class Char {
    constructor(c, f) {
        // character represented 
        this.char = c;
        // chars frequency 
        this.freq = f;
    }
}

///////////////////
// helper functions
///////////////////
// inserts an element of an array in sorted order
function pushSort(ary, elem) {
    ary.push(elem);  // element is now last element in ary
    let idx = ary.length - 1;
    let temp;
    while (idx > 0 && ary[idx].freq < ary[idx - 1].freq) {
        // swap
        temp = ary[idx];
        ary[idx] = ary[idx - 1];
        ary[idx - 1] = temp;
    }
    return ary;
}

///////////////////
// huffman code calculation
///////////////////
// takes a list of Char's and constructs a tree
function makeTree(list) {
    let l, r;  // left and right child to be popped from list
    // want final length of list to be 1 
    while (list.length > 1) {
        // l <= r
        l = list.shift();
        r = list.shift();
        // add new node
        pushSort(list, new Node(l, r));
    }
    return list[0];  // parent node of tree
}

// given a file, reads in and counts the frequencies of each character
function countFreq(fileName) {
    let freqList;
    fs.readFile(fileName, 'utf-8', (err, file) => {
        if (err) { throw err; }  // check for error
        file = file.toString().sort();
        // check for 0 length file
        if (file.length == 0) { return []; }
        // read file data and count frequencies
        freqList = [new Char(file[0], 1)];
        let idx = 0;
        for (let i = 1; i < file.length; ++i) {
            // see if character has already been added
            if (file[i] == file[i - 1]) { freqList[idx]++; }
            else { freqList[++idx] = new Char(file[i], 1); }
        }
    });
    return freqList;
}

///////////////////
// i/o
///////////////////
// converts a list into a nice string to output
function listToString(list) {
    let len = list.length;
    let str = "";
    for (let i = 0; i < len; ++i) {
        str += list[i];
        str += (i < len - 1) ? ", " : "";
    }
    return str;
}

// called by html button, computes and outputs lcs
function computeSS() {
    // get input from list1, list2
    let set = document.getElementById("set").value;
    let k = document.getElementById("sum").value;

    // checking for too large of input
    if (set.length > 200) {
        ssOut.innerHTML = "<h3>Input Too Large (>100 elements)</h3>";
        return; 
    } else if (k.length > 3) {
        ssOut.innerHTML = "<h3>Input Too Large (>999)</h3>";
        return; 
    }

    // remove all whitespace
    set = set.split(" ").join("");

    // separate by ,
    set = set.split(",");

    // converting to ints
    list = [];
    k = parseInt(k);
    for (let i = 0; i < set.length; ++i) {
        list[i] = parseInt(set[i]);
    }

    // sorting set
    list.sort();

    // making sure all positive numbers
    if (list[0] < 1) {
        ssOut.innerHTML = "<h3>Must be all Positive Numbers</h3>";
    }

    // making sure elements are not repeating
    for (let i = 1; i < list.length; ++i) {
        if (list[i] == list[i - 1]) {
            ssOut.innerHTML = `<h3>Not a Set (repeating elements: ${list[i]})</h3>`;
            return;
        }
    }

    // constructing output
    out = subsetSum(list, k);
    ssOut.innerHTML = `<h3>It ${out.ss ? `is` : `is not`} possible to construct a sum of ${k} from the set ${listToString(list)}`;
}