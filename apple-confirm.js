var fs = require("fs"),
    path = require("path"),
    webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until,
    parseCaptcha = require('./parseCaptcha'),
    decodeCaptcha = require('./decodeCaptcha'),
    generateHost = require("./generateHost"),
    getMail = require("./getMail"),
    path = require('path'),
    uuidV1 = require('uuid/v1'),
    getEmailData = require("./getEmailData"),
    saveAppleId = require("./saveAppleId"),
    log4js = require("log4js");

log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('logs/log.log'), 'normal');
var logger = log4js.getLogger("normal");


var timeouts = {
    WAIT_FOR_CREATE_PAGE_VISIT: 10000,
    VISIT_CREATE_PAGE_TIMEOUT: 20000,
    WAIT_FOR_EMAIL_CODE_VERIFY_DIALOG_TIMEOUT: 40000,
    WAIT_FOR_GET_EMAIL_CODE_TIMEOUT: 60000,
    WAIT_FOR_EMAIL_CODE_VERIFY_DIALOG_CONTINUE_BUTTON: 5000,
    WAIT_FOR_CREATE_SUCCESS_PAGE_VISIT: 10000,
    WAIT_FOR_CREATE_SUCCESS_PAGE_TIMEOUT: 30000
};


var createPageUrl = "https://mail.sohu.com/fe/#/login";
// var locale = 'zh'; // zh,en

function wait(timeout) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve(true);
        }, timeout);
    });
}

//回调方法
function callBack(data) {

}

var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .usingServer('http://localhost:4444/wd/hub')
    .build();

function confirmAppleAccount() {
    driver.get(createPageUrl).then(function() {
    //   wait(timeouts.WAIT_FOR_CREATE_PAGE_VISIT).then(function() {
    //       driver.wait(until.elementLocated(By.css(".idms-captcha-wrapper")), timeouts.VISIT_CREATE_PAGE_TIMEOUT).then(function(elem) {
            getEmailData().then(function(emailData) {
                // var data = {
                //     email: emailData.email,
                //     emailPassword: emailData.password,
                //     emailHost: generateHost(emailData.email),
                // };
                var data = {
                    email: 'zhuozhuangdisi@sohu.com',
                    emailPassword: 'mideng429',
                    emailHost: 'imap.sohu.com'
                };
                getMail({
                    user: data.email,
                    password: data.emailPassword,
                    host: data.emailHost,
                    port: 993,
                    tls: true,
                }).then(function(mailCode) {
                    logger.info("收到邮件验证码：" + mailCode);
                    // driver.get(mailCode).then(function() {
                    //   wait(timeouts.WAIT_FOR_CREATE_SUCCESS_PAGE_VISIT).then(function() {
                    //       driver.wait(until.urlContains("appleid.apple.com/account/manage"), timeouts.WAIT_FOR_CREATE_SUCCESS_PAGE_TIMEOUT).then(function () {
                    //           logger.info("Apple ID申请成功:" + JSON.stringify(data));
                    //           callBack(data);
                    //           confirmAppleAccount();
                    //       }).catch(function(err) {
                    //           logger.error("等待成功页面超时");
                    //           logger.error(err);
                    //           confirmAppleAccount();
                    //       });
                    //   })
                    // }).catch(function(err) {
                    //     logger.error("验证失败，失败原因：打开验证地址失败");
                    //     confirmAppleAccount();
                    // });
                }).catch(function(err) {
                    logger.error("申请Apple ID失败，失败原因：获取验证码失败");
                    // confirmAppleAccount();
                })
            }).catch(function(err) {
              logger.error("获取邮箱信息异常");
              logger.error(err);
              // confirmAppleAccount();
            });
    //       }).catch(function(err) {
    //         logger.error("加载" + createPageUrl + "页面超时");
    //         createAppleId();
    //       })
    //   )};
    // }).catch(function(err) {
    //     logger.error("访问" + createPageUrl + "页面失败");
    //     logger.error(err);
    //     createAppleId();
   });
}

confirmAppleAccount();
