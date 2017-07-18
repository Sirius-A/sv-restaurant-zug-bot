'use strict';
var mongodb_uri = process.env.MONGODB_URI;
var MongoClient = require('mongodb').MongoClient,
    co = require('co');

class Subscriptions{

    add(chat,callback){
        co(function*() {
            //connect to db
            var db = yield MongoClient.connect(mongodb_uri);
            console.log("Connected correctly to server");

            // Insert/update a single document
            yield db.collection('subscribers').updateOne(
                {id:chat.id},
                {$set:{'firstname': chat.first_name, 'lastname': chat.last_name, 'type': chat.type, 'username': chat.username }},
                { upsert: true}
            );

            // Close connection
            db.close();
        }).catch(function(err) {
            console.log(err.stack);
        });

        callback();
    }

    addWeekday(chat, weekday, callback){
        co(function*() {
            //connect to db
            var db = yield MongoClient.connect(mongodb_uri);
            console.log("Connected correctly to server");

            // Insert/update a single document
            yield db.collection('subscribers').updateOne(
                {id:chat.id},
                {$addToSet: {weekdays: weekday}},
                {upsert: true}
            );

            // Close connection
            db.close();
        }).catch(function(err) {
            console.log(err.stack);
        });

        callback();
    }

    remove(chatId, callback){
        co(function*() {
            //connect to db
            var db = yield MongoClient.connect(mongodb_uri);
            console.log("Connected correctly to server");

            // delete a single document
            yield db.collection('subscribers').removeOne({id:chatId});

            // Close connection
            db.close();
        }).catch(function(err) {
            console.log(err.stack);
        });
        if(typeof callback === 'function') {
            callback();
        }
    }

    getWeekdays(chat,callback){
        co(function*() {
            //connect to db
            var db = yield MongoClient.connect(mongodb_uri);
            console.log("Connected correctly to server");

            // Insert/update a single document
            db.collection('subscribers').findOne({ $and: [ {id:chat.id}, {weekdays:{$exists: true}}]},callback);

            // Close connection
            db.close();
        }).catch(function(err) {
            console.log(err.stack);
        });

    }

    forAllDailly(next){
        co(function*() {
            //connect to db
            var db = yield MongoClient.connect(mongodb_uri);
            console.log("Connected correctly to server");

            //find all daily subs
            db.collection('subscribers').find({weekdays:{$exists: false}}).forEach(next);

            // Close connection
            db.close();
        }).catch(function(err) {
            console.log(err.stack);
        });
    }
    forAllParttime(weekdayIndex,next){
        co(function*() {
            //connect to db
            var db = yield MongoClient.connect(mongodb_uri);
            console.log("Connected correctly to server");

            // find all documents containing a given weekday
            db.collection('subscribers').find({weekdays: weekdayIndex}).forEach(next);

            // Close connection
            db.close();
        }).catch(function(err) {
            console.log(err.stack);
        });
    }
}

module.exports = Subscriptions;