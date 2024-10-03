import React, { useState } from "react";
import "../../Styles/Content.css";
import { Button } from "@mui/material";
import { Dropdown, Space, Drawer } from "antd";
import { MdExpandLess, MdExpandMore, MdFavoriteBorder } from "react-icons/md";
import { BestSeller, Bottoms, Dresses, Tops, Trending } from "../HeaderMenuItems/HeaderMenuItems";
import { RiMenu2Fill } from "react-icons/ri";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import {
  ListItemText,
} from "@mui/material";
import { Collapse } from "@mui/material";
import { CiBookmark } from "react-icons/ci";
import { FaRegCircleUser } from "react-icons/fa6";
import { MdOutlineShoppingBag } from "react-icons/md";


function ContentHeader() {
  
  /** drawer work */
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
    setOpenTrending(false);
    setOpenTop(false);
    setOpenBottom(false);
  };

  //
  const [openTrending, setOpenTrending] = useState(false);
  const [openTop, setOpenTop] = useState(false);
  const [openBottom, setOpenBottom] = useState(false);

  // Handle click for top category submenu
  const handleTrendingClick = () => {
    setOpenTrending(!openTrending);
  };

  // Handle click for Tops category submenu
  const handleTopClick = () => {
    setOpenTop(!openTop);
  };

  // Handle click for bottom category submenu
  const handleBottomClick = () => {
    setOpenBottom(!openBottom);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        <div className="menu-item">
          <a href="/" className="item">
            <CiBookmark className="icons" />
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
        </div>
      </List>
      <List>
        <div>
          <h1 className="history-heading">CATEGORIES</h1>
        </div>
        <div className="menu-item">
          <div className="item" onClick={handleTrendingClick}>
            New & Trending {openTrending ? <MdExpandLess /> : <MdExpandMore />}
          </div>
        <Collapse in={openTrending} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button className="item">
              <ListItemText primary="Gowns" />
            </ListItem>
            <ListItem button className="submenu-item">
              <ListItemText primary="Wrap dresses" />
            </ListItem>
            <ListItem button className="submenu-item">
              <ListItemText primary="Halter Tops" />
            </ListItem>
            <ListItem button className="submenu-item">
              <ListItemText primary="Summer dresses" />
            </ListItem>
            <ListItem button className="submenu-item">
              <ListItemText primary="Hoodies" />
            </ListItem>
            <ListItem button className="submenu-item">
              <ListItemText primary="Shirts Jackets" />
            </ListItem>
            <ListItem button className="submenu-item">
              <ListItemText primary="Rompers" />
            </ListItem>
          </List>
        </Collapse>
        </div>
        <div className="menu-item">
          <div className="item" onClick={handleTopClick}>
            Tops {openTop ? <MdExpandLess /> : <MdExpandMore />}
          </div>
        </div>
        <Collapse in={openTop} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button className="submenu-item">
              <ListItemText primary="Boat NeckTops" />
            </ListItem>
            <ListItem button className="submenu-item">
              <ListItemText primary="Turtleneck" />
            </ListItem>
            <ListItem button className="submenu-item">
              <ListItemText primary="Off The Shoulder" />
            </ListItem>
            <ListItem button className="submenu-item">
              <ListItemText primary="Cropped" />
            </ListItem>
          </List>
        </Collapse>
        <div className="menu-item">
          <div className="item" onClick={handleBottomClick}>
            Bottom {openBottom ? <MdExpandLess /> : <MdExpandMore />}
          </div>
        </div>
        <Collapse in={openBottom} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button className="submenu-item">
              <ListItemText primary="Denim" />
            </ListItem>
            <ListItem button className="submenu-item">
              <ListItemText primary="High Waisted Pants" />
            </ListItem>
          </List>
        </Collapse>
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

  return (
    <>
    
    {/*  drawer work*/}
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer> 
      
    {/*  drawer work*/}

    <div className="content-mobile">
      <div className="content-mobile-header">
      <RiMenu2Fill onClick={toggleDrawer(true)} style={{width:"30px", height:"30px"}} />
          <h2>𝑺𝒎𝒂𝒓𝒕𝑾𝒂𝒓𝒅𝒓𝒐𝒃𝒆</h2>
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
                <FaRegCircleUser style={{ width: "30px", height: "30px" }} />
                </Space>
              </a>
            </Dropdown>
      </div>
    </div>
    <div className="content-header">
    <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
      <Space direction="vertical">
        <Space wrap>
          <Dropdown
            className="header-buttons"
            menu={{
              items: Trending,
            }}
            placement="bottomLeft"
          >
            <Button>News & Trending</Button>
          </Dropdown>
        </Space>
      </Space>
      <Space direction="vertical">
        <Space wrap>
          <Dropdown
            className="header-buttons"
            menu={{
              items: BestSeller,
            }}
            placement="bottomLeft"
          >
            <Button>Best Sellers</Button>
          </Dropdown>
        </Space>
      </Space>
      <Space direction="vertical">
        <Space wrap>
          <Dropdown
            className="header-buttons"
            menu={{
              items: Tops,
            }}
            placement="bottomLeft"
          >
            <Button>Tops</Button>
          </Dropdown>
        </Space>
      </Space>
      <Space direction="vertical">
        <Space wrap>
          <Dropdown
            className="header-buttons"
            menu={{
              items: Bottoms,
            }}
            placement="bottomLeft"
          >
            <Button>Bottoms</Button>
          </Dropdown>
        </Space>
      </Space>
      <Space direction="vertical">
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
      </Space>
      </div>
      <div style={{ marginLeft: 'auto' }}>
      <Button className="Cart-button"><MdOutlineShoppingBag  style={{width:"30px", height:"30px", color:"#2D261A"}}/></Button>
    </div>
    </div>
    </>
  );
}

export default ContentHeader;
