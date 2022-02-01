const { MongoClient } = require("mongodb")
require("dotenv").config()

async function setup() {

    const driverMongo = new MongoClient(process.env.mongoUrl)

    console.log(`Connecting to database on url *${process.env.mongoUrl}*...`);
    console.log("==========================================================");

    await driverMongo.connect()
        .then(msg => console.log("Connected into database!"))
        .catch(msg => console.log(`Can't connected into database : ${msg}`))
    console.log("==========================================================");

    await driverMongo.db("chaTime").createCollection("message")
        .then(msg => console.log(message))
        .catch(errMsg => console.log(`Can't create "message" collection : ${errMsg}`))
        .finally(() => driverMongo.close())
    console.log("==========================================================");

    console.log("Setup finished");
}

setup()