'use strict';

var parser  = require('./lib/parser'),
    log     = require('./lib/log');

log.info('*** 네이버 따뜻한 세상 뉴스 파서 시작 ***');

var naverHost = 'news.naver.com';
var parser = new parser(naverHost);

var currentPage = 1;
parser.parseNaverArticlePathList(currentPage, function(articlePaths) {
    for (var i = 0; i < articlePaths.length; i++) {
        var articlePath = articlePaths[i];
        parser.parseNaverArticleMetadata(articlePath, function(articleOriginalUrl, articleDate, articleImageDesc) {
            console.log("URL: " + articleOriginalUrl + " | Date: " + articleDate + " | Desc: " + articleImageDesc);
        });
    }
});
