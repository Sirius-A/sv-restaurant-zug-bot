'use strict';
const TelegramBot = require('node-telegram-bot-api');
const bot_api_token = process.env.BOT_API_TOKEN;
const tgBot  = new TelegramBot(bot_api_token, { polling: true });
const CronJob = require('cron').CronJob;

const Parser = require('./SVPageParser');
const Subscriptions = require('./subscriptions');

const weekdays = ["(Mon(day)?)","(Tue(sday)?)","(Wed(nesday)?)","Thu(rsday)?","Fri(day)?"];
const weekdayRegex = new RegExp(weekdays.join("|"),'i');

/* Daily cronjob to notify subscribers*/
try {
    new CronJob('00 10 * * 1-5', function () {
        console.log('Cron job started');
        notifySubscribers();
    }, null, true,'Europe/Zurich');
} catch(ex) {
    console.log("cron pattern not valid");
}

/* Routes */
tgBot.onText(/\/get(Today)?$/mgi,getTodayHandler);
tgBot.onText(/\/(get)?Daily/i,getDailyHandler);
tgBot.onText(/\/(get)?PartTime/i,getPartTimeHandler);
tgBot.onText(/\/start/i,startHandler);
tgBot.onText(/\/stop/i,cancelSubscriptionsHandler);
tgBot.onText(/\/cancel/i,cancelSubscriptionsHandler);
tgBot.onText(/\/(get)?source/mgi,getSourceHandler);
tgBot.onText(weekdayRegex,weekdayHandler);
tgBot.onText(/Done.*/i,cancelWeekdaySelectionHandler);

/* Handlers */
function sendTodaysMenu(chatId) {
    const url = 'http://siemens.sv-restaurant.ch/de/menuplan.html';
    const parser = new Parser();

    parser.parse(url, function (markdownText) {
        tgBot.sendMessage(chatId, markdownText, {parse_mode: 'Markdown'});
    });
}
function getTodayHandler(message) {
    let chatId = message.chat.id;
    sendTodaysMenu(chatId);
}

function getDailyHandler(message) {
    let chat = message.chat;
    let chatId = message.chat.id;

    const subscriptions = new Subscriptions();
    subscriptions.add(chat,function () {
        let markdownText = "*Successfully added you to the daily subscriber list* \n" +
            "I will send you the menu at 10:00am from now on. \n" +
            "You can send me /stop to quit that.";
        tgBot.sendMessage(chatId,markdownText,{ parse_mode: 'Markdown'});
    });
}

function getPartTimeHandler(message) {
    const weekdaysKeyboard = [
        [{text: "Monday"},{text: "Tuesday"},],
        [{text: "Wednesday"},{text: "Thursday"}],
        [{text: "Friday"}],[{text: "Done!"}]
    ];
    let chatId = message.chat.id;
    let markdownText = "Please select all weekdays you want to be notified.";

    let options = {
        "parse_mode": "Markdown",
        "reply_markup": {
            "keyboard": weekdaysKeyboard,
            "selective": true,
        }
    };
    tgBot.sendMessage(chatId, markdownText, options);
}

function weekdayHandler(message,match) {
    let chatId = message.chat.id;
    let markdownText = "Okey I will send you updates each " + match[0] ;
    let weekdayIndex = + weekdays.regexIndexOf(match[0]) + 1; //+1 since dates/days start with 1.

    tgBot.sendMessage(chatId, markdownText, {parse_mode: 'Markdown'});

    weekdays.regexIndexOf(match[0]);

}

function cancelWeekdaySelectionHandler(message) {
    let chatId = message.chat.id;

    let markdownText = "Alright. Here are the days I will send you the menu";
    let options = {
        "parse_mode": "Markdown",
        "reply_markup": {
            "remove_keyboard": true,
            "selective": true
        }
    };
    tgBot.sendMessage(chatId, markdownText, options);
}
function cancelSubscriptionsHandler(message) {
    let chat = message.chat;
    let chatId = message.chat.id;

    const subscriptions = new Subscriptions();
    subscriptions.remove(chat,function () {
        let markdownText = "*Successfully removed you from the daily subscriber list* \n" +
            "I will no longer bother you with daily updates.";
        tgBot.sendMessage(chatId,markdownText,{ parse_mode: 'Markdown'});
    });
}

function startHandler(message) {
    let chatId = message.chat.id;

    let markdownText = 'Hello! \n' +
        'I can send you the menu for the SV restaurant in Zug. \n' +
        'try /get or /Daily (for daily updates)';

        tgBot.sendMessage(chatId,markdownText, { parse_mode: 'Markdown'});
}

function notifySubscribers() {
    let subscriptions = new Subscriptions();

    console.log("notify Subscribers called");
    subscriptions.forAll(function (subscriber) {
            sendTodaysMenu(subscriber.id);
    });
}

function getSourceHandler(message){
    let chatId = message.chat.id;

    let markdownText = 'This bot is written by Fabio Zuber utilizing Node.js.\n' +
        'The code is open source. Feel free to check it out on [GitHub](https://github.com/Sirius-A/sv-restaurant-zug-bot).';
    tgBot.sendMessage(chatId,markdownText,{ parse_mode: 'Markdown'});
}

/**
 * Regular Expresion IndexOf for Arrays
 * This little addition to the Array prototype will iterate over array
 * and return the index of the first element which matches the provided
 * regular expresion.
 * Note: This will not match on objects.
 * @param  {RegEx}   rx The regular expression to test with. E.g. /-ba/gim
 * @return {Numeric} -1 means not found
 */
if (typeof Array.prototype.regexIndexOf === 'undefined') {
    Array.prototype.regexIndexOf = function (rx) {
        for (var i in this) {
            if (rx.match(this[i].toString())) {
                return i;
            }
        }
        return -1;
    };
}