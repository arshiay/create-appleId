var uuidV1 = require("uuid/v1");

function getRandomUppercaseChar() {
    var chars = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    var randomCharIndex = Math.round(Math.random() * 100) % 26;
    return chars[randomCharIndex];
}

function getRandomLowercaseChar() {
    var chars = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    var randomCharIndex = Math.round(Math.random() * 100) % 26;
    return chars[randomCharIndex];
}

function getRandomNumericChar() {
    return (Math.round(Math.random() * 10) % 10).toString();
}

module.exports = function() {
    var result = "";
    for(var i = 0;i < 8; i++) {
        if(i % 3 === 0) {
            result += getRandomLowercaseChar();
        } else if(i % 3 == 1) {
            result += getRandomNumericChar();
        } else {
            result += getRandomUppercaseChar();
        }
    }
    return result;
}