var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until,
    path = require('path'),
    uuidV1 = require('uuid/v1'),
    decodeCaptcha = require("./decodeCaptchaByUrl");

module.exports = function(data) {
    return new Promise(function(resolve, reject) {
        var driver = new webdriver.Builder()
            .forBrowser('chrome')
            .usingServer('http://localhost:4444/wd/hub')
            .build();

        data = {
            url: 'https://passport.yandex.com/registration/mail',
            firstName: 'tulatu',
            lastName: 'hadalo',
            userName: "a" + uuidV1().replace(/\-/g, '').substring(0, 24),
            password: 'aA164_235!',
            passwordAgain: 'aA164_235!',
            question: 13,
            answer: 'xixia'
        };
        try {
            console.log("开始注册邮箱：" + data.userName + "@yandex.com");
            driver.get(data.url);
            driver.wait(until.titleIs("Registration"), 1000);
            driver.findElement(By.id("firstname")).sendKeys(data.firstName);
            driver.findElement(By.id("lastname")).sendKeys(data.lastName);
            driver.findElement(By.id("login")).sendKeys(data.userName);
            driver.findElement(By.id("password")).sendKeys(data.password);
            driver.findElement(By.id("password_confirm")).sendKeys(data.passwordAgain);
            driver.findElement(By.css(".human-confirmation-switch.human-confirmation-via-captcha")).click();
            var selectInput = driver.findElement(By.id("hint_question_id"));
            driver.wait(function() {
                return selectInput.isDisplayed();
            }, 1000);
            selectInput.click();
            driver.wait(until.elementLocated(By.xpath("//ul[@id='ui-id-1']/li[3]")), 10000).then(function(elem) {
                elem.click();
            });
            driver.findElement(By.id("hint_answer")).sendKeys(data.answer);
            driver.findElement(By.css(".captcha__captcha__text")).getAttribute("src").then(function(value) {
                return decodeCaptcha(value);
            }).then(function(captcha) {
                console.log("------------------");
                console.log(captcha);
                driver.findElement(By.id("answer")).sendKeys(captcha);
                driver.findElement(By.id("nb-5")).click();
                driver.wait(until.titleIs("Yandex.Passport"), 100000).then(function(value) {
                    driver.quit();
                    resolve({
                        status: "success",
                        data: {
                            email: data.userName + '@yandex.com',
                            password: data.password
                        }
                    });
                });

            });
        } catch(err) {
            resolve({
                status: "fail",
                data: err.message
            });
        }
    });
}





