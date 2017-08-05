'use strict';

var cheerio         = require('cheerio'),
    requestSync     = require('sync-request'),
    fs              = require('fs'),
    iconv           = require('iconv-lite'),
    NewsMeta        = require('./lib/news-meta');

console.log('*** 네이버 따뜻한 세상 뉴스 파서 시작 ***');
console.time('exec_time');

if (fs.existsSync('./output.txt')) {
    fs.unlinkSync('./output.txt');
}

var articlePaths = [];
for (var page = 1; page <= 145; page++) {
    var url = 'http://news.naver.com/main/hotissue/sectionList.nhn?sid1=102&cid=3069&page=' + page;
    var response = requestSync('GET', url);

    var $ = cheerio.load(response.getBody('utf8'));
    var articleATags = $('dl.cnt dt.t a');
    articleATags.each(function() {
        var articlePath = $(this).attr('href');
        articlePaths.push(articlePath);
    });

    console.log('[P.' + page + '] ' + articlePaths.length + ' ArticlePaths fetched.');
}

var newsMetas = [];
var index = 0;
while (index < articlePaths.length) {
    var naverUrl = 'http://news.naver.com' + articlePaths[index];
    var response = undefined;
    try {
        response = requestSync('GET', naverUrl);
    } catch (error) {
        console.log('[' + (index + 1) + '] Error: ' + error.message);
        continue;
    }
    
    // EUC-KR => UTF-8
    var html = iconv.decode(response.getBody(), 'EUC-KR').toString();
    var $ = cheerio.load(html);

    var articleUrl = $('div.article_header div.sponsor a.btn_artialoriginal').first().attr('href');
    if (!articleUrl) {
        articleUrl = '';
    }
    var articleTitle = $('meta[property="og:title"]').first().attr('content');
    var articleDesc = $('meta[property="og:description"]').first().attr('content');
    var articleImageUrl = $('div.article_body span.end_photo_org img').first().attr('src');
    if (!articleImageUrl) {
        articleImageUrl = '';
    }
    var articlePublisher = $('meta[name="twitter:creator"]').first().attr('content');
    if (!articlePublisher) {
        articlePublisher = $('meta[property="og:article:author"]').first().attr('content');
    }

    var articleDate = $('div.article_header div.sponsor span.t11').first().text();

    var newsMeta = new NewsMeta();
    newsMeta.setNaverUrl(naverUrl);
    newsMeta.setOriUrl(articleUrl);
    newsMeta.setTitle(articleTitle);
    newsMeta.setDesc(articleDesc);
    newsMeta.setImageUrl(articleImageUrl); 
    newsMeta.setPublisher(articlePublisher);
    newsMeta.setDate(articleDate);
    fs.appendFileSync('./output.txt', newsMeta.toString() + '\n');

    console.log('[' + (++index) + '] ' + newsMeta.title);
}

console.log('*** 네이버 따뜻한 세상 뉴스 파서 종료 ***');
console.timeEnd('exec_time');
