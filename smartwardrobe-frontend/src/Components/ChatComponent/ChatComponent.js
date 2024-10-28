import { Button, Modal } from "antd";
import { useRef, useState } from "react";
import Draggable from "react-draggable";
import { FcGoogle } from "react-icons/fc";
import { Flex, Input, Typography } from "antd";
import "../../Styles/SignUp.css";
import apiCall from "../GenericApiCallFunctions/GenericApiCallFunctions";
import { Backdrop, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { showToastSuccess } from "../GenericToasters/GenericToasters";
import { IoMdChatboxes } from "react-icons/io";
import "../../Styles/ChatComponent.css";
import { FaPaperPlane } from "react-icons/fa6";

function ChatComponent(props) {
  const [disabled, setDisabled] = useState(true);
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
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const draggleRef = useRef(null);
  const handleCancel = (e) => {
    props?.closeModal();
  };
  const onStart = (_event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };
  const [showChat, setShowChat] = useState(false);
  const chatHandler = () => {
    setShowChat(!showChat);
  };

  return (
    <>
      <div>
        <Button
          className="Chat-button"
          aria-label="Scroll to top"
          onClick={chatHandler}
        >
          <IoMdChatboxes className="scroll-to-top-icons" />
        </Button>
      </div>
      <Modal
        title={
          <div
            style={{
              width: "100%",
              cursor: "move",
            }}
            onMouseOver={() => {
              if (disabled) {
                setDisabled(false);
              }
            }}
            onMouseOut={() => {
              setDisabled(true);
            }}
            onFocus={() => {}}
            onBlur={() => {}}
          >
            {/* {props?.title} */}
          </div>
        }
        open={showChat}
        width={"70%"}
        onCancel={chatHandler}
        // className="custom-modal"
        footer={[]}
        modalRender={(modal) => (
          <Draggable
            disabled={disabled}
            bounds={bounds}
            nodeRef={draggleRef}
            onStart={(event, uiData) => onStart(event, uiData)}
          >
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}
      >
        <div className="modal-container-chat">
          <div className="chat-container">
            <div className="left-chat-section">
              <h2>Contacts</h2>
              <div className="contact-list">
                <div className="contact">Alice</div>
                <div className="contact">Bob</div>
                <div className="contact">Charlie</div>
              </div>
            </div>
            <div className="right-chat-section">
              <h2>Chat</h2>
              <div className="chat-messages">
                <div className="message-container">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`chat-message ${
                        msg.sender === "user" ? "chat_sender" : "chat_receiver"
                      }`}
                    >
                      {msg.sender === "user" ? (
                        <p>{msg.text}</p>
                      ) : (
                        <p>
                          <strong>{msg?.sender}</strong> <br />
                          {msg.text}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="chat-input">
                <input type="text" placeholder="Type a message..." />
                <button className="send-button">
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
export default ChatComponent;
