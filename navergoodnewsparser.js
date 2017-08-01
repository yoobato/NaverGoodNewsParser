'use strict';

var parser      = require('./lib/parser'),
    fs          = require('fs');

console.log('*** 네이버 따뜻한 세상 뉴스 파서 시작 ***');

if (fs.existsSync('./output.txt')) {
    fs.unlinkSync('./output.txt');
}

var naverHost = 'news.naver.com';
var parser = new parser(naverHost);

for (var page = 1; page <= 2; page++) {
    parser.parseNaverArticlePathList(page, function(page, articlePaths) {
        for (var i = 0; i < articlePaths.length; i++) {
            var articlePath = articlePaths[i];
            var count = 0;
            parser.parseNaverArticleDetail(page, i, articlePath, function(page, index, articleOriginalUrl, articleTitle, articleDate, articleImageDesc) {

                // TODO: 그냥... 또 request 보내자 후 ㅠ...
                // fs.appendFileSync('./output.txt', articleOriginalUrl + '\t' + articleTitle + '\t' + articleDate + '\t' + articleImageDesc + '\n');
            });
        }
    });
}
