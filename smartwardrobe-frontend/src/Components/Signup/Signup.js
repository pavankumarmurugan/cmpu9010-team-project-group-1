import { Button, Modal } from "antd";
import { useRef, useState } from "react";
import Draggable from "react-draggable";
import { FcGoogle } from "react-icons/fc";
import { Flex, Input, Typography } from 'antd';
import "../../Styles/SignUp.css";

function SignupModal(props) {
  const [disabled, setDisabled] = useState(true);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const draggleRef = useRef(null);
  /** modal open function */
  //   const handleOk = (e) => {
  //     props?.okModalFunction();
  //   };
  /** modal close function */
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
            {/* {props?.title} */}
          </div>
        }
        open={props.isShowModel}
        // onOk={handleOk}
        onCancel={handleCancel}
        className="custom-modal"
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
        <div className="modal-container">
          <div>
            <h2>𝑺𝒎𝒂𝒓𝒕𝑾𝒂𝒓𝒅𝒓𝒐𝒃𝒆</h2>
          </div>
          <div>
            {props?.checkingLoginOrSignup === "Signup" ?
            <h1>Create an Account</h1>
            : 
            <h1>Log in to your Account</h1>}
          </div>
          <div className="Signup-form-section">
            <div className="google-section">
              <button className="Signup-form-button">
                <FcGoogle
                  style={{ width: "20px", height: "20px", marginRight: "5px" }}
                />
                {props?.checkingLoginOrSignup === "Signup" ? "Sign up with Google" : "Sign in with Google"}
              </button>
              <span style={{fontSize:"18px", fontWeight:"bold"}}>or</span>
            </div>
            <div className="inputfields-section">
              <div className="Signup-Inputs">
                { props?.checkingLoginOrSignup === "Signup" &&
                <>
                  <Typography.Title level={5}>First Name</Typography.Title>
                <Input placeholder="First Name" className="Signup-Inputfield"/>
                <Typography.Title level={5}>Last Name</Typography.Title>
                <Input placeholder="Last Name" className="Signup-Inputfield"/>
                </>}
                <Typography.Title level={5}>Email</Typography.Title>
                <Input placeholder="Email" className="Signup-Inputfield"/>
                <Typography.Title level={5}>Password</Typography.Title>
                <Input placeholder="Password" className="Signup-Inputfield"/>
                { props?.checkingLoginOrSignup !== "Signup" &&
                <Typography.Title level={5} style={{float:"right", cursor:"pointer"}}>Forget Password?</Typography.Title>
                }
              </div>
              <div class="text-xs text-text-neutral font-brittiSans">&nbsp;</div>
              <div class="text-xs text-text-neutral font-brittiSans">&nbsp;</div>
              <button className="Signup-button">
                Get Started
              </button>
              <div className="already-account-section">
                <span className="signup-text">{props?.checkingLoginOrSignup === "Signup" ? "Already have an account?" : "Don't have an account?"}</span>
                <span className="LoginLink-text" onClick={(e) => props?.accountCreate(props?.checkingLoginOrSignup)}>{props?.checkingLoginOrSignup === "Signup" ? "Login" : "Create a free acount"}</span>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
export default SignupModal;
