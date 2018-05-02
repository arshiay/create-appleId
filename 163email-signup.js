var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until,
    path = require('path'),
    uuidV1 = require('uuid/v1');

module.exports = function(data) {
    var driver = new webdriver.Builder()
        .forBrowser('chrome')
        .usingServer('http://localhost:4444/wd/hub')
        .build();

    data = {
        url: 'http://reg.email.163.com/unireg/call.do?cmd=register.entrance&from=163mail_right',
        name: "a" + uuidV1().replace(/\-/g, '').substring(0, 17),
        password: 'aA123456!',
        passwordAgain: 'aA123456!',
        mobile: '15120041246',
        captcha: ''
    };

    driver.get(data.url);
    driver.wait(until.titleIs("注册网易免费邮箱 - 中国第一大电子邮件服务商"), 1000);
    driver.findElement(By.css("ul#tabsUl li a[class='a1']")).click();
    driver.findElement(By.id("nameIpt")).sendKeys(data.name);
    driver.findElement(By.id("mainPwdIpt")).sendKeys(data.password);
    driver.findElement(By.id("mainCfmPwdIpt")).sendKeys(data.passwordAgain);
    driver.findElement(By.id("mainMobileIpt")).sendKeys(data.mobile);
    driver.findElement(By.id("vcodeIpt")).sendKeys(data.captcha);
    driver.findElement(By.id("vcodeImg"));
    var myScript = "var canvas = document.createElement('canvas');var context = canvas.getContext('2d');" +
        "var img = document.getElementById('vcodeImg');" +
    "canvas.width = img.width;" +
    "canvas.height = img.height;" +
    "context.drawImage(img, 0, 0 );" +
    "var myData = context.getImageData(0, 0, img.width, img.height);" +
    "return myData;";
    driver.executeScript(myScript).then(function(value) {
        var bf = new Buffer(value);
        console.log(bf);
    });
    /*driver.executeAsyncScript(function() {
        var canvas =  driver.manage().window().document().createElement('canvas');
        var context = canvas.getContext('2d');
        var img = driver.findElement(By.id("vcodeImg"));
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0 );
        var myData = context.getImageData(0, 0, img.width, img.height);
        return myData;
    }).then(function(data) {
        console.log(data);
    });*/

    driver.findElement(By.id("mainAcodeIpt")).sendKeys(data);
    return {
        status: "success",
        data: ""
    }
    //node-tesseract
}







