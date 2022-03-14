///////////////////
// imports
///////////////////

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
function countFreq(input) {
    let freqList;
    // readFile(fileName, 'utf-8', (err, file) => {
        // if (err) { throw err; }  // check for error
        // file = file.toString().sort();
        input = input.split('').sort();
        // check for 0 length file
        if (input.length == 0) { return []; }
        // read file data and count frequencies
        freqList = [new Char(input[0], 1)];
        let idx = 0;
        for (let i = 1; i < input.length; ++i) {
            // see if character has already been added
            if (input[i] == input[i - 1]) { freqList[idx].freq++; }
            else { freqList[++idx] = new Char(input[i], 1); }
        }
    // });
    return freqList;
}

// returns the depth of the current node
function getDepth(node) {
    // is an actual node
    if (node.char === undefined) {
        return Math.max(getDepth(node.left), getDepth(node.right)) + 1;
    }
    // is a char
    return 1;
}

///////////////////
// i/o
///////////////////
// inorder traversal of a binary tree
function inOrder(tree) {
    if (tree.char === undefined) {
        inOrder(tree.left);
        console.log("freq: " + tree.freq);
        inOrder(tree.right);
    } else {
        console.log("freq: " + tree.freq + " | " + tree.char);
    }
}

// draws a binary tree of the huffman encoding
function drawTree(canvas, tree) {
    // running breadth first search to get nodes
    let node = tree;  // current node in the tree
    let queue = [node];
    let depth = getDepth(tree);  // depth of tree
    console.log("depth: " + depth);
    for (let level = 0; level < depth; ++level) {
        // need to run through 2^level nodes
        let numNodes = Math.pow(2, level);
        let currLevel = document.createElement('h4');
        for (let levelNum = 0; levelNum < numNodes; ++levelNum) {
            // pop node, output it and push child nodes
            node = queue.shift();
            // if node is null, push two nulls
            if (node === null) {
                currLevel.innerHTML += ("null ");
                queue.push(null);
                queue.push(null);
            } else if(node.char === undefined) {  // actual node, output and push children
                currLevel.innerHTML += (node.freq + " ");
                queue.push(node.left);
                queue.push(node.right);
            } else {  // char, output and push nulls
                currLevel.innerHTML += (node.freq + "(" + node.char + ") ");
                queue.push(null);
                queue.push(null);
            }
        }
        canvas.appendChild(currLevel);
    }
    return canvas;
}

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

    console.log(chars.split('').sort());

    // getting frequencies of each character
    freqList = countFreq(chars);
    for (let i = 0; i < freqList.length; ++i) {
        console.log(freqList[i].freq + " | " + freqList[i].char);
    }
    console.log("end");

    // constructing huffman tree
    freqList = freqList.sort((a, b) => a.freq - b.freq);
    tree = makeTree(freqList);

    inOrder(tree);

    // constructing output
    out = freqList;
    let innerHTML = document.createElement('h3');
    let canvas = document.createElement('div');
    innerHTML.innerHTML = `<h3>The corresponding Huffman Coding is:</h3>`;
    canvas =  drawTree(canvas, tree);
    hc.appendChild(innerHTML);
    hc.appendChild(canvas);
}