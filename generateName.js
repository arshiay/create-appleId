module.exports = function() {
    var chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    var result = "";
    for(var i = 0; i < 10; i++) {
        var random = Math.round(Math.random() * 10);
        var randomString = chars[random];
        result += randomString;
    }
    return result;
}