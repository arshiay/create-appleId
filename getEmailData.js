var ws = require("./util/ws");

module.exports = function() {
    return new Promise(function(resolve, reject) {
        ws.get({
            url: '/email'
        }).then(function(response) {
            if(response.code === 0) {
                // resolve(response.data);
                resolve({
                    email: 'pushiyuela@sohu.com',
                    password: 'youhuaitang'
                })
            } else {
                reject(new Error("没有可用邮箱"));
            }
        }).catch(function(err) {
            reject(new Error("请求email接口出现异常"));
        })
    })
}
