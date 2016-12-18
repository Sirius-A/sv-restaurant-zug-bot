'use strict';
const TelegramBot = require('node-telegram-bot-api');
const bot_api_token = process.env.BOT_API_TOKEN;
const tgBot  = new TelegramBot(bot_api_token, { polling: true });
const Parser = require('./SVPageParser');
const Subscriptions = require('./subscriptions');

/* Routes */
tgBot.onText(/\/get(Today)?$/mg,getTodayHandler);
tgBot.onText(/\/getDaily/,getDailyHandler);
tgBot.onText(/\/start/,startHandler);
tgBot.onText(/\/stop/,cancelSubscriptionsHandler);
tgBot.onText(/\/cancel/,cancelSubscriptionsHandler);


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
    let chat = message.chat;
    let chatId = message.chat.id;

    const subscriptions = new Subscriptions();
    subscriptions.add(chat,function () {
        let markdownText = "*Successfully added you to the daily subscriber list* \n" +
            "I will send you the menu at 10:00am from now on.";
        tgBot.sendMessage(chatId,markdownText,{ parse_mode: 'Markdown'});
    });
}

function cancelSubscriptionsHandler(message) {
    let chat = message.chat;
    let chatId = message.chat.id;

    const subscriptions = new Subscriptions();
    subscriptions.remove(chat,function () {
        let markdownText = "*Successfully removed you from the daily subscriber list* \n" +
            "I will no longer bother you";
        tgBot.sendMessage(chatId,markdownText,{ parse_mode: 'Markdown'});
    });
}

function startHandler(message) {
    let chatId = message.chat.id;

    var markdownText = 'Hello! \n' +
        'I can send you the menu for the SV restaurant in Zug. \n' +
        'try /get or /getDaily (for daily updates)';
    tgBot.sendMessage(chatId,markdownText,{ parse_mode: 'Markdown'});
}
