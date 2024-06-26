import CommentSendButton from "./commentSendButton";
import CommentInput from "./commentInput";
import CommentBoard from "./commentBoard";
import ChatTitle from "./chatTitle";
import { useEffect, useRef, useState } from "react";
import getUser from "../../../utilities/decodeJwt";
import "./chatPage.css";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
const REACT_APP_SOCKET_URI = process.env.REACT_APP_SOCKET_URI;
const socket = io(REACT_APP_SOCKET_URI);

const Chat = ({ trainLine }) => {
    const [user, setUser] = useState({});
    const [userComments, setUserComments] = useState([]);
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const scrollableDivRef = useRef(null);

    socket.on("receiveComment", (userComments) => {
        setUserComments(userComments);
        scrollToBottom();
    });

    const scrollToBottom = () => {
        if (scrollableDivRef.current) {
            scrollableDivRef.current.scrollTop =
                scrollableDivRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        setUser(getUser());
        fetchCommentDb(trainLine);
        socket.emit("joinTrainLine", trainLine);
    }, [trainLine]);

    const clearCommentInput = () => {
        inputRef.current.value = "";
    };

    const addUserComment = (username, trainLine, comment) => {
        setUserComments([
            ...userComments,
            {
                username: username,
                trainLine: trainLine,
                comment: comment,
            },
        ]);
    };

    const saveCommentDb = async (userId, trainLine, comment) => {
        try {
            const response = await fetch(REACT_APP_API_URL + "/comment/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    trainLine: trainLine,
                    comment: comment,
                }),
            });
            if (response.ok) {
            } else {
                throw new Error("Error saving data");
            }
        } catch (error) {
            throw new Error("Error:", error);
        }
    };

    const fetchCommentDb = async (trainLine) => {
        try {
            const response = await fetch(
                REACT_APP_API_URL + "/comment/getByTrainLine/" + trainLine
            );
            if (!response.ok) {
                throw new Error("Failed to fetch comments");
            }
            const userCommentsData = await response.json();
            setUserComments(userCommentsData);

            scrollToBottom();
        } catch (error) {
            console.error("Error fetching comments:", error.message);
        }
    };

    const handleSendButtonClick = () => {
        if (!user) {
            return navigate("/login");
        }

        const userId = user.id;
        const username = user.username;
        const comment = inputRef.current.value.trim();

        if (!comment) {
            return;
        }

        const success = saveCommentDb(userId, trainLine, comment);

        success
            .then(() => {
                addUserComment(username, trainLine, comment);
                socket.emit("sendComment", [
                    ...userComments,
                    {
                        username: username,
                        trainLine: trainLine,
                        comment: comment,
                    },
                ]);
                clearCommentInput();
                scrollToBottom();
            })
            .catch((e) => {
                console.log(e);
                alert("Something went wrong!");
            });
    };

    return (
        <>
            <div
                className="chat-container"
            >
                <div className="title-div">
                    <ChatTitle trainLine={trainLine}></ChatTitle>
                </div>
                <div className="horizontal-line"></div>
                <div className="chat-board-div" ref={scrollableDivRef}>
                    <CommentBoard userComments={userComments}></CommentBoard>
                </div>
                <div className="bottom-div row">
                    <div className="input-div col-10">
                        <CommentInput
                            handleSendButtonClick={handleSendButtonClick}
                            ref={inputRef}
                        ></CommentInput>
                    </div>
                    <div className="send-button-div col-2">
                        <CommentSendButton
                            handleSendButtonClick={handleSendButtonClick}
                        ></CommentSendButton>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Chat;
