const { MongoClient } = require("mongodb")
const pathP = require("path")
// require("dotenv").config({
//     path: pathP.join(__dirname, "../env")
// })

const MongoModel = function() {
    this.client = new MongoClient("mongodb+srv://novan:12345@cluster0.vrmp5.mongodb.net/?retryWrites=true&w=majority")
    this.db = this.client.db("chaTime")
}

MongoModel.prototype.connect = async function() {
    await this.client.connect()
        .then(() => console.log("Connected..."))
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

MongoModel.prototype.login = async function(Username, Password, callback) {
    await this.client.connect()

    await this.db.collection("user").findOne({ username: Username })
        .then(userDetail => {
            console.log(userDetail);
            return userDetail.username == Username && userDetail.password == Password
        })
        .then(res => {
            callback(res, false)
        })
        .catch(msg => callback(null, msg))
}

MongoModel.prototype.closeConnection = async function() {
    await this.client.close()
}

module.exports = MongoModel
