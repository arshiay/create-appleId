module.exports = function() {
    var result = Math.round(Math.random() * 100) % 28 + 1;
    if(result < 10) {
        result = "0" + result;
    }
    return result;
}