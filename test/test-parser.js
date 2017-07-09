'use strict';
const assert = require('chai').assert;
const fs = require('fs');
const cheerio = require("cheerio/lib/static.js");
const SVPageParser = require('../app/SVPageParser');


describe('The sv page formatting module', function(){
    it('formats the menuplan page of 2017-05-02 correctly',function() {
        let markdownTextExpected = '*Ofenfrischer Lammgigot*\n' +
            'mit Rosmarinjus dazu Kartoffelgratin ' +
            'und gratinierter Blumenkohl\n' +
            '_18.50 CHF_\n' +
            '_Herkunft Fleisch: Lamm / Neuseeland_\n\n' +
            '*Geschmortes Rindsgulasch*\n' +
            'in Rotweinsauce dazu Käsepolenta und Ratatouille\n' +
            '_14.50 CHF_\n' +
            '_Herkunft Fleisch: Rind / Schweiz_\n\n' +
            '*Frisch vom Feld*\nErdbeertörtchen mit Vanillecreme ' +
            'Unsere Doris verzaubert Sie heute mit Erbeeren\n_5.50 CHF_\n\n' +
            '*Fusilli Primavera Magic*\n' +
            'Hausgemachte Pasta mit Olivenöl, Dörrtomaten, Röstgemüse und Pesto\n' +
            '_12.90 CHF_\n\n' +
            '*Tandoori-Chicken*\n' +
            'Linseneintopf, Kichererbsen mit Koriander,  Mango Masala, gebratener Paneer Käse,  ' +
            'Roti Brot, Samosa\n' +
            '_3.30 100G_\n' +
            '_Herkunft Fleisch: Geflügel / Schweiz_\n\n';

        let menuplanPath = __dirname + "/Menuplan.html";
        let svPageParser = new SVPageParser();

        let $ = cheerio.load(fs.readFileSync(menuplanPath));
        let markdownTextActual = svPageParser.formatMessage($);
        assert.equal(markdownTextActual, markdownTextExpected, "Page is formatted to the correct markdown");
    });

    it('replaces markdown syntax characters in the menu',function () {

        let svPageParser = new SVPageParser();
        let $ = cheerio.load("<div id='menu-plan-tab1' class='menu-plan-grid'>" +
            "<div class='menu-item'>" +
            "<div class='menu-title'>Super-Duper Menu::</div>" +
            "<div class='menu-description'><p class='trimmings'>A multi line*, <br\><br>" +
            "*dish</p></div>" +
            "<div class='menu-prices prices-3'><span class='price'>" +
            "<span class='val'>18.50</span><span class='desc'>CHF</span>" +
            "</span></div>" +
            "</div>"+
            "</div>"
        );
        let markdownTextExpected = "*Super-Duper Menu::*\n" +
            "A multi line,   dish\n" +
            "_18.50 CHF_\n\n";
        let markdownTextActual = svPageParser.formatMessage($);
        assert.equal(markdownTextActual, markdownTextExpected, "escapes the relevant ");
    });
});

