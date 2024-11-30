import { AutoComplete, Modal } from "antd";
import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { FcGoogle } from "react-icons/fc";
import { Flex, Input, Typography } from "antd";
import "../../Styles/SignUp.css";
import apiCall, { baseUrl } from "../GenericApiCallFunctions/GenericApiCallFunctions";
import {
  Backdrop,
  Button,
  ButtonBase,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import { json, useLocation, useNavigate } from "react-router-dom";
import {
  showToastError,
  showToastInfo,
  showToastSuccess,
} from "../GenericToasters/GenericToasters";
import { setTokenToLocalStorage } from "../GenericCode/GenericCode";
import { RiChatNewLine } from "react-icons/ri";
import { AiOutlineWechat } from "react-icons/ai";
import "../../Styles/ChatComponent.css";
import { GoPersonAdd } from "react-icons/go";
import { Search } from "@mui/icons-material";
import { TiTick } from "react-icons/ti";
import { FreiendRequestsValueSuccess } from "../../redux/slices/HomeDataSlice";

function NewChatModal(props) {
  let token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
    const location = useLocation();
  const [disabled, setDisabled] = useState(true);
  const [openLoader, setOpenLoader] = useState(false);
  const [addNewChat, setAddNewChat] = useState(false);
  const [addNewGroup, setAddNewGroup] = useState(false);
  const [currentTab, setCurrentTab] = useState(1);
  const [friendEmail, setFriendEmail] = useState("");
  const [InviteButtonText, setInviteButtonText] = useState("Send Friend Request");
  const [groupNameValue, setGroupNameValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [friendReqData, setFriendReqData] = useState([]);
  const [friendsDataForGroup, setFriendsDataForGroup] = useState([]);
  const [autocomplteAllData, setAutocomplteAllData] = useState([]);
  const [addMemberToGroupList, setaddMemberToGroupList] = useState([]);
  const [shareDataList, setShareDataList] = useState([]);
  const [friendsData, setFriendsData] = useState([]);
  const [GroupData, setGroupsData] = useState([]);
  const [copyButtonText, setCopyButtonText] = useState("Copy Product Link");
  // const [loading, setLoading] = useState(false);

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
  const handleAddFriendFromShareProduct = (value) => {
    debugger;

    props?.changeSection(value);

  }
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

  const handleCheckboxForShareProducts = async (event, item) => {
    debugger;
    console.log(event);
    console.log(item);

    if (event?.target?.checked) {
      setShareDataList([...shareDataList, item]);
    } else {
      let filterCheckedOnly = shareDataList?.filter((i) => i !== item);
      setShareDataList(filterCheckedOnly);
    }
  };

  const handleCopyProductLink = () => {
    debugger;
    let url = `${window.location.origin}${location.pathname}`;
    navigator.clipboard.writeText(url)
    .then(() => {
      setCopyButtonText("Copied");
    })
    // .catch((error) => {
    //   console.error("Failed to copy the link: ", error);
    // });
  }

  // const handleAddFriendFromShareProduct = () => {
  //   debugger;

  //   props?.changeSection();

  // }

  const handleShareProduct = async () => {
    debugger;

    if (shareDataList?.length === 0) {
      showToastInfo(
        "Please select atleast one friend or group to share product."
      );
      return;
    }

    if (shareDataList?.length > 0) {
      const friendList = shareDataList?.filter((x) => x?.userId);
      const groupList = shareDataList?.filter((x) => x?.groupId);
      if (friendList?.length > 0) {
        const apiCalls = friendList.map((item) => {
          let message = {
            message: props?.productUrl,
            receiverId: item?.userId,
            messageType: "text",
          };
          return apiCall(
            "POST",
            `${baseUrl}/chat/create/send-message-to-friend`,
            message,
            token?.token
          );
        });
        setOpenLoader(true);
        const apiCallsFriends = await Promise.all(apiCalls);
        if (apiCallsFriends?.length > 0) {
          // showToastSuccess("Product Shared Successfully");
          console.log(apiCallsFriends);
        }
      }

      if (groupList?.length > 0) {
        const apiCalls = groupList.map((item) => {
          let message = {
            message: props?.productUrl,
            groupId: item?.groupId,
            messageType: "text",
          };

          return apiCall(
            "POST",
            `${baseUrl}/chat/create/send-message-to-group`,
            message,
            token?.token
          );
        });
        setOpenLoader(true);
        const apiCallsGroups = await Promise.all(apiCalls);

        if (apiCallsGroups?.length > 0) {
          // showToastSuccess("Product Shared Successfully");
          console.log(apiCallsGroups);
        }
        // handleCancel();
        // setOpenLoader(false);
      }
      setOpenLoader(false);
      handleCancel();
    }
  };

  const handleCheckboxForAddMemberInGroup = async (e, item) => {
    debugger;
    if (e?.target?.checked) {
      addMemberToGroupList.push(item?.userId);
    } else {
      let filterCheckedOnly = addMemberToGroupList?.filter(
        (i) => i !== item?.userId
      );
      setaddMemberToGroupList(filterCheckedOnly);
    }
  };

  const handleAddMemberButton = async () => {
    debugger;
    if (addMemberToGroupList?.length > 0) {
      const apiCalls = addMemberToGroupList.map((item) => {
        const data = {
          groupId: props?.chatInfo?.groupId,
          userId: item,
        };
        return apiCall(
          "POST",
          `${baseUrl}/group-members/create`,
          data,
          token?.token
        );
      });
      setOpenLoader(true);
      const addMemberToGroup = await Promise.all(apiCalls);
      setOpenLoader(false);
      if (addMemberToGroup?.length > 0) {
        showToastSuccess("Member Added Successfully");
        handleCancel();
        props?.reRenderComponent();
      }
    }
  };

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const handleInputChnageAutocomplete = (value) => {
    debugger
    setInputValue(value);

    if(value === ""){
      setInviteButtonText("Send Friend Request");
      return;
    }

    let findData = autocomplteAllData?.filter(x => x?.username === value);
    if(findData?.length > 0){
      setInviteButtonText("Send Friend Request");
    }else{
      setInviteButtonText("Invite");
    }
  }

  const fetchSuggestions = async (query) => {
    debugger;
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await apiCall(
        "GET",
        `${baseUrl}/users/search/${trimmedQuery}`,
        null,
        token?.token
      );

      if (response?.data?.length > 0) {
        setAutocomplteAllData(response?.data);
        const options = response.data
          .filter((user) => user?.status !== "accepted")
          .map((user) => ({
            value: user?.username,
            label: (
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={
                    user?.profilePic ||
                    "https://www.w3schools.com/howto/img_avatar.png"
                  }
                  alt="user-image"
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    marginRight: 8,
                  }}
                />
                <span>{user?.username}</span>
              </div>
            ),
          }));

        setSuggestions(options);
        // props?.reRenderComponent();
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  // Debounced version of the fetchSuggestions function
  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

  useEffect(() => {
    debouncedFetchSuggestions(inputValue);
  }, [inputValue]);

  useEffect(() => {
    if (props?.friendReqCount?.length > 0) {
      setFriendReqData(props?.friendReqCount);
    }
  }, [props?.friendReqCount]);

  useEffect(() => {
    if (props?.friends?.length > 0) {
      setFriendsDataForGroup(props?.friends);
    }
  }, [props?.friends]);

  useEffect(() => {
    if (props?.friendsListForShare?.length > 0) {
      let friends = props?.friendsListForShare.filter((x) => x?.userId);
      // setFriendsData(friends);
      setFriendsDataForGroup(friends);
      let groups = props?.friendsListForShare.filter((x) => x?.groupName);
      setGroupsData(groups);
    }
  }, [props?.friendsListForShare]);

  const handleInputChange = (event) => {
    setInputValue(event);
    if (event === "") {
      setSuggestions([]);
    }
  };

  const handleAddClick = async () => {
    debugger;
    if (inputValue === "") {
      return;
    }
    const data = autocomplteAllData.filter(
      (user) => user.username === inputValue
    );
    // if (data?.length === 0) {
    //   showToastInfo("User not found");
    // }
    if (data && InviteButtonText === "Send Friend Request") {
      try {
        const sendObj = {
          receiverId: data[0]?.userId,
          status: "pending",
        };
        setOpenLoader(true);
        const response = await apiCall(
          "POST",
          `${baseUrl}/friend-requests/create`,
          sendObj,
          token?.token
        );
        setOpenLoader(false);
        if (response?.message !== "FRIEND REQUEST ALREADY SENT") {
          showToastSuccess("Your request has been sent successfully.");
          if(props?.fromProductsDetails === "AddFriends"){
            handleAddFriendFromShareProduct("ShareProductsToFriends")
          }else{
            props?.reRenderComponent();
            props?.closeModal();
          }
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else if(InviteButtonText === "Invite"){
      if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(inputValue)){
         showToastError("Enter a valid email address");
         return;
      }
      console.log(props)
      if(props?.productUrl){
      let url = location.pathname;
      let spliturl = url?.split("/");
      let productId = spliturl?.pop();
      let appiUrl = `${baseUrl}/invite/user`;
      const sendObj = {
        email: inputValue,
        productId:  Number(productId),
      };
      setOpenLoader(true);
      const response = await apiCall(
        "POST",
        appiUrl,
        sendObj,
        token?.token
      );
      setOpenLoader(false);
      if(response?.message === "Invitation email sent successfully"){
        showToastSuccess(response?.message);
        handleAddFriendFromShareProduct("ShareProductsToFriends");
      }
    }else{
      let sendObj = {
        email: inputValue,
      }
      let appiUrl = `${baseUrl}/invite/chat`;
      setOpenLoader(true);
      const response = await apiCall(
        "POST",
        appiUrl,
        sendObj,
        token?.token
      );
      setOpenLoader(false);
      if(response?.message === "Invitation for chat email sent successfully"){
        showToastSuccess(response?.message);
        // handleAddFriendFromShareProduct("ShareProductsToFriends");
        handleCancel();
      }
    }
    }
  };

  const handleRequestResponse = async (item, appOrRej) => {
    debugger;
    const data = {
      requestId: item?.requestId,
    };
    let filterData = [];
    if (appOrRej === "Accept") {
      setOpenLoader(true);
      const acceptApi = await apiCall(
        "PATCH",
        `${baseUrl}/friend-requests/update`,
        data,
        token?.token
      );
      setOpenLoader(false);
      if (acceptApi) {
        showToastSuccess("Request Accepted Successfully");
        filterData = friendReqData.filter(
          (item) => item?.requestId !== data?.requestId
        );
        setFriendReqData(filterData);
        props?.setFriendReqCountToShow(filterData?.length);
      }
    } else {
      setOpenLoader(true);
      const rejectApi = await apiCall(
        "DELETE",
        `${baseUrl}/friend-requests/delete/${item?.requestId}`,
        null,
        token?.token
      );
      setOpenLoader(false);
      if (rejectApi) {
        showToastSuccess("Request Rejected Successfully");
        filterData = friendReqData.filter(
          (item) => item?.requestId !== data?.requestId
        );
        setFriendReqData(filterData);
        props?.setFriendReqCountToShow(filterData?.length);
      }
    }

    if (filterData?.length === 0) {
      props?.reRenderComponent();
      props?.closeModal();
    }
  };

  const handleInputChangeGroup = (event) => {
    setGroupNameValue(event?.target?.value);
  };

  const handleGroupCreate = async (e) => {
    debugger;

    if (groupNameValue.trim() === "") {
      showToastInfo("Please enter group name");
      return;
    }

    if (addMemberToGroupList?.length === 0) {
      showToastInfo("Select atleast one friend to create group");
      return;
    }

    const sendObj = {
      groupName: groupNameValue,
    };
    setOpenLoader(true);
    const response = await apiCall(
      "POST",
      `${baseUrl}/group/create`,
      sendObj,
      token?.token
    );
    setOpenLoader(false);
    if (response?.message === "SUCCESSFULLY CREATED GROUP") {
      let groupId = response?.data?.groupId;
      const promises = addMemberToGroupList.map(async (value) => {
        const data = props?.friends?.filter((user) => user?.userId === value);

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
            `${baseUrl}/group-members/create`,
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
        const addingFriends = await Promise.all(promises);
        setOpenLoader(false);
        if (addingFriends) {
          showToastInfo("Group created successfully");
        }
        
        if(props?.fromProductsDetails === "CreateGroup"){
          setGroupNameValue("");
          setOpenLoader(true);
          const getGroupsList = await apiCall(
            "GET",
            `${baseUrl}/group/get-my-groups`,
            null,
            token?.token
          );
          setOpenLoader(false);
          if (getGroupsList?.data?.length > 0) {
            setGroupsData(getGroupsList?.data);
          }
          handleAddFriendFromShareProduct("ShareProductsToFriends");
        } else{
          props?.reRenderComponent();
          props?.closeModal();
        }
      } catch (error) {
        console.error("Error handling multiple friend requests:", error);
      }
    }
  };

  const handleSearchFriendInGroup = (event) => {
    debugger;
    const searchValue = event?.target?.value;
    if (searchValue?.trim === "") {
      return;
    }
    const filterData = props?.friends?.filter((x) =>
      x.username?.toLowerCase().includes(searchValue?.toLowerCase())
    );
    if (filterData && filterData?.length > 0) {
      setFriendsDataForGroup(filterData);
    } else {
      setFriendsDataForGroup(props?.friends);
    }
  };

  const handleTabSelect = (value) => {
    debugger;
    setCurrentTab(value);
  };

  const handleFriendsSearch = (event, from) => {
    debugger;
    let searchValue = event?.target?.value;
    if (searchValue.trim() !== "") {
      if (from === "friends") {
        let filteredFriends = props?.friendsListForShare.filter((friend) => {
          const usernameMatches = friend?.username
            ?.toLowerCase()
            .includes(searchValue.toLowerCase());

          return usernameMatches;
        });
        // setFriendsData(filteredFriends);
        setFriendsDataForGroup(filteredFriends);
      } else {
        let filteredFriends = props?.friendsListForShare.filter((friend) => {
          const usernameMatches = friend?.groupName
            ?.toLowerCase()
            .includes(searchValue.toLowerCase());

          return usernameMatches;
        });
        setGroupsData(filteredFriends);
      }
    } else {
      let friends = props?.friendsListForShare.filter((x) => x?.userId);
      // setFriendsData(friends);
      setFriendsDataForGroup(friends);
      let groups = props?.friendsListForShare.filter((x) => x?.groupName);
      setGroupsData(groups);
    }
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
            {props?.showSection === "AddFriends"
              ? "Add New Friends"
              : props?.showSection === "ShareProductsToFriends"
              ? "Share Product with Friends or Groups"
              : props?.showSection === "InviteFriendsToGroup"
              ? "Invite Friends to Group"
              : props?.showSection === "ShareProductsToFriends"
              ? "Share Product with Friends or Groups"
              : props?.showSection === "friendReq"
              ? "Friend Requests"
              : "Create New Group"}
          </div>
        }
        open={props.isShowModel}
        onCancel={handleCancel}
        className="custom-modal-new-chat"
        footer={null}
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
        <div className="new-chat-main">
          {props?.showSection === "AddFriends" && (
            <div className="create-search-contacts">
              <div className="search-input-add">
                <p style={{ marginBottom: "10px" }}>
                  Enter the username or email of the friend you want to add.
                </p>
                <AutoComplete
                  style={{ width: "100%", height: "40px" }}
                  value={inputValue}
                  onChange={handleInputChnageAutocomplete}
                  // onChange={(value) => {
                  //   setInputValue(value);
                  // }}
                  onSelect={(value) => {
                    fetchSuggestions(value);
                  }}
                  placeholder="Friends Username or Email"
                  options={suggestions}
                />
              </div>
              <div className="create-button-div">
              {props?.fromProductsDetails === "AddFriends" &&
                <Button
                  className="Create-Button"
                  color="default"
                  onClick={() => handleAddFriendFromShareProduct("ShareProductsToFriends")}
                  style={{marginRight:"10px"}}
                >
                  Back
                </Button>}
                <Button
                  className="Create-Button"
                  color="default"
                  onClick={handleAddClick}
                >
                  {/* Send Friend Request */}
                  {InviteButtonText}
                </Button>
              </div>
            </div>
          )}

          {props?.showSection === "CreateGroup" && (
            <div className="create-search-contacts">
              <div className="search-input-group">
                <label>Group Name</label>
                <input
                  type="text"
                  value={groupNameValue}
                  onChange={handleInputChangeGroup}
                  placeholder="Enter Group Name"
                  className="group-name-input"
                />
              </div>
              <div className="newGroup-main-div">
                <div className="searchfriendinGroupCreate">
                  <label>{friendsDataForGroup?.length > 0 ? "Friends List" : "No Friends" }</label>
                  <input
                    type="text"
                    onChange={handleSearchFriendInGroup}
                    placeholder="Search Friends"
                    className="searchfriendinGroup"
                  />
                </div>
                {friendsDataForGroup?.map(
                  (item, index) =>
                    item?.username && (
                      <div className="newGroup-list">
                        <div className="newGroup-list-item">
                          <div
                            className="checkbox-div"
                            style={{ display: "flex" }}
                          >
                            <Checkbox
                              onChange={(e) =>
                                handleCheckboxForAddMemberInGroup(e, item)
                              }
                            />
                          </div>
                          <div className="newGroup-list-item-image">
                            <img
                              src={
                                item?.profilePic
                                  ? item?.profilePic
                                  : `data:image/svg+xml;base64,${btoa(`
                              <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                                <rect width="100" height="100" fill="gray" />
                                <text x="50%" y="50%" font-size="50" font-family="Arial" dy=".35em" text-anchor="middle" fill="white">
                                  ${
                                    item?.username?.charAt(0).toUpperCase() ||
                                    ""
                                  }
                                </text>
                              </svg>
                            `)}`
                              }
                              alt=""
                              className="newGroup-list-item-image-img"
                            />
                          </div>
                          <div className="newGroup-list-item-name">
                            <div className="newGroup-list-item-name-text">
                              <p style={{ textTransform: "capitalize" }}>
                                {item?.username}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                )}
              </div>
              <div className="create-button-div">
                {props?.fromProductsDetails === "CreateGroup" &&
              <Button
                  className="Create-Button"
                  color="default"
                  onClick={() => handleAddFriendFromShareProduct("ShareProductsToFriends")}
                  style={{marginRight:"10px"}}
                >
                  Back
                </Button>}
                <Button
                  className="Create-Button"
                  color="default"
                  onClick={handleGroupCreate}
                >
                  Create
                </Button>
              </div>
            </div>
          )}

          {props?.showSection === "InviteFriendsToGroup" && (
            <>
              <div className="newGroup-main-div">
                {props?.friends?.map(
                  (item, index) =>
                    item?.username && (
                      <div className="newGroup-list">
                        <div className="newGroup-list-item">
                          <div className="newGroup-list-item-image">
                            <img
                              src={
                                item?.profilePic
                                  ? item?.profilePic
                                  : "https://www.w3schools.com/howto/img_avatar.png"
                              }
                              alt=""
                              className="newGroup-list-item-image-img"
                            />
                          </div>
                          <div className="newGroup-list-item-name">
                            <div className="newGroup-list-item-name-text">
                              <p>{item?.username}</p>
                            </div>
                            <div className="checkbox-div">
                              <Checkbox
                                onChange={(e) =>
                                  handleCheckboxForAddMemberInGroup(e, item)
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                )}
              </div>
              <div className="create-button-div">
                <Button
                  className="Create-Button"
                  color="default"
                  onClick={handleAddMemberButton}
                >
                  Add
                </Button>
              </div>
            </>
          )}

          {props?.showSection === "ShareProductsToFriends" && (
            <div className="newGroup-main-div">
              <div className="add-friends-groups-div">
                <Button
                  className="Share-screen-add-friend-group-buttons"
                  color="default"
                  onClick={() => handleAddFriendFromShareProduct('AddFriends')}
                >
                  Add Friends
                </Button>
                <Button
                  className="Share-screen-add-friend-group-buttons"
                  color="default"
                  onClick={() => handleAddFriendFromShareProduct('CreateGroup')}
                >
                  Create Group
                </Button>
              </div>
              <div className="tab-main-div" style={{ marginBottom: "10px" }}>
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
              {currentTab === 1 ? (
                <>
                  <div className="search-input">
                    <input
                      type="text"
                      placeholder="Search Friends"
                      onChange={(e) => handleFriendsSearch(e, "friends")}
                    />
                    <button className="search-button">
                      <Search style={{ color: "2e3b4e" }} />
                    </button>
                  </div>
                  <div className="div-for-scroll">
                    {friendsDataForGroup?.map(
                      (item, index) =>
                        item?.userId && (
                          <div className="newGroup-list">
                            <div className="newGroup-list-item">
                              <div
                                className="checkbox-div"
                                style={{ display: "flex" }}
                              >
                                <Checkbox
                                  checked={shareDataList?.includes(item)}
                                  onChange={(e) =>
                                    handleCheckboxForShareProducts(e, item)
                                  }
                                />
                              </div>
                              <div className="newGroup-list-item-image">
                                <img
                                  src={
                                    item?.profilePic ||
                                    `data:image/svg+xml;base64,${btoa(`
                              <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                                <rect width="100" height="100" fill="gray" />
                                <text x="50%" y="50%" font-size="50" font-family="Arial" dy=".35em" text-anchor="middle" fill="white">
                                  ${
                                    item?.username?.charAt(0).toUpperCase() ||
                                    item?.groupName?.charAt(0).toUpperCase()
                                  }
                                </text>
                              </svg>
                            `)}`
                                  }
                                  alt=""
                                  className="newGroup-list-item-image-img"
                                />
                              </div>
                              <div className="newGroup-list-item-name">
                                <div
                                  className="newGroup-list-item-name-text"
                                  style={{ textTransform: "capitalize" }}
                                >
                                  <p>{item?.groupName || item?.username} </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="search-input">
                    <input
                      type="text"
                      placeholder="Search Friends"
                      onChange={(e) => handleFriendsSearch(e, "groups")}
                    />
                    <button className="search-button">
                      <Search style={{ color: "2e3b4e" }} />
                    </button>
                  </div>
                  <div className="div-for-scroll">
                    {GroupData?.map(
                      (item, index) =>
                        item?.groupName && (
                          <div className="newGroup-list">
                            <div className="newGroup-list-item">
                              <div
                                className="checkbox-div"
                                style={{ display: "flex" }}
                              >
                                <Checkbox
                                  checked={shareDataList?.includes(item)}
                                  onChange={(e) =>
                                    handleCheckboxForShareProducts(e, item)
                                  }
                                />
                              </div>
                              <div className="newGroup-list-item-image">
                                <img
                                  src={
                                    item?.profilePic ||
                                    `data:image/svg+xml;base64,${btoa(`
                              <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                                <rect width="100" height="100" fill="gray" />
                                <text x="50%" y="50%" font-size="50" font-family="Arial" dy=".35em" text-anchor="middle" fill="white">
                                  ${
                                    item?.username?.charAt(0).toUpperCase() ||
                                    item?.groupName?.charAt(0).toUpperCase()
                                  }
                                </text>
                              </svg>
                            `)}`
                                  }
                                  alt=""
                                  className="newGroup-list-item-image-img"
                                />
                              </div>
                              <div className="newGroup-list-item-name">
                                <div
                                  className="newGroup-list-item-name-text"
                                  style={{ textTransform: "capitalize" }}
                                >
                                  <p>{item?.groupName || item?.username} </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {props?.showSection === "ShareProductsToFriends" && (
            <div style={{display:"flex", justifyContent:"end"}}>
            <div className="create-button-div" >
              <Button
                className={`${copyButtonText === "Copied" ?  "copiedlink-Button" :  "copylink-Button"}`}
                color="default"
                onClick={handleCopyProductLink}
              >
              {copyButtonText} {copyButtonText === "Copied" && <TiTick style={{ width:"25px", height:"25px", color: "white"}} />} 
              </Button>
            </div>
            <div className="create-button-div">
              <Button
                className="Create-Button"
                color="default"
                onClick={handleShareProduct}
              >
                Share
              </Button>
            </div>
            </div>
          )}
          {props?.showSection === "friendReq" && (
            <div style={{ marginTop: "30px" }}>
              {friendReqData?.map((item, index) => (
                <div className="newfriendReq-main-div">
                  <div className="newGroup-list">
                    <div className="newGroup-list-item">
                      <div className="newGroup-list-item-image">
                        <img
                          src={
                            item?.user?.profilePic
                              ? item?.user?.profilePic
                              : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpCKq1XnPYYDaUIlwlsvmLPZ-9-rdK28RToA&s"
                          }
                          alt=""
                          className="newGroup-list-item-image-img"
                        />
                      </div>
                      <div className="newGroup-list-item-name">
                        <div className="newGroup-list-item-name-text">
                          <p>{item?.user?.username}</p>
                        </div>
                        <div className="checkbox-div">
                          <Button
                            className="Accept-Button"
                            color="default"
                            onClick={() =>
                              handleRequestResponse(item, "Accept")
                            }
                          >
                            Accept
                          </Button>
                          <Button
                            className="Reject-Button"
                            color="default"
                            onClick={() =>
                              handleRequestResponse(item, "Reject")
                            }
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
export default NewChatModal;
