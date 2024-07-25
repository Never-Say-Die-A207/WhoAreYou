const stompClient = new StompJs.Client({
    brokerURL: 'ws://localhost:8080/chat'
});
var roomId = -1;

stompClient.activate();

stompClient.onConnect = (frame) => {
    setConnected(true);
    console.log('Connected: ' + frame);

    roomId = $("#roomId").val();
    console.log(roomId);
    stompClient.subscribe('/message/' + roomId, (message) => {
        showMessage(JSON.parse(message.body));
    });
};

stompClient.onWebSocketError = (error) => {
    console.error('Error with websocket', error);
};

stompClient.onStompError = (frame) => {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
};

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#result").html("");
}

function connect() {
    stompClient.activate();
}

function disconnect() {
    stompClient.deactivate();
    setConnected(false);
    console.log("Disconnected");
}

//function sendMessage() {
//    stompClient.publish({
//        destination: "/send/rooms",
//        body: JSON.stringify({})
//    });
//}

function sendName() {
    roomId = $("#roomId").val();
    stompClient.publish({
        destination: "/send/rooms/" + roomId,
        body: JSON.stringify({'name': $("#name").val(), 'message': $("#message").val()})
    });
}

function showMessage(data) {
    const { sender, message, time } = data;
    const formattedMessage = `보낸 이 : ${sender} ${message}` + `\n${time}`;

    console.log(message);
    $("#result").append(`<tr><td>${formattedMessage}</td></tr>`);
}

$(function () {
    $("form").on('submit', (e) => e.preventDefault());
    $( "#connect" ).click(() => connect());
    $( "#disconnect" ).click(() => disconnect());
    $( "#send" ).click(() => sendName());
});

