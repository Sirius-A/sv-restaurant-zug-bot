'use strict';

const Telegram = require('telegram-node-bot');
const TelegramBaseController = Telegram.TelegramBaseController;
const tg = new Telegram.Telegram('BotFatherKey');
const request = require('request');
const cheerio = require('cheerio');

class MenuController extends TelegramBaseController {
    parse(url, callback) {
        const baseURL = 'http://siemens.sv-restaurant.ch/';
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
        self.parse('mensa.html', function(text1) {
            response += '*MENSA*\n';
            response += text1;
            self.parse('forschungszentrum.html', function(text2) {
                text2 = text2.replace(/ Bowl/g, " Schnabelteller");
                response += '*FORSCHUNGSZENTRUM*\n';
                response += text2;
                response = response.replace('`', '');
                $.sendMessage(response, { parse_mode: 'Markdown'})
            })
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