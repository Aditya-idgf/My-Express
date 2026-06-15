// function add (a, b) {
//     return a + b;
// }

// function sub (a,b) {
//     return a - b;
// }

// // module.exports = {add, sub};    
// module.exports = {
//     addFN: add, 
//     subFN: sub
// };    // able to export multilple functions once 

// module.exports will override the privious values at the end so it can be used only once


// could be done as anonymus fn's

exports.add = (a, b) => {
    return a + b;
}

exports.sub = (a, b) => {
    return a - b;
}

// this returns : { add: [Function (anonymous)], sub: [Function (anonymous)] }