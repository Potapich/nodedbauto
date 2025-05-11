const express = require('express');
const path = require('path');
const config = require('./config');

let app = express();

let server = require('http').createServer(app);

server.listen(config.start_port, function () {
    console.log('App listening on port ' + config.start_port + '!');
});
app.use(express.json());

const mongoConfig = require('./config/config_mongo');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

let urlDB = mongoConfig.mongoURL;//'mongodb://' + mongoConfig.user + ':' + mongoConfig.password + '@' + mongoConfig.rootlink_ip + ',' + mongoConfig.secondarylink_ip;
let dbo;
let numbersCollection;

(function mongo_starter() {
    MongoClient.connect(urlDB, {   // + '/' + dbName, {
        useUnifiedTopology: true, useNewUrlParser: true
    }, function (err, db) {
        if (err) {
            console.log(err);
            return err;
        } else {
            console.log("Connected successfully to db");
            dbo = db.db();
            numbersCollection = dbo.collection(mongoConfig.numbersCollection);
        }
    })
})();

async function insertNote() {
    try {
        numbersCollection.insertOne(noteI, function (err, results) {
            if (err) {
                console.warn(err);
            } else
                console.log(results);
        });
    } catch (e) {
        console.log('MONGO_ERROR', e);
    }
}

async function updateNotes() {
    try {
        numbersCollection.find({type: 'counters'}).toArray(async function (err, result) {
            numbersCollection.updateOne({type: 'counters'}, {
                $set: {
                    "visiters": Number(result[0].visiters + 1),
                }
            })
        })
    } catch (e) {
        console.log('MONGO_ERROR', e);
    }
}

async function getNotes() {
    try {
        let result = await numbersCollection.find({type: "counters"}, {
            projection: {_id: 0, type: 0}
        }).toArray();
        console.log(result);
    } catch (e) {
        console.log('MONGO_ERROR', e);
    }
}

let noteI = {
    "type": "counters",
    "visiters": 0
};

setTimeout(insertNote, 5000)
setTimeout(updateNotes, 10000)
setTimeout(getNotes, 15000)