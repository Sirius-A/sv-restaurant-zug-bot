'use strict';
const assert = require('chai').assert;
const fs = require('fs');
const cheerio = require("cheerio/lib/static.js");
const MealsController = require('../app/app');


describe('The sv page parer module', function(){
    it('formats the menuplan page of 2016-02-14 correctly',function () {
        let menuplanPath = __dirname + "\\menuplan2016-02-14.html";

        let mealsController = new MealsController.MealsController();

        let $ = cheerio.load(fs.readFileSync(menuplanPath));
        mealsController.formatMessage($,function (text) {
            console.warn("callback");
            console.warn(text);
        });
/*        mealsController.parse('file://__dirname\\test\Menuplan2016-02-14.html',function () {

        });*/
    });
});

