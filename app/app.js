'use strict';
const Tgfancy = require("tgfancy");
const bot_api_token = process.env.BOT_API_TOKEN;
const tgBot  = new Tgfancy(bot_api_token, {
  tgfancy: {
    emojification: true,
  },
  polling: true
});
const CronJob = require('cron').CronJob;

const Parser = require('./SVPageParser');
const parser = new Parser();
const Subscriptions = require('./subscriptions');
const subscriptions = new Subscriptions();

const weekdays = ["(Mon(day)?)","(Tue(sday)?)","(Wed(nesday)?)","Thu(rsday)?","Fri(day)?"];
const weekdayRegex = new RegExp(weekdays.join("(@\w+)?|"),'i');

let botUsername = process.env.BOT_USERNAME;
if (botUsername === undefined){
  botUsername = "FiveMoodsBot";
}

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
tgBot.onText(/\/(get)?(Today)?(@\w+)?$/gmi,getTodayHandler);
tgBot.onText(/\/(get)?Week(@\w+)?$/gmi,getWeekHandler);
tgBot.onText(/\/(get)?Daily(@\w+)?$/gmi,getDailyHandler);
tgBot.onText(/\/(get)?PartTime(@\w+)?/i,getPartTimeHandler);
tgBot.onText(/\/start(@\w+)?/i,startHandler);
tgBot.onText(/\/stop(@\w+)?/i,cancelSubscriptionsHandler);
tgBot.onText(/\/cancel(@\w+)?/i,cancelSubscriptionsHandler);
tgBot.onText(/\/(get)?source(@\w+)?/mgi,getSourceHandler);
tgBot.onText(weekdayRegex,weekdayHandler);
tgBot.onText(/Done.*(@\w+)?/i,cancelWeekdaySelectionHandler);
// tgBot.onText(/notify/gi,notifySubscribers); //to test subscriber notifications

/* Handlers */
function getTodayHandler(message) {
  let chatId = message.chat.id;
  sendTodaysMenu(chatId);
}

function getWeekHandler(message) {
  let chatId = message.chat.id;
  sendWeekMenu(chatId);
}

function getDailyHandler(message) {
  let chat = message.chat;
  let chatId = message.chat.id;

  subscriptions.add(chat,function () {
    let markdownText = "*Successfully added you to the daily subscriber list* \n" +
      "I will send you the menu at 10:00am from now on. \n" +
      `You can send me /stop@${botUsername} to quit that.`;
    tgBot.sendMessage(chatId,markdownText,{ parse_mode: 'Markdown'});
  });
}

function getPartTimeHandler(message) {
  let chatId = message.chat.id;

  // remove current subscriptions before selecting new ones.
  subscriptions.remove(chatId);

  const weekdaysKeyboard = [
    [{text: "Monday"},{text: "Tuesday"},],
    [{text: "Wednesday"},{text: "Thursday"}],
    [{text: "Friday"}],[{text: "Done!"}]
  ];

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
  let chat = message.chat;
  let chatId = message.chat.id;
  let markdownText = "Okay I will send you updates each " + match[0] ;
  let weekdayIndex = + weekdays.regexIndexOf(match[0]) + 1; //+1 since dates/days start on Sunday .

  subscriptions.addWeekday(chat,weekdayIndex,function () {
    tgBot.sendMessage(chatId, markdownText, {parse_mode: 'Markdown'});
    weekdays.regexIndexOf(match[0]);
  });

}

function cancelWeekdaySelectionHandler(message) {
  let chat = message.chat;
  let chatId = message.chat.id;

  subscriptions.getWeekdays(chat,function (err,weekdaysData) {
    let markdownText = "";
    if(err){
      console.log("error getting weekdays from mongodb");
      return;
    }

    if(weekdaysData === null){
      markdownText = " You did not select any Weekdays :confused: \nI will not send you updates";
    }else {
      markdownText = ":thumbsup: Alright. Here are the days I will send you the menu:";
      for (let weekday of weekdaysData.weekdays) {
        let weekdayName = weekdays[weekday - 1].replace(/[()?]/gi, "");
        markdownText += `\n- ${weekdayName}`;
      }
    }

    let options = {
      "parse_mode": "HTML",
      "reply_markup": {
        "remove_keyboard": true,
        "selective": true
      }
    };
    tgBot.sendMessage(chatId, markdownText, options);
  });
}
function cancelSubscriptionsHandler(message) {
  let chatId = message.chat.id;

  subscriptions.remove(chatId,function () {
    let markdownText = "*Successfully removed you from the daily subscriber list* \n" +
      "I will no longer send you updates. :wave:";
    tgBot.sendMessage(chatId,markdownText,{ parse_mode: 'Markdown'});
  });
}

function startHandler(message) {
  let chatId = message.chat.id;

  let markdownText = 'Hello! :smile: \n' +
    "I can send you the menu for the SV restaurant in Zug. \n" +
    `- Try /get@${botUsername} to receive today's menu. \n` +
    `- For regular notifications use /daily@${botUsername} or /partTime@${botUsername}`;

  tgBot.sendMessage(chatId,markdownText, { parse_mode: 'Markdown'});
}

function getSourceHandler(message){
  let chatId = message.chat.id;

  let markdownText = 'This bot is written by Fabio Zuber utilizing Node.js.\n' +
    'The code is open source. Feel free to check it out on [GitHub](https://github.com/Sirius-A/sv-restaurant-zug-bot).';
  tgBot.sendMessage(chatId,markdownText,{ parse_mode: 'Markdown'});
}

/* Menu Send Functions */
function sendTodaysMenu(chatId) {
  parser.parseToday(function (markdownText) {
    tgBot.sendMessage(chatId, markdownText, {parse_mode: 'Markdown'});
  });
}

function sendWeekMenu(chatId) {
  parser.parseWeek(function (markdownText) {
    tgBot.sendMessage(chatId, markdownText, {parse_mode: 'Markdown'});
  });
}

function notifySubscribers() {
  console.log("notify Subscribers");
  subscriptions.forAllDailly(function (subscriber) {
    sendTodaysMenu(subscriber.id);
  });

  let now = new Date();
  subscriptions.forAllParttime(now.getDay(),function (subscriber) {
    sendTodaysMenu(subscriber.id);
  })
  ;}

/**
 * Regular Expression IndexOf for Arrays
 * This little addition to the Array prototype will iterate over array
 * and return the index of the first element which matches the provided
 * regular expression.
 * Note: This will not match on objects.
 * @param  {RegExp}   rx The regular expression to test with. E.g. /-ba/gim
 * @return {Number} -1 means not found
 */
if (typeof Array.prototype.regexIndexOf === 'undefined') {
  Array.prototype.regexIndexOf = function (RegEx) {
    for (let i in this) {
      if (RegEx.match(this[i].toString())) {
        return i;
      }
    }
    return -1;
  };
}
