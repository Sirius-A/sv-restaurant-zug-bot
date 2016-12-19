'use strict';
const assert = require('chai').assert;
const fs = require('fs');
const cheerio = require("cheerio/lib/static.js");
const SVPageParser = require('../app/SVPageParser');


describe('The sv page formatting module', function(){
    it('formats the menuplan page of 2016-02-14 correctly',function() {
        let markdownTextExpected = "*chefs choice: Knusprig gebratene Entenbrust*\n" +
            "an Balsamicojus\n" +
            "Ofen Kartoffeln\n" +
            "Grillgemüse\n" +
            "_CHF 18.90_\n" +
            "\n" +
            "*dailys: Gemüseauflauf*\n" +
            "mit Basilikumsauce\n" +
            "und gebackenen Avocadoecken\n" +
            "_CHF 14.50_\n" +
            "\n" +
            "*free choice: Sautierte Lammstreifen*\n" +
            "Thymiansauce, Kartoffelgratin, Schwarzwurzel mit Sultanienen, \n" +
            "Gemüseebly, Bouillongemüse, \n" +
            "sautiertes Kürbisgemüse\n" +
            "_100G 3.30_\n" +
            "\n" +
            "*season market: Wrap mit Rindsstreifen*\n" +
            "Cocktailsauce, Rucola, \n" +
            "Tomaten, Eisbergsalat\n" +
            "an bunten Blattsalaten\n" +
            "_CHF 17.50_\n" +
            "\n" +
            "*go4 pasta: Agnolotti Fondue*\n" +
            "Sauce Quattro Formaggi\n" +
            "und Gemüse Ragout\n" +
            "_CHF 14.90_\n" +
            "\n";

        let menuplanPath = __dirname + "/menuplan2016-02-14.html";
        let svPageParser = new SVPageParser();


        let $ = cheerio.load(fs.readFileSync(menuplanPath));
        let markdownTextActual = svPageParser.formatMessage($);
        assert.equal(markdownTextActual, markdownTextExpected, "Page is formatted to the correct markdown");
    });

    it('replaces markdown syntax characters in the menu',function () {

        let svPageParser = new SVPageParser();
        let $ = cheerio.load("<div class='offer'>" +
            "<p class='offer-description'>daily`s:</p> " +
            "<div class='menu-description'><p class='title'>Super-Duper Menu</p></div>" +
            "<div class='menu-description'><p class='trimmings'>A multi line*, <br\>" +
            "*dish</p></div>" +
            "<div class='price'><span class='price-item'>#CHF 16.90_</span></div>" +
            "</div>"
        );
        let markdownTextExpected = "*dailys:: Super-Duper Menu*\n" +
            "A multi line, dish\n" +
            "_CHF 16.90_\n\n";
        let markdownTextActual = svPageParser.formatMessage($);
        assert.equal(markdownTextActual, markdownTextExpected, "escapes the relevant ");
    });
});

