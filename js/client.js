const socket = io();

//Get DOM elements in repective JS variables.
const form = document.getElementById("send-container");
const msginp = document.getElementById("msginp");
const container = document.querySelector(".container");

function updateScroll() {
    container.scrollTop = container.scrollHeight;
}

//Audio that will play on receiving messages.
var audio = new Audio("msg.mp3");

//Function which will append event info to the container.
const append = (message, position) => {
    const messageElement = document.createElement("div");
    messageElement.innerHTML = message;
    messageElement.classList.add("message");
    messageElement.classList.add(position);
    container.append(messageElement);
    if (position == "left") audio.play();
    updateScroll();
};

//Ask new user's name and let the server know.
const name = prompt("Enter your name to join");
const room = prompt("Enter the room name");
if (name.length > 0 && room.length > 0) {
    socket.emit("new-user-joined", { userName: name, roomName: room });
    append(
        `Welcome to the <b>Chat+</b>, ${name}. You are joined in <b>${room}</b> room.`,
        "right"
    );
} else {
    alert("Please enter a proper username & roomname!");
    location.reload();
}

//If a new user joins, receive the event from the server.
socket.on("user-joined", (name) => {
    append(`<b>${name}</b> joined the chat`, "right");
});

//If server sends the message, receive it.
socket.on("receive", (data) => {
    append(`<b>${data.name}:</b> ${data.message}`, "left");
});

//If a user leaves the chat, append the info to the container.
socket.on("left", (name) => {
    append(`<b>${name}</b> left the chat`, "right");
});

//If the form gets submitted, send server the message.
form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (msginp.value.length > 0) {
        const message = msginp.value;
        append(`<b>You:</b> ${message}`, "right");
        socket.emit("send", message);
        msginp.value = "";
    } else {
        alert("Please enter a message!");
    }
});
