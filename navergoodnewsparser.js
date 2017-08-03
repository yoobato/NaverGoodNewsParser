'use strict';

var cheerio         = require('cheerio'),
    requestSync     = require('sync-request'),
    fs              = require('fs'),
    iconv           = require('iconv-lite'),
    NewsMeta        = require('./lib/news-meta'),
    NewsMetaParser  = require('./lib/news-meta-parser'),
    jschardet       = require('jschardet');

console.log('*** 네이버 따뜻한 세상 뉴스 파서 시작 ***');
console.time('exec_time');

if (fs.existsSync('./output.txt')) {
    fs.unlinkSync('./output.txt');
}

// TODO: 페이지 계산을 이렇게 말고, 다르게 할 수 있는 방법이 있을까???
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
for (var i = 0; i < articlePaths.length; i++) {
    var url = 'http://news.naver.com' + articlePaths[i];
    var response = requestSync('GET', url);
    
    // EUC-KR => UTF-8
    var html = iconv.decode(response.getBody(), 'EUC-KR').toString();
    var $ = cheerio.load(html);
    
    var oriUrl = $('div.article_header div.sponsor a.btn_artialoriginal').first().attr('href');
    var oriTitle = $('div.article_header #articleTitle').first().text();
    var oriImageUrl = $('div.article_body span.end_photo_org img').first().attr('src');
    var publisher = $('div.article_header div.press_logo a img').first().attr('alt');
    if (!publisher) {
        publisher = $('div.article_header div.press_logo a img').first().attr('title');
    }
    var date = $('div.article_header div.sponsor span.t11').first().text();

    var newsMeta = new NewsMeta(publisher, date);
    
    response = requestSync('GET', oriUrl);
    var encoding = jschardet.detect(response.getBody()).encoding.toLowerCase();
    if (encoding == 'euc-kr') {
        html = iconv.decode(response.getBody(), 'EUC-KR').toString();
    } else {
        html = iconv.decode(response.getBody(), 'utf-8').toString();
    }
    $ = cheerio.load(html);

    var parser = new NewsMetaParser();
    var url = parser.parseMetaUrl($);
    newsMeta.url = url.length > 0 ? url : oriUrl;
    newsMeta.setUrl(url);

    var title = parser.parseMetaTitle($);
    title = title.length > 0 ? title : oriTitle;
    newsMeta.setTitle(title);

    var desc = parser.parseMetaDescription($);
    newsMeta.setDesc(desc);
    
    var imageUrl = parser.parseMetaImageUrl($);
    imageUrl = imageUrl.length > 0 ? imageUrl : oriImageUrl;
    newsMeta.setImageUrl(imageUrl);

    fs.appendFileSync('./output.txt', newsMeta.toString() + '\n');

    console.log('[' + (i + 1) + '] Article (' + newsMeta.title + ') saved.');
}

console.timeEnd('exec_time');
