import React, { Children, useState } from "react";
import "../../Styles/header.css";
import {
  Badge,
  Box,
  Drawer,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { ListItemText } from "@mui/material";
import { Collapse } from "@mui/material";
import { CiBookmark } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import {
  MdExpandLess,
  MdExpandMore,
  MdFavoriteBorder,
  MdOutlineShoppingBag,
} from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import MenuIcon from "@mui/icons-material/Menu";
import { Dropdown } from "antd";
import { GenericDropdownMenu } from "../GenericCode/GenericCode";
import SignupModal from "../Signup/Signup";
import { useLocation, useNavigate } from "react-router-dom";

function Headermenu() {
  {
    /*  Use State*/
  }
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openTrending, setOpenTrending] = useState(false);
  const [openTop, setOpenTop] = useState(false);
  const [openFootwear, setOpenFootwear] = useState(false);
  const [openMenFootwear, setOpenMenFootwear] = useState(false);
  const [openWomenenFootwear, setOpenWomenFootwear] = useState(false);
  const [openAccessories, setOpenAccessories] = useState(false);
  const [OpenLoginModal, setOpenLoginModal] = useState(false);
  const [checkingLoginOrSignup, setCheckingLoginOrSignup] = useState("");
  const [searchValue, setSearchValue] = useState("");
  {
    /*  Use State*/
  }

  {
    /*  drawer work*/
  }

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
    setOpenTrending(false);
    setOpenTop(false);
    setOpenFootwear(false);
    setOpenMenFootwear(false);
    setOpenWomenFootwear(false);
    setOpenAccessories(false);
  };

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
    setOpenWomenFootwear(!openWomenenFootwear);
  };

  const handlesetAccessories = () => {
    setOpenAccessories(!openAccessories);
  };

  const DrawerList = (
    <Box sx={{ width: 300 }} className="mobile-menu-main" role="presentation" onClick={toggleDrawer(false)}>
      <List>
        <div style={{display:"flex", justifyContent:"flex-end", marginBottom:"10px"}}>
        <IoMdClose />
        </div>
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
              <ListItem
                button
                className="item"
                data-hidden-text="Dresses Extra Info"
              >
                <ListItemText primary="Dresses" />
              </ListItem>
              <ListItem
                button
                className="submenu-item"
                onClick={() => console.log("Tops selected")}
              >
                <ListItemText primary="Tops" />
              </ListItem>
              <ListItem
                button
                className="submenu-item"
                onClick={() => console.log("Bottom selected")}
              >
                <ListItemText primary="Bottom" />
              </ListItem>
              <ListItem
                button
                className="submenu-item"
                onClick={() => console.log("Skirts selected")}
              >
                <ListItemText primary="Skirts" />
              </ListItem>
              <ListItem
                button
                className="submenu-item"
                onClick={() => console.log("Pants selected")}
              >
                <ListItemText primary="Pants " />
              </ListItem>
              <ListItem
                button
                className="submenu-item"
                onClick={() => console.log("Trousers selected")}
              >
                <ListItemText primary="Trousers" />
              </ListItem>
              <ListItem
                button
                className="submenu-item"
                onClick={() => console.log("Outerwear selected")}
              >
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
            <ListItem
              button
              className="submenu-item footwear-submenu"
              onClick={handleMenFootwear}
            >
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
            <ListItem
              button
              className="submenu-item footwear-submenu"
              onClick={handleWomenFootwear}
            >
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
  {
    /*  drawer work*/
  }

  /*  login work*/
  const items = [
    {
      key: "1",
      label: "User Name",
    },
    {
      key: "2",
      label: "Logout",
    },
  ];
  /*  login work*/

  /*  header dropdown menu lists work*/
  const menuData = [
    {
      label: "Women",
      key: "Women",
      children: [
        { label: "Dress", key: "Women Dress" },
        { label: "Tops", key: "Women Tops" },
        { label: "Bottoms", key: "Women Bottoms" },
        { label: "Skirts", key: "Women Skirts" },
        { label: "Pants", key: "Women Pants" },
        { label: "Trousers", key: "Women Trousers" },
        { label: "Outwear", key: "Women Outwear" },
      ],
    },
    {
      label: "Men",
      key: "Men",
      children: [
        { label: "T-Shirts", key: "Men T-Shirts" },
        { label: "Shirts", key: "Men Shirts" },
        { label: "Jeans", key: "Men Jeans" },
        { label: "Chinos", key: "Men Chinos" },
        { label: "Trousers", key: "Men Trousers" },
        { label: "Cargo", key: "Men Cargo" },
        { label: "Shorts", key: "Men Shorts" },
        { label: "Suits & Blazers", key: "Men Suits & Blazers" },
      ],
    },
    {
      label: "Footwear",
      key: "Footwear",
      children: [
        // Define children for the Footwear category
        {
          label: "Men Footwear",
          key: "Men Footwear submenu",
          children: [
            { label: "Casual Shoes", key: "Men Casual Shoes" },
            { label: "Formal Shoes", key: "Men Formal Shoes" },
            { label: "Sneakers", key: "Men Sneakers" },
            { label: "Boots", key: "Men Boots" },
          ],
        },
        {
          label: "Women Footwear",
          key: "Women Footwear submenu",
          children: [
            { label: "Heals", key: "Men Heals" },
            { label: "Flats", key: "Men Flats" },
            { label: "Sneakers", key: "Men Sneakers" },
            { label: "Boots", key: "Men Boots" },
          ],
        },
      ],
    },
    {
      label: "Accessories",
      key: "Accessories",
      children: [
        // Define children for the Footwear category
        {
          label: "Men Accessories",
          key: "Men Accessories submenu",
          children: [
            { label: "Bags", key: "Men Bags" },
            { label: "Belts", key: "Men Belts" },
            { label: "Wallets", key: "Men Wallets" },
            { label: "Sunglasses", key: "Men Sunglasses" },
            { label: "Watches", key: "Men Watches" },
            { label: "Caps", key: "Men Caps" },
          ],
        },
        {
          label: "Women Footwear",
          key: "Women Accessories submenu",
          children: [
            { label: "Bags", key: "Women Bags" },
            { label: "Wallets", key: "Women Wallets" },
            { label: "Sunglasses", key: "Women Sunglasses" },
            { label: "Watches", key: "Women Watches" },
            { label: "Rings", key: "Women Rings" },
            { label: "Caps", key: "Women Caps" },
          ],
        },
      ],
    },
  ];
  /*  header dropdown menu lists work*/

  /*  user dropdown work*/

  const userDropdown = (e) => {
    debugger;
    console.log(e);
    if (e.key === "2") {
      console.log("User Name Clicked");
    } else {
      setCheckingLoginOrSignup("Login");
      setOpenLoginModal(true);
    }
  };

  /*  user dropdown work*/

  /*  login work*/

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

  /*  login work*/

  /*  search work*/

  const onChangeSearchValue = (e) => {
    debugger;
    setSearchValue(e.target.value);
  };

  const handleSearch = () => {
    debugger;
    if (searchValue.trim() !== "") {
      navigate("/products", { state: { searchValue } });
    }
  };

  /*  search work*/

  /** handle dropdown click */

  const handleDropdownClick = (value) => {
    debugger
    console.log("Selected value:", value);
  };

  /** handle dropdown click */

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

      <div className="header-main">
        <div className="header-conatiner page-width">
          <div className={location?.pathname === "/products" ? "search-div-laptop-productspage search-input-above-900px" : "search-div-laptop search-input-above-900px"} >
            {location?.pathname === "/products" ? (
              <></>
            ) : (
              <FormControl sx={{ m: 1 }} variant="outlined">
                <InputLabel
                  sx={{
                    color: "white",
                    "&.Mui-focused": {
                      color: "white",
                      fontSize: "18px",
                    },
                  }}
                  htmlFor="outlined-adornment-password"
                >
                  Search
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={"text"}
                  style={{ color: "white" }}
                  placeholder="What do you want?"
                  value={searchValue}
                  onChange={onChangeSearchValue}
                  autoComplete="off"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleSearch}
                        edge="end"
                      >
                        <SearchIcon style={{ color: "white" }} />
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                  sx={{
                    "& label": {
                      color: "white",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "white",
                      borderWidth: 2,
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "white",
                      borderWidth: 2,
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "white",
                      borderWidth: 2,
                    },
                    // color: 'white',
                  }}
                />
              </FormControl>
            )}
            <a href="/" className="anchor-tag">
              <h1 className="header-logo">SMARTWARDROBE</h1>
            </a>
            <div className="header-icons">
            <Badge badgeContent={2} color="error"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}>
              <FavoriteBorderIcon sx={{ color: "white", fontSize: "30px" }} />
              </Badge>
              {/* this is for logout*/}
              {/* <Dropdown 
                menu={{
                  items,
                  onClick: userDropdown,
                }}
                placement="bottom"
              >
                <PersonOutlineIcon sx={{ color: "white", fontSize: "30px" }} />
              </Dropdown> */}
              {/* this is for logout*/}
              <PersonOutlineIcon
                onClick={userDropdown}
                sx={{ color: "white", fontSize: "30px" }}
              />
              {/* will use later for login signup form open only*/}
              <Badge badgeContent={2} color="error"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}>
              <ShoppingBagOutlinedIcon
                sx={{ color: "white", fontSize: "30px" }}
              />
              </Badge>
            </div>
          </div>
          <div className="search-div-mobile search-input-below-900px">
            <MenuIcon
              onClick={toggleDrawer(true)}
              sx={{ color: "white", fontSize: "30px" }}
            />
            <a href="/" className="anchor-tag">
            <h1 className="header-logo">SMARTWARDROBE</h1>
            </a>
            <div className="header-icons">
            <Badge badgeContent={2} color="error"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}>
              <FavoriteBorderIcon sx={{ color: "white", fontSize: "30px" }} />
              </Badge>
              <Dropdown
                className="profile-icon"
                menu={{
                  items,
                  onClick: userDropdown,
                }}
                placement="bottom"
              >
                <PersonOutlineIcon sx={{ color: "white", fontSize: "30px" }} />
              </Dropdown>
              <Badge badgeContent={2} color="error"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}>
              <ShoppingBagOutlinedIcon
                sx={{ color: "white", fontSize: "30px" }}
              />
              </Badge>
            </div>
          </div>
          {location?.pathname === "/products" ? (
            <></>
          ) : (
            <div className="mobile-search-input search-input-below-900px">
              <FormControl sx={{ m: 1 }} variant="outlined">
                <InputLabel
                  sx={{
                    color: "white",
                    "&.Mui-focused": {
                      color: "white",
                      fontSize: "18px",
                    },
                  }}
                  htmlFor="outlined-adornment-password"
                >
                  Search
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={"text"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        //   onClick={handleClickShowPassword}
                        edge="end"
                      >
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                  sx={{
                    "& label": {
                      color: "white",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "white",
                      borderWidth: 5,
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "white",
                      borderWidth: 5,
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "white",
                      borderWidth: 5,
                    },
                    // color: 'white',
                  }}
                />
              </FormControl>
            </div>
          )}
          {/* Header Dropdowns */}
          <div className="search-input-above-900px">
            <GenericDropdownMenu menuData={menuData} handleChange={handleDropdownClick} />
          </div>
          {/* Header Dropdowns */}
        </div>
      </div>
    </>
  );
}

export default Headermenu;
