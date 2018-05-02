var fs = require("fs"),
    path = require("path"),
    webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until,
    parseCaptcha = require('./parseCaptcha'),
    decodeCaptcha = require('./decodeCaptcha'),
    getMail = require("./getMail"),
    path = require('path'),
    uuidV1 = require('uuid/v1'),
    generatePassword = require("./generatePassword"),
    generateLastName = require("./generateLastName"),
    generateName = require("./generateName"),
    generateAnswer = require("./generateAnswer"),
    generateBirthYear = require("./generateBirthYear"),
    generateBirthMonth = require("./generateBirthMonth"),
    generateBirthDay = require("./generateBirthDay"),
    generateHost = require("./generateHost"),
    getEmailData = require("./getEmailData"),
    saveAppleId = require("./saveAppleId"),
    log4js = require("log4js");

log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('logs/log.log'), 'normal');
var logger = log4js.getLogger("normal");

/*var emailDataString = fs.readFileSync(path.join(__dirname, "./email_datas/email.json"), "utf-8");
 var emailDatas = JSON.parse(emailDataString);
 var emailData = emailDatas.pop();*/

var timeouts = {
    VISIT_CREATE_PAGE_TIMEOUT: 10000,
    WAIT_FOR_EMAIL_CODE_VERIFY_DIALOG_TIMEOUT: 40000,
    WAIT_FOR_GET_EMAIL_CODE_TIMEOUT: 60000,
    WAIT_FOR_EMAIL_CODE_VERIFY_DIALOG_CONTINUE_BUTTON: 5000,
    WAIT_FOR_CREATE_SUCCESS_PAGE_TIMEOUT: 30000
};

var createPageUrl = "https://appleid.apple.com/account";
var locale = 'zh'; // zh,en

async function wait(timeout) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve(true);
        }, timeout);
    });
}

async function saveData(data) {
    return await saveAppleId({
        appleId: data.email,
        password: data.password,
        lastName: data.lastName,
        firstName: data.firstName,
        q1: "你少年时代最好的朋友叫什么名字？",
        a1: data.answer0,
        q2: "你的理想工作是什么？",
        a2: data.answer1,
        q3: "你的父母是在哪里认识的？",
        a3: data.answer2,
        birthDate: data.birthYear.toString() + "-" + data.birthMonth.toString() + "-" + data.birthDay.toString(),
        country: data.country
    });
}

var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .usingServer('http://localhost:4444/wd/hub')
    .build();

