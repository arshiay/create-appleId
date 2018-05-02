/**
 * 利用原始的txt文件，生成json格式数据，并聚合到email.json文件中
 */
var fs = require("fs"),
    path = require("path"),
    _ = require("lodash");

var readFileName = "new_sohu1.txt";
var writeFileName = "email.json";
fs.readFile(path.join(__dirname, "./email_datas/" + readFileName), function(err, data) {
    if(err) throw err;
    var emailFile = data.toString("utf-8");
    var emailArray = emailFile.split("\r\n");
    var emailData = _.map(emailArray, function(item) {
        var emailParts = item.split("----");
        var emailName = emailParts[0];
        var emailPassword = emailParts[1];
        return {
            email: emailName,
            password: emailPassword,
            used: false
        }
    });
    var originDataString = fs.readFileSync(path.join(__dirname, "./email_datas/" + writeFileName), "utf-8");
    var originData = JSON.parse(originDataString);
    var newDatas = _.concat(originData, emailData);
    console.log("汇总后数据条数：" + newDatas.length);
    fs.writeFile(path.join(__dirname, "./email_datas/" + writeFileName), JSON.stringify(newDatas), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("write operation completed!");
        }

    })
});