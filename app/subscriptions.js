'use strict';
var mongodb_uri = process.env.MONGODB_URI;
var MongoClient = require('mongodb').MongoClient,
    co = require('co'),
    assert = require('assert');

class Subscriptions{

    add(chat,callback){
        co(function*() {
            //connect to db
            var db = yield MongoClient.connect(mongodb_uri);
            console.log("Connected correctly to server");

            // Insert a single document
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

    remove(chat, callback){
        co(function*() {
            //connect to db
            var db = yield MongoClient.connect(mongodb_uri);
            console.log("Connected correctly to server");

            // delete a single document
            yield db.collection('subscribers').removeOne({id:chat.id});

            // Close connection
            db.close();
        }).catch(function(err) {
            console.log(err.stack);
        });

        callback();
    }

    getAll(callback){
        var subscriberCollection = co(function*() {
            //connect to db
            var db = yield MongoClient.connect(mongodb_uri);
            console.log("Connected correctly to server");

            // delete a single document
            var subscriberCollection = yield db.collection('subscribers').find();

            // Close connection
            db.close();

            return subscriberCollection;
        }).catch(function(err) {
            console.log(err.stack);
        }).then();

        callback(subscriberCollection);
    }

}

module.exports = Subscriptions;