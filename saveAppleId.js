var ws = require("./util/ws");

module.exports = function(data) {
    return new Promise(function(resolve, reject) {
        ws.post({
            url: '/email/registered',
            data: data
        }).then(function(response) {
            if(response.code === 0) {
                resolve(response.data);
            } else {
                reject(new Error("没有可用邮箱"));
            }
        }).catch(function(err) {
            reject(new Error("请求email接口出现异常"));
        })
    })
}
