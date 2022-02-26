///////////////////
// imports
///////////////////
import fs from 'fs';  // for reading from files 

///////////////////
// globals
///////////////////
// document tags to display compare values
let hc = document.getElementById("hcOut");

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

// called by html button, computes and outputs huffman encoding
function computeHC() {
    // get input from list1, list2
    let chars = document.getElementById("chars").value;

    // checking for too large of input
    if (chars.length > 1000) {
        ssOut.innerHTML = "<h3>Input Too Large (>1000 characters)</h3>";
        return; 
    }

    // sorting set
    chars = chars.sort();

    // constructing output
    out = chars;
    hc.innerHTML = `<h3>The corresponding Huffman Coding is: ${out}</h3>`;
}