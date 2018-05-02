var sh = require("../getEmailData");
sh().then(function(email) {
    console.log(email);
});