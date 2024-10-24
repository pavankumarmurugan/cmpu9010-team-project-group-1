import { Button, Modal } from "antd";
import { useRef, useState } from "react";
import Draggable from "react-draggable";
import { FcGoogle } from "react-icons/fc";
import { Flex, Input, Typography } from "antd";
import "../../Styles/SignUp.css";
import apiCall from "../GenericApiCallFunctions/GenericApiCallFunctions";
import { Backdrop, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { showToastSuccess } from "../GenericToasters/GenericToasters";

function SignupModal(props) {
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(true);
  const [openLoader, setOpenLoader] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    // userEmail: "",
    password: "",
    role: "user",
  });

  const [validationField, setValidationField] = useState({
    username: false,
    firstname: false,
    lastname: false,
    // signUpEmail: false,
    password: false,
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
      setValidationField((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
  };

  const handleSignUp = async () => {
    debugger;
    if (props?.checkingLoginOrSignup === "Signup") {
      let showerror = false;
      if (formData.firstname.trim() === "") {
        setValidationField((prev) => ({
          ...prev,
          firstname: true,
        }));
        showerror = true;
      } 
      if (formData.lastname.trim() === "") {
        setValidationField((prev) => ({
          ...prev,
          lastname: true,
        }));
        showerror = true;
      }
      if (formData.username.trim() === "") {
        setValidationField((prev) => ({
          ...prev,
          username: true,
        }));
        showerror = true;
      }
      if (formData.password.trim() === "") {
        setValidationField((prev) => ({
          ...prev,
          password: true,
        }));
        showerror = true;
      }

      if(showerror){
        return;
      }
      setOpenLoader(true);
      const response = await apiCall("POST", "https://sw-backend-afhxerfcftakduhk.northeurope-01.azurewebsites.net/users/create", formData);
      debugger
      setOpenLoader(false)
      handleloginOrSignupChange()
      if (response?.statusCode?.text === 'Success') {
        showToastSuccess(response?.data?.message);
        handleCancel();
        const data = response?.data;
        setTimeout(() => {
          navigate("/", { state: { data } });
          
        }, 1000);
      }
    } else {
      let showerror = false;
      if (formData.username.trim() === "") {
        setValidationField((prev) => ({
          ...prev,
          username: true,
        }));
        showerror = true;
      }
      if (formData.password.trim() === "") {
        setValidationField((prev) => ({
          ...prev,
          password: true,
        }));
        showerror = true;
      }
      if(showerror){
        return;
      }
      
      delete formData["firstname"];
      delete formData["lastname"];
      delete formData["role"];
      setOpenLoader(true);
      const response = await apiCall("POST", "https://sw-backend-afhxerfcftakduhk.northeurope-01.azurewebsites.net/auth/login", formData);
      debugger
      console.log(response)
      setOpenLoader(false)
      handleloginOrSignupChange()
      if (response?.statusCode?.text === 'Success') {
        showToastSuccess(response?.data?.message);
        handleCancel();
        const data = response?.data;
        setTimeout(() => {
          navigate("/", { state: { data } });
          
        }, 1000);
      }
      
    }
  };

  const handleloginOrSignupChange = () => {
    setFormData({
      username: "",
      firstname: "",
      lastname: "",
      password: "",
      role: "user",
    })
    setValidationField({
      username: false,
      firstname: false,
      lastname: false,
      password: false,
    })
    props?.accountCreate(props?.checkingLoginOrSignup);
  }

  return (
    <>
    <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={openLoader}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
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
                {props?.checkingLoginOrSignup === "Signup" ? (
                  <>
                  <Typography.Title
                      level={5}
                      className={`${
                        validationField.username && "Error-FieldName"
                      }`}
                    >
                      User Name
                    </Typography.Title>
                    <Input
                      placeholder="First Name"
                      name="username"
                      autoComplete="off"
                      value={formData.username}
                      onChange={handleChange}
                      className={`${
                        validationField.username
                          ? "errorSignup-Inputfield"
                          : "Signup-Inputfield"
                      }`}
                    />
                    <Typography.Title
                      level={5}
                      className={`${
                        validationField.firstname && "Error-FieldName"
                      }`}
                    >
                      First Name
                    </Typography.Title>
                    <Input
                      placeholder="First Name"
                      name="firstname"
                      value={formData.firstname}
                      autoComplete="off"
                      onChange={handleChange}
                      className={`${
                        validationField.firstname
                          ? "errorSignup-Inputfield"
                          : "Signup-Inputfield"
                      }`}
                    />
                    <Typography.Title level={5}
                    className={`${
                      validationField.lastname && "Error-FieldName"
                    }`}>Last Name</Typography.Title>
                    <Input
                      placeholder="Last Name"
                      name="lastname"
                      value={formData.lastname}
                      autoComplete="off"
                      onChange={handleChange}
                      className={`${
                        validationField.lastname
                          ? "errorSignup-Inputfield"
                          : "Signup-Inputfield"
                      }`}
                    />
                  </>
                )
              :
              (
                <>
                <Typography.Title
                      level={5}
                      className={`${
                        validationField.username && "Error-FieldName"
                      }`}
                    >
                      User Name
                    </Typography.Title>
                    <Input
                      placeholder="First Name"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      autoComplete="off"
                      className={`${
                        validationField.username
                          ? "errorSignup-Inputfield"
                          : "Signup-Inputfield"
                      }`}
                    />
                </>
              )}
                
                <Typography.Title level={5}
                className={`${
                  validationField.password && "Error-FieldName"
                }`}>Password</Typography.Title>
                <Input
                  placeholder="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  autocomplete="new-password"
                  onChange={handleChange}
                  className={`${
                    validationField.password
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
                  onClick={handleloginOrSignupChange}
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
