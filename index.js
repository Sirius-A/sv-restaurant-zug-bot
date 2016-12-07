'use strict';

const Telegram = require('telegram-node-bot');
const TelegramBaseController = Telegram.TelegramBaseController;
const tg = new Telegram.Telegram('BotFatherKey');
const TextCommand = Telegram.TextCommand;
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
                text += '*' + $(offer).find('.offer-description').text().trim() + ': ' ;
                text += $(offer).find('.menu-description .title').text() + '*\n';
                text += $(offer).find('.menu-description .trimmings').text() + '\n';
                text += '_' + $(offer).find('.price .price-item').text() + '_\n\n'
            });
            callback(text)
        });
    }

    menuHandler($) {
        const self = this;
        var response = '';
        self.parse('menuplan.html', function(text) {
            response += text;
            response = response.replace(/`/g, '' );
            $.sendMessage(response, { parse_mode: 'Markdown'});
        })
    }

    get routes() {
        return {
            'getToday': 'menuHandler'
        }
    }
}

tg.router
    .when(
        new TextCommand('get', 'getToday'),
        new MenuController()
    );