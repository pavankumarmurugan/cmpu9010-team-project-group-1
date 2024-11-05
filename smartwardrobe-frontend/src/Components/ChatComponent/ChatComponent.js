import { Modal } from "antd";
import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { FaPlus } from "react-icons/fa";
import { Flex, Input, Typography } from "antd";
import "../../Styles/SignUp.css";
import apiCall from "../GenericApiCallFunctions/GenericApiCallFunctions";
import {
  Backdrop,
  Badge,
  Button,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  styled,
} from "@mui/material";
import "../../Styles/ChatComponent.css";
import { FaPaperPlane } from "react-icons/fa6";
import { IoExitOutline } from "react-icons/io5";
import chatbackgroundimage from "../../Assets/chatbackgroundimage.jpg";
import { Search } from "@mui/icons-material";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NewChatModal from "../NewChatModal/NewChatModal";
import TextArea from "antd/es/input/TextArea";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { showToastInfo } from "../GenericToasters/GenericToasters";
// import { FreiendRequestsValueSuccess } from "../../redux/slices/HomeDataSlice";

function ChatComponent(props) {
  let token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const [disabled, setDisabled] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [openLoader, setOpenLoader] = useState(false);
  const [addNewFriendorGroup, setaddNewFriendorGroup] = useState("");
  const [friendReqCount, setFriendReqCount] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendReqCountToShow, setFriendReqCountToShow] = useState(0);
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
  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      color: "white",
      backgroundColor: "black",
    },
  }));
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

  /** get all friend requests */

  useEffect(() => {
    getAllFriendandFriendRequests();
  }, []);

  const getAllFriendandFriendRequests = async () => {
    debugger;
    setOpenLoader(true);
    const getFriendReqList = await apiCall(
      "GET",
      "https://smartwardrobe-backend.azurewebsites.net/friend-requests/get-all-my-received-requests",
      null,
      token?.token
    );
    if (getFriendReqList?.data?.length > 0) {
      setFriendReqCountToShow(getFriendReqList?.data?.length);
      setFriendReqCount(getFriendReqList?.data);
      setaddNewFriendorGroup("friendReq");
    }

    const getGroupsList = await apiCall("GET", "https://smartwardrobe-backend.azurewebsites.net/group/get-my-groups", null, token?.token);
    if (getGroupsList?.data?.length > 0) {
      setFriends(getGroupsList?.data);
    }

    const getFriendsList = await apiCall(
      "GET",
      "https://smartwardrobe-backend.azurewebsites.net/friends/get-all-my-friends",
      null,
      token?.token
    );
    if (getFriendsList?.data?.length > 0) {
      setFriends((prevFriends) => [...prevFriends, ...getFriendsList.data]);
    }
    setOpenLoader(false);
  };

  /** get all friend requests */

  const chatHandler = () => {
    props?.closeModal();
  };

  const toggleChatSection = () => {
    // debugger
    sethideLeftSection(false);
  };

  const handleShowChat = (event) => {
    debugger
    if (window.innerWidth < 768) {
      sethideLeftSection(true);
    }
  };

  const closeNewChat = () => {
    setShowNewChat(false);
  };

  /** more options menu */

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (e) => {
    debugger;
    if (e === "AddFriends") {
      setaddNewFriendorGroup("AddFriends");
      setShowNewChat(true);
    } else if (e === "CreateGroup") {
      setaddNewFriendorGroup("CreateGroup");
      setShowNewChat(true);
    }
    setAnchorEl(null);
  };
  /** more options menu */

  /** open friend requests modal */

  const handleFriendRequests = () => {
    if(friendReqCountToShow !== 0){
      setaddNewFriendorGroup("friendReq");
      setShowNewChat(true);
    }else{
      showToastInfo("No friend requests to show");
    }
  }

  /** open friend requests modal */

  return (
    <>
      {/** loader code */}
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={openLoader}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/** loader code */}

      {/** new chat component */}

      {showNewChat && (
        <NewChatModal
          isShowModel={showNewChat}
          closeModal={closeNewChat}
          showSection={addNewFriendorGroup}
          friendReqCount={friendReqCount}
          friends={friends}
          setFriendReqCountToShow={setFriendReqCountToShow}
        />
      )}

      {/** new chat component */}

      <Modal
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
            <div
              className={`left-chat-section ${
                hideLeftSection ? "hide-left" : "show-left"
              }`}
            >
              {/* <div className="new-conversation-div">
                <div className="new-conversation">
                  <Button
                    className="new-converation-button"
                    color="default"
                    onClick={handleNewChat}
                  >
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
              </div> */}
              <div className="chat-moreoptions-icon">
                <h2>Chats</h2>
                <div className="moreoptions-div">
                  <StyledBadge
                    badgeContent={friendReqCountToShow}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                  >
                    <PeopleOutlinedIcon style={{ cursor: "pointer" }} onClick={handleFriendRequests} />
                  </StyledBadge>
                  <IconButton
                    aria-label="more"
                    aria-controls="kebab-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="kebab-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    MenuListProps={{
                      "aria-labelledby": "more-button",
                    }}
                  >
                    <MenuItem onClick={() => handleClose("AddFriends")}>
                      Add Friends
                    </MenuItem>
                    <MenuItem onClick={(e) => handleClose("CreateGroup")}>
                      Create Group
                    </MenuItem>
                  </Menu>
                </div>
              </div>
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
                {friends?.map((friend, index) => (
                <div className="contact-details-div" onClick={() => handleShowChat(friend)}>
                  <img
                    src={
                      friend?.profilePic
                        ? friend?.profilePic
                        : chatbackgroundimage
                    }
                    alt="Alice"
                    className="contact-image"
                  />
                  <div className="contact-name-and-last-msg">
                    <div className="contact-Name">{friend?.groupName ? friend?.groupName : friend?.username}</div>
                    <div className="contact-last-msg">Hi, how are you?</div>
                  </div>
                </div>))}
                {
                  friends?.length === 0 && (
                    <div className="no-friends">
                      <h4>No Friends</h4>
                    </div>
                  )
                }
              </div>
            </div>
            <div
              className={`right-chat-section ${
                hideLeftSection ? "show-right" : "hide-right"
              }`}
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
                {/* <input type="text" placeholder="Type a message..." /> */}
                <TextArea
                  style={{ paddingRight: "7%" }}
                  placeholder="Type a message..."
                  autoSize={{ minRows: 2 }}
                  className="custom-textarea"
                />
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
