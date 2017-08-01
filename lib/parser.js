'use strict';

var request = require('request'),
    Iconv   = require('iconv').Iconv,
    cheerio = require("cheerio");

function Parser(baseUrl) {
    this.baseUrl = baseUrl;
}

Parser.prototype.parseNaverArticlePathList = function(page, completionHandler) {
    var option = {
        url: 'http://' + this.baseUrl + '/main/hotissue/sectionList.nhn?sid1=102&cid=3069&page=' + page,
        encoding: null
    };

    request.get(option, function(error, response, html) {
        if (error) {
            throw error;
        }

        var iconv = new Iconv('euc-kr', 'utf-8//translit//ignore');
        html = iconv.convert(html).toString();
        var $ = cheerio.load(html);

        var articleATags = $('dl.cnt dt.t a');
        var articlePaths = [];
        articleATags.each(function() {
            var articlePath = $(this).attr('href');
            articlePaths.push(articlePath);
        });

        completionHandler(articlePaths);
    });
};

Parser.prototype.parseNaverArticleMetadata = function(articlePath, completionHandler) {
    var option = {
        url: 'http://' + this.baseUrl + articlePath,
        encoding: null
    };

    request.get(option, function(error, response, html) {
        if (error) {
            throw error;
        }

        var iconv = new Iconv('euc-kr', 'utf-8//translit//ignore');
        html = iconv.convert(html).toString();
        var $ = cheerio.load(html);

        var articleDate = $('div.sponsor span.t11').text();
        var articleOriginalUrl = $('div.sponsor a.btn_artialoriginal').attr('href');
        var articleImageDesc = $('span.end_photo_org em.img_desc').first().text();

        completionHandler(articleOriginalUrl, articleDate, articleImageDesc);
    });
}

module.exports = Parser;
