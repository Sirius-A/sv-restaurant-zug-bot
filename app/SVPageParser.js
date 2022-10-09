'use strict';
const request = require('request');
const cheerio = require('cheerio');
const url = 'http://siemens.sv-restaurant.ch/de/menuplan/';

class SVPageParser {
  parseToday(callback) {
    request(url, (err, resp, body) => {
      const $ = cheerio.load(body);
      const offers = $('#menu-plan-tab1').find('.menu-item');
      const message = this.formatDayMenu($, offers);
      callback(message);
    });
  }

  parseWeek(callback) {
    request(url, (err, resp, body) => {
      const $ = cheerio.load(body);
      const message = this.formatWeek($);
      callback(message);
    });
  }

  formatWeek($) {
    const days = $('.day-nav').find('li');

    let text = '';
    $(days).each((i, day) => {
      const dayName = $(day).find('.day').text();
      const dayDate= $(day).find('.date').text();
      const offers = $(`#menu-plan-tab${i+1}`).find('.menu-item');

      text += `*${dayName} ${dayDate}* \n`;
      text += `========\n`;
      text += this.formatDayMenu($, offers) + '\n';
    });

    return text;
  }

  formatDayMenu($, offers) {
    let text = '';
    $(offers).each(function(i, offer) {
      const menuDescription = $(offer).find('.menu-description');
      menuDescription.find('br').replaceWith(' ');

      text += '_' + removeSpecialCharacters($(offer).find('.menuline').text()) + '_\n';
      text += '*' + removeSpecialCharacters($(offer).find('.menu-title').text().trim()) + '*\n';
      text += removeSpecialCharacters(menuDescription.text()) + '\n';
      text += '_' + removeSpecialCharacters($(offer).find('.prices-3 .val').text() + ' ' + $(offer).find('.prices-3 .desc').text()) + '_\n';
      const provenance = removeSpecialCharacters($(offer).find('.menu-provenance').text());
      if (provenance.length > 1) {
        text += '_' + provenance + '_\n\n';
      } else {
        text += '\n';
      }
    });

    function removeSpecialCharacters(text) {
      return (text.replace(/[`*_#\r]/g, ''));
    }

    return text;
  }
}

module.exports = SVPageParser;
