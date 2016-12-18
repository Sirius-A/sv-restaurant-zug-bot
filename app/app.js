'use strict';
const TelegramBot = require('node-telegram-bot-api');
const bot_api_token = process.env.BOT_API_TOKEN;
const tgBot  = new TelegramBot(bot_api_token, { polling: true });
const Parser = require('./SVPageParser');

/* Routes */
tgBot.onText(/\/get(Today)?/,getTodayHandler);
tgBot.onText(/\/getDaily/,getDailyHandler);
tgBot.onText(/\/start/,startHandler);


/* Handlers */
function getTodayHandler(message) {
    const parser = new Parser();
    const url = 'http://siemens.sv-restaurant.ch/de/menuplan.html';
    let chatId = message.chat.id;

    parser.parse(url, function (markdownText) {
        tgBot.sendMessage(chatId,markdownText,{ parse_mode: 'Markdown'});
    });
}

function getDailyHandler(message) {
    let chatId = message.chat.id;

}

function startHandler(message) {
    let chatId = message.chat.id;

    var markdownText = 'Hello! \n' +
        'I can send you the menu for the SV restaurant in Zug. \n' +
        'try /get or /getDaily (for daily updates)';
    tgBot.sendMessage(chatId,markdownText,{ parse_mode: 'Markdown'});
}
