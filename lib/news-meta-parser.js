'use strict';

var cheerio     = require('cheerio');

var NewsMetaParser = function NewsMetaParser() {    
};

// 기사 원문 URL
NewsMetaParser.prototype.parseMetaUrl = function($) {
    var url = $('meta[property="og:url"]').first().attr('content');
    if (!url) {
        url = $('meta[name="og:url"]').first().attr('content');
        if (!url) {
            url = $('meta[name="twitter:url"]').first().attr('content');
            if (!url) {
                url = $('meta[property="twitter:url"]').first().attr('content');
                if (!url) {
                    url = $('meta[name="dable:url"]').first().attr('content');
                    if (!url) {
                        url = $('meta[name="nate:url"]').first().attr('content');
                        if (!url) {
                            url = $('meta[name="nextweb:artUrl"]').first().attr('content');
                            if (!url) {
                                url = $('meta[itemprop="url"]').first().attr('content');
                                if (!url) {
                                    url = '';
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return url;
};

// 기사 제목
NewsMetaParser.prototype.parseMetaTitle = function($) {
    var title = $('meta[property="og:title"]').first().attr('content');
    if (!title) {
        title = $('meta[name="og:title"]').first().attr('content');
        if (!title) {
            title = $('meta[name="twitter:title"]').first().attr('content');
            if (!title) {
                title = $('meta[property="twitter:title"]').first().attr('content');
                if (!title) {
                    title = $('meta[name="nate:title"]').first().attr('content');
                    if (!title) {
                        title = $('meta[name="nextweb:artSubject"]').first().attr('content');
                        if (!title) {
                            title = $('meta[name="title"]').first().attr('content');
                            if (!title) {
                                title = $('meta[itemprop="name"]').first().attr('content');
                                if (!title) {
                                    title = $('meta[itemprop="headline"]').first().attr('content');
                                    if (!title) {
                                        title = $('title').first().text();
                                        if (!title) {
                                            title = '';
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }   
        }
    }
    return title;
};

// 기사 요약
NewsMetaParser.prototype.parseMetaDescription = function($) {
    var desc = $('meta[property="og:description"]').first().attr('content');
    if (!desc) {
        desc = $('meta[name="og:description"]').first().attr('content');
        if (!desc) {
            desc = $('meta[name="twitter:description"]').first().attr('content');
            if (!desc) {
                desc = $('meta[property="twitter:description"]').first().attr('content');
                if (!desc) {
                    desc = $('meta[name="nate:description"]').first().attr('content');
                    if (!desc) {
                        desc = $('meta[name="nextweb:description"]').first().attr('content');
                        if (!desc) {
                            desc = $('meta[itemprop="description"]').first().attr('content');
                            if (!desc) {
                                desc = $('meta[name="description"]').first().attr('content');
                                if (!desc) {
                                    desc = '';
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return desc;
};

// 기사 대표 이미지 URL
NewsMetaParser.prototype.parseMetaImageUrl = function($) {
    var imageUrl = $('meta[property="og:image"]').first().attr('content');
    if (!imageUrl) {
        imageUrl = $('meta[name="og:image"]').first().attr('content');
        if (!imageUrl) {
            imageUrl = $('meta[name="twitter:image:src"]').first().attr('content');
            if (!imageUrl) {
                imageUrl = $('meta[property="twitter:image:src"]').first().attr('content');
                if (!imageUrl) {
                    imageUrl = $('meta[name="twitter:image"]').first().attr('content');
                    if (!imageUrl) {
                        imageUrl = $('meta[property="twitter:image"]').first().attr('content');
                        if (!imageUrl) {
                            imageUrl = $('meta[name="nate:image"]').first().attr('content');
                            if (!imageUrl) {
                                imageUrl = $('meta[name="nextweb:imgUrl"]').first().attr('content');
                                if (!imageUrl) {
                                    imageUrl = $('meta[itemprop="image"]').first().attr('content');
                                    if (!imageUrl) {
                                        imageUrl = $('meta[name="image"]').first().attr('content');
                                        if (!imageUrl) {
                                            imageUrl = $('link[rel="image_src"]').first().attr('href');
                                            if (!imageUrl) {
                                                imageUrl = $('meta[itemprop="thumbnailUrl"]').first().attr('content');
                                                if (!imageUrl) {
                                                    imageUrl = $('meta[property="dable:image"]').first().attr('content');
                                                    if (!imageUrl) {
                                                        imageUrl = '';
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return imageUrl;
};

module.exports = NewsMetaParser;
