const express = require('express');
const path = require("path")
const dotenv = require("dotenv")
const MongoModel = require(path.join(__dirname, "lib/mongo.js"))
const app = express();
const http = require('http');
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server);
const Mongo = new MongoModel()
dotenv.config()
Mongo.connect()

app.use(express.static(__dirname))
app.get('/', (req, res) => {
    res.set({
        "Access-Control-Allow-Origin": "*"
    }).sendFile(__dirname + '/index.html');
})

io.on("connect", socket => {
    Mongo.getMessage(allMsg => {
        socket.emit("loadMessages", allMsg)
    })
})

io.on("connection", socket => {
    socket.on("send", msg => {
        msg.date = new Date()
        Mongo.pushMessage(msg, messageId => {
            Mongo.getMessage(newMessage => {
                io.emit("newMessage", newMessage[0])
            }, { _id: messageId })
        })
    })
})

io.on("disconnect", socket => {
    console.log("user has been disconnected!")
})

server.listen(process.env.httpPort, () => { console.log(`listening on port ${process.env.httpPort}`) })