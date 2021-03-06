'use strict';

var cheerio         = require('cheerio'),
    requestSync     = require('sync-request'),
    fs              = require('fs'),
    Iconv           = require('iconv').Iconv,
    NewsMeta        = require('./lib/news-meta'),
    readlineSync    = require('readline-sync');

console.log('*** 네이버 따뜻한 세상 뉴스 파서 ***');

// 시작 페이지 입력
var startPage = undefined;
while (startPage === undefined) {
    startPage = readlineSync.question('시작 페이지: ');
    if (isNaN(startPage)) {
        startPage = undefined;
    }
}

var endPage = undefined;
while (endPage === undefined) {
    endPage = readlineSync.question('종료 페이지: ');
    if (isNaN(endPage)) {
        endPage = undefined;
    }
}

console.log('*** 네이버 따뜻한 세상 뉴스 파서 시작 ***');
console.time('exec_time');

if (fs.existsSync('./output.txt')) {
    fs.unlinkSync('./output.txt');
}

var articlePaths = [];
for (var page = startPage; page <= endPage; page++) {
    var url = 'http://news.naver.com/main/hotissue/sectionList.nhn?sid1=102&cid=3069&page=' + page;
    var response = requestSync('GET', url);

    var $ = cheerio.load(response.getBody('utf8'));
    var articleATags = $('dl.cnt dt.t a');
    articleATags.each(function() {
        var articlePath = $(this).attr('href');
        // 붎필요한 session id 제거
        articlePath = articlePath.replace(/;jsessionid=\w*/, '');
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

    var html = '';    
    var contentType = response.headers['content-type'].toLowerCase();
    if (contentType.indexOf('utf-8') > '-1') {
        // UTF-8
        html = response.getBody('utf8');
    } else {
        // EUC-KR => UTF-8
        var iconv = new Iconv('EUC-KR', 'UTF-8//TRANSLIT//IGNORE');
        html = iconv.convert(response.getBody()).toString();
    }
    var $ = cheerio.load(html);

    var articleUrl = $('div.article_header div.sponsor a.btn_artialoriginal').first().attr('href');
    if (!articleUrl || articleUrl.trim().length == 0) {
        articleUrl = $('div.article_info a.btn_news_origin').first().attr('href');
        if (!articleUrl || articleUrl.trim().length == 0) {
            articleUrl = '';
        }
    }
    var articleTitle = $('meta[property="og:title"]').first().attr('content');
    var articleDesc = $('meta[property="og:description"]').first().attr('content');
    var articleImageUrl = $('div.article_body span.end_photo_org img').first().attr('src');
    if (!articleImageUrl || articleImageUrl.trim().length == 0) {
        articleImageUrl = $('meta[property="og:image"]').first().attr('content');
        // 네이버 기본 로고 이미지는 제외
        if (!articleImageUrl || articleImageUrl.trim().length == 0
            || articleImageUrl == 'http://static.news.naver.net/image/news/2014/press_logo/tventertain160802.png' 
            || articleImageUrl == 'http://static.news.naver.net/image/news/ogtag/navernews_200x200_20160804.png') {
            articleImageUrl = '';
        }
    }
    var articlePublisher = $('meta[name="twitter:creator"]').first().attr('content');
    if (!articlePublisher) {
        articlePublisher = $('meta[property="og:article:author"]').first().attr('content');
    }

    var articleDate = $('div.article_header div.sponsor span.t11').first().text();
    if (!articleDate) {
        articleDate = $('div.article_info span.author em').first().text();
    }

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
