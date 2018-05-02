module.exports = function(email) {
    if(email == null) throw new Error("email address is empty");
    if(email.endsWith("@hotmail.com")) {
        return "imap-mail.outlook.com";
    }
    var atIndex = email.indexOf("@");
    if(atIndex > -1) {
        return "imap." + email.substring(atIndex + 1, email.length);
    } else {
        throw new Error("Not correct email address");
    }
}