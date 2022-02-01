const socket = io();

$(document).ready(function() {
    socket.on("loadMessages", allMsg => {
        for (const message of allMsg) {
            $("#messagePanel").append(`
            <div class="card message">
                <div class="card-header bg-success d-flex flex-row justify-content-between">
                    <span class="text-light">${message.from}</span>
                    <span class="text-light">${message.date}</span>
                </div>
                <div class="card-body">
                    <p class="card-text">
                        ${message.body}
                    </p>
                </div>
            </div>
            `)
        }
    })
})

$("#sendBtn").click(function() {
    const message = {
        from: $("#usernameBox").val(),
        body: $("#messageBody").val(),
    }
    socket.emit("send", message)
    $("#messageBody").text("")
})

socket.on("newMessage", message => {
    console.log(message)
    $("#messagePanel").append(`
    <div class="card message">
        <div class="card-header bg-success d-flex flex-row justify-content-between">
            <span class="text-light">${message.from}</span>
            <span class="text-light">${message.date}</span>
        </div>
        <div class="card-body">
            <p class="card-text">
                ${message.body}
            </p>
        </div>
    </div>
    `)
})