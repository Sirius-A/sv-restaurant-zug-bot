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
            text += '*' + replaceMarkdownCharacters($(offer).find('.offer-description').text().trim()) + ': ';
            text += replaceMarkdownCharacters($(offer).find('.menu-description .title').text()) + '*\n';
            text += replaceMarkdownCharacters($(offer).find('.menu-description .trimmings').text())  + '\n';
            text += '_' + replaceMarkdownCharacters($(offer).find('.price .price-item').text())  + '_\n\n';
        });

        function replaceMarkdownCharacters(text){
            return(text.replace(/`|\*|_|#/g, ''));
        }

        return text;
    }

}

module.exports = SVPageParser;
