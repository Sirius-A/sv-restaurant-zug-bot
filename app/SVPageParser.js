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
        let offers = $('.menu-item');
        let text = '';
        $(offers).each(function (i, offer) {
            text += '*' + removeSpecialCharacters($(offer).find('.menu-title').text().trim()) + '*\n';
            text += removeSpecialCharacters($(offer).find('.menu-description').text()) + "\n";
            text += '_' + removeSpecialCharacters($(offer).find('.prices-3').text())  + "_\n";
            let provenance = removeSpecialCharacters($(offer).find('.menu-provenance').text());
            if(provenance.length > 1){
                text += '_' + provenance + "_\n\n";
            }else{
                text += "\n";
            }

        });

        function removeSpecialCharacters(text){
            return(text.replace(/`|\*|_|#|\r/g, ''));
        }

        return text;
    }

}

module.exports = SVPageParser;
