'use strict';
const assert = require('assert');
const fs = require('fs');
const cheerio = require("cheerio/lib/static.js");
const SVPageParser = require('../app/SVPageParser');


describe('The sv page formatting module', function(){
    it('formats the menuplan page of 2016-02-14 correctly',function() {
        let markdownTextExpected = `*chefs choice: Knusprig gebratene Entenbrust*
an Balsamicojus
Ofen Kartoffeln
Grillgemüse
_CHF 18.90_

*dailys: Gemüseauflauf*
mit Basilikumsauce
und gebackenen Avocadoecken
_CHF 14.50_

*free choice: Sautierte Lammstreifen*
Thymiansauce, Kartoffelgratin, Schwarzwurzel mit Sultanienen, 
Gemüseebly, Bouillongemüse, 
sautiertes Kürbisgemüse
_100G 3.30_

*season market: Wrap mit Rindsstreifen*
Cocktailsauce, Rucola, 
Tomaten, Eisbergsalat
an bunten Blattsalaten
_CHF 17.50_

*go4 pasta: Agnolotti Fondue*
Sauce Quattro Formaggi
und Gemüse Ragout
_CHF 14.90_

`;
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

