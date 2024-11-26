import { Button, Modal } from "antd";
import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { FcGoogle } from "react-icons/fc";
import { Flex, Input, Typography } from "antd";
import "../../Styles/SignUp.css";
import apiCall, { baseUrl } from "../GenericApiCallFunctions/GenericApiCallFunctions";
import { Backdrop, CircularProgress } from "@mui/material";
import { json, useNavigate } from "react-router-dom";
import { showToastSuccess } from "../GenericToasters/GenericToasters";
import { setTokenToLocalStorage } from "../GenericCode/GenericCode";
import WelcomeBanner from "../WelcomeBanner/WelcomeBanner";

function SignupModal(props) {
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(true);
  const [openLoader, setOpenLoader] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstname: "ewfdscx",
    lastname: "dsvcdscwd",
    username: "",
    password: "",
    confirmpassword: "",
    role: "user",
  });

  const [validationField, setValidationField] = useState({
    email: false,
    // firstname: false,
    // lastname: false,
    username: false,
    password: false,
    confirmpassword: false,
  });

  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const draggleRef = useRef(null);
  const handleCancel = (e) => {
    handleloginOrSignupChange("fromApi")
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

  const handleBlurOnConfirmPassword = (e) => {
    debugger

    const name = e?.target?.name;
    const value = e?.target?.value;

    if(value !== formData?.password){
      setValidationField((prev) => ({
        ...prev,
        [name]: true,
      }));
    }else{
      setValidationField((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
  }

  const handleValidations = () => {
    let showerror = false;
    if (props?.checkingLoginOrSignup === "Signup") {
      // if (formData.firstname.trim() === "") {
      //   setValidationField((prev) => ({
      //     ...prev,
      //     firstname: true,
      //   }));
      //   showerror = true;
      // } 
      // if (formData?.lastname?.trim() === "") {
      //   setValidationField((prev) => ({
      //     ...prev,
      //     lastname: true,
      //   }));
      //   showerror = true;
      // }
      if (formData.email.trim() === "" || !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(formData?.email)) {
        setValidationField((prev) => ({
          ...prev,
          email: true,
        }));
        showerror = true;
      }
      if (formData?.username?.trim() === "") {
        setValidationField((prev) => ({
          ...prev,
          username: true,
        }));
        showerror = true;
      }
      if (formData?.password?.trim().length < 5) {
        setValidationField((prev) => ({
          ...prev,
          password: true,
        }));
        showerror = true;
      }
    }else{
      // if (formData.email.trim() === "" || !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(formData?.email)) {
      //   setValidationField((prev) => ({
      //     ...prev,
      //     email: true,
      //   }));
      //   showerror = true;
      // }
      if (formData?.username?.trim() === "") {
        setValidationField((prev) => ({
          ...prev,
          username: true,
        }));
        showerror = true;
      }
      if (formData?.password?.trim().length < 5) {
        setValidationField((prev) => ({
          ...prev,
          password: true,
        }));
        showerror = true;
      }
    }
      if(showerror){
        showerror = false;
        return true;
      }
  }

  const handleSignUp = async () => {
    debugger;
    if (props?.checkingLoginOrSignup === "Signup") {
      const valdiations = handleValidations();
      if(valdiations){
        return;
      }
      formData['firstname'] = formData['username']
      formData['lastname'] = formData['username']
      setOpenLoader(true);
      const response = await apiCall("POST", `${baseUrl}/users/create`, formData);
      debugger
      setOpenLoader(false)
      if (response?.statusCode?.text === 'Success') {
        let token = setTokenToLocalStorage(response?.data);
        localStorage.setItem("firstlogin", JSON.stringify(true));
        showToastSuccess(response?.data?.message);
        handleCancel();
        handleloginOrSignupChange()
        const data = response?.data;
        setTimeout(() => {
          // navigate("/", { state: { data } });
          window.location.reload();
          
        }, 1000);
      }
    } else {
      const valdiations = handleValidations();
      if(valdiations){
        return;
      }
      
      // delete formData["firstname"];
      // delete formData["lastname"];
      delete formData["role"];
      setOpenLoader(true);
      const response = await apiCall("POST", `${baseUrl}/auth/login`, formData);
      debugger
      setOpenLoader(false)
      handleloginOrSignupChange("fromApi")
      if (response?.statusCode?.text === 'Success') {
        let token = setTokenToLocalStorage(response?.data);
        showToastSuccess(response?.data?.message);
        handleCancel();
        const data = response?.data;
        setTimeout(() => {
          // navigate("/", { state: { data } });
          window.location.reload();
        }, 1000);
      }
      
    }
  };

  const handleloginOrSignupChange = (from) => {
    setFormData({
      email: "",
      username: "",
      // firstname: "",
      // lastname: "",
      password: "",
      role: "user",
    })
    setValidationField({
      email: false,
      username: false,
      // firstname: false,
      // lastname: false,
      password: false,
    })
    if(from !== "fromApi"){
      props?.accountCreate(props?.checkingLoginOrSignup);
    }
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
            <h1>SMARTWARDROBE</h1>
          </div>
          <div>
            {props?.checkingLoginOrSignup === "Signup" ? (
              <h1>Create an Account</h1>
            ) : (
              <h1>Login</h1>
            )}
          </div>
          <div className="Signup-form-section">
            {/* <div className="google-section">
              <button className="Signup-form-button">
                <FcGoogle
                  style={{ width: "20px", height: "20px", marginRight: "5px" }}
                />
                {props?.checkingLoginOrSignup === "Signup"
                  ? "Sign up with Google"
                  : "Sign in with Google"}
              </button>
              <span style={{ fontSize: "18px", fontWeight: "bold" }}>or</span>
            </div> */}
            <div className="inputfields-section">
              <div className="Signup-Inputs">
                {props?.checkingLoginOrSignup === "Signup" ? (
                  <>
                  {/* <Typography.Title
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
                    /> */}
                    {/* <Typography.Title
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
                    /> */}
                    {/* <Typography.Title level={5}
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
                    /> */}
                    <Typography.Title
                      level={5}
                      className={`${
                        validationField.username && "Error-FieldName"
                      }`}
                    >
                      {/* Email */}
                      User Name
                    </Typography.Title>
                    <Input
                      placeholder="User Name"
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
                        validationField.email && "Error-FieldName"
                      }`}
                    >
                      Email
                    </Typography.Title>
                    <Input
                      placeholder="Email"
                      name="email"
                      autoComplete="off"
                      value={formData.email}
                      onChange={handleChange}
                      className={`${
                        validationField.email
                          ? "errorSignup-Inputfield"
                          : "Signup-Inputfield"
                      }`}
                    />
                  </>
                )
              :
              (
                <>
                {/* <Typography.Title
                      level={5}
                      className={`${
                        validationField.email && "Error-FieldName"
                      }`}
                    >
                      Email
                    </Typography.Title>
                    <Input
                      placeholder="Email"
                      name="email"
                      autoComplete="off"
                      value={formData.email}
                      onChange={handleChange}
                      className={`${
                        validationField.email
                          ? "errorSignup-Inputfield"
                          : "Signup-Inputfield"
                      }`}
                    /> */}
                    <Typography.Title
                      level={5}
                      className={`${
                        validationField.username && "Error-FieldName"
                      }`}
                    >
                      {/* Email */}
                      User Name
                    </Typography.Title>
                    <Input
                      placeholder="User Name"
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
                </>
              )}
                
                <Typography.Title level={5}
                className={`${
                  validationField.password && "Error-FieldName"
                }`}>Password</Typography.Title>
                <Input.Password
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
                  style={{gap: 0}}
                />
                {props?.checkingLoginOrSignup === "Signup" &&
                <>
                <Typography.Title level={5}
                className={`${
                  validationField.confirmpassword && "Error-FieldName"
                }`}>Confirm Password</Typography.Title>
                <Input.Password
                  placeholder="confirmPassword"
                  type="password"
                  name="confirmpassword"
                  value={formData.confirmpassword}
                  autocomplete="new-password"
                  onChange={handleChange}
                  onBlur={handleBlurOnConfirmPassword}
                  className={`${
                    validationField.confirmpassword
                      ? "errorSignup-Inputfield"
                      : "Signup-Inputfield"
                  }`}
                  style={{gap: 0}}
                />
                </>
                }
                {/* {props?.checkingLoginOrSignup !== "Signup" && (
                  <Typography.Title
                    level={5}
                    style={{ float: "right", cursor: "pointer" }}
                  >
                    Forget Password?
                  </Typography.Title>
                )} */}
                {validationField.password && <div class="password-error">
                Password must be at least 5 characters long.
              </div>}
              </div>
              <div class="text-xs text-text-neutral font-brittiSans">
                
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
                    : "Sign Up"}
                    
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
