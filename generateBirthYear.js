module.exports = function() {
    var baseYear = 1985;
    var random = Math.round(Math.random() * 10);
    var signRandom = Math.round(Math.random() * 10) % 2;
    var result;
    if(signRandom == 0) {
        result = baseYear + random;
    } else {
        result = baseYear - random;
    }
    return result;
}