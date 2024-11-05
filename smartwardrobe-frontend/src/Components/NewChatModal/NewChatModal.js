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

  const handleCheckbox = (e) => {
    debugger;
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

  // Fetch suggestions from the API
  const fetchSuggestions = async (query) => {
    debugger;
    const trimmedQuery = query.trim();
    if (trimmedQuery.trim().length < 3) {
      // setSuggestions([]);
      return;
    }
    // setLoading(true);
    try {
      // setOpenLoader(true);
      const response = await apiCall(
        "GET",
        `https://smartwardrobe-backend.azurewebsites.net/users/search/${query}`,
        null,
        token?.token
      );
      // setOpenLoader(false);
      if (response?.data) {
        setAutocomplteAllData(response?.data);
        const options = response.data.map((user) => ({
          value: user.username,
          label: user.username,
        }));
        setSuggestions(options);
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
          showToastSuccess("Friend Added Successfully");
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
      props?.closeModal();
    }
  };

  const handleInputChangeGroup = (event) => {
    setGroupNameValue(event?.target?.value);
  }

  const handleGroupCreate = async () => {
    debugger;
    if (groupNameValue.trim() === "") {
      return;
    }
    const sendObj = {
      groupName: groupNameValue,
      };
    setOpenLoader(true);
    const response = await apiCall("POST", "https://smartwardrobe-backend.azurewebsites.net/group/create", sendObj, token?.token);
    setOpenLoader(false);
    if(response?.message === "SUCCESSFULLY CREATED GROUP") {
      showToastSuccess(response?.message);
      props?.closeModal();
    }
  }

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
              : "Create New Group"}
          </div>
        }
        open={props.isShowModel}
        onCancel={handleCancel}
        className="custom-modal-new-chat"
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
                  onChange={handleInputChange}
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
            <div className="newGroup-main-div">
              {props?.friends?.map((item, index) => (
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
                        <Checkbox onChange={(e) => handleCheckbox(e)} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="create-button-div">
                <Button className="Create-Button" color="default">
                  Create
                </Button>
              </div>
            </div>
          )}

          {props?.showSection === "ShareProductsToFriends" && (
            <div className="newGroup-main-div">
              <div className="newGroup-list">
                <div className="newGroup-list-item">
                  <div className="newGroup-list-item-image">
                    <img
                      src="https://www.w3schools.com/howto/img_avatar.png"
                      alt=""
                      className="newGroup-list-item-image-img"
                    />
                  </div>
                  <div className="newGroup-list-item-name">
                    <div className="newGroup-list-item-name-text">
                      <p>Alice Steven</p>
                    </div>
                    <div className="checkbox-div">
                      <Checkbox onChange={(e) => handleCheckbox(e)} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="newGroup-list">
                <div className="newGroup-list-item">
                  <div className="newGroup-list-item-image">
                    <img
                      src="https://www.w3schools.com/howto/img_avatar.png"
                      alt=""
                      className="newGroup-list-item-image-img"
                    />
                  </div>
                  <div className="newGroup-list-item-name">
                    <div className="newGroup-list-item-name-text">
                      <p>Alice Steven</p>
                    </div>
                    <div className="checkbox-div">
                      <Checkbox onChange={(e) => handleCheckbox(e)} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="create-button-div">
                <Button className="Create-Button" color="default">
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
