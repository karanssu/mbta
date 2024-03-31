import CommentSendButton from "./commentSendButton";
import CommentInput from "./commentInput";
import CommentBoard from "./commentBoard";
import ChatTitle from "./chatTitle";
import { useEffect, useRef, useState } from "react";
import getUserInfo from "../../../utilities/decodeJwt";
import Color from "../../../constants/colors";
import "./chatPage.css";

const Chat = () => {
    const [user, setUser] = useState({});
    const [userComments, setUserComments] = useState([]);
    const inputRef = useRef(null);
    const scrollableDivRef = useRef(null);

    useEffect(() => {
        setUser(getUserInfo());
        fetchCommentDb(trainLine);
    }, []);

    const scrollToBottom = () => {
        if (scrollableDivRef.current) {
            scrollableDivRef.current.scrollTop =
                scrollableDivRef.current.scrollHeight;
        }
    };

    const clearCommentInput = () => {
        inputRef.current.value = "";
    };

    const addUserComment = (username, comment) => {
        setUserComments([
            ...userComments,
            {
                username: username,
                comment: comment,
            },
        ]);
    };

    const saveCommentDb = async (userId, trainLine, comment) => {
        try {
            const response = await fetch("http://localhost:8081/comment/", {
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
                "http://localhost:8081/comment/getByTrainLine/" + trainLine
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
        const userId = user.id;
        const username = user.username;
        const comment = inputRef.current.value.trim();

        const success = saveCommentDb(userId, trainLine, comment);

        success
            .then(() => {
                addUserComment(username, comment);
                clearCommentInput();
                scrollToBottom();
            })
            .catch((e) => {
                console.log(e);
                alert("Something went wrong!");
            });
    };

    // TESTING PURPOSE ONLY
    /////////
    const [trainLine, setTrainLine] = useState("Red");

    const handleChange = (trainLine) => {
        setTrainLine(trainLine);
        fetchCommentDb(trainLine);
    };

    //////

    return (
        <>
            <div
                className="container"
                style={{ "--primary-color": Color.Pink }}
            >
                <div className="title-div">
                    <ChatTitle trainLine={trainLine}></ChatTitle>
                </div>
                <div className="horizontal-line"></div>
                <div className="chat-board-div" ref={scrollableDivRef}>
                    <CommentBoard userComments={userComments}></CommentBoard>
                </div>
                <div className="bottom-div row">
                    <div className="input-div col-11">
                        <CommentInput
                            handleSendButtonClick={handleSendButtonClick}
                            ref={inputRef}
                        ></CommentInput>
                    </div>
                    <div className="send-button-div col-1">
                        <CommentSendButton
                            handleSendButtonClick={handleSendButtonClick}
                        ></CommentSendButton>
                    </div>
                </div>
            </div>

            {/* TESTING PURPOSE ONLY */}
            {/* ///////////// */}
            <div>
                <label>
                    <input
                        type="radio"
                        name="color"
                        value="Red"
                        onChange={() => handleChange("Red")}
                    />
                    Red
                </label>
                <label>
                    <input
                        type="radio"
                        name="color"
                        value="Orange"
                        onChange={() => handleChange("Orange")}
                    />
                    Orange
                </label>
                <label>
                    <input
                        type="radio"
                        name="color"
                        value="Blue"
                        onChange={() => handleChange("Blue")}
                    />
                    Blue
                </label>
                <label>
                    <input
                        type="radio"
                        name="color"
                        value="Green"
                        onChange={() => handleChange("Green")}
                    />
                    Green
                </label>
            </div>
            {/* ////////////// */}
        </>
    );
};

export default Chat;
