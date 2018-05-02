var fs = require('fs'),
    path = require('path');

module.exports = function(base64Img, imageName) {
    var matches = base64Img.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
    var imgExt;
    switch (matches[1]) {
        case 'image/jpeg':
            imgExt = '.jpg';
            break;
        case 'image/png':
            imgExt = '.png';
            break;
        default:
            throw new Error('not supported image media type');
    }

    var filePath = path.join(__dirname,'/captchas/' + imageName + imgExt);
    fs.writeFileSync(filePath, response.data, 'base64', function(err) {
        console.log('');
    });
    return filePath;
}