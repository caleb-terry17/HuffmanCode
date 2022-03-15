///////////////////
// imports
///////////////////

// afekj;rajkg;lejk;akjfgja;ljaf;lejka;lk

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

// expands tree to be a full binary tree with null nodes where needed
function expandTree(tree) {
    let queue = [tree];
    let depth = getDepth(tree);  // depth of tree

    // running breadth first search to create null nodes where needed
    for (let level = 0; level < depth; ++level) {
        // need to run through 2^level nodes
        let numNodes = Math.pow(2, level);
        for (let nodeNum = 0; nodeNum < numNodes - 1; ++nodeNum) {
            // pop node, give it children, and push child nodes
            let node = queue.shift();
            // if char => give "null" children
            if (node.char !== undefined || node.char === null) {
                node.left = new Char(null, null);
                node.right = new Char(null, null);
            }
            queue.push(node.left);
            queue.push(node.right);
        }
    }
    return tree;
}

// returns a string of the node, char, or null node
function toStringNode(node) {
    if (node.char === null) {  // null node
        return "&nbsp;&nbsp;&nbsp;";
    } else if (node.char !== undefined) {  // char
        return node.freq + "-" + node.char;
    } else {  // node
        return "&nbsp;" + node.freq + "&nbsp;";
    }
}

///////////////////
// i/o
///////////////////
// draws a binary tree of the huffman encoding
function drawTree(tag, tree) {
    // expanding tree
    tree = expandTree(tree);

    let depth = getDepth(tree);  // depth of tree

    // creating array of strings to store each rows output
    let pTags = [];
    for (let level = 0; level < depth; ++level) {
        pTags.push("");
    }

    // runs an inorder traversal on tree adding spaces where needed
    function inOrder(node, row) {
        // check for end of loop
        if (node.left !== undefined) {
            // call left child
            inOrder(node.left, row - 1);
            // insert necessary data into pTags array (spaces and freq)
            for (let r = 0; r < depth; ++r) {
                pTags[r] += (r == row ? toStringNode(node) : "&nbsp;&nbsp;&nbsp;");
            }
            // call right child
            inOrder(node.right, row - 1);
        }
    }

    inOrder(tree, depth - 1);

    // convert pTag strings to tags and append to div
    for (let level = depth - 1; level >= 0; --level) {
        let pTag = document.createElement('p');
        // console.log("i: " + level + " " + pTags[level]);
        pTag.innerHTML = pTags[level];
        tag.appendChild(pTag);
    }
    
    return tag;
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
        hcOut.innerHTML = "<h3 id=huffmanTable>Input Too Large (>1000 characters)</h3>";
        return; 
    }

    // getting frequencies of each character
    freqList = countFreq(chars);
    
    console.log(freqList.sort((a, b) => a.freq - b.freq));

    // constructing huffman tree
    freqList = freqList.sort((a, b) => a.freq - b.freq);  // sorting nodes in array by frequency
    tree = makeTree(freqList);

    // tags to hold huffman tree
    let div = document.createElement('div');
    let mainH3 = document.createElement('h3');

    // adding id to div tag
    div.id = "huffmanTable"

    // adding main text to div 
    mainH3.innerHTML = `<h3>The corresponding Huffman Coding is:</h3>`;  // "main text"
    div.appendChild(mainH3);

    // constructing tree
    div =  drawTree(div, tree);

    // if div has already been attached => remove div
    if (document.getElementById("huffmanTable") !== null) {
        hc.removeChild(document.getElementById("huffmanTable"));
    }

    // appending div to html document
    hc.appendChild(div);
}