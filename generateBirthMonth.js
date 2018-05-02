module.exports = function() {
    var result = Math.round(Math.random() * 100) % 11 + 1;
    if(result < 10) {
        result = "0" + result;
    }
    return result
}