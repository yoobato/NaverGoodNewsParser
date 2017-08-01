'use strict';

var request = require('request'),
    Iconv   = require('iconv').Iconv,
    cheerio = require("cheerio"),
    log     = require('./lib/log');

log.info('*** 네이버 따뜻한 세상 뉴스 파서 시작 ***');

var iconv = new Iconv('euc-kr', 'utf-8//translit//ignore');

var naverHost = 'news.naver.com';

var currentPage = 1;
var getNewsListOption = {
    url: 'http://' + naverHost + '/main/hotissue/sectionList.nhn?sid1=102&cid=3069&page=' + currentPage,
    encoding: null
};
request.get(getNewsListOption, function(error, response, html) {
    if (error) {
        throw error;
    }

    var htmlData = iconv.convert(html).toString();
    var $ = cheerio.load(htmlData);
    
    var articleATags = $('dl.cnt dt.t a');
    articleATags.each(function() {
        var articleUrl = $(this).attr('href');

        var getArticleOption = {
            url: 'http://' + naverHost + articleUrl,
            encoding: null
        };
        request.get(getArticleOption, function(error2, response2, html2) {
            if (error2) {
                throw error;
            }

            var htmlData2 = iconv.convert(html2).toString();
            var $2 = cheerio.load(htmlData2);

            var articleTitle = $2('#articleTitle').text();
            console.log(articleTitle);
        });

        // console.log(url);
    });
});
