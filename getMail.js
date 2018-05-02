var imap = require('imap');
var mailparser = require("mailparser");

module.exports = function(data) {
    return new Promise(function(resolve, reject) {
        try {
            var server = new imap(data);

            function openInbox(cb) {
                server.openBox('INBOX', true, cb);
            }
            server.once('ready', function () {
                openInbox(function (err, box) {
                    if (err) return reject(err);
                    var f = server.seq.fetch(box.messages.total + ":*", {
                        bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'],
                        struct: true
                    });
                    f.on('message', function (msg, seqno) {
                        console.log('Message #%d', seqno);
                        var prefix = '(#' + seqno + ') ';
                        msg.on('body', function (stream, info) {
                            mailparser.simpleParser(stream, function (err, mail) {
                                var markString,
                                    markIndex,
                                    result;
                                if (mail.text) {
                                    if(data.user.endsWith("@sina.com")) {
                                        markString = "=B9=E9=AA=8C=E8=AF=81=E7=A0=81=EF=BC=9A";
                                        markIndex = mail.text.indexOf(markString) + markString.length + 2;
                                    } else {
                                        // markString = "<tr><td class=\"paragraph verification-code\" style=\"padding:0 5% 18px;font:300 23px/18px 'Lucida Grande', Lucida Sans, Lucida Sans Unicode, sans-serif, Arial, Helvetica, Verdana, sans-serif;color:#333;\">";
                                        markString = "padding:0 5% 18px;font:300 23px/18px 'Lucida Grande', Lucida Sans, Lucida Sans Unicode, sans-serif, Arial, Helvetica, Verdana, sans-serif;color:#333;";
                                        markIndex = mail.text.indexOf(markString) + markString.length + 2;
                                    }
                                    result = mail.text.substring(markIndex, markIndex + 6);
                                    console.log("get the code: " + result);
                                    resolve(result);

                                } else {
                                    reject(new Error("尚未收到Apple邮件"));
                                }
                            });
                        });
                        msg.once('attributes', function (attrs) {
                            console.log(prefix + 'Attributes: %s', JSON.stringify(attrs));
                        });
                        msg.once('end', function () {
                            console.log(prefix + 'Finished');
                        });
                    });
                    f.once('error', function (err) {
                        console.log('Fetch error: ' + err);
                        reject(err);
                    });
                    f.once('end', function () {
                        console.log('Done fetching all messages!');
                        server.end();
                    });
                });
            });

            server.once('error', function (err) {
                console.log(err);
                reject(err);
            });

            server.once('end', function () {
                console.log('Connection ended');
            });

            server.connect();
        } catch (err) {
            reject(err);
        }
    });
}
