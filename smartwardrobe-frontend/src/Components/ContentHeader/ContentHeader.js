import React, { useState } from "react";
import "../../Styles/Content.css";
import { Button } from "@mui/material";
import { Dropdown, Space, Drawer } from "antd";
import { MdExpandLess, MdExpandMore, MdFavoriteBorder } from "react-icons/md";
import {
  Men,
  Accessories,
  Footwear,
  Women,
} from "../HeaderMenuItems/HeaderMenuItems";
import { RiMenu2Fill } from "react-icons/ri";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { ListItemText } from "@mui/material";
import { Collapse } from "@mui/material";
import { CiBookmark } from "react-icons/ci";
import { FaRegCircleUser } from "react-icons/fa6";
import { MdOutlineShoppingBag } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { DownOutlined } from "@ant-design/icons";
import SignupModal from "../Signup/Signup";

function ContentHeader() {
  /** drawer work */
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(true);
  const [checkingLoginOrSignup, setCheckingLoginOrSignup] = useState("");
  const [OpenLoginModal, setOpenLoginModal] = useState(false);
  const [openTrending, setOpenTrending] = useState(false);
  const [openTop, setOpenTop] = useState(false);
  const [openFootwear, setOpenFootwear] = useState(false);
  const [openMenFootwear, setOpenMenFootwear] = useState(false);
  const [openWomenenFootwear, setOpenWomenFootwear] = useState(false);
  const [openAccessories, setOpenAccessories] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
    setOpenTrending(false);
    setOpenTop(false);
    setOpenFootwear(false);
    setOpenMenFootwear(false);
    setOpenWomenFootwear(false);
    setOpenAccessories(false);
  };

  //

  // Handle click for top category submenu
  const handleTrendingClick = () => {
    setOpenTrending(!openTrending);
  };

  // Handle click for Tops category submenu
  const handleTopClick = () => {
    setOpenTop(!openTop);
  };

  const handleFootwear = () => {
    setOpenFootwear(!openFootwear);
  };
  const handleMenFootwear = () => {
    setOpenMenFootwear(!openMenFootwear);
  };

  const handleWomenFootwear = () => {
    setOpenWomenFootwear(!openMenFootwear);
  };

  const handlesetAccessories = () => {
    setOpenAccessories(!openMenFootwear);
  };

  const handleSelect = (e) => {
    // console.log(e.target.innerText);
    // console.log(e.currentTarget.getAttribute('data-hidden-text'))
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        <div className="menu-item">
          <a href="/" className="item">
            <IoSearch className="icons" />
            Home
          </a>
          <a href="#" className="item">
            <CiBookmark className="icons" />
            Collections
          </a>
          <a href="#" className="item">
            <MdFavoriteBorder className="icons" />
            Favorites
          </a>
          <a href="#" className="item">
            <MdOutlineShoppingBag className="icons" />
            Cart
          </a>
        </div>
      </List>
      <List>
        <div>
          <h1 className="history-heading">CATEGORIES</h1>
        </div>
        <div className="menu-item">
          <div className="item" onClick={handleTrendingClick}>
            Women {openTrending ? <MdExpandLess /> : <MdExpandMore />}
          </div>
          <Collapse in={openTrending} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem button className="item" data-hidden-text="Dresses Extra Info" onClick={handleSelect}>
            <ListItemText primary="Dresses" />
          </ListItem>
          <ListItem button className="submenu-item" onClick={() => console.log('Tops selected')}>
            <ListItemText primary="Tops" />
          </ListItem>
          <ListItem button className="submenu-item" onClick={() => console.log('Bottom selected')}>
            <ListItemText primary="Bottom" />
          </ListItem>
          <ListItem button className="submenu-item" onClick={() => console.log('Skirts selected')}>
            <ListItemText primary="Skirts" />
          </ListItem>
          <ListItem button className="submenu-item" onClick={() => console.log('Pants & Trousers selected')}>
            <ListItemText primary="Pants & Trousers" />
          </ListItem>
          <ListItem button className="submenu-item" onClick={() => console.log('Outerwear selected')}>
            <ListItemText primary="Outerwear" />
          </ListItem>
        </List>
      </Collapse>
        </div>
        <div className="menu-item">
          <div className="item" onClick={handleTopClick}>
            Men {openTop ? <MdExpandLess /> : <MdExpandMore />}
          </div>
        </div>
        <Collapse in={openTop} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button className="submenu-item">
              <ListItemText primary="T-Shirts" />
            </ListItem>
            <ListItem button className="submenu-item">
              <ListItemText primary="Shirts" />
            </ListItem>
            <ListItem button className="submenu-item">
              <ListItemText primary="Pants" />
            </ListItem>
            <ListItem button className="submenu-item">
              <ListItemText primary="Trousers & Cargo" />
            </ListItem>
            <ListItem button className="submenu-item">
              <ListItemText primary="Shorts" />
            </ListItem>
            <ListItem button className="submenu-item">
              <ListItemText primary="Outwear" />
            </ListItem>
            <ListItem button className="submenu-item">
              <ListItemText primary="Suits & Blazers" />
            </ListItem>
          </List>
        </Collapse>
        <div className="menu-item">
          <div className="item" onClick={handleFootwear}>
            Footwear {openFootwear ? <MdExpandLess /> : <MdExpandMore />}
          </div>
        </div>
        <Collapse in={openFootwear} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {/* Men Category */}
            <ListItem button className="submenu-item footwear-submenu" onClick={handleMenFootwear}>
              <ListItemText primary="Men" />
              {openMenFootwear ? <MdExpandLess /> : <MdExpandMore />}
            </ListItem>
            <Collapse in={openMenFootwear} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button className="submenu-item">
                  <ListItemText primary="Casual Shoes" />
                </ListItem>
                <ListItem button className="submenu-item">
                  <ListItemText primary="Formal Shoes" />
                </ListItem>
                <ListItem button className="submenu-item">
                  <ListItemText primary="Sneakers" />
                </ListItem>
                <ListItem button className="submenu-item">
                  <ListItemText primary="Boots" />
                </ListItem>
              </List>
            </Collapse>

            {/* Women Category */}
            <ListItem button className="submenu-item footwear-submenu" onClick={handleWomenFootwear}>
              <ListItemText primary="Women" />
              {openWomenenFootwear ? <MdExpandLess /> : <MdExpandMore />}
            </ListItem>
            <Collapse in={openWomenenFootwear} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button className="submenu-item">
                  <ListItemText primary="Heels" />
                </ListItem>
                <ListItem button className="submenu-item">
                  <ListItemText primary="Flats" />
                </ListItem>
                <ListItem button className="submenu-item">
                  <ListItemText primary="Sneakers" />
                </ListItem>
                <ListItem button className="submenu-item">
                  <ListItemText primary="Boots" />
                </ListItem>
              </List>
            </Collapse>
          </List>
        </Collapse>
        <div className="menu-item">
          <div className="item" onClick={handlesetAccessories}>
          Accessories {openAccessories ? <MdExpandLess /> : <MdExpandMore />}
          </div>
          <Collapse in={openAccessories} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button className="item">
                <ListItemText primary="Bags" />
              </ListItem>
              <ListItem button className="submenu-item">
                <ListItemText primary="Jewelry" />
              </ListItem>
              <ListItem button className="submenu-item">
                <ListItemText primary="Belts & Wallets" />
              </ListItem>
              <ListItem button className="submenu-item">
                <ListItemText primary="Sunglasses" />
              </ListItem>
              <ListItem button className="submenu-item">
                <ListItemText primary="Watches" />
              </ListItem>
              <ListItem button className="submenu-item">
                <ListItemText primary="Hats & Caps" />
              </ListItem>
            </List>
          </Collapse>
        </div>
      </List>
    </Box>
  );

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

  const OpenLoginForm = (e) => {
    setCheckingLoginOrSignup(e);
    setOpenLoginModal(true);
  };

  const CloseLoginForm = () => {
    setCheckingLoginOrSignup("");
    setOpenLoginModal(false);
  };

  const accountCreate = (e) => {
    if (e === "Signup") {
      setCheckingLoginOrSignup("login");
    } else {
      setCheckingLoginOrSignup("Signup");
    }
  };

  return (
    <>
      {/*  drawer work*/}
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>

      {/*  drawer work*/}

      {/* Signup/Login Modal */}

      <SignupModal
        isShowModel={OpenLoginModal}
        closeModal={CloseLoginForm}
        checkingLoginOrSignup={checkingLoginOrSignup}
        accountCreate={accountCreate}
      />
      {/*  Signup/Login Modal */}

      <div className="content-mobile">
        <div className="content-mobile-header">
          <RiMenu2Fill
            onClick={toggleDrawer(true)}
            style={{ width: "30px", height: "30px" }}
          />
          <h2>𝑺𝒎𝒂𝒓𝒕𝑾𝒂𝒓𝒅𝒓𝒐𝒃𝒆</h2>
          <Dropdown
            menu={{
              items,
            }}
            trigger={["click"]}
          >
            <a onClick={(e) => e.preventDefault()} className="profile-dropdown">
              <Space>
                <FaRegCircleUser style={{ width: "30px", height: "30px" }} />
              </Space>
            </a>
          </Dropdown>
        </div>
      </div>
      <div className="content-header">
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            paddingLeft: "13%",
          }}
        >
          <Space direction="vertical">
            <Space wrap>
              <Dropdown
                className="header-buttons"
                menu={{
                  items: Women,
                }}
                placement="bottomLeft"
              >
                <Button>Women</Button>
              </Dropdown>
            </Space>
          </Space>
          <Space direction="vertical">
            <Space wrap>
              <Dropdown
                className="header-buttons"
                menu={{
                  items: Men,
                }}
                placement="bottomLeft"
              >
                <Button>Men</Button>
              </Dropdown>
            </Space>
          </Space>
          <Space direction="vertical">
            <Space wrap>
              <Dropdown
                className="header-buttons"
                menu={{
                  items: Footwear,
                }}
                placement="bottomLeft"
              >
                <Button>Footwear</Button>
              </Dropdown>
            </Space>
          </Space>
          <Space direction="vertical">
            <Space wrap>
              <Dropdown
                className="header-buttons"
                menu={{
                  items: Accessories,
                }}
                placement="bottomLeft"
              >
                <Button>Accessories</Button>
              </Dropdown>
            </Space>
          </Space>
          {/* <Space direction="vertical">
        <Space wrap>
          <Dropdown
            className="header-buttons"
            menu={{
              items: Dresses,
            }}
            placement="bottomLeft"
          >
            <Button>Dresses</Button>
          </Dropdown>
        </Space>
      </Space> */}
        </div>
        <div style={{ marginLeft: "auto" }} className="Cart-section">
          <Button className="Cart-button">
            <MdOutlineShoppingBag
              style={{ width: "30px", height: "30px", color: "#2D261A" }}
            />
          </Button>
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
              <Button
                type="text"
                className="signup-buttons"
                onClick={(e) => OpenLoginForm("Login")}
                style={{
                  backgroundColor: "#BDD7DE",
                  color: "white",
                  marginRight: "5px",
                }}
              >
                Log in
              </Button>
              <Button
                color="default"
                variant="solid"
                className="signup-buttons"
                onClick={(e) => OpenLoginForm("Signup")}
                style={{ backgroundColor: "black", color: "white" }}
              >
                Sign up
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ContentHeader;
