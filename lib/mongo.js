const { MongoClient } = require("mongodb")
require("dotenv").config()

const MongoModel = function() {
    this.client = new MongoClient(process.env.mongoUrl)
    this.db = this.client.db("chaTime")
}

MongoModel.prototype.connect = async function() {
    await this.client.connect()
        .then(() => console.log("Success"))
        .catch(message => console.log(message))
}

MongoModel.prototype.getMessage = async function(callback, query = {}) {
    await this.client.connect()

    this.db.collection("message").find(query).toArray()
        .then(Allmsg => callback(Allmsg))
        .catch(errMsg => console.log(errMsg))
}

MongoModel.prototype.pushMessage = async function(messageDetail, callback) {
    await this.client.connect()

    await this.db.collection("message").insertOne(messageDetail)
        .then(message => {
            console.log(`Message has sent, Id : ${message.insertedId}`)
            callback(message.insertedId)
        })
        .catch(errMsg => console.log(errMsg))

}

MongoModel.prototype.closeConnection = async function() {
    await this.client.close()
}

module.exports = MongoModel