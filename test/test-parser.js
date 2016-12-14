'use strict';
const assert = require('chai').assert;
const MealsController = require('../app/app');

describe('The sv page parer module', function(){
    it('parses the menuplan page of 2016-02-14',function () {
        var mealsController = new MealsController.MealsController();
        console.log("bla")
        mealsController.parse('http://siemens.sv-restaurant.ch/de/menuplan.html',function (text) {
            console.log("callback");
            console.log(text);
        });
/*        mealsController.parse('file://__dirname\\test\Menuplan2016-02-14.html',function () {

        });*/
    });
});

