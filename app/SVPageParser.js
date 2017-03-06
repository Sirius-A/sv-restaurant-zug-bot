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
        let text = '';
        $(offers).each(function (i, offer) {
            text += '*' + removeSpecialCharacters($(offer).find('.offer-description').text().trim()) + ': ';
            text += removeSpecialCharacters($(offer).find('.menu-description .title').text()) + "*\n";
            text += removeSpecialCharacters($(offer).find('.menu-description .trimmings').text())  + "\n";
            text += '_' + removeSpecialCharacters($(offer).find('.price .price-item').text())  + "_\n";
            let provenance = removeSpecialCharacters($(offer).find('.provenance').text());
            if(provenance !== ""){
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
