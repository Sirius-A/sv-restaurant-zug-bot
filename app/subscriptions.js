const MongoClient = require('mongodb').MongoClient

class Subscriptions{
  async add(chat,callback){
    client = new MongoClient(mongodb_uri);
    try {
      const db = client.db('sv-bot');
      await db.collection('subscribers').updateOne(
        {id:chat.id},
        {$set:{'firstname': chat.first_name, 'lastname': chat.last_name, 'type': chat.type, 'username': chat.username }},
        { upsert: true}
      );
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }

    callback();
  }

  async addWeekday(chat, weekday, callback){
    client = new MongoClient(mongodb_uri);
    try {
      const db = client.db('sv-bot');

      // Insert/update a single document
      await db.collection('subscribers').updateOne(
        {id:chat.id},
        {$addToSet: {weekdays: weekday}},
        {upsert: true}
      );
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
    callback();
  }

  async remove(chatId, callback){
    client = new MongoClient(mongodb_uri);
    try {
      const db = client.db('sv-bot');

      // delete a single document
      await db.collection('subscribers').removeOne({id:chatId});

    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
    if(typeof callback === 'function') {
      callback();
    }
  }

  async getWeekdays(chat,callback){
    client = new MongoClient(mongodb_uri);
    try {
      const db = client.db('sv-bot');
      // Insert/update a single document
      db.collection('subscribers').findOne({ $and: [ {id:chat.id}, {weekdays:{$exists: true}}]},callback);

    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }

  }

  async forAllDailly(next){
    client = new MongoClient(mongodb_uri);
    try {
      const db = client.db('sv-bot');
      console.log("Connected correctly to server");

      //find all daily subs
      db.collection('subscribers').find({weekdays:{$exists: false}}).forEach(next);

    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }

  async forAllParttime(weekdayIndex, next){
    client = new MongoClient(mongodb_uri);
    try {
      const db = client.db('sv-bot');
      console.log("Connected correctly to server");

      // find all documents containing a given weekday
      db.collection('subscribers').find({weekdays: weekdayIndex}).forEach(next);

    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
}

module.exports = Subscriptions;
