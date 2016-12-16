'use strict';
const request = require('request');
const cheerio = require('cheerio');

class SVPageParser{
    parse(url, callback) {
        const self = this;
        request(url, function(err, resp, body){
            let $ = cheerio.load(body);
            let message = self.formatMessage($);
            callback(message);
        });
    }

    formatMessage($) {
        let offers = $('.offer');
        var text = '';
        $(offers).each(function (i, offer) {
            text += '*' + $(offer).find('.offer-description').text().trim() + ': ';
            text += $(offer).find('.menu-description .title').text() + '*\n';
            text += $(offer).find('.menu-description .trimmings').text() + '\n';
            text += '_' + $(offer).find('.price .price-item').text() + '_\n\n';
        });

        //get rid of special chars that mess with markdown formatting
        text = text.replace(/`/g, '');

        return text;
    }
}

module.exports = SVPageParser;
