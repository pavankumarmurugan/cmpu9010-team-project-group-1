import { Modal } from "antd";
import { useRef, useState } from "react";
import Draggable from "react-draggable";
import { FcGoogle } from "react-icons/fc";
import { Flex, Input, Typography } from "antd";
import "../../Styles/SignUp.css";
import apiCall from "../GenericApiCallFunctions/GenericApiCallFunctions";
import { Backdrop, Button, ButtonBase, Checkbox, CircularProgress } from "@mui/material";
import { json, useNavigate } from "react-router-dom";
import { showToastSuccess } from "../GenericToasters/GenericToasters";
import { setTokenToLocalStorage } from "../GenericCode/GenericCode";
import { RiChatNewLine } from "react-icons/ri";
import { AiOutlineWechat } from "react-icons/ai";
import "../../Styles/ChatComponent.css";
import { GoPersonAdd } from "react-icons/go";
import { Search } from "@mui/icons-material";

function NewChatModal(props) {
  const [disabled, setDisabled] = useState(true);
  const [addNewChat, setAddNewChat] = useState(false);
  const [addNewGroup, setAddNewGroup] = useState(false);
  const [friendEmail, setFriendEmail] = useState("");

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

  const handleAddNewChat = () => {
    debugger;
    setAddNewChat(true);
  };
  const handleAddNewGroup = () => {
    debugger;
    setAddNewGroup(true);
  };

  const handleCheckbox = (e) => {
    debugger;
  }

  return (
    <>
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
            Add New Chats
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
          {!addNewChat && !addNewGroup && (
            <div className="">
              <Button
                className="new-converation-button"
                color="default"
                style={{ marginBottom: "20px" }}
                onClick={handleAddNewChat}
              >
                <RiChatNewLine
                  style={{
                    width: "20px",
                    height: "20px",
                    paddingRight: "10px",
                    paddingBottom: "3px",
                  }}
                />
                New Chat
              </Button>
              <Button
                className="new-converation-button"
                color="default"
                onClick={handleAddNewGroup}
              >
                <AiOutlineWechat
                  style={{
                    width: "20px",
                    height: "20px",
                    paddingRight: "10px",
                    paddingBottom: "3px",
                  }}
                />
                New Group
              </Button>
            </div>
          )}

          {addNewChat && (
            <div className="search-contacts">
              <div className="search-input">
                <input
                  type="text"
                  placeholder="Enter Friends Email"
                  value={friendEmail}
                  onChange={(e) => setFriendEmail(e.target.value)}
                />
                <button className="search-button">
                  <GoPersonAdd style={{ color: "2e3b4e" }} />
                </button>
              </div>
            </div>
          )}

          {addNewGroup && (
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
                        <Checkbox  onChange={(e) => handleCheckbox(e)}/>
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
                        <Checkbox  onChange={(e) => handleCheckbox(e)}/>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
export default NewChatModal;
