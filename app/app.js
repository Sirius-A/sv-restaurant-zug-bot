'use strict';
const Telegram = require('telegram-node-bot');
const TelegramBaseController = Telegram.TelegramBaseController;
const TextCommand = Telegram.TextCommand;
const bot_api_token = process.env.BOT_API_TOKEN;
const tg = new Telegram.Telegram(bot_api_token);
const Parser = require('./SVPageParser');

class MealsController extends TelegramBaseController {

    mealsHandler($) {
        const parser = new Parser();
        const url = 'http://siemens.sv-restaurant.ch/de/menuplan.html';

        parser.parse(url, function(text) {
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