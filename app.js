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
const {MongoClient} = require('mongodb');

let urlDB = mongoConfig.mongoURL;//'mongodb://' + mongoConfig.user + ':' + mongoConfig.password + '@' + mongoConfig.rootlink_ip + ',' + mongoConfig.secondarylink_ip;
let dbo;
let numbersCollection;

const client = new MongoClient(urlDB, {useNewUrlParser: true});

(function mongo_starter() {
    client.connect();

    console.log("Connected successfully to db");
    dbo = client.db();
    numbersCollection = dbo.collection(mongoConfig.numbersCollection);

    numbersCollection.deleteMany({}, function (err, result) {
        if (err) {
            console.log(err);
        }
        console.log(result);
    });

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
        let result = await numbersCollection.find({type: "counters"}, {
            projection: {_id: 0, type: 0}
        }).toArray();
        console.log(result)
        numbersCollection.updateOne({type: 'counters'}, {
            $set: {
                "visiters": Number(result[0].visiters + 1),
            }
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

setTimeout(insertNote, 1000)
setTimeout(updateNotes, 2000)
setTimeout(getNotes, 3000)