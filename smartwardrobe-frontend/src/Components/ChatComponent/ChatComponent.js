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

function ChatComponent(props) {
  let token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
    const messagesEndRef = useRef(null);
  const [disabled, setDisabled] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [openLoader, setOpenLoader] = useState(false);
  const [addNewFriendorGroup, setaddNewFriendorGroup] = useState("");
  const [textValue, settextValue] = useState("");
  const [friendReqCount, setFriendReqCount] = useState([]);
  const [activeFriend, setActiveFriend] = useState(null);
  const [chatInfo, setChatInfo] = useState({});
  const [friends, setFriends] = useState([]);
  const [friendsDataForFilter, setFriendsDataForFilter] = useState([]);
  const [friendReqCountToShow, setFriendReqCountToShow] = useState(0);
  const [hideLeftSection, sethideLeftSection] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [messages, setMessages] = useState([]);
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

    const getGroupsList = await apiCall(
      "GET",
      "https://smartwardrobe-backend.azurewebsites.net/group/get-my-groups",
      null,
      token?.token
    );
    if (getGroupsList?.data?.length > 0) {
      setFriends(getGroupsList?.data);
      setFriendsDataForFilter(getGroupsList?.data);
    }

    const getFriendsList = await apiCall(
      "GET",
      "https://smartwardrobe-backend.azurewebsites.net/friends/get-all-my-friends",
      null,
      token?.token
    );
    if (getFriendsList?.data?.length > 0) {
      setFriends((prevFriends) => [...prevFriends, ...getFriendsList.data]);
      setFriendsDataForFilter((prevFriends) => [
        ...prevFriends,
        ...getFriendsList.data,
      ]);
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

  const handleShowChat = async (event) => {
    debugger;
    setActiveFriend(event);
    setChatInfo(event);

    if(event?.userId){
    const getMessages = await apiCall(
      "GET",
      `https://smartwardrobe-backend.azurewebsites.net/chat/get-all-my-chats-by-friend-id/${event?.userId}`,
      null,
      token?.token
    );

    if (getMessages?.data?.length > 0) {
      const sortedMessages = getMessages?.data.sort((a, b) => a.id - b.id);
      setMessages(sortedMessages);
    }
  }

  if(event?.groupId){
    const getGroupMessages = await apiCall(
      "GET",
      `https://smartwardrobe-backend.azurewebsites.net/chat/get-all-my-chats-by-group-id/${event?.groupId}`,
      null,
      token?.token
    );

    if (getGroupMessages?.data?.length > 0) {
      const sortedMessages = getGroupMessages?.data.sort((a, b) => a.id - b.id);
      setMessages(sortedMessages);
    }
  }

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
    if (friendReqCountToShow !== 0) {
      setaddNewFriendorGroup("friendReq");
      setShowNewChat(true);
    } else {
      showToastInfo("No friend requests to show");
    }
  };

  /** open friend requests modal */

  /** handle friend search */

  const handleFriendsSearch = (event) => {
    debugger;
    let searchValue = event?.target?.value;
    if (searchValue.trim() !== "") {
      let filteredFriends = friendsDataForFilter.filter((friend) => {
        const usernameMatches = friend?.username
          ?.toLowerCase()
          .includes(searchValue.toLowerCase());
        const groupNameMatches = friend?.groupName
          ?.toLowerCase()
          .includes(searchValue.toLowerCase());
        return usernameMatches || groupNameMatches; // Match either username or groupName
      });
      setFriends(filteredFriends);
    } else {
      setFriends(friendsDataForFilter);
    }
  };

  /** handle friend search */

  /** Re-render Component */

  const rerenderComponent = () => {
    getAllFriendandFriendRequests();
  };

  /** Re-render Component */

  /** handle Invite friend to group */

  const handleInviteFriendsToGroup = () => {
    debugger;
    setaddNewFriendorGroup("InviteFriendsToGroup");
    setShowNewChat(true);
  };

  /** handle Invite friend to group */

  /** handle send messages */

  const handleInput = (event) => {
    if (chatInfo?.userId || chatInfo?.groupName) {
      settextValue(event.target.value);
    }
  };

  const handleSendMessage = async (event) => {
    if (event.key === "Enter" && textValue.trim() !== "") {
      event.preventDefault();
      if (chatInfo?.userId) {
        let message = {
          message: textValue,
          receiverId: chatInfo?.userId,
          messageType: "text"
        };
        setMessages((prevMessages) => [
          ...prevMessages,
          { 
            message: textValue,
            receiverId: chatInfo?.userId,
            messageType: "text"
           },
        ]);
        settextValue("");
        const sendMessage = await apiCall(
          "POST",
          "https://smartwardrobe-backend.azurewebsites.net/chat/create/send-message-to-friend",
          message,
          token?.token
        );
        if (sendMessage) {
          console.log(sendMessage);
        }
      }
      if (chatInfo?.groupId) {
        let message = {
          message: textValue,
          groupId: chatInfo?.groupId,
          messageType: "text"
        };
        setMessages((prevMessages) => [
          ...prevMessages,
          { 
            message: textValue,
            groupId: chatInfo?.groupId,
            messageType: "text"
           },
        ]);
        settextValue("");
        const sendMessage = await apiCall(
          "POST",
          "https://smartwardrobe-backend.azurewebsites.net/chat/create/send-message-to-group",
          message,
          token?.token
        );
        if (sendMessage) {
          console.log(sendMessage);
        }
      }
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessageFromIcon = async () => {
    if (textValue.trim() !== "") {
      if (chatInfo?.userId) {
        let message = {
          receiverId: chatInfo?.userId,
          message: textValue,
          messageType: "text",
        };
        // setMessages((prevMessages) => [
        //   ...prevMessages,
        //   { sender: "user", text: textValue },
        // ]);
        // settextValue("");
        const sendMessage = await apiCall(
          "POST",
          "https://smartwardrobe-backend.azurewebsites.net/chat/create/send-message-to-friend",
          message,
          token?.token
        );
        if (sendMessage) {
          console.log(sendMessage);
        }
      }
      if (chatInfo?.groupName) {
      }
    }
  };

  /** handle send messages */

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
          reRenderComponent={getAllFriendandFriendRequests}
          chatInfo={chatInfo}
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
                    <PeopleOutlinedIcon
                      style={{ cursor: "pointer" }}
                      onClick={handleFriendRequests}
                    />
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
                  <input
                    type="text"
                    placeholder="Search Friends"
                    onChange={handleFriendsSearch}
                  />
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
                  <div
                    key={friend.id} // Assuming each friend has a unique `id`
                    className={`contact-details-div ${
                      activeFriend === friend ? "active" : ""
                    }`}
                    onClick={() => handleShowChat(friend)}
                    tabIndex="0" // Makes it focusable
                  >
                    <img
                      src={
                        friend?.profilePic
                          ? friend?.profilePic
                          : "https://www.w3schools.com/howto/img_avatar.png"
                      }
                      alt="Alice"
                      className="contact-image"
                    />
                    <div className="contact-name-and-last-msg">
                      <div className="contact-Name">
                        {friend?.groupName
                          ? friend?.groupName
                          : friend?.username}
                      </div>
                      <div className="contact-last-msg">Hi, how are you?</div>
                    </div>
                  </div>
                ))}
                {friends?.length === 0 && (
                  <div className="no-friends">
                    <h4>No Friends</h4>
                  </div>
                )}
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
                  {chatInfo && chatInfo?.groupName && (
                    <div
                      className="Invite-Friends"
                      onClick={handleInviteFriendsToGroup}
                    >
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
                  )}
                </div>
              </div>
              <div className="chat-messages">
                {chatInfo?.userId && 
                <div className="message-container" ref={messagesEndRef}>
                  {messages?.map((msg, index) => (
                    <>
                    <div
                      key={index}
                      className={`chat-message ${
                        (msg.receiverId === chatInfo?.userId)
                          ? "chat_sender"
                          : "chat_receiver"
                      }`}
                    >
                      {msg.receiverId === chatInfo?.userId ? (
                        <p>{msg.message}</p>
                      ) : (
                        <div className="receiver-message">
                          <img
                            src={chatbackgroundimage}
                            alt={msg.sender}
                            className="receiver-image"
                          />
                          <p>
                            <strong>
                              {chatInfo?.userId
                                ? chatInfo?.username
                                : msg?.username}{" "}
                            </strong>{" "}
                            <br />
                            {msg.message}
                          </p>
                        </div>
                      )}
                    </div>
                    <div ref={messagesEndRef}></div></>
                  ))}
                </div>}
                {chatInfo?.groupId &&
                <div className="message-container" ref={messagesEndRef}>
                  {messages?.map((msg, index) => (
                    <>
                    <div
                      key={index}
                      className={`chat-message ${
                        (msg?.senderId !== chatInfo?.createdBy)
                          ? "chat_sender"
                          : "chat_receiver"
                      }`}
                    >
                      {msg?.senderId !== chatInfo?.createdBy ? (
                        <p>{msg.message}</p>
                      ) : (
                        <div className="receiver-message">
                          <img
                            src={chatbackgroundimage}
                            alt={msg.sender}
                            className="receiver-image"
                          />
                          <p>
                            <strong>
                              {msg?.userDetails?.username}
                            </strong>
                            <br />
                            {msg.message}
                          </p>
                        </div>
                      )}
                    </div>
                    <div ref={messagesEndRef}></div></>
                  ))}
                </div>}
              </div>

              <div className="chat-input">
                <TextArea
                  style={{ paddingRight: "7%" }}
                  placeholder="Type a message..."
                  autoSize={{ minRows: 2 }}
                  className="custom-textarea"
                  value={textValue}
                  onChange={handleInput}
                  onKeyDown={handleSendMessage}
                  disabled={!chatInfo?.userId && !chatInfo?.groupName}
                />
                <button className="send-button">
                  <FaPaperPlane
                    style={{ color: "2e3b4e", cursor: "pointer" }}
                    onClick={sendMessageFromIcon}
                  />
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
