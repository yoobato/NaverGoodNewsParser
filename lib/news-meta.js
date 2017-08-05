'use strict';

var NewsMeta = function() {
    this.naverUrl = '';
    this.oriUrl = '';
    this.title = '';
    this.desc = '';
    this.imageUrl = '';
    this.publisher = '';
    this.date = '';
};

NewsMeta.prototype.setNaverUrl = function(naverUrl) {
    this.naverUrl = naverUrl.trim();
}

NewsMeta.prototype.setOriUrl = function(oriUrl) {
    this.oriUrl = oriUrl.trim();
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
    this.imageUrl = imageUrl.trim();
}

NewsMeta.prototype.setPublisher = function(publisher) {
    this.publisher = publisher.trim();
}

NewsMeta.prototype.setDate = function(date) {
    this.date = date.trim();
}

NewsMeta.prototype.toString = function() {
    return this.date + '\t' + this.naverUrl + '\t' + this.oriUrl + '\t' + this.title + '\t' + this.desc + '\t' + this.imageUrl + '\t' + this.publisher;
};

module.exports = NewsMeta;
