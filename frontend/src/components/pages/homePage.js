import React, { useState, useEffect } from "react";
// import getUserInfo from "../../utilities/decodeJwt";
import Chat from "./chat/chatPage";
import Stations from "./stations/stationsList";

const HomePage = () => {
    // const [user, setUser] = useState({});
    const [trainLine, setTrainLine] = useState("Red");

    // useEffect(() => {
    //     setUser(getUserInfo());
    // }, []);

    const handleTrainlineChange = (trainLine) => {
        setTrainLine(trainLine);
    };

    // if (!user)
    //     return (
    //         <div>
    //             <h4>log in to view this page.</h4>
    //         </div>
    //     );

    // const {} = user;
    return (
        <>
            <Chat trainLine={trainLine}></Chat>
            <Stations handleTrainlineChecked={handleTrainlineChange}></Stations>
        </>
    );
};

export default HomePage;
