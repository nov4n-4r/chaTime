const socket = io();

const username = $("#usernameBox").val()
const msg = $("#messageBody")

$(document).ready(function() {
    socket.on("loadMessages", allMsg => {
        $("#messagePanel").text("")
        for (const message of allMsg) {
            renderMessage(message)
        }
        autoScrollToBottom()

    })
    $("#profileName").append(username)
})

socket.on("newMessage", message => {
    renderMessage(message)
    autoScrollToBottom()
})

socket.on("refreshOnlineUser", onlineUser => {
    $("#listOnlineUser").text("")
    $("#onlineMember").text(`${onlineUser.number} member online`)
    for(let name of onlineUser.list){
        name = (`
            <li class="">
                <p>${htmlText(name)}</p><span>(online)</span>
            </li>
        `)
        console.log(name);
        $("#listOnlineUser").append(name)
    }
})

$("#messageForm").keypress(function(e) {
    if (e.keyCode == 13) {
        if($("#messageBody").val().replace(/\s/gi, "") != ""){
            const message = {
                from: $("#usernameBox").val(),
                body: $("#messageBody").val(),
            }
            socket.emit("send", message)
        }
        $("#messageBody").val("")
    }
})

$("#sendBtn").click(function(e) {
    if($("#messageBody").val().replace(/\s/gi, "") != ""){
        const message = {
            from: $("#usernameBox").val(),
            body: $("#messageBody").val(),
        }
        socket.emit("send", message)
    }
    $("#messageBody").val("")
})

$("#logoutBtn").click(() => {
    socket.emit("logout", "nothing")
})

$("#onlineMember").click( () => {
    $("#listOnlineUser").toggleClass("slide")
    $("#darkerBackground").toggleClass("invicible")
    $("body").toggleClass("overflow-none")
})

$("#darkerBackground").click( () => {
    $("#listOnlineUser").toggleClass("slide")
    $("#darkerBackground").toggleClass("invicible")
    $("body").toggleClass("overflow-none")
})

// Custom function


function renderMessage(message){
    let messageClass = "message"
    if(username == message.from){
        messageClass += " self"
    }
    const date = convertDate(message.date)
    message.from = htmlText(message.from)
    message.body = htmlText(message.body)
    const html = (`
        <div class="${messageClass}">
            <h3 class="message-username">${message.from}</h3>
            <div class="message-body">
                    <h5>${message.body}</h5>
                <div class="message-time">
                    <p>${date}</p>
                </div>
            </div>
        </div>
    `)
    $("#messagePanel").append(html)
}

function autoScrollToBottom(){
    $("html").animate({
        scrollTop: $('html').get(0).scrollHeight
    }, 1000);
}