import Color from "../../../constants/colors";

const ChatTitle = ({ trainLine }) => {
    const chatTitleStyle = {
        color: Color[trainLine],
        fontWeight: "bold",
        textAlign: "center",
    };

    return (
        <>
            <div>
                <h1 style={chatTitleStyle}>Live Chat: {trainLine} Line</h1>
            </div>
        </>
    );
};

export default ChatTitle;