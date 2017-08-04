'use strict';

var NewsMeta = function() {
    this.url = '';
    this.title = '';
    this.desc = '';
    this.imageUrl = '';
    this.publisher = '';
    this.date = '';
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

NewsMeta.prototype.setPublisher = function(publisher) {
    this.publisher = publisher.trim();
}

NewsMeta.prototype.setDate = function(date) {
    this.date = date.trim();
}

NewsMeta.prototype.toString = function() {
    return this.url + '\t' + this.title + '\t' + this.desc + '\t' + this.imageUrl + '\t' + this.publisher + '\t' + this.date;
};

module.exports = NewsMeta;
