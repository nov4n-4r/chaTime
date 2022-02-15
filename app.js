const
path = require("path"),
dotenv = require("dotenv"),
cookie = require("cookie"),
MongoModel = require(path.join(__dirname, "lib/mongo.js")),
bodyParser = require("body-parser"),
express = require('express'),
cookieParser = require("cookie-parser"),
expressSession = require("express-session"),
flash = require("connect-flash"),
{ Server } = require("socket.io")

const app = express();
const http = require('http');
const server = http.createServer(app);
const io = new Server(server, {cookie : true});

const Mongo = new MongoModel()
// dotenv.config("./env")
Mongo.connect()

app.use(expressSession({
    secret: "asdfjklh000",
    resave: false,
    saveUninitialized: false
}))
app.use(flash())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))
app.use(bodyParser.urlencoded({ extended: false }))

app.set("view engine", "ejs")

app.route('/')
    .get((req, res) => {
        if (req.cookies.status) {
            res.render("home.ejs", { 
                username : req.cookies.username
            })
        } else {
            res.render("login.ejs", {
                flash : req.flash("msg")
            })
        }
        res.end()
    })
    .post((req, res) => {
        Mongo.login(req.body.username, req.body.password, function(success, err) {
            if (err) {
                req.flash("msg", "User not found")
            } else {
                if (success) {
                    res.cookie("username" ,req.body.username)
                    res.cookie("status" ,true, {httpOnly : true})
                } else {
                    req.flash("msg", "Incorrect information")
                }
            }
            res.redirect(`/`)
            res.end()
        })
    })

app.get("/logout", (req, res) => {
    res.clearCookie("username")
    res.clearCookie("status")
    res.redirect("/")
    res.end()
})

// *** Handling Online User *** 
    
const onlineUsersObj = require(path.join(__dirname, "lib/onlineUser.js"))
const users = new onlineUsersObj([])

// ============================

io.on("connect", socket => {
    Mongo.getMessage(allMsg => {
        socket.emit("loadMessages", allMsg)
    })
    const cookies = cookie.parse(socket.handshake.headers.cookie)
    users.add(socket.id, cookies.username)
})

io.on("connection", socket => {

    io.emit("refreshOnlineUser", {
        list : users.getNameList(),
        number : users.getNameList().length
    })
    
    socket.on("send", msg => {
        msg.date = new Date()
        Mongo.pushMessage(msg, messageId => {
            Mongo.getMessage(newMessage => {
                io.emit("newMessage", newMessage[0])
            }, { _id: messageId })
        })
    })

    socket.on("disconnect", s => {

        users.remove(socket.id)

        io.emit("refreshOnlineUser", {
            list : users.getNameList(),
            number : users.getNameList().length
        })
        console.log("A user has been disconnected");
    })
})

server.listen(3000, () => { console.log(`listening on port 3000`) })
