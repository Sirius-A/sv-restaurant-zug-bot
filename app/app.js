'use strict';
const Telegram = require('telegram-node-bot');
const TelegramBaseController = Telegram.TelegramBaseController;
const TextCommand = Telegram.TextCommand;
const bot_api_token = process.env.BOT_API_TOKEN;
const tg = new Telegram.Telegram(bot_api_token);
const request = require('request');
const cheerio = require('cheerio');

class MealsController extends TelegramBaseController {
    parse(url, callback) {
        const self = this;
        request(url, function(err, resp, body){
            console.log("request");
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

    mealsHandler($) {
        const self = this;
        const url = 'http://siemens.sv-restaurant.ch/de/menuplan.html';

        self.parse(url, function(text) {
            $.sendMessage(text, { parse_mode: 'Markdown'});
        });
    }

    get routes() {
        return {
            'getToday': 'mealsHandler'
        };
    }
}

class StartController extends TelegramBaseController {
    /**
     * @param {Scope} $
     */
    static start($) {
        $.sendMessage('Hello! \n I can send you the menu for the SV restaurant in Zug. \n Try /get or /getDaily (for daily updates)');
    }

    get routes() {
        return {
            'startHandler': 'start'
        };
    }
}

tg.router
    .when(
        new TextCommand('get', 'getToday'),
        new MealsController()
    )
    .when(
        new TextCommand('/start', 'startHandler'),
        new StartController()
    );

module.exports.MealsController = MealsController;