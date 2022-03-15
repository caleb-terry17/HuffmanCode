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
// draws a binary tree of the huffman encoding
function drawTree(body, tree) {
    // running breadth first search to get nodes
    let node = tree;  // current node in the tree
    let queue = [node];
    let depth = getDepth(tree);  // depth of tree
    for (let level = 0; level < depth; ++level) {
        // need to run through 2^level nodes
        let numNodes = Math.pow(2, level);
        let currLevel = document.createElement('tr');  // current level of table
        for (let levelNum = 0; levelNum < numNodes; ++levelNum) {
            // pop node, output it and push child nodes
            node = queue.shift();
            // col entry for this node
            let entry = document.createElement('td');
            // if node is null, push two nulls
            if (node === null) {
                // editing col entry (null)
                entry.innerHTML = "";
                // pushing nodes to queue for bfs
                queue.push(null);
                queue.push(null);
            } else if(node.char === undefined) {  // actual node, output and push children
                // editing col entry (node)
                entry.innerHTML = node.freq;
                // pushing nodes to queue for bfs
                queue.push(node.left);
                queue.push(node.right);
            } else {  // char, output and push nulls
                // editing col entry (char)
                entry.innerHTML = node.freq + " (" + node.char + ")";
                // pushing nodes to queue for bfs
                queue.push(null);
                queue.push(null);
            }
            currLevel.appendChild(entry);
        }
        body.appendChild(currLevel);
    }
    return body;
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

    // constructing huffman tree
    freqList = freqList.sort((a, b) => a.freq - b.freq);
    tree = makeTree(freqList);

    // tags to hold huffman tree
    let innerHTML = document.createElement('h3');
    let canvas = document.createElement('table');
    let tbody = document.createElement('tobdy');
    let div = document.createElement('div');

    innerHTML.innerHTML = `<h3>The corresponding Huffman Coding is:</h3>`;
    
    // constructing tree
    tbody =  drawTree(tbody, tree);

    // adding children tags to main div tag
    canvas.appendChild(tbody);
    div.appendChild(innerHTML);
    div.appendChild(canvas);

    // adding id to div tag
    div.id = "huffmanTable"

    // removing div if div has already been attached
    if (document.getElementById("huffmanTable") !== null) {
        hc.removeChild(document.getElementById("huffmanTable"));
    }

    // appending div to html document
    hc.appendChild(div);
}