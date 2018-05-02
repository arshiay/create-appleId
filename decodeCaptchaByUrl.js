var deathbycaptcha = require("deathbycaptcha2");

module.exports = function(url) {
    return new Promise(function(resolve, reject) {
        try {
            deathbycaptcha.credentials = {
                username: 'qingfengyijiu',
                password: 'iamdbcnumber77'
            };
            deathbycaptcha.decodeUrl(url, 10000, function(err, result) {
                resolve(result.text);
            });
        } catch (err) {
            reject(err);
        }
    })

}