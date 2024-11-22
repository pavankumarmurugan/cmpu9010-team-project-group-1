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
  Checkbox,
  CircularProgress,
  Collapse,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  styled,
} from "@mui/material";
import "../../Styles/ChatComponent.css";
import { FaPaperPlane } from "react-icons/fa6";
import { IoArrowBack, IoExitOutline } from "react-icons/io5";
import chatbackgroundimage from "../../Assets/chatbackgroundimage.jpg";
import { ExpandLess, ExpandMore, Search } from "@mui/icons-material";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import { CgMoreVerticalO } from "react-icons/cg";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NewChatModal from "../NewChatModal/NewChatModal";
import TextArea from "antd/es/input/TextArea";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { showToastInfo } from "../GenericToasters/GenericToasters";
import { IoMdAddCircle } from "react-icons/io";
import WhatsAppStylePreview from "../GenericCode/GenericCode";
import { IoPersonAddSharp } from "react-icons/io5";
import { HiUserRemove } from "react-icons/hi";
import { LuUserCheck2 } from "react-icons/lu";
import {
  IoIosInformationCircleOutline,
  IoMdContacts,
  IoMdExit,
} from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { io, Socket } from "socket.io-client";
import { MdOutlineKeyboardVoice, MdOutlineMoreVert } from "react-icons/md";
import { AudioRecorder } from "react-audio-voice-recorder";
import { BsChat, BsInfoCircleFill } from "react-icons/bs";

function ChatComponent(props) {
  let token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  let userId = token?.userId;
  const inputRef = useRef(null);
  const backendUrl = "https://smartwardrobe-backend.azurewebsites.net/";
  const messagesEndRef = useRef(null);
  const [disabled, setDisabled] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [newChatCraete, setNewChatCraete] = useState(false);
  const [openMemberList, setOpenMemberList] = useState(false);
  const [defaultArray, setDefaultArray] = useState(0);
  const [openLoader, setOpenLoader] = useState(false);
  const [addNewFriendorGroup, setaddNewFriendorGroup] = useState("");
  const [leftinputValue, setleftinputValue] = useState("");
  const [textValue, settextValue] = useState("");
  const [friendReqCount, setFriendReqCount] = useState([]);
  const [activeFriend, setActiveFriend] = useState(null);
  const [audioMessage, setAudioMessage] = useState(null);
  const [chatInfo, setChatInfo] = useState(null);
  const [friends, setFriends] = useState([]);
  const [newChatFriends, setNewChatFriends] = useState([]);
  const [activeNewChat, setActiveNewChat] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [friendsDataForFilter, setFriendsDataForFilter] = useState([]);
  const [friendReqCountToShow, setFriendReqCountToShow] = useState(0);
  const [hideLeftSection, sethideLeftSection] = useState(false);
  const [addMemberToGroupList, setaddMemberToGroupList] = useState([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [autocomplteAllData, setAutocomplteAllData] = useState([]);
  const [messages, setMessages] = useState([]);
  const [groupMemberList, setGroupMemberList] = useState([]);
  const [memberListForDetails, setMemberListForDetails] = useState([]);
  const [friendIds, setFriendIds] = useState([]);
  const [groupIds, setGroupIds] = useState([]);
  const [currentTab, setCurrentTab] = useState(1);
  const [socket, setSocket] = useState(null);
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

    return () => {
      chatInfoRef.current = null;
    };
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
      setGroupIds(getGroupsList.data.map((x) => x.groupId));
    }

    const getFriendsList = await apiCall(
      "GET",
      "https://smartwardrobe-backend.azurewebsites.net/friends/get-all-my-friends",
      null,
      token?.token
    );
    if (getFriendsList?.data?.length > 0) {
      setFriends((prevFriends) => [...prevFriends, ...getFriendsList.data]);
      // setFriends(getFriendsList?.data);
      setFriendIds(getFriendsList.data.map((x) => x.userId));
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
    chatInfoRef.current = event;
    setMessages([]);

    if (event?.userId) {
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

    if (event?.groupId) {
      const getGroupMessages = await apiCall(
        "GET",
        `https://smartwardrobe-backend.azurewebsites.net/chat/get-all-my-chats-by-group-id/${event?.groupId}`,
        null,
        token?.token
      );

      if (getGroupMessages?.data?.length > 0) {
        const sortedMessages = getGroupMessages?.data.sort(
          (a, b) => a.id - b.id
        );
        setMessages(sortedMessages);
      }

      const getAllGroupMembers = await apiCall(
        "GET",
        `https://smartwardrobe-backend.azurewebsites.net/group/get-all-members-in-group/${event?.groupId}`,
        null,
        token?.token
      );
      if (getAllGroupMembers?.data?.length > 0) {
        let setGroupMembers = [];
        let aa = getAllGroupMembers?.data?.forEach((x) =>
          setGroupMembers?.push(x?.username)
        );
        setMemberListForDetails(getAllGroupMembers?.data);
        const formattedNames = setGroupMembers
          ?.map((name) => {
            // Capitalize the first letter of each name
            return name?.charAt(0).toUpperCase() + name?.slice(1);
          })
          .join(", ");
        setGroupMemberList(formattedNames);
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
    // setAnchorEl(event.currentTarget);
    setNewChatCraete(true);
    setDefaultArray(1);
  };

  const handleAddFriendAndGroup = (e) => {
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

  const handleNewChatSearch = async (event, defaultArray) => {
    debugger;
    let searchValue = event?.target?.value;
    setleftinputValue(searchValue);
    if (activeNewChat === "New Chat") {
      if (searchValue?.length >= 3) {
        const response = await apiCall(
          "GET",
          `https://smartwardrobe-backend.azurewebsites.net/users/search/${searchValue.trim()}`,
          null,
          token?.token
        );
        if (response?.data) {
          setAutocomplteAllData(response?.data);
          setNewChatFriends(response?.data);
        }
      } else if (searchValue?.length === 0) {
        setNewChatFriends([]);
      }
    }
  };

  const handleGroupCreate = async (e) => {
    debugger;

    if (newGroupName.trim() === "") {
      showToastInfo("Please enter group name");
      return;
    }

    const sendObj = {
      groupName: newGroupName,
    };
    setOpenLoader(true);
    const response = await apiCall(
      "POST",
      "https://smartwardrobe-backend.azurewebsites.net/group/create",
      sendObj,
      token?.token
    );
    setOpenLoader(false);
    if (response?.message === "SUCCESSFULLY CREATED GROUP") {
      let groupId = response?.data?.groupId;
      const promises = addMemberToGroupList.map(async (value) => {
        const data = friends?.filter((user) => user?.userId === value);

        // if (data?.length === 0) {
        //   showToastInfo(`User ${value} not found`);
        //   return;
        // }

        try {
          const sendObj = {
            groupId: groupId,
            userId: data[0]?.userId,
          };

          setOpenLoader(true);
          const response = await apiCall(
            "POST",
            "https://smartwardrobe-backend.azurewebsites.net/group-members/create",
            sendObj,
            token?.token
          );
          if (response) {
            setaddMemberToGroupList([]);
          }
        } catch (error) {
          console.error(`Error sending request for ${value}:`, error);
        }
      });

      try {
        // Wait for all promises to resolve
        const addingFriends = await Promise.all(promises);
        setOpenLoader(false);
        if (addingFriends) {
          showToastInfo("Group created successfully");
          setDefaultArray(0);
          setNewChatCraete(false);
          setNewChatFriends([]);
          setleftinputValue("");
          getAllFriendandFriendRequests();
        }

        // After all requests are completed
        // props?.reRenderComponent();
        // props?.closeModal();
      } catch (error) {
        console.error("Error handling multiple friend requests:", error);
      }
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

  const handleContactDetails = () => {
    debugger;
    setShowContactDetails(true);
  };

  const handleCloseDetails = () => {
    debugger;
    setShowContactDetails(false);
  };

  const handleRemoveFriend = async (e) => {
    debugger;
    console.log(chatInfo);
    setOpenLoader(true);
    const delteFriend = await apiCall(
      "DELETE",
      `https://smartwardrobe-backend.azurewebsites.net/friends/delete/${chatInfo?.friendId}`,
      null,
      token?.token
    );
    setOpenLoader(false);
    if (delteFriend?.message === "DELETED FRIEND") {
      setShowContactDetails(false);
      setChatInfo(null);
      setOpenLoader(true);
      const getFriendsList = await apiCall(
        "GET",
        "https://smartwardrobe-backend.azurewebsites.net/friends/get-all-my-friends",
        null,
        token?.token
      );
      setOpenLoader(false);
      if (getFriendsList?.data?.length > 0) {
        let removeDeletedFriend = friends?.filter(
          (x) => x.friendId !== chatInfo?.friendId
        );
        setFriends(removeDeletedFriend);
        setFriendIds(getFriendsList.data.map((x) => x.userId));
        setFriendsDataForFilter((prevFriends) => [
          ...prevFriends,
          ...getFriendsList.data,
        ]);
      }

      if (getFriendsList?.data?.length === 0) {
        let removeDeletedFriend = friends?.filter(
          (x) => x.friendId !== chatInfo?.friendId
        );
        setFriends(removeDeletedFriend);
      }
    }
  };

  const handleExitGroup = async (e) => {
    debugger;
    console.log(chatInfo);
    setOpenLoader(true);
    const exitGroup = await apiCall(
      "DELETE",
      `https://smartwardrobe-backend.azurewebsites.net/group-members/delete/${chatInfo?.membershipId}`,
      null,
      token?.token
    );

    if (exitGroup?.message === "DELETED GROUP MEMBER") {
      console.log("deleted group member");
      setShowContactDetails(false);
      setChatInfo(null);
      let removeDeletedFriend = friends?.filter(
        (x) => x.groupId !== chatInfo?.groupId
      );
      setFriends(removeDeletedFriend);
    }
    setOpenLoader(false);
  };

  /** handle Invite friend to group */

  /** handle send messages */

  const handleInput = (event) => {
    if (chatInfo?.userId || chatInfo?.groupName) {
      settextValue(event.target.value);
    }
  };

  const handleSendMessage = async (event, from) => {
    debugger;
    if (
      (event.key === "Enter" && textValue.trim() !== "") ||
      (textValue.trim() !== "" && from === "fromIcon")
    ) {
      // if(audioMessage !== null){
      //   console.log("audioMessage", audioMessage);
      //   return
      // }

      event.preventDefault();
      if (chatInfo?.userId) {
        let message = {
          message: textValue,
          receiverId: chatInfo?.userId,
          messageType: "text",
        };
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            message: textValue,
            receiverId: chatInfo?.userId,
            messageType: "text",
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
          messageType: "text",
        };
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            message: textValue,
            groupId: chatInfo?.groupId,
            messageType: "text",
            senderId: token?.userId,
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
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  /** handle send messages */

  const handleClickMember = () => {
    setOpenMemberList(!openMemberList);
  };

  const chatInfoRef = useRef(null);

  // Update the ref whenever chatInfo changes

  useEffect(() => {
    debugger;
    if (friendIds?.length === 0 && groupIds?.length === 0) return;

    // Initialize WebSocket connection
    const newSocket = io(backendUrl, {
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
      timeout: 20000,
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket server with id:", newSocket.id);

      friendIds.forEach((friendId) => {
        const roomId = `room_${Math.min(userId, friendId)}_${Math.max(
          userId,
          friendId
        )}`;
        newSocket.emit("joinChatRoom", { roomId, userId });
        console.log(`User ${userId} joined friend chat room: ${roomId}`);
      });

      groupIds.forEach((groupId) => {
        newSocket.emit("joinGroupRoom", { groupId, userId });
        console.log(`User ${userId} joined group chat room: group_${groupId}`);
      });
    });

    // Listener for friend messages
    newSocket.on("newMessage", (data) => {
      debugger
      console.log("New friend message received:", data);
      console.log(chatInfoRef.current);
      setChatInfo(chatInfoRef.current);
      if (data?.senderId === chatInfoRef?.current?.userId) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    });

    // Listener for group messages
    newSocket.on("newGroupMessage", (data) => {
      console.log("New group message received:", data);
      if (data?.senderId !== userId) {
        // showToastInfo("New group message received");
        console.log(chatInfoRef.current);
        setChatInfo(chatInfoRef.current);
        if (data?.groupId === chatInfoRef?.current?.groupId) {
          setMessages((prevMessages) => [...prevMessages, data]);
        }
      }
      // Display a notification or update UI with the new group message
    });

    newSocket.emit("joinNotificationRoom", { userId });
    console.log(`User ${userId} joined their notification room user_${userId}`);

    // To get notifications

    // Friend request event listeners
    newSocket.on("friendRequestCreated", (data) => {
      debugger;
      console.log("New friend request received in Chat:", data);
      // Display a notification or update UI with new friend request
      handleFriendRequest();
    });

    newSocket.on("friendRequestUpdated", (data) => {
      debugger;
      console.log("Friend request updated:", data);
      if (data.status === "accepted") {
        getAllFriendandFriendRequests();
      }
      // Display a notification or update UI with friend request update
    });

    // Handle disconnection
    newSocket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    // Clean up WebSocket connection when the component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, [userId, friendIds, groupIds]); // Re-run effect when friendIds or groupIds change

  const handleFriendRequest = async () => {
    debugger;
    setOpenLoader(true);
    const getFriendReqList = await apiCall(
      "GET",
      "https://smartwardrobe-backend.azurewebsites.net/friend-requests/get-all-my-received-requests",
      null,
      token?.token
    );
    setOpenLoader(false);
    if (getFriendReqList?.data?.length > 0) {
      setFriendReqCountToShow(getFriendReqList?.data?.length);
      setFriendReqCount(getFriendReqList?.data);
      setaddNewFriendorGroup("friendReq");
    }
  };

  const handleCheckboxForAddMemberInGroup = async (e, item) => {
    debugger;
    if (e?.target?.checked) {
      setaddMemberToGroupList((prevList) => [...prevList, item?.userId]);
    } else {
      let filterCheckedOnly = addMemberToGroupList?.filter(
        (i) => i !== item?.userId
      );
      setaddMemberToGroupList(filterCheckedOnly);
    }
  };

  const handleNewChat = (e) => {
    debugger;
    if (e === "New Chat") {
      if (inputRef.current) {
        inputRef.current.focus();
      }
      setActiveNewChat(e);
    } else if (e === "New Group") {
      let filterfriends = friends?.filter((x) => x.username);
      setNewChatFriends(filterfriends);
      setActiveNewChat(e);
    }

    setDefaultArray(2);
  };

  const handleRemoveChatCraete = () => {
    debugger;
    setNewChatCraete(false);
    setDefaultArray(defaultArray - 1);
    setleftinputValue("");
    setaddMemberToGroupList([]);
    if (defaultArray !== 3) {
      setNewChatFriends([]);
      setActiveNewChat("");
    }
  };

  const handleAddClick = async () => {
    debugger;
    if (!addMemberToGroupList || addMemberToGroupList.length === 0) {
      return;
    }

    if (activeNewChat === "New Chat") {
      const promises = addMemberToGroupList.map(async (value) => {
        const data = autocomplteAllData.filter(
          (user) => user?.userId === value
        );

        if (data?.length === 0) {
          showToastInfo(`User ${value} not found`);
          return;
        }

        try {
          const sendObj = {
            receiverId: data[0]?.userId,
            status: "pending",
          };

          setOpenLoader(true);
          const response = await apiCall(
            "POST",
            `https://smartwardrobe-backend.azurewebsites.net/friend-requests/create`,
            sendObj,
            token?.token
          );
          if (response) {
            setaddMemberToGroupList([]);
          }
        } catch (error) {
          console.error(`Error sending request for ${value}:`, error);
        }
      });

      try {
        // Wait for all promises to resolve
        const addingFriends = await Promise.all(promises);

        if (addingFriends) {
          showToastInfo("Friend requests sent successfully");
          setDefaultArray(0);
          setNewChatCraete(false);
          setNewChatFriends([]);
          setleftinputValue("");
          getAllFriendandFriendRequests();
        }

        // After all requests are completed
        // props?.reRenderComponent();
        // props?.closeModal();
      } catch (error) {
        console.error("Error handling multiple friend requests:", error);
      }
    } else if (activeNewChat === "New Group") {
      if (addMemberToGroupList?.length > 0) {
        setDefaultArray(3);
        return;
      }

      // if (leftinputValue.trim() === "") {
      //   showToastInfo("Please enter group name");
      //   return;
      // }
    }
  };

  const handleNewGroupName = (e) => {
    debugger;
    let value = e?.target?.value;
    if (value.trim() !== "") {
      setNewGroupName(value);
    } else {
      setNewGroupName("");
    }
  };

  /** audio */

  const handleRecordingComplete = (audioBlob) => {
    // Log or handle the blob, for example:
    debugger;
    console.log("Audio recorded:", audioBlob);

    setAudioMessage(audioBlob);

    // Create FormData to send the audio as part of a POST request
    const formData = new FormData();
    formData.append("audioFile", audioBlob, "recording.webm");
  };

  /** audio */

  const handleTabSelect = (value) => {
    debugger;
    setCurrentTab(value);
  };

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
              {defaultArray === 0 ? (
                <>
                  <div className="chat-moreoptions-icon">
                    <h2>Chats</h2>

                    <Button
                      className="frined-request-button"
                      color="default"
                      aria-hidden="true"
                      onClick={handleFriendRequests}
                    >
                      <LuUserCheck2
                        style={{
                          width: "20px",
                          height: "20px",
                          
                        }}
                      />
                      Friend requests
                      {friendReqCountToShow !== 0 && `(${friendReqCountToShow})`}
                    </Button>

                    {/* <div className="moreoptions-div">
                      {friendReqCountToShow !== 0 && (
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
                      )}
                      <IconButton
                        aria-label="more"
                        aria-controls="kebab-menu"
                        aria-haspopup="true"
                        onClick={handleClick}
                      >
                        <IoMdAddCircle style={{ color: "blue" }} />
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
                    </div> */}
                  </div>
                  
                  <div className="search-contacts" style={{ marginTop:"6px" }}>
                  <Button
                      className="frined-request-button-specificscreensize"
                      color="default"
                      aria-hidden="true"
                      onClick={handleFriendRequests}
                    >
                      <LuUserCheck2
                        style={{
                          width: "20px",
                          height: "20px",
                          
                        }}
                      />
                      Friend requests
                      {friendReqCountToShow !== 0 && `(${friendReqCountToShow})`}
                    </Button>
                  <Button
                    className="add-friends-groups-button"
                    color="default"
                    aria-hidden="true"
                    onClick={() => handleAddFriendAndGroup("AddFriends")}
                  >
                    Add Friends
                  </Button>
                  <Button
                          className="add-friends-groups-button"
                          color="default"
                          aria-hidden="true"
                          onClick={() => handleAddFriendAndGroup("CreateGroup")}
                        >
                          Create Group
                        </Button>
                  </div>

                  <div className="tab-main-div">
                      <div
                        className={`friends-tab-div ${
                          currentTab === 1 ? "activeTab" : ""
                        }`}
                        onClick={() => handleTabSelect(1)}
                      >
                        Friends
                      </div>
                      <div
                        className={`groups-tab-div ${
                          currentTab === 2 ? "activeTab" : ""
                        }`}
                        onClick={() => handleTabSelect(2)}
                      >
                        Groups
                      </div>
                    </div>

                  <div className="contact-list">
                    {currentTab === 1 && (
                      <div>
                         <div className="search-friends">
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
                        
                        {friends?.map(
                          (friend, index) =>
                            friend?.username && (
                              <div
                                key={friend.id}
                                className={`contact-details-div ${
                                  activeFriend === friend ? "active" : ""
                                }`}
                                onClick={() => handleShowChat(friend)}
                                tabIndex="0"
                              >
                                <img
                                  src={
                                    friend?.profilePic
                                      ? friend.profilePic
                                      : friend?.groupName
                                      ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJ3LToR-ycDBDBii0DSf9YrdTOjQs27e-9ywV8vVnjfdzfS7iE_QnIYx_UYkFtVxYl-x8&usqp=CAU"
                                      : `data:image/svg+xml;base64,${btoa(`
                            <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                              <rect width="100" height="100" fill="gray" />
                              <text x="50%" y="50%" font-size="50" font-family="Arial" dy=".35em" text-anchor="middle" fill="white">
                                ${
                                  friend?.username?.charAt(0).toUpperCase() ||
                                  ""
                                }
                              </text>
                            </svg>
                          `)}`
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
                                </div>
                              </div>
                            )
                        )}
                      </div>
                    )}

                    {currentTab === 2 && (
                      <div>
                        <div className="search-input">
                      <input
                        type="text"
                        placeholder="Search Groups"
                        onChange={handleFriendsSearch}
                      />
                      <button className="search-button">
                        <Search style={{ color: "2e3b4e" }} />
                      </button>
                    </div>
                        {friends?.map(
                          (friend, index) =>
                            friend?.groupName && (
                              <div
                                key={friend.id}
                                className={`contact-details-div ${
                                  activeFriend === friend ? "active" : ""
                                }`}
                                onClick={() => handleShowChat(friend)}
                                tabIndex="0"
                              >
                                <img
                                  src={
                                    friend?.profilePic
                                      ? friend.profilePic
                                      : friend?.groupName
                                      ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJ3LToR-ycDBDBii0DSf9YrdTOjQs27e-9ywV8vVnjfdzfS7iE_QnIYx_UYkFtVxYl-x8&usqp=CAU"
                                      : `data:image/svg+xml;base64,${btoa(`
                              <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                                <rect width="100" height="100" fill="gray" />
                                <text x="50%" y="50%" font-size="50" font-family="Arial" dy=".35em" text-anchor="middle" fill="white">
                                  ${
                                    friend?.username?.charAt(0).toUpperCase() ||
                                    ""
                                  }
                                </text>
                              </svg>
                            `)}`
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
                                </div>
                              </div>
                            )
                        )}
                      </div>
                    )}

                    {friends?.length === 0 && (
                      <div className="no-friends">
                        <h4>{currentTab === 1 ? "No Friends" : "No Groups" }</h4>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="Newchat-moreoptions-icon">
                    <IoArrowBack
                      style={{
                        width: "30px",
                        height: "30px",
                        cursor: "pointer",
                      }}
                      onClick={handleRemoveChatCraete}
                    />
                    <h2>{activeNewChat ? activeNewChat : "New Chats"} </h2>
                    {addMemberToGroupList?.length > 0 && defaultArray !== 3 && (
                      <Button
                        className="Create-Button"
                        color="default"
                        onClick={handleAddClick}
                      >
                        Add
                      </Button>
                    )}
                    <div className="moreoptions-div">
                      {friendReqCountToShow !== 0 && (
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
                      )}
                    </div>
                  </div>
                  {activeNewChat !== "New Group" ? (
                    <div className="search-contacts">
                      <div className="search-input">
                        <input
                          type="text"
                          placeholder={
                            activeNewChat === "New Group"
                              ? "Group Name"
                              : "Search Username"
                          }
                          onChange={(e) => handleNewChatSearch(e, defaultArray)}
                          ref={inputRef}
                          value={leftinputValue}
                        />
                        {activeNewChat !== "New Group" && (
                          <button className="search-button">
                            <Search style={{ color: "2e3b4e" }} />
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <h3>
                          {defaultArray !== 3
                            ? "Select friends to add in group."
                            : "Enter your group name"}
                        </h3>
                      </div>
                    </>
                  )}
                  {/* <h4>
                <b style={{ paddingLeft: "10px" }}>GROUPS</b>
              </h4> */}
                  <div className="contact-list">
                    {defaultArray === 1 ? (
                      <>
                        {["New Chat", "New Group", "New Community"]?.map(
                          (friend, index) => (
                            <div
                              key={friend.id}
                              className={`contact-details-div ${
                                activeFriend === friend ? "active" : ""
                              }`}
                              onClick={() => handleNewChat(friend)}
                              tabIndex="0"
                            >
                              <img
                                src={
                                  friend === "New Chat"
                                    ? "https://cdn-icons-png.flaticon.com/512/1144/1144760.png"
                                    : "https://cdn1.iconfinder.com/data/icons/developer-set-2/512/users-512.png"
                                }
                                alt="Alice"
                                className="contact-image"
                              />
                              <div className="contact-name-and-last-msg">
                                <div className="contact-Name">{friend}</div>
                              </div>
                            </div>
                          )
                        )}
                      </>
                    ) : defaultArray === 2 ? (
                      <>
                        {newChatFriends?.map((friend, index) => (
                          <div
                            key={friend.id}
                            className={`contact-details-div ${
                              activeFriend === friend ? "active" : ""
                            }`}
                            onClick={() => handleNewChat(friend)}
                            tabIndex="0"
                          >
                            <img
                              src={
                                friend?.profilePic
                                  ? friend.profilePic
                                  : friend?.groupName
                                  ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJ3LToR-ycDBDBii0DSf9YrdTOjQs27e-9ywV8vVnjfdzfS7iE_QnIYx_UYkFtVxYl-x8&usqp=CAU"
                                  : `data:image/svg+xml;base64,${btoa(`
                              <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                                <rect width="100" height="100" fill="gray" />
                                <text x="50%" y="50%" font-size="50" font-family="Arial" dy=".35em" text-anchor="middle" fill="white">
                                  ${
                                    friend?.username?.charAt(0).toUpperCase() ||
                                    ""
                                  }
                                </text>
                              </svg>
                            `)}`
                              }
                              alt="Alice"
                              className="contact-image"
                            />
                            <div
                              className="contact-name-and-last-msg"
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                              }}
                            >
                              <div className="contact-Name">
                                {friend?.username}
                              </div>
                              <div className="checkbox-div">
                                <Checkbox
                                  onChange={(e) =>
                                    handleCheckboxForAddMemberInGroup(e, friend)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      defaultArray === 3 && (
                        <>
                          <div className="groupname-main-div">
                            <div className="group-image-div">
                              {/* <label
                                htmlFor="profilePicInput"
                                className="profile-label"
                              > */}
                              <img
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJ3LToR-ycDBDBii0DSf9YrdTOjQs27e-9ywV8vVnjfdzfS7iE_QnIYx_UYkFtVxYl-x8&usqp=CAU"
                                alt="profile"
                                className="group-profile"
                              />
                              {/* <div className="hover-overlay">
                                  Change Profile Image
                                </div> */}
                              {/* </label> */}
                              {/* <input
                                type="file"
                                id="profilePicInput"
                                style={{ display: "none" }}
                                // onChange={handleProfilePicChange} // Replace with your function to handle image updates
                              /> */}
                            </div>
                            <div className="search-contacts">
                              <div className="search-input">
                                <input
                                  type="text"
                                  placeholder="Enter Group Name"
                                  onChange={handleNewGroupName}
                                  ref={inputRef}
                                  value={newGroupName}
                                  style={{ textTransform: "capitalize" }}
                                />
                              </div>
                            </div>
                            <div className="create-button-div">
                              <Button
                                className="Create-Button"
                                color="default"
                                onClick={handleGroupCreate}
                              >
                                Create
                              </Button>
                            </div>
                          </div>
                        </>
                      )
                    )}
                  </div>
                </>
              )}
            </div>
            <div
              className={`right-chat-section ${
                hideLeftSection ? "show-right" : "hide-right"
              } ${showContactDetails && "show-deatils-only"} `}
              style={{
                // backgroundImage: `url(${chatbackgroundimage})`,
                // backgroundColor: "#f4f3f8",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              {chatInfo !== null ? (
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
                      <div className="groupName-and-member-div">
                        <h2 className="contact-Name-for-OpenChat">
                          {chatInfo &&
                            (chatInfo?.username || chatInfo?.groupName)}
                        </h2>
                        {chatInfo?.groupName && (
                          <div className="members-div">
                            <div className="member-div">
                              <span>{groupMemberList}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="Invite-Friends">
                      {/* <div style={{ display: "flex" }} onClick={handleInviteFriendsToGroup}>
                          <FaPlus
                            style={{
                              width: "20px",
                              height: "20px",
                              paddingRight: "10px",
                              paddingBottom: "3px",
                            }}
                          />
                          <h3 className="invite-friends-text">
                            Invite Friends
                          </h3>
                        </div> */}
                      <BsInfoCircleFill
                        style={{ width: "30px", height: "30px" }}
                        onClick={handleContactDetails}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="rightside-div-when-Nocontact-selected"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    height: "100%",
                    flexDirection: "column",
                  }}
                >
                  <BsChat
                    style={{
                      width: "40px",
                      height: "35px",
                      strokeWidth: "1",
                      color: "gray",
                    }}
                  />
                  <h2
                    style={{
                      marginTop: "10px",
                      //   display: "flex",
                      //   justifyContent: "center",
                      //   alignItems: "center",
                      //   textAlign: "center",
                      //   height: "100%",
                      //   flexDirection: "column",
                    }}
                  >
                    No Chat Selected
                  </h2>
                  <p style={{ marginTop: "5px", color: "gray" }}>
                    Choose a conversation from sidebar to start chatting
                  </p>
                </div>
              )}
              <div className="chat-messages">
                {chatInfo?.userId && (
                  <div className="message-container">
                    {messages?.map((msg, index) => (
                      <>
                        <div
                          key={index}
                          className={`chat-message ${
                            msg.receiverId === chatInfo?.userId
                              ? "chat_sender"
                              : "chat_receiver"
                          }`}
                        >
                          {msg.receiverId === chatInfo?.userId ? (
                            // <p>{msg.message}</p>
                            <WhatsAppStylePreview message={msg?.message} />
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
                                <WhatsAppStylePreview message={msg?.message} />
                              </p>
                            </div>
                          )}
                        </div>
                        <div ref={messagesEndRef}></div>
                      </>
                    ))}
                  </div>
                )}
                {chatInfo?.groupId && (
                  <div className="message-container" ref={messagesEndRef}>
                    {messages?.map((msg, index) => (
                      <>
                        {/* <div
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
                    </div> */}

                        <div
                          key={index}
                          className={`chat-message ${
                            msg?.senderId === token?.userId
                              ? "chat_sender"
                              : "chat_receiver"
                          } `}
                        >
                          {msg?.senderId === token?.userId ? (
                            <WhatsAppStylePreview message={msg?.message} />
                          ) : (
                            <div className="receiver-message">
                              <img
                                src={chatbackgroundimage}
                                alt={msg.sender}
                                className="receiver-image"
                              />
                              <p>
                                <strong>{msg?.userDetails?.username}</strong>
                                <br />
                                <WhatsAppStylePreview message={msg?.message} />
                              </p>
                            </div>
                          )}
                        </div>
                        <div ref={messagesEndRef}></div>
                      </>
                    ))}
                  </div>
                )}
              </div>
              {chatInfo !== null && (
                <div className="chat-input">
                  <TextArea
                    style={{ paddingRight: "7%", marginLeft: "10px" }}
                    placeholder="Type a message..."
                    autoSize={{ minRows: 2 }}
                    className="custom-textarea"
                    value={textValue}
                    onChange={handleInput}
                    onKeyDown={(event) => handleSendMessage(event, "fromEnter")}
                    disabled={!chatInfo?.userId && !chatInfo?.groupName}
                  />
                  <button className="send-button">
                    {/* <AudioRecorder
                      onRecordingComplete={handleRecordingComplete}
                      audioTrackConstraints={{
                        noiseSuppression: true,
                        echoCancellation: true,
                        // autoGainControl,
                        // channelCount,
                        // deviceId,
                        // groupId,
                        // sampleRate,
                        // sampleSize,
                      }}
                      onNotAllowedOrFound={(err) => console.table(err)}
                      downloadOnSavePress={false}
                      downloadFileExtension="webm"
                      mediaRecorderOptions={{
                        audioBitsPerSecond: 128000,
                      }}
                      showVisualizer={true}
                      showSaveButton={false}
                    /> */}
                    {/* <MdOutlineKeyboardVoice style={{width:"25px", height:"25px"}} /> */}
                    <FaPaperPlane
                      style={{
                        color: "2e3b4e",
                        cursor: "pointer",
                        marginLeft: "10px",
                      }}
                      onClick={(event) => handleSendMessage(event, "fromIcon")}
                    />
                  </button>
                </div>
              )}
            </div>

            {showContactDetails && (
              <div
                className={`details-chat-section ${showContactDetails && ""}`}
                style={{
                  // backgroundImage: `url(${chatbackgroundimage})`,
                  // backgroundColor: "#f4f3f8",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div
                  className="details-header"
                  style={{ borderBottom: "1px solid lightgray" }}
                >
                  <h2>Contact Information</h2>
                  <IoMdClose
                    style={{ width: "20px", height: "20px", cursor: "pointer" }}
                    onClick={handleCloseDetails}
                  />
                </div>

                <div className="details-body">
                  <div className="details-image-div">
                    <img
                      src={chatbackgroundimage}
                      alt="details-iamge"
                      className="details-image"
                    />
                    <h3 style={{ textTransform: "capitalize" }}>
                      {chatInfo?.username || chatInfo?.groupName}
                    </h3>
                  </div>

                  <div className="member-list-div">
                    <List
                      sx={{
                        width: "100%",
                        maxWidth: 360,
                        borderTop: "1px solid lightgray",
                        borderBottom: "1px solid lightgray",
                      }}
                      component="nav"
                      aria-labelledby="nested-list-subheader"
                    >
                      {chatInfo?.groupName ? (
                        <>
                          <ListItemButton
                            onClick={handleInviteFriendsToGroup}
                            style={{ borderBottom: "1px solid lightgray" }}
                          >
                            <ListItemIcon>
                              <IoPersonAddSharp
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  color: "green",
                                }}
                              />
                            </ListItemIcon>
                            <ListItemText primary="Add Member" />
                            {/* {openMemberList ? <ExpandLess /> : <ExpandMore />} */}
                          </ListItemButton>
                          <ListItemButton
                            onClick={handleClickMember}
                            style={{ borderBottom: "1px solid lightgray" }}
                          >
                            <ListItemIcon>
                              <IoMdContacts
                                style={{ width: "30px", height: "30px" }}
                              />
                            </ListItemIcon>
                            <ListItemText primary="Members" />
                            {openMemberList ? <ExpandLess /> : <ExpandMore />}
                          </ListItemButton>
                          <Collapse
                            in={openMemberList}
                            timeout="auto"
                            unmountOnExit
                          >
                            <List component="div" disablePadding>
                              {memberListForDetails?.map(
                                (member, index) =>
                                  member?.username !== token?.username && (
                                    <ListItemButton
                                      key={index}
                                      sx={{ pl: 4 }}
                                      style={{
                                        borderBottom: "1px solid lightgray",
                                        paddingLeft: "10px",
                                      }}
                                    >
                                      <img
                                        src="https://www.w3schools.com/howto/img_avatar.png"
                                        alt="contact-details-image"
                                        style={{
                                          width: "50px",
                                          height: "50px",
                                          borderRadius: "50%",
                                        }}
                                      />
                                      <ListItemText
                                        primary={member?.username}
                                        style={{
                                          textTransform: "capitalize",
                                          paddingLeft: "15px",
                                        }}
                                      />
                                      {token?.userId ===
                                        chatInfo?.createdBy && (
                                        <HiUserRemove
                                          style={{
                                            width: "20px",
                                            height: "20px",
                                          }}
                                          onClick={handleRemoveFriend}
                                        />
                                      )}
                                    </ListItemButton>
                                  )
                              )}
                            </List>
                          </Collapse>
                          <ListItemButton>
                            <ListItemIcon>
                              <IoMdExit
                                style={{ width: "30px", height: "30px" }}
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary="Exit Group"
                              style={{ color: "red" }}
                              onClick={handleExitGroup}
                            />
                          </ListItemButton>
                        </>
                      ) : (
                        <>
                          <ListItemButton>
                            <ListItemIcon>
                              <IoMdExit
                                style={{ width: "30px", height: "30px" }}
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary="Remove Friend"
                              onClick={handleRemoveFriend}
                            />
                          </ListItemButton>
                        </>
                      )}
                    </List>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
export default ChatComponent;
