'use strict';

const Telegram = require('telegram-node-bot');
const TelegramBaseController = Telegram.TelegramBaseController;
const tg = new Telegram.Telegram('BotFatherKey');
const request = require('request');
const cheerio = require('cheerio');

class MenuController extends TelegramBaseController {

    parse(url, callback) {
        const baseURL = 'http://siemens.sv-restaurant.ch/de/';
        request(baseURL + url, function(err, resp, body){
            let $ = cheerio.load(body);
            let offers = $('.offer');
            var text = '';
            $(offers).each(function(i, offer) {
                text += '_' + $(offer).find('.offer-description').text().trim() + '_\n';
                text += $(offer).find('.menu-description .title').text() + ' - ' + $(offer).find('.menu-description .trimmings').text() + '\n\n'
            });
            callback(text)
        });
    }

    menuHandler($) {
        const self = this;
        var response = '';
        self.parse('menuplan.html', function(text) {
            response += '*Five Moods*\n';
            response += text;
            response = response.replace('`', '');
            $.sendMessage(response, { parse_mode: 'Markdown'});
        })
    }

    get routes() {
        return {
            'get': 'menuHandler'
        }
    }
}

tg.router
    .when(['get'], new MenuController());