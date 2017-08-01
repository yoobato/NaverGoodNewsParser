'use strict';

var request = require('request'),
    cheerio = require('cheerio'),
    Iconv   = require('iconv').Iconv;

function Parser(baseUrl) {
    this.baseUrl = baseUrl;
}

Parser.prototype.parseNaverArticlePathList = function(page, completionHandler) {
    var url = 'http://' + this.baseUrl + '/main/hotissue/sectionList.nhn?sid1=102&cid=3069&page=' + page;
    request.get(url, function(error, response, html) {
        if (error) {
            throw error;
        }

        var $ = cheerio.load(html);
        var articleATags = $('dl.cnt dt.t a');
        var articlePaths = [];
        articleATags.each(function() {
            var articlePath = $(this).attr('href');
            articlePaths.push(articlePath);
        });

        completionHandler(page, articlePaths);
    });
};

Parser.prototype.parseNaverArticleDetail = function(page, index, articlePath, completionHandler) {
    var option = {
        'uri': 'http://' + this.baseUrl + articlePath,
        'encoding': null
    };
    request.get(option, function(error, response, html) {
        if (error) {
            throw error;
        }

        // content-type 으로 먼저 보자
        
        var iconv = new Iconv('EUC-KR', 'UTF-8//TRANSLIT//IGNORE');
        var htmlBinary = new Buffer(html, 'binary');
        var htmlData = iconv.convert(htmlBinary).toString();

        var $ = cheerio.load(htmlData);

        // TODO: 이걸로 그냥 일일히 수집해야겠다...
        var title = $('meta[property="og:title"]').attr('content');
        console.log(title);

        var articleTitle = $('#articleTitle').text();
        var articleDate = $('div.sponsor span.t11').text();
        var articleOriginalUrl = $('div.sponsor a.btn_artialoriginal').attr('href');
        var articleImageDesc = $('span.end_photo_org em.img_desc').first().text();

        completionHandler(page, index, articleOriginalUrl, articleTitle, articleDate, articleImageDesc);
    });
}

module.exports = Parser;
