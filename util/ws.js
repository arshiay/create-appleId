var rp = require("request-promise");
var errors = require('request-promise/errors');
var _ = require('lodash');
var logger = console;

function completeUri(url) {
    return "http://asos.upay360.cn" + url;
}

/**
 *
 * @param res   the Web Response
 * @param options
 *              url 接口url, string
 *              method  httpMethod, string
 *              qs  查询参数, plain object
 *              data    post参数, plain object
 * @return Promise
 *
 *
 */
function ws(options) {
    var contentType = options.contentType ? options.contentType : 'application/json',
        method = options.method ? options.method : 'GET',
        isJson = false,
        isForm = false,
        headers = _.extend({}, options.headers, {
            'Content-Type': contentType
        }),
        uri = completeUri(options.url);
    if(options.token) {
        headers['X-Auth-Token'] = options.token;
    }
    switch (contentType) {
        case "application/json":
            isJson = true;
            break;
        case "application/x-www-form-urlencoded":
            isForm = true;
            break;
        default:
        // do nothing
    }
    var _options = {
        uri: uri,
        method: method,
        qs: options.qs,
        body: isJson ? options.data : options.body,
        form: isForm ? options.data : undefined,
        json: isJson,
        headers: headers
    };

    return rp(_options).then(function(body) {
        logger.info('-------------调用接口--------------------');
        logger.info('请求信息：' + JSON.stringify(_options));
        logger.info('响应结果：' + method + ' ' + uri + ' ' + JSON.stringify(body));
        return body;
    }).catch(errors.StatusCodeError, function(reason) {
        logger.info('-------------调用接口--------------------');
        logger.info('请求信息：' + JSON.stringify(_options));
        logger.info('响应结果：' + method + ' ' + uri + ' ' + reason.statusCode);
        var status = reason.statusCode;
        return {
            code: status,
            msg: '服务端API接口异常'
        }
    }).catch(errors.TransformError, function(reason) {
        logger.info('-------------调用接口--------------------');
        logger.info('请求信息：' + JSON.stringify(_options));
        logger.error('响应结果：' + method + ' ' + uri + ' ' + reason);
        return {
            code: 500,
            msg: '服务端API数据解析错误'
        }
    }).catch(function(err) {
        logger.info('-------------调用接口--------------------');
        logger.info('请求信息：' + JSON.stringify(_options));
        logger.error('响应结果：' + method + ' ' + uri + ' ' + err);
        return {
            code: 500,
            msg: '网络异常，请稍后重试'
        }
    });
}

ws.get = function(options) {
    options.method = 'GET';
    return ws(options);
};

ws.post = function(options) {
    options.method = 'POST';
    return ws(options);
};

ws.put = function(options) {
    options.method = 'PUT';
    return ws(options);
};

ws.delete = function(options) {
    options.method = 'DELETE';
    return ws(options);
};

ws.handleResponse = function(response, res) {
    if(response.code >= 400 && response.code <= 599) {
        res.status(response.code);
        res.send(response.msg);
    } else {
        res.json(response);
    }
};

module.exports = ws;