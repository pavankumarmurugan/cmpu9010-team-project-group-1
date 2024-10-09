import { Button, Modal } from "antd";
import { useRef, useState } from "react";
import Draggable from "react-draggable";
import { FcGoogle } from "react-icons/fc";
import { Flex, Input, Typography } from "antd";
import "../../Styles/SignUp.css";

function SignupModal(props) {
  const [disabled, setDisabled] = useState(true);
  const [formData, setFormData] = useState({
    userFirstName: "",
    userLastName: "",
    userEmail: "",
    userPassword: "",
  });

  const [validationField, setValidationField] = useState({
    signUpFName: false,
    signUpLName: false,
    signUpEmail: false,
    signUpPassword: false,
  });

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

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (value !== null && value !== undefined) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      // setValidationField((prev) => ({
      //   ...prev,
      //   signUpFName: false,
      //   signUpLName: false,
      // }));
    }
  };

  const handleSignUp = async () => {
    debugger;
    if (props?.checkingLoginOrSignup === "Signup") {
      // if (formData.userFirstName.trim() === "") {
      //   setValidationField((prev) => ({
      //     ...prev,
      //     userFirstName: true,
      //   }));
      //   // showToastError("First Name can not be empty.");
      //   return;
      // } else if (formData.userLastName.trim() === "") {
      //   setValidationField((prev) => ({
      //     ...prev,
      //     userLastName: true,
      //   }));
      //   // showToastError("Last Name can not be empty.");
      //   return;
      // } else if (formData.userEmail.trim() === "") {
      //   setValidationField((prev) => ({
      //     ...prev,
      //     userEmail: true,
      //   }));
      //   // showToastError("Last Name can not be empty.");
      //   return;
      // } else if (formData.userPassword.trim() === "") {
      //   setValidationField((prev) => ({
      //     ...prev,
      //     userPassword: true,
      //   }));
      //   // showToastError("Last Name can not be empty.");
      //   return;
      // }
      // delete formData["loginEmail"];
      // delete formData["loginPassword"];
      const aa = {
        username: "string",
  firstname: "string",
  lastname: "string",
  password: "string",
  role: "user"
      }
      const response = await fetch(
        "https://smartwardrobe-backend.azurewebsites.net/users/create",
        {
          method: "POST",
          headers: {
            "Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(aa),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data?.message === "User registered successfully!") {
            // showToastSuccess(data?.message);
          } else {
            // showToastError(data?.message);
          }
        })
        .catch((err) => {
          // showToastError(err);
          console.log(err);
        });
    } else {
    }
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
            <h1>𝑺𝒎𝒂𝒓𝒕𝑾𝒂𝒓𝒅𝒓𝒐𝒃𝒆</h1>
          </div>
          <div>
            {props?.checkingLoginOrSignup === "Signup" ? (
              <h1>Create an Account</h1>
            ) : (
              <h1>Log in to your Account</h1>
            )}
          </div>
          <div className="Signup-form-section">
            <div className="google-section">
              <button className="Signup-form-button">
                <FcGoogle
                  style={{ width: "20px", height: "20px", marginRight: "5px" }}
                />
                {props?.checkingLoginOrSignup === "Signup"
                  ? "Sign up with Google"
                  : "Sign in with Google"}
              </button>
              <span style={{ fontSize: "18px", fontWeight: "bold" }}>or</span>
            </div>
            <div className="inputfields-section">
              <div className="Signup-Inputs">
                {props?.checkingLoginOrSignup === "Signup" && (
                  <>
                    <Typography.Title
                      level={5}
                      className={`${
                        validationField.signUpFName && "Error-FieldName"
                      }`}
                    >
                      First Name
                    </Typography.Title>
                    <Input
                      placeholder="First Name"
                      name="userFirstName"
                      value={formData.userFirstName}
                      onChange={handleChange}
                      className={`${
                        validationField.signUpFName
                          ? "errorSignup-Inputfield"
                          : "Signup-Inputfield"
                      }`}
                    />
                    <Typography.Title level={5}
                    className={`${
                      validationField.signUpLName && "Error-FieldName"
                    }`}>Last Name</Typography.Title>
                    <Input
                      placeholder="Last Name"
                      name="userLastName"
                      value={formData.userLastName}
                      onChange={handleChange}
                      className={`${
                        validationField.signUpLName
                          ? "errorSignup-Inputfield"
                          : "Signup-Inputfield"
                      }`}
                    />
                  </>
                )}
                <Typography.Title level={5}
                className={`${
                  validationField.signUpEmail && "Error-FieldName"
                }`}>Email</Typography.Title>
                <Input
                  placeholder="Email"
                  name="userEmail"
                  value={formData.userEmail}
                  onChange={handleChange}
                  className={`${
                    validationField.signUpEmail
                      ? "errorSignup-Inputfield"
                      : "Signup-Inputfield"
                  }`}
                />
                <Typography.Title level={5}
                className={`${
                  validationField.signUpPassword && "Error-FieldName"
                }`}>Password</Typography.Title>
                <Input
                  placeholder="Password"
                  type="password"
                  name="userPassword"
                  value={formData.userPassword}
                  onChange={handleChange}
                  className={`${
                    validationField.signUpPassword
                      ? "errorSignup-Inputfield"
                      : "Signup-Inputfield"
                  }`}
                />
                {props?.checkingLoginOrSignup !== "Signup" && (
                  <Typography.Title
                    level={5}
                    style={{ float: "right", cursor: "pointer" }}
                  >
                    Forget Password?
                  </Typography.Title>
                )}
              </div>
              <div class="text-xs text-text-neutral font-brittiSans">
                &nbsp;
              </div>
              <div class="text-xs text-text-neutral font-brittiSans">
                &nbsp;
              </div>
              <button className="Signup-button" onClick={handleSignUp}>
                Get Started
              </button>
              <div className="already-account-section">
                <span className="signup-text">
                  {props?.checkingLoginOrSignup === "Signup"
                    ? "Already have an account?"
                    : "Don't have an account?"}
                </span>
                <span
                  className="LoginLink-text"
                  onClick={(e) =>
                    props?.accountCreate(props?.checkingLoginOrSignup)
                  }
                >
                  {props?.checkingLoginOrSignup === "Signup"
                    ? "Login"
                    : "Create a free acount"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
export default SignupModal;
