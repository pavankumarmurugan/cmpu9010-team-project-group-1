import { Modal } from "antd";
import { useRef, useState } from "react";
import Draggable from "react-draggable";
import { FaPlus } from "react-icons/fa";
import { Flex, Input, Typography } from "antd";
import "../../Styles/SignUp.css";
import apiCall from "../GenericApiCallFunctions/GenericApiCallFunctions";
import { Backdrop, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { showToastSuccess } from "../GenericToasters/GenericToasters";
import { IoMdChatboxes } from "react-icons/io";
import "../../Styles/ChatComponent.css";
import { FaPaperPlane } from "react-icons/fa6";
import { IoExitOutline } from "react-icons/io5";
import chatbackgroundimage from "../../Assets/chatbackgroundimage.jpg";
import { Search } from "@mui/icons-material";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import NewChatModal from "../NewChatModal/NewChatModal";

function ChatComponent(props) {
  const [disabled, setDisabled] = useState(true);
  const [hideLeftSection, sethideLeftSection] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
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
    props?.closeModal();
  };

  const toggleChatSection = () => {
    // debugger
    sethideLeftSection(false);
  };

  const handleShowChat = () => {
    // debugger
    if(window.innerWidth < 768){
      sethideLeftSection(true);
    }
  }

  const closeNewChat = () => {
    setShowNewChat(false);
  }

  const handleNewChat = () => {
    setShowNewChat(true);
  }

  return (
    <>
      {/* <div>
        <Button
          className="Chat-button"
          aria-label="Scroll to top"
          onClick={chatHandler}
        >
          <IoMdChatboxes style={{color:"white"}} />
        </Button>
      </div> */}
      
      {/** new chat component */}

        {showNewChat && 
        <NewChatModal
        isShowModel={showNewChat}
        closeModal={closeNewChat} />
      }

      {/** new chat component */}
      <Modal
        // title={
        //   <div
        //     style={{
        //       width: "100%",
        //       cursor: "move",
        //     }}
        //     onMouseOver={() => {
        //       if (disabled) {
        //         setDisabled(false);
        //       }
        //     }}
        //     onMouseOut={() => {
        //       setDisabled(true);
        //     }}
        //     onFocus={() => {}}
        //     onBlur={() => {}}
        //   >
        //     {/* {props?.title} */}
        //   </div>
        // }
        open={props?.isShowModel}
        width={"80%"}
        style={{ top: 20 }}
        onCancel={chatHandler}
        className="custom-modal-for-collaborative-chat"
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
            <div className={`left-chat-section ${hideLeftSection ? "hide-left" : "show-left"}`} >
              <div className="new-conversation-div">
                <div className="new-conversation">
                  <Button className="new-converation-button" color="default" onClick={handleNewChat}>
                    <FaPlus
                      style={{
                        width: "20px",
                        height: "20px",
                        paddingRight: "10px",
                        paddingBottom: "3px",
                      }}
                    />
                    New Conversation
                  </Button>
                </div>
              </div>
              <h2>Chats</h2>
              <div className="search-contacts">
                <div className="search-input">
                  <input type="text" placeholder="Search Friends" />
                  <button className="search-button">
                    <Search style={{ color: "2e3b4e" }} />
                  </button>
                </div>
              </div>
              {/* <h4>
                <b style={{ paddingLeft: "10px" }}>GROUPS</b>
              </h4> */}
              <div className="contact-list">
                <div className="contact-details-div" onClick={handleShowChat}>
                  <img
                    src={chatbackgroundimage}
                    alt="Alice"
                    className="contact-image"
                  />
                  <div className="contact-name-and-last-msg" >
                    <div className="contact-Name">Alice</div>
                    <div className="contact-last-msg">Hi, how are you?</div>
                  </div>
                </div>
                <div className="contact-details-div">
                  <img
                    src={chatbackgroundimage}
                    alt="Alice"
                    className="contact-image"
                  />
                  <div className="contact-name-and-last-msg">
                    <div className="contact-Name">Salil</div>
                    <div className="contact-last-msg">Hi, how are you?</div>
                  </div>
                </div>
              </div>
              {/* <h4>
                <b style={{ paddingLeft: "10px" }}>CONTACTS</b>
              </h4> */}
              <div className="contact-list">
                <div className="contact-details-div">
                  <img
                    src={chatbackgroundimage}
                    alt="Alice"
                    className="contact-image"
                  />
                  <div className="contact-name-and-last-msg">
                    <div className="contact-Name">Pavan</div>
                    <div className="contact-last-msg">Hi, how are you?</div>
                  </div>
                </div>
                <div className="contact-details-div">
                  <img
                    src={chatbackgroundimage}
                    alt="Alice"
                    className="contact-image"
                  />
                  <div className="contact-name-and-last-msg">
                    <div className="contact-Name">Jane</div>
                    <div className="contact-last-msg">Hi, how are you?</div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`right-chat-section ${hideLeftSection ? "show-right" : "hide-right"}`} 
              style={{
                // backgroundImage: `url(${chatbackgroundimage})`,
                backgroundColor: "#f4f3f8",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="chat-header">
                <div className="back-icon">
                  <ChevronLeftOutlinedIcon
                    style={{ width: "30px", height: "30px" }}
                    onClick={toggleChatSection}
                  />
                </div>
                {/* {hideLeftSection && (
                  <div className="back-icon">
                <ChevronLeftOutlinedIcon style={{width:"30px", height:"30px"}} onclick={toggleChatSection} />
                </div>)} */}
                <div className="Chat-Icon-and-Name-div">
                  <div className="Chat-Icon-and-Name">
                    <img
                      src={chatbackgroundimage}
                      alt="Alice"
                      className="contact-image"
                    />
                    <h2 className="contact-Name-for-OpenChat">TUD Group</h2>
                  </div>
                  <div className="Invite-Friends">
                    <FaPlus
                      style={{
                        width: "20px",
                        height: "20px",
                        paddingRight: "10px",
                        paddingBottom: "3px",
                      }}
                    />
                    <h3 className="invite-friends-text">Invite Friends</h3>
                  </div>
                </div>
              </div>
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
                        <div className="receiver-message">
                          <img
                            src={chatbackgroundimage}
                            alt={msg.sender}
                            className="receiver-image"
                          />
                          <p>
                            <strong>{msg?.sender}</strong> <br />
                            {msg.text}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="chat-input">
                <input type="text" placeholder="Type a message..." />
                <button className="send-button">
                  <FaPaperPlane style={{ color: "2e3b4e" }} />
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
