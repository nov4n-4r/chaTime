const
    express = require('express'),
    path = require("path"),
    dotenv = require("dotenv"),
    MongoModel = require(path.join(__dirname, "lib/mongo.js")),
    bodyParser = require("body-parser"),
    cookieParser = require("cookie-parser"),
    expressSession = require("express-session"),
    flash = require("connect-flash"),
    { Server } = require("socket.io")

const app = express();
const http = require('http');
const server = http.createServer(app);
const io = new Server(server, {cookie : true});

const Mongo = new MongoModel()
dotenv.config("./env")
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
        console.log(req.cookies);
        if (typeof req.cookies.Auth != "undefined") {
            res.render("home.ejs", { 
                username : req.cookies.Auth.username
            })
            // console.log(req.cookies["connect.sid"]);

// s:oWHjfYBUbLytjabKQ5ZnkK-r4VJybOyS.i6pgwJHTm7Qjp+7hXTTZfEOcVe1Rb96tlyJnBf+swlE
// s%3AoWHjfYBUbLytjabKQ5ZnkK-r4VJybOyS.i6pgwJHTm7Qjp%2B7hXTTZfEOcVe1Rb96tlyJnBf%2BswlE

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
                    res.cookie("Auth", {
                        status: true,
                        msg: "Login success",
                        username : req.body.username
                    }, {
                        httpOnly: true
                    })
                } else {
                    req.flash("msg", "Incorrect information")
                }
            }
            res.redirect(`/`)
            res.end()
        })
    })

app.get("/logout", (req, res) => {
    res.clearCookie("Auth")
    res.redirect("/")
    res.end()
})

io.on("connect", socket => {
    Mongo.getMessage(allMsg => {
        socket.emit("loadMessages", allMsg)
    })
})

let userConnected = 0;
io.on("connection", socket => {
    userConnected += 1
    io.emit("refreshOnlineUser", userConnected)
    console.log(socket.handshake.headers.cookie);
    
    socket.on("send", msg => {
        msg.date = new Date()
        Mongo.pushMessage(msg, messageId => {
            Mongo.getMessage(newMessage => {
                io.emit("newMessage", newMessage[0])
            }, { _id: messageId })
        })
    })

    socket.on("disconnect", s => {
        userConnected -= 1
        io.emit("refreshOnlineUser", userConnected)
        console.log("A user has been disconnected");
    })
})

server.listen(process.env.httpPort, () => { console.log(`listening on port ${process.env.httpPort}`) })
