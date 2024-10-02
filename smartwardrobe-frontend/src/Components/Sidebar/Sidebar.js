import React, { useState } from "react";
import { CiBookmark } from "react-icons/ci";
import { MdFavoriteBorder } from "react-icons/md";
import "../../Styles/Sidebar.css";
import { Link } from "react-router-dom";
import { Button, Drawer, Dropdown, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { FaRegCircleUser } from "react-icons/fa6";
import SignupModal from "../Signup/Signup";
import logo from "../../Assets/logo.png";

function Sidebar() {
  const [user, setUser] = useState(true);
  const [checkingLoginOrSignup, setCheckingLoginOrSignup] = useState("");
  const [OpenLoginModal, setOpenLoginModal] = useState(false);

  const items = [
    {
      label: "usamanooruddin3@gmail.com",
      key: "1",
    },
    {
      type: "divider",
    },
    {
      label: "Log out",
      key: "2",
    },
  ];

  /** Login button function */

  const OpenLoginForm = (e) => {
    debugger
    setCheckingLoginOrSignup(e);
    setOpenLoginModal(true);
  }

  const CloseLoginForm = () => {
    setCheckingLoginOrSignup("");
    setOpenLoginModal(false);
  }

  const accountCreate =(e) => {
    debugger
    if(e === 'Signup'){
      setCheckingLoginOrSignup("login");
    }else{
      setCheckingLoginOrSignup("Signup");
    }
  }

  /** Login button function */

  return (
    <>

      <SignupModal
      isShowModel={OpenLoginModal} 
      closeModal={CloseLoginForm}
      checkingLoginOrSignup={checkingLoginOrSignup}
      accountCreate={accountCreate}
      />

      <div className="menu">
        <div className="logo">
          <Link to="/" className="logodesign">
            <h2>𝑺𝒎𝒂𝒓𝒕𝑾𝒂𝒓𝒅𝒓𝒐𝒃𝒆</h2>
          </Link>
           {/* <img src={logo} alt="Logo" className="logo-icon"
           style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          /> */}
        </div>

        <div className="menu-item">
          <a href="#" className="item">
            <CiBookmark className="icons" />
            Collections
          </a>
          <a href="#" className="item">
            <MdFavoriteBorder className="icons" />
            Favorites
          </a>
        </div>

        <div className="search-history">
          <b className="history-heading">Search history</b>
          <ul className="history-list">
            <li>
              <span className="history-text">
                Summer Vacationasdsadasdasdsadasdsadsadsasad
              </span>
              <span className="history-time">15 hours</span>
            </li>
            <li>
              <span className="history-text">
                Summer Vacationasdsadasdasdsadasdsadsadsasad
              </span>
              <span className="history-time">15 hours</span>
            </li>
            <li>
              <span className="history-text">
                Summer Vacationasdsadasdasdsadasdsadsadsasad
              </span>
              <span className="history-time">15 hours</span>
            </li>
            <li>
              <span className="history-text">
                Summer Vacationasdsadasdasdsadasdsadsadsasad
              </span>
              <span className="history-time">15 hours</span>
            </li>
            <li>
              <span className="history-text">
                Summer Vacationasdsadasdasdsadasdsadsadsasad
              </span>
              <span className="history-time">15 hours</span>
            </li>
            <li>
              <span className="history-text">
                Summer Vacationasdsadasdasdsadasdsadsadsasad
              </span>
              <span className="history-time">15 hours</span>
            </li>
            <li>
              <span className="history-text">
                Summer Vacationasdsadasdasdsadasdsadsadsasad
              </span>
              <span className="history-time">15 hours</span>
            </li>
            <li>
              <span className="history-text">
                Summer Vacationasdsadasdasdsadasdsadsadsasad
              </span>
              <span className="history-time">15 hours</span>
            </li>
            <li>
              <span className="history-text">
                Summer Vacationasdsadasdasdsadasdsadsadsasad
              </span>
              <span className="history-time">15 hours</span>
            </li>
            <li>
              <span className="history-text">
                Summer Vacationasdsadasdasdsadasdsadsadsasad
              </span>
              <span className="history-time">15 hours</span>
            </li>
            <li>
              <span className="history-text">
                Summer Vacationasdsadasdasdsadasdsadsadsasad
              </span>
              <span className="history-time">15 hours</span>
            </li>
            <li>
              <span className="history-text">
                Summer Vacationasdsadasdasdsadasdsadsadsasad
              </span>
              <span className="history-time">15 hours</span>
            </li>
            <li>
              <span className="history-text">
                Summer Vacationasdsadasdasdsadasdsadsadsasad
              </span>
              <span className="history-time">15 hours</span>
            </li>
            <li>
              <span className="history-text">
                Summer Vacationasdsadasdasdsadasdsadsadsasad
              </span>
              <span className="history-time">15 hours</span>
            </li>
            <li>
              <span className="history-text">
                Summer Vacationasdsadasdasdsadasdsadsadsasad
              </span>
              <span className="history-time">15 hours</span>
            </li>
            <li>
              <span className="history-text">
                Summer Vacationasdsadasdasdsadasdsadsadsasad
              </span>
              <span className="history-time">15 hours</span>
            </li>
            <li>
              <span className="history-text">
                Summer Vacationasdsadasdasdsadasdsadsadsasad
              </span>
              <span className="history-time">15 hours</span>
            </li>
            <li>
              <span className="history-text">
                Summer Vacationasdsadasdasdsadasdsadsadsasad
              </span>
              <span className="history-time">15 hours</span>
            </li>
            <li>
              <span className="history-text">
                Summer Vacationasdsadasdasdsadasdsadsadsasad
              </span>
              <span className="history-time">15 hours</span>
            </li>
            <li>
              <span className="history-text">
                Summer Vacationasdsadasdasdsadasdsadsadsasad
              </span>
              <span className="history-time">15 hours</span>
            </li>
          </ul>
        </div>

        {!user ? (
          <div className="Login-Signup-Btns">
            <FaRegCircleUser style={{ width: "30px", height: "30px" }} />
            <Dropdown
              menu={{
                items,
              }}
              trigger={["click"]}
            >
              <a
                onClick={(e) => e.preventDefault()}
                className="profile-dropdown"
              >
                <Space>
                  Osama
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </div>
        ) : (
          <div className="Login-Signup-Btns">
            <Button type="text" className="signup-buttons" onClick={(e) => OpenLoginForm('Login')} style={{backgroundColor:"#DCEEF2"}}>
              Log in
            </Button>
            <Button color="default" variant="solid" className="signup-buttons" onClick={(e) => OpenLoginForm('Signup')}>
              Sign up
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

export default Sidebar;
