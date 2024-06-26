const express = require("express");
const app = express();
const cors = require("cors");
const dbConnection = require("./config/db.config");

require("dotenv").config();
const SERVER_PORT = process.env.SERVER_PORT || 8081;
const CHAT_SERVER_PORT = process.env.CHAT_SERVER_PORT || 2000;

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
const REACT_APP_FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL;

// Socket
const io = require("socket.io")(CHAT_SERVER_PORT, {
    cors: {
        origin: [REACT_APP_API_URL, REACT_APP_FRONTEND_URL],
    },
});

io.on("connection", (socket) => {
    socket.on("joinTrainLine", (trainLine) => {
        if (socket.trainLine) {
            socket.leave(socket.trainLine);
        }
        socket.join(trainLine);
        socket.trainLine = trainLine;
    });
    socket.on("sendComment", (userComments) => {
        io.to(socket.trainLine).emit("receiveComment", userComments);
    });
});

dbConnection();
app.use(cors({ origin: "*" }));
app.use(express.json());

// user
app.use("/user", require("./routes/user/userLogin"));
app.use("/user", require("./routes/user/userSignUp"));
app.use("/user", require("./routes/user/users"));
app.use("/user", require("./routes/user/userGetUserById"));
app.use("/user", require("./routes/user/userEditUser"));
app.use("/user", require("./routes/user/userDeleteAll"));

// Comment
app.use("/comment", require("./routes/comment/comments"));
app.use("/comment", require("./routes/comment/commentGetByUserId"));
app.use("/comment", require("./routes/comment/commentGetByTrainLine"));
app.use("/comment", require("./routes/comment/commentAddByUserId"));

// Train Line
app.use("/trainLine", require("./routes/trainLine/trainLines"));

app.listen(SERVER_PORT, (req, res) => {
    console.log(
        `The backend service is running on port ${SERVER_PORT} and waiting for requests.`
    );
});
