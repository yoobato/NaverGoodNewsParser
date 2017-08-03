'use strict';

var NewsMeta = function(publisher, date) {
    this.url = '';
    this.title = '';
    this.desc = '';
    this.imageUrl = '';
    this.publisher = publisher.trim();
    this.date = date.trim();
};

NewsMeta.prototype.setUrl = function(url) {
    this.url = url;
}

NewsMeta.prototype.setTitle = function(title) {
    title = title.replace(/\r?\n|\r|\t/g, ' ');
    this.title = title.trim();
}

NewsMeta.prototype.setDesc = function(desc) {
    desc = desc.replace(/\r?\n|\r|\t/g, ' ');
    this.desc = desc.trim();
}

NewsMeta.prototype.setImageUrl = function(imageUrl) {
    this.imageUrl = imageUrl;
}

NewsMeta.prototype.toString = function() {
    return this.url + '\t' + this.title + '\t' + this.desc + '\t' + this.imageUrl + '\t' + this.publisher + '\t' + this.date;
};

module.exports = NewsMeta;