async function createAppleId() {

    try {
        try {
            await driver.get(createPageUrl);
        } catch (error) {
            logger.error("访问" + createPageUrl + "页面失败");
            logger.error(error);
            createAppleId();
        }


        try {
            await driver.wait(until.elementLocated(By.css(".idms-captcha-wrapper")), timeouts.VISIT_CREATE_PAGE_TIMEOUT);
        } catch(error) {
            logger.error("加载" + createPageUrl + "页面超时");
            createAppleId();
        }

        var emailData = await getEmailData();
        var password = generatePassword();
        var data = {
            url: 'https://appleid.apple.com/account',
            email: emailData.email,
            emailPassword: emailData.password,
            emailHost: generateHost(emailData.email),
            password: password,
            confirmPassword: password,
            lastName: generateLastName(),
            firstName: generateName(),
            birthYear: generateBirthYear(),
            birthMonth: generateBirthMonth(),
            birthDay: generateBirthDay(),
            question0: 130, //130~135
            answer0: generateAnswer(),
            question1: 136, //136~141
            answer1: generateAnswer(),
            question2: 142, //142~147
            answer2: generateAnswer(),
            countryCode: 'CHN', //CHN-中国, THA-泰国
            country: "中国"
        };
        logger.info("准备生成的Apple Id信息:" + JSON.stringify(data));

        await driver.findElement(By.css("input[type='email']")).sendKeys(data.email);
        await driver.findElement(By.id("password")).sendKeys(data.password);
        await driver.findElement(By.css("input[id^='confirm-password-input']")).sendKeys(data.confirmPassword);
        await driver.findElement(By.xpath("//last-name-input//div[@class='name-input']//input")).sendKeys(data.lastName);
        await driver.findElement(By.xpath("//first-name-input//div[@class='name-input']//input")).sendKeys(data.firstName);
        var birthdayElement = await driver.findElement(By.css("input[class*='birthday-field']"));
        await birthdayElement.clear();
        var birthdayString;
        switch (locale) {
            case "en":
                birthdayString = data.birthMonth.toString() + data.birthDay.toString() + data.birthYear.toString() ;
                break;
            default:
                birthdayString = data.birthYear.toString() + data.birthMonth.toString() + data.birthDay.toString()
        }
        await birthdayElement.sendKeys(birthdayString);
        await driver.findElement(By.css("div[class*=qa-set0] select")).click();
        await driver.findElement(By.css("div[class*=qa-set0] select option[value='" + data.question0 + "']")).click();
        await driver.findElement(By.css("div[class*=qa-set0] div[class*='security-answer'] input")).sendKeys(data.answer0);
        await driver.findElement(By.css("div[class*=qa-set1] select")).click();
        await driver.findElement(By.css("div[class*=qa-set1] select option[value='" + data.question1 + "']")).click();
        await driver.findElement(By.css("div[class*=qa-set1] div[class*='security-answer'] input")).sendKeys(data.answer1);
        await driver.findElement(By.css("div[class*=qa-set2] select")).click();
        await driver.findElement(By.css("div[class*=qa-set2] select option[value='" + data.question2 + "']")).click();
        await driver.findElement(By.css("div[class*=qa-set2] div[class*='security-answer'] input")).sendKeys(data.answer2);
        await driver.findElement(By.id("countryOptions")).click();
        await driver.findElement(By.css("select#countryOptions option[value='" + data.countryCode + "']")).click();
        var base64Img = await driver.findElement(By.css("div[class='idms-captcha-wrapper'] img")).getAttribute("src");
        var imgName = uuidV1().replace(/\-/g, '');
        try {
            var filePath = await parseCaptcha(base64Img, imgName);
            var captcha = await decodeCaptcha(filePath);
            logger.info("解析得到验证码：" + captcha);
        } catch (error) {
            logger.error("decode图片验证码出错");
            logger.error(error);
            createAppleId();
        }

        await driver.findElement(By.css("div.captcha-input input")).sendKeys(captcha);
        await driver.findElement(By.css("button.button.button-primary.last.nav-action")).click();
        await driver.wait(until.elementLocated(By.id("char0")), timeouts.WAIT_FOR_EMAIL_CODE_VERIFY_DIALOG_TIMEOUT);
        await new Promise(function(resolve, reject) {
            setTimeout(function() {
                resolve(true);
            }, timeouts.WAIT_FOR_GET_EMAIL_CODE_TIMEOUT)
        });
        try {
            var mailCode = await getMail({
                user: data.email,
                password: data.emailPassword,
                host: data.emailHost,
                port: 993,
                tls: true
            });
        } catch (error) {
            logger.error("获取邮件验证码失败");
            logger.error(error);
            createAppleId();
        }

        logger.info("收到邮件验证码：" + mailCode);
        await driver.findElement(By.id("char0")).sendKeys(mailCode[0]);
        await driver.findElement(By.id("char1")).sendKeys(mailCode[1]);
        await driver.findElement(By.id("char2")).sendKeys(mailCode[2]);
        await driver.findElement(By.id("char3")).sendKeys(mailCode[3]);
        await driver.findElement(By.id("char4")).sendKeys(mailCode[4]);
        await driver.findElement(By.id("char5")).sendKeys(mailCode[5]);
        await new Promise(function(resolve, reject) {
            setTimeout(function() {
                resolve(true);
            }, timeouts.WAIT_FOR_EMAIL_CODE_VERIFY_DIALOG_CONTINUE_BUTTON)
        });
        await driver.findElement(By.css("div.idms-modal-dialog button.button.button-link.last.nav-action")).click();
        await driver.wait(until.urlIs("https://appleid.apple.com/account/manage"), timeouts.WAIT_FOR_CREATE_SUCCESS_PAGE_TIMEOUT);
        logger.info("Apple ID申请成功:" + JSON.stringify(data));
        await saveData(data);
        createAppleId();
    } catch (error) {
        logger.error(error);
        createAppleId();
    }
}

createAppleId();
