'use strict';
const request = require('request');
const cheerio = require('cheerio');

class SVPageParser{


    parseToday(url, callback) {
        const self = this;
        request(url, function(err, resp, body){
            let $ = cheerio.load(body);
            let message = self.formatMessage($);
            callback(message);
        });
    }

    parseWeek(url, callback) {
        const self = this;
        request(url, function(err, resp, body){
            let $ = cheerio.load(body);
            let message = self.formatWeek($);
            callback(message);
        });
    }

    formatWeek($) {
        let days = $('.day-nav').find('li');

        let text = '';
        $(days).each(function (i, day) {
            let dayName = $(day).find('.day').text();
            let dayDate= $(day).find('.date').text();

            text += `*${dayName} ${dayDate} \n*`
        });

        return text;
    }

    formatMessage($) {
        let offers = $('#menu-plan-tab1').find('.menu-item');
        let text = '';
        $(offers).each(function (i, offer) {
            let menuDescription = $(offer).find('.menu-description');
            menuDescription.find('br').replaceWith(' ');

            text += '*' + removeSpecialCharacters($(offer).find('.menu-title').text().trim()) + '*\n';
            text += removeSpecialCharacters(menuDescription.text()) + '\n';
            text += '_' + removeSpecialCharacters($(offer).find('.prices-3 .val').text() + ' ' + $(offer).find('.prices-3 .desc').text()) + "_\n";
            let provenance = removeSpecialCharacters($(offer).find('.menu-provenance').text());
            if (provenance.length > 1) {
                text += '_' + provenance + "_\n\n";
            } else {
                text += "\n";
            }

        });

        function removeSpecialCharacters(text) {
            return (text.replace(/`|\*|_|#|\r/g, ''));
        }

        return text;
    }
}

module.exports = SVPageParser;
