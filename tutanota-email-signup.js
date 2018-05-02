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
        url: 'https://app.tutanota.com/#register',
        mailAddress: "a" + uuidV1().replace(/\-/g, ''),
        password: 'aA164_235!',
        passwordAgain: 'aA164_235!'
    };
    try {
        driver.get(data.url);
        console.log("开始注册邮箱：" + data.mailAddress + "@tutanota.com");
        driver.wait(until.titleIs("Tutanota"), 1000);
        var confirmButton = driver.findElement(By.css(".record .formAction button[type=submit]"));
        driver.wait(function() {
            return confirmButton.isDisplayed();
        }, 100000);
        driver.findElement(By.id("mailAddress")).sendKeys(data.mailAddress);
        driver.findElement(By.id("newpassword")).sendKeys(data.password);
        driver.findElement(By.id("newpassword2")).sendKeys(data.passwordAgain);
        driver.findElement(By.id("termsInput")).click();
        driver.wait(function() {
            return confirmButton.getAttribute("class").then(function(value) {
                return value.indexOf("disabled") < 0;
            });
        }, 100000);
        confirmButton.click();
        return {
            status: "success",
            data: ""
        }
    } catch (err) {
        return {
            status: "fail",
            data: err.message
        }
    }

    //node-tesseract
}





