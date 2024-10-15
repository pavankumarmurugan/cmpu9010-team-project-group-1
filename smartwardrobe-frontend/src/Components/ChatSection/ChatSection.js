import React, { useRef, useState } from "react";
import "../../Styles/ChatSection.css";

const ChatSection = () => {
    const chatBoxRef = useRef(null);
    const [messages, setMessages] = useState([
        { sender: "user", text: "Hello, how are you?" },
        { sender: "bot", text: "I'm good! How can I assist you today?" },
        { sender: "user", text: "Can you tell me about the weather?" },
        { sender: "bot", text: "Sure! It looks sunny and warm today." },
        { sender: "user", text: "Hello, how are you?" },
        { sender: "bot", text: "I'm good! How can I assist you today?" },
        { sender: "user", text: "Can you tell me about the weather?" },
        { sender: "bot", text: "Sure! It looks sunny and warm today." },
        { sender: "user", text: "Hello, how are you?" },
        { sender: "bot", text: "I'm good! How can I assist you today?" },
        { sender: "user", text: "Can you tell me about the weather?" },
        { sender: "bot", text: "Sure! It looks sunny and warm today." },
        { sender: "user", text: "Hello, how are you?" },
        { sender: "bot", text: "I'm good! How can I assist you today?" },
        { sender: "user", text: "Can you tell me about the weather?" },
        { sender: "bot", text: "Sure! It looks sunny and warm today." },
    ]);

    /** this function will call later when calling api for message and response show */
    const addMessage = (sender, text) => {
        setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages, { sender, text }];
            scrollToBottom();
            return updatedMessages;
        });
    };

    /** this is to scroll bottom at the latest chat */
    const scrollToBottom = () => {
        const chatBox = chatBoxRef.current;
        if (chatBox) {
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    };

    return (
        <div className="chat-container">
        <div className="chat-box" ref={chatBoxRef}>
            {messages.map((msg, index) => (
                <div
                    key={index}
                    className={`chat-message ${msg.sender === "user" ? "chat_sender" : "chat_receiver"}`}
                >
                    <p>{msg.text}</p>
                </div>
            ))}
        </div>
    </div>
    );
    };

export default ChatSection;