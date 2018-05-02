var deathbycaptcha = require("deathbycaptcha2"),
    fs = require("fs");

module.exports = function(filePath) {
    return new Promise(function(resolve, reject) {
        try {
            deathbycaptcha.credentials = {
                username: 'upayaso',
                password: 'upay360!'
            };
            deathbycaptcha.decodeFile(filePath, 10000, function(err, result) {
                fs.unlink(filePath);
                if(err) {
                    reject(err);
                } else {
                    resolve(result.text);
                }
            });
        } catch (err) {
            reject(err);
        }
    })

}