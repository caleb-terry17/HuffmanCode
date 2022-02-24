///////////////////
// globals
///////////////////
// document tags to display compare values
let ss = document.getElementById("hcOut");

///////////////////
// huffman code calculation
///////////////////

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