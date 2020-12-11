//Node server which will handle socket.io connection
const users = {};

const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/css/style.css", (req, res) => {
    res.sendFile(__dirname + "/css/style.css");
});

app.get("/js/client.js", (req, res) => {
    res.sendFile(__dirname + "/js/client.js");
});

app.get("/logo.png", (req, res) => {
    res.sendFile(__dirname + "/logo.png");
});

app.get("/msg.mp3", (req, res) => {
    res.sendFile(__dirname + "/msg.mp3");
});

http.listen(port, () => {
    console.log("Listening on", port);
});

io.on("connection", (socket) => {
    //If any new user joins, let other users know.
    socket.on("new-user-joined", (data) => {
        socket.username = data.userName;
        socket.room = data.roomName;
        users[socket.id] = data.userName;
        socket.join(data.roomName);
        socket.broadcast.to(data.roomName).emit("user-joined", data.userName);
    });

    //If someone sends a message, broadcast it to other people.
    socket.on("send", (message) => {
        socket.broadcast.to(socket.room).emit("receive", {
            message: message,
            name: users[socket.id],
        });
    });

    //If someone leaves the chat, let other users know.
    socket.on("disconnect", (message) => {
        socket.broadcast.to(socket.room).emit("left", users[socket.id]);
        socket.leave(socket.room);
        delete users[socket.username];
    });
});
