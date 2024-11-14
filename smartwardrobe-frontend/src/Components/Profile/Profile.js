import { Button, Modal } from "antd";
import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { FcGoogle } from "react-icons/fc";
import { Flex, Input, Typography } from "antd";
import "../../Styles/SignUp.css";
import apiCall from "../GenericApiCallFunctions/GenericApiCallFunctions";
import { Backdrop, CircularProgress } from "@mui/material";
import { json, useNavigate } from "react-router-dom";
import { showToastError, showToastSuccess } from "../GenericToasters/GenericToasters";
import { setTokenToLocalStorage } from "../GenericCode/GenericCode";
import "../../Styles/Profile.css";

function Profile(props) {
  let token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(true);
  const [openLoader, setOpenLoader] = useState(false);
  const [formDataUpdate, setFormDataUpdate] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [formData, setFormData] = useState({
    // username: "",
    firstname: "",
    lastname: "",
    username: "",
  });

  const [validationField, setValidationField] = useState({
    // username: false,
    firstname: false,
    lastname: false,
    username: false,
  });

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
      setFormDataUpdate(true);
    }
  };

  const handleValidations = () => {
    debugger;
    let showerror = false;
    if (formData?.firstname?.trim() === "") {
      setValidationField((prev) => ({
        ...prev,
        firstname: true,
      }));
      showerror = true;
    }
    if (formData?.lastname?.trim() === "") {
      setValidationField((prev) => ({
        ...prev,
        lastname: true,
      }));
      showerror = true;
    }
    // if (formData.email.trim() === "" || !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(formData?.email)) {
    if (formData?.username?.trim() === "") {
      setValidationField((prev) => ({
        ...prev,
        username: true,
      }));
      showerror = true;
    }
    if (showerror) {
      showerror = false;
      return true;
    }
  };

  const handleProfileUpdate = async () => {
    debugger;

    const valdiations = handleValidations();
    if (valdiations || formDataUpdate === false) {
      return;
    }
    const data = {
        firstname: formData?.firstname,
        lastname: formData?.lastname,
        email: formData?.username,
        dob: formData?.dob,
    }
    setOpenLoader(true);
    const response = await apiCall(
      "PATCH",
      "https://smartwardrobe-backend.azurewebsites.net/users/update",
      data,
      token?.token
    );
    debugger;
    setOpenLoader(false);
    if (response?.statusCode?.text === "Success") {
        handleloginOrSignupChange();
      showToastSuccess(response?.message);
      handleCancel();
      const data = response?.data;
      setTimeout(() => {
        navigate("/", { state: { data } });
      }, 1000);
    }
  };

  const handleloginOrSignupChange = (from) => {
    setFormData({
      username: "",
      firstname: "",
      lastname: "",
    });
    setValidationField({
      username: false,
      firstname: false,
      lastname: false,
    });
  };

  const getProfileData = async () => {
    debugger;
    setOpenLoader(true);
    const response = await apiCall(
      "GET",
      "https://smartwardrobe-backend.azurewebsites.net/users/get-my-profile",
      null,
      token?.token
    );
    setOpenLoader(false);
    if (response?.statusCode?.text === "Success") {
      setFormData(response?.data);
      setProfilePic(response?.data?.profilePic);
    }
  };

  useEffect(() => {
    getProfileData();
  }, []);

  const handleProfilePicChange = async (event) => {
    debugger
    const file = event.target.files[0];
    if (file) {
        const formData = new FormData();
        if (file) {
            formData.append("file", file);
        }
        try {
            setOpenLoader(true);
            const response = await fetch(
              `https://smartwardrobe-backend.azurewebsites.net/users/upload-profile-picture`,
              {
                method: "POST",
                headers: {
                  accept: "*/*",
                  Authorization: `Bearer ${token?.token}`,
                },
                body: formData,
              }
            );
            setOpenLoader(false);
            if (!response.ok) {
              const errorData = await response.json();
              showToastError(errorData?.message || response.statusText);
            }else{
                setProfilePic(URL.createObjectURL(file));
            }
          } catch (error) {
            console.error("There was an error uploading the image:", error);
          }
    }
};

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
            {props?.checkingLoginOrSignup === "Signup" ? (
              <h1>Create an Account</h1>
            ) : (
              <h1>Update Profile</h1>
            )}
          </div>
          <div className="Signup-form-section">
            <div className="inputfields-section">
              <div className="Signup-Inputs">
              <div className="user-profile-main">
                <div className="user-profile-div">
                  <label htmlFor="profilePicInput" className="profile-label">
                    <img
                      src={
                        profilePic
                          ? profilePic
                          : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpCKq1XnPYYDaUIlwlsvmLPZ-9-rdK28RToA&s"
                      }
                      alt="profile"
                      className="user-profile"
                    />
                    <div className="hover-overlay">Change Profile Image</div>
                  </label>
                  <input
                    type="file"
                    id="profilePicInput"
                    style={{ display: "none" }}
                    onChange={handleProfilePicChange} // Replace with your function to handle image updates
                  />
                </div>
                </div>

                <>
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
                  <Typography.Title
                    level={5}
                    className={`${
                      validationField.lastname && "Error-FieldName"
                    }`}
                  >
                    Last Name
                  </Typography.Title>
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

                <>
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

              </div>
              <div class="text-xs text-text-neutral font-brittiSans">
                &nbsp;
              </div>
              <div class="text-xs text-text-neutral font-brittiSans">
                &nbsp;
              </div>
              <button className="Signup-button" onClick={handleProfileUpdate}>
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
export default Profile;
