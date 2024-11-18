import { AutoComplete, Modal } from "antd";
import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { FcGoogle } from "react-icons/fc";
import { Flex, Input, Typography } from "antd";
import "../../Styles/SignUp.css";
import apiCall from "../GenericApiCallFunctions/GenericApiCallFunctions";
import {
  Backdrop,
  Button,
  ButtonBase,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import { json, useNavigate } from "react-router-dom";
import {
  showToastInfo,
  showToastSuccess,
} from "../GenericToasters/GenericToasters";
import { setTokenToLocalStorage } from "../GenericCode/GenericCode";
import { RiChatNewLine } from "react-icons/ri";
import { AiOutlineWechat } from "react-icons/ai";
import "../../Styles/ChatComponent.css";
import { GoPersonAdd } from "react-icons/go";
import { Search } from "@mui/icons-material";
import { FreiendRequestsValueSuccess } from "../../redux/slices/HomeDataSlice";

function NewChatModal(props) {
  let token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const [disabled, setDisabled] = useState(true);
  const [openLoader, setOpenLoader] = useState(false);
  const [addNewChat, setAddNewChat] = useState(false);
  const [addNewGroup, setAddNewGroup] = useState(false);
  const [friendEmail, setFriendEmail] = useState("");
  const [groupNameValue, setGroupNameValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [friendReqData, setFriendReqData] = useState([]);
  const [autocomplteAllData, setAutocomplteAllData] = useState([]);
  const [addMemberToGroupList, setaddMemberToGroupList] = useState([]);
  const [shareDataList, setShareDataList] = useState([]);
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

  const handleCheckboxForShareProducts = async (event,item) => {
    debugger;
    console.log(event)
    console.log(item)

    if(event?.target?.checked){
      setShareDataList([...shareDataList,item])
    }
    else{
      let filterCheckedOnly = shareDataList?.filter(
        (i) => i !== item
      );
      setShareDataList(filterCheckedOnly);
    }
  };

  const handleShareProduct = async () => {
    debugger;

    if(shareDataList?.length === 0){
      showToastInfo("Please select atleast one friend or group to share product.");
      return;
    }

    if (shareDataList?.length > 0) {
      const friendList = shareDataList?.filter(x => x?.userId);
      const groupList = shareDataList?.filter(x => x?.groupId);
      if(friendList?.length > 0){
      const apiCalls = friendList.map((item) => {
          let message = {
            message: props?.productUrl,
            receiverId: item?.userId,
            messageType: "text"
          };
        return apiCall(
         "POST",
        "https://smartwardrobe-backend.azurewebsites.net/chat/create/send-message-to-friend",
        message,
        token?.token
        );
      });
      setOpenLoader(true);
      const apiCallsFriends = await Promise.all(apiCalls);
      if(apiCallsFriends?.length > 0){
        // showToastSuccess("Product Shared Successfully");
        console.log(apiCallsFriends)
      }
    }

    if(groupList?.length > 0){
      const apiCalls = groupList.map((item) => {
        let message = {
          message: props?.productUrl,
          groupId: item?.groupId,
          messageType: "text"
        };
        
      return apiCall(
        "POST",
        "https://smartwardrobe-backend.azurewebsites.net/chat/create/send-message-to-group",
        message,
        token?.token
      );
    });
    setOpenLoader(true);
    const apiCallsGroups = await Promise.all(apiCalls);

    if(apiCallsGroups?.length > 0){
      // showToastSuccess("Product Shared Successfully");
      console.log(apiCallsGroups)
    }
    setOpenLoader(false);
    handleCancel();
    }
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
          "https://smartwardrobe-backend.azurewebsites.net/group-members/create",
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

  const fetchSuggestions = async (query) => {
    debugger
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await apiCall(
        "GET",
        `https://smartwardrobe-backend.azurewebsites.net/users/search/${trimmedQuery}`,
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
        props?.reRenderComponent();
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
    if (data?.length === 0) {
      showToastInfo("User not found");
    }
    if (data) {
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
        setOpenLoader(false);
        if (response) {
          showToastSuccess("Your request has been sent successfully.");
          props?.reRenderComponent();
          props?.closeModal();
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
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
      const acceptApi = await apiCall(
        "PATCH",
        `https://smartwardrobe-backend.azurewebsites.net/friend-requests/update`,
        data,
        token?.token
      );
      if (acceptApi) {
        showToastSuccess("Request Accepted Successfully");
        filterData = friendReqData.filter(
          (item) => item?.requestId !== data?.requestId
        );
        setFriendReqData(filterData);
        props?.setFriendReqCountToShow(filterData?.length);
      }
    } else {
      const rejectApi = await apiCall(
        "DELETE",
        `https://smartwardrobe-backend.azurewebsites.net/friend-requests/delete/${item?.requestId}`,
        null,
        token?.token
      );
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

  const handleGroupCreate = async () => {
    debugger;
    if (groupNameValue.trim() === "") {
      return;
    }
    const sendObj = {
      groupName: groupNameValue,
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
      showToastSuccess(response?.message);
      props?.reRenderComponent();
      props?.closeModal();
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
              ? "Share Product with Friends"
              : props?.showSection === "InviteFriendsToGroup"
              ? "Invite Friends to Group"
              : props?.showSection === "ShareProductsToFriends"
              ? "Share Product with Friends"
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
            <div className="search-contacts">
              <div className="search-input">
                {/* <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type to search..."
            /> */}
                {/* {suggestions.length > 0 && (
                <ul>
                    {suggestions?.map((suggestion, index) => (
                        <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                            {suggestion?.username}
                        </li>
                    ))}
                </ul>
            )} */}
                <AutoComplete
                  style={{ width: "100%", height: "40px" }}
                  value={inputValue}
                  onChange={(value) => {
                    setInputValue(value);
                  }}
                  onSelect={(value) => {
                    fetchSuggestions(value);
                  }}
                  placeholder="Search Friends"
                  options={suggestions}
                />
              </div>
              <div className="create-button-div">
                <Button
                  className="Create-Button"
                  color="default"
                  onClick={handleAddClick}
                >
                  Add
                </Button>
              </div>
            </div>
          )}

          {props?.showSection === "CreateGroup" && (
            <div className="search-contacts">
              <div className="search-input">
                <input
                  type="text"
                  value={groupNameValue}
                  onChange={handleInputChangeGroup}
                  placeholder="Enter Group Name"
                />
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
              {props?.friendsListForShare?.map( (item, index) => (
                
              <div className="newGroup-list">
                <div className="newGroup-list-item">
                  <div className="newGroup-list-item-image">
                    <img
                      src={item?.profilePic || "https://www.w3schools.com/howto/img_avatar.png"} 
                      alt=""
                      className="newGroup-list-item-image-img"
                    />
                  </div>
                  <div className="newGroup-list-item-name">
                    <div className="newGroup-list-item-name-text" style={{textTransform: "capitalize"}}>
                      <p>{item?.groupName || item?.username} </p>
                    </div>
                    <div className="checkbox-div">
                      <Checkbox onChange={(e) => handleCheckboxForShareProducts(e,item)} />
                    </div>
                  </div>
                </div>
              </div>
              ))}

              <div className="create-button-div">
                <Button className="Create-Button" color="default" onClick={handleShareProduct} >
                  Share
                </Button>
              </div>
            </div>
          )}

          {props?.showSection === "friendReq" && (
            <>
              {friendReqData?.map((item, index) => (
                <div className="newGroup-main-div">
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
            </>
          )}
        </div>
      </Modal>
    </>
  );
}
export default NewChatModal;
