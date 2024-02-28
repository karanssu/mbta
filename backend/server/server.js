const express = require("express");
const app = express();
const cors = require("cors");
const loginRoute = require("./routes/user/userLogin");
const getAllUsersRoute = require("./routes/user/user");
const registerRoute = require("./routes/user/userSignUp");
const getUserByIdRoute = require("./routes/user/userGetUserById");
const getAllCommentRoute = require("./routes/comment/comment");
const dbConnection = require("./config/db.config");
const editUser = require("./routes/user/userEditUser");
const deleteUser = require("./routes/user/userDeleteAll");
const getAllFriendsRoute = require("./routes/friend/friend");


require("dotenv").config();
const SERVER_PORT = 8081;

dbConnection();
app.use(cors({ origin: "*" }));
app.use(express.json());

// user
app.use("/user", loginRoute);
app.use("/user", registerRoute);
app.use("/user", getAllUsersRoute);
app.use("/user", getUserByIdRoute);
app.use("/user", editUser);
app.use("/user", deleteUser);

// Comment
app.use("/comment", getAllCommentRoute);

// Friends
app.use("/friend", getAllFriendsRoute);

// Favriote Line

app.listen(SERVER_PORT, (req, res) => {
    console.log(
        `The backend service is running on port ${SERVER_PORT} and waiting for requests.`
    );
});
