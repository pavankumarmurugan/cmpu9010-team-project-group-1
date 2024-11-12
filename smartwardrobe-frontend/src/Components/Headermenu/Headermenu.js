import React, { Children, useEffect, useState } from "react";
import "../../Styles/header.css";
import {
  Backdrop,
  Badge,
  Box,
  CircularProgress,
  Drawer,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  styled,
  SvgIcon,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
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
import { Button, Carousel, Dropdown } from "antd";
import { GenericDropdownMenu } from "../GenericCode/GenericCode";
import SignupModal from "../Signup/Signup";
import { useLocation, useNavigate } from "react-router-dom";
import ChatComponent from "../ChatComponent/ChatComponent";
import { showToastInfo } from "../GenericToasters/GenericToasters";
import {
  addToCartValueSuccess,
  headerSearchValue,
  headerSearchValueSuccess,
  wishListValueSuccess,
} from "../../redux/slices/HomeDataSlice";
import { useDispatch, useSelector } from "react-redux";
import apiCall from "../GenericApiCallFunctions/GenericApiCallFunctions";
import CartComponent from "../CartComponent/CartComponent";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

const backendUrl = "https://smartwardrobe-backend.azurewebsites.net/";

function Headermenu() {
  console.log("rendered header");
  {
    /*  Use State*/
  }
  let token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [login, setlogin] = useState(false);
  const [openTrending, setOpenTrending] = useState(false);
  const [openTop, setOpenTop] = useState(false);
  const [openFootwear, setOpenFootwear] = useState(false);
  const [openMenFootwear, setOpenMenFootwear] = useState(false);
  const [openWomenenFootwear, setOpenWomenFootwear] = useState(false);
  const [openLoader, setOpenLoader] = useState(false);
  const [openAccessories, setOpenAccessories] = useState(false);
  const [OpenLoginModal, setOpenLoginModal] = useState(false);
  const [checkingLoginOrSignup, setCheckingLoginOrSignup] = useState("");
  const [openChatComponent, setOpenChatComponent] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [countOfLikeProducts, setCountOfLikeProducts] = useState(0);
  const wishListValue = useSelector((state) => state.homeData.wishListValue);
  const cartValue = useSelector((state) => state.homeData.cartValue);
  const [file, setFile] = useState(null);
  {
    /*  Use State*/
  }

  let userId = token?.userId;
  // State for friend and group IDs
const [friendIds, setFriendIds] = useState([]);
const [groupIds, setGroupIds] = useState([]);
const [socket, setSocket] = useState(null);

// Mock API call to get friend IDs and group IDs (replace with actual API call)
const fetchFriendAndGroupIds = async () => {
  // Simulate an API call
  debugger
  const getFriendsList = await apiCall(
    "GET",
    "https://smartwardrobe-backend.azurewebsites.net/friends/get-all-my-friends",
    null,
    token?.token
  );
  if(getFriendsList?.data?.length > 0){
    setFriendIds(getFriendsList.data.map((x) => x.userId));
  }
  console.log(getFriendsList);
  const getGroupsList = await apiCall(
    "GET",
    "https://smartwardrobe-backend.azurewebsites.net/group/get-my-groups",
    null,
    token?.token
  );
  if(getGroupsList?.data?.length > 0){
    setGroupIds(getGroupsList.data.map((x) => x.groupId));
  }
  console.log(getGroupsList);
  console.log(friendIds);
  console.log(groupIds);
};

useEffect(() => {
  // Fetch friend and group IDs when component mounts
  if(token){
    fetchFriendAndGroupIds();
  }
}, []);

useEffect(() => {
  debugger
  if (friendIds.length === 0 && groupIds.length === 0) return; // Only initialize socket if we have IDs

  // Initialize WebSocket connection
  const newSocket = io(backendUrl, {
    withCredentials: true,
    reconnection: true, // enables automatic reconnection
    reconnectionAttempts: Infinity, // retry indefinitely
    reconnectionDelay: 2000, // time before the first retry in milliseconds
    reconnectionDelayMax: 10000, // maximum time delay between retries
    timeout: 20000, // connection timeout before trying to reconnect
  });
  setSocket(newSocket);

  newSocket.on("connect", () => {
    console.log("Connected to WebSocket server with id:", newSocket.id);

    // Dynamically join friend chat rooms
    friendIds.forEach((friendId) => {
      const roomId = `room_${Math.min(userId, friendId)}_${Math.max(
        userId,
        friendId
      )}`;
      newSocket.emit("joinChatRoom", { roomId, userId });
      console.log(`User ${userId} joined friend chat room: ${roomId}`);
    });

    // Dynamically join group chat rooms
    groupIds.forEach((groupId) => {
      newSocket.emit("joinGroupRoom", { groupId, userId });
      console.log(`User ${userId} joined group chat room: group_${groupId}`);
    });
  });

  // Listener for friend messages
  newSocket.on("newMessage", (data) => {
    console.log("New friend message received:", data);
    if(data?.senderId !== userId){
    showToastInfo('New friend message received');
    }
  });

  // Listener for group messages
  newSocket.on("newGroupMessage", (data) => {
    console.log("New group message received:", data);
    if(data?.senderId !== userId){
      showToastInfo('New group message received');

    }
    // Display a notification or update UI with the new group message
  });

  // Handle disconnection
  newSocket.on("disconnect", () => {
    console.log("Disconnected from WebSocket server");
  });

  // Clean up WebSocket connection when the component unmounts
  return () => {
    newSocket.disconnect();
  };
}, [userId, friendIds, groupIds]); // Re-run effect when friendIds or groupIds change


  const contentStyle= {
    margin: 0,
    // height: '30px',
    color: '#fff',
    textAlign: 'center',
    background: '#e8e4e0',
    color: "black",
    fontWeight: "500"
  };

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      color: "black",
      backgroundColor: "white",
    },
  }));

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

  const handleItemClick = (item) => {
    debugger;
    console.log(`${item} selected`);
  };

  const DrawerList = (
    <Box
      sx={{ width: 300 }}
      className="mobile-menu-main"
      role="presentation"
      // onClick={toggleDrawer(false)}
    >
      <List>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "10px",
          }}
        >
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
                onClick={() => handleItemClick("Women Dresses")}
              >
                <ListItemText primary="Dresses" />
              </ListItem>
              <ListItem
                button
                className="submenu-item"
                onClick={() => handleItemClick("Women Tops")}
              >
                <ListItemText primary="Tops" />
              </ListItem>
              <ListItem
                button
                className="submenu-item"
                onClick={() => handleItemClick("Women Bottoms")}
              >
                <ListItemText primary="Bottom" />
              </ListItem>
              <ListItem
                button
                className="submenu-item"
                onClick={() => handleItemClick("Women Skirts")}
              >
                <ListItemText primary="Skirts" />
              </ListItem>
              <ListItem
                button
                className="submenu-item"
                onClick={() => handleItemClick("Women Pants")}
              >
                <ListItemText primary="Pants " />
              </ListItem>
              <ListItem
                button
                className="submenu-item"
                onClick={() => handleItemClick("Women Trousers")}
              >
                <ListItemText primary="Trousers" />
              </ListItem>
              {/* <ListItem
                button
                className="submenu-item"
                onClick={() => handleItemClick("Women Outerwear")}
              >
                <ListItemText primary="Outerwear" />
              </ListItem> */}
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
            <ListItem
              button
              className="submenu-item"
              onClick={() => handleItemClick("Men T-Shirts")}
            >
              <ListItemText primary="T-Shirts" />
            </ListItem>
            <ListItem
              button
              className="submenu-item"
              onClick={() => handleItemClick("Men Shirts")}
            >
              <ListItemText primary="Shirts" />
            </ListItem>
            <ListItem
              button
              className="submenu-item"
              onClick={() => handleItemClick("Men Pants")}
            >
              <ListItemText primary="Pants" />
            </ListItem>
            <ListItem
              button
              className="submenu-item"
              onClick={() => handleItemClick("Men Trousers & Cargo")}
            >
              <ListItemText primary="Trousers & Cargo" />
            </ListItem>
            <ListItem
              button
              className="submenu-item"
              onClick={() => handleItemClick("Men Shorts")}
            >
              <ListItemText primary="Shorts" />
            </ListItem>
            {/* <ListItem button className="submenu-item" onClick={() => handleItemClick("Men Outwear")}>
              <ListItemText primary="Outwear" />
            </ListItem> */}
            <ListItem
              button
              className="submenu-item"
              onClick={() => handleItemClick("Men Suits & Blazers")}
            >
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
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Men Casual Shoes")}
                >
                  <ListItemText primary="Casual Shoes" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Men Formal Shoes")}
                >
                  <ListItemText primary="Formal Shoes" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Men Sneakers")}
                >
                  <ListItemText primary="Sneakers" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Men Boots")}
                >
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
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Women Heels")}
                >
                  <ListItemText primary="Heels" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Women Flats")}
                >
                  <ListItemText primary="Flats" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Women Sneakers")}
                >
                  <ListItemText primary="Sneakers" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Women Boots")}
                >
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
              <ListItem
                button
                className="item"
                onClick={() => handleItemClick("Bags")}
              >
                <ListItemText primary="Bags" />
              </ListItem>
              <ListItem
                button
                className="submenu-item"
                onClick={() => handleItemClick("Jewelery")}
              >
                <ListItemText primary="Jewelry" />
              </ListItem>
              <ListItem
                button
                className="submenu-item"
                onClick={() => handleItemClick("Belts & Wallets")}
              >
                <ListItemText primary="Belts & Wallets" />
              </ListItem>
              <ListItem
                button
                className="submenu-item"
                onClick={() => handleItemClick("Sunglasses")}
              >
                <ListItemText primary="Sunglasses" />
              </ListItem>
              <ListItem
                button
                className="submenu-item"
                onClick={() => handleItemClick("Watches")}
              >
                <ListItemText primary="Watches" />
              </ListItem>
              <ListItem
                button
                className="submenu-item"
                onClick={() => handleItemClick("Hats & Caps")}
              >
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
      label: token?.username,
    },
    {
      key: "2",
      label: "Profile",
    },
    {
      key: "3",
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
    if (e.key === "3") {
      localStorage.removeItem("user");
      navigate("/");
      window.location.reload();
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
    setSearchValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    debugger;
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    debugger;
    if (searchValue.trim() !== "") {
      dispatch(headerSearchValueSuccess({ headerSearchValue: searchValue }));
      navigate("/products");
    }
  };

  /*  search work*/

  /** handle dropdown click */

  const handleDropdownClick = (value) => {
    debugger;
    console.log("Selected value:", value);
  };

  const handleChatComponent = () => {
    if(token !== undefined && token !== null){ /** will uncomment after login signup setup to email */
    setOpenChatComponent(true);
    }else{
      showToastInfo("Please login first to chat with your friends.");
    }
  };
  const CloseChatComponent = () => {
    setOpenChatComponent(!openChatComponent);
    fetchFriendAndGroupIds();
  };

  /** handle dropdown click */

  /** wishlist component  */

  const handleWishListComponent = () => {
    if (!token) {
      showToastInfo("Please login first.");
      return;
    }
    if (wishListValue === 0) {
      showToastInfo("No products in wishlist.");
      return;
    } else {
      navigate("/wishlist");
    }
  };

  /** wishlist component  */

  /** wish list count */

  useEffect(() => {
    if(token?.token){
      getWishListCount();
    }
  }, []);

  const getWishListCount = async () => {
    debugger;
    if(token?.token){

    
    const getLikeProducts = await apiCall(
      "GET",
      "https://smartwardrobe-backend.azurewebsites.net/likes/get-all",
      null,
      token?.token
    );
    // setOpenLoader(false);
    if (getLikeProducts?.data?.length) {
      // setCountOfLikeProducts(getLikeProducts?.data?.length);
      dispatch(
        wishListValueSuccess({ wishListValue: getLikeProducts?.data?.length })
      );
    }

    const getAllCartValues = await apiCall(
      "GET",
      "https://smartwardrobe-backend.azurewebsites.net/cart-item/get-all",
      null,
      token?.token
    );
    setOpenLoader(false);
    if (getAllCartValues?.data?.length) {
      dispatch(
        addToCartValueSuccess({ cartValue: getAllCartValues?.data?.length })
      );
    }}
  };

  /** wish list count */

  /** Cart component */

  const handleCartComponent = () => {
    if (!token) {
      showToastInfo("Please login first.");
      return;
    }
    if (cartValue === 0) {
      showToastInfo("No products in Cart.");
      return;
    } else {
      setOpenCart(true);
    }
  };

  const handleCloseCart = () => {
    setOpenCart(false);
  };

  /** Cart component */

  const imageUpload = async (e) => {
    debugger;
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      // setFormData((prevData) => ({
      //   ...prevData,
      //   imagePreview: URL.createObjectURL(file),
      // }));
    }
    // console.log(formData.image);
  };

  return (
    <>
      {/** loader code */}
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={openLoader}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/** loader code */}

      {/** Cart Component */}

      {openCart && (
        <CartComponent openCart={openCart} close={handleCloseCart} />
      )}

      {/** Cart Component */}

      {/*  drawer work*/}
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>

      {/*  drawer work*/}

      {/*  Chat component */}
      {openChatComponent &&
      <ChatComponent
        isShowModel={openChatComponent}
        closeModal={CloseChatComponent}
      />}

      {/*  Chat component */}

      {/* Signup/Login Modal */}

      <SignupModal
        isShowModel={OpenLoginModal}
        closeModal={CloseLoginForm}
        checkingLoginOrSignup={checkingLoginOrSignup}
        accountCreate={accountCreate}
      />
      {/*  Signup/Login Modal */}

      <Carousel dotPosition="left" dots={false} infinite={false} autoplay={true} autoplaySpeed={1500} style={{maxHeight:"20px"}} >
      <div>
        <h3 style={contentStyle}>Collaborative Chat</h3>
      </div>
      <div>
        <h3 style={contentStyle}>Virtual Try-On</h3>
      </div>
      <div>
        <h3 style={contentStyle}>Customization option</h3>
      </div>
    </Carousel>

      <div className="header-main">
        <div className="header-conatiner page-width">
          <div
            className={
              location?.pathname === "/products"
                ? "search-div-laptop-productspage search-input-above-900px"
                : "search-div-laptop search-input-above-900px"
            }
          >
            {location?.pathname === "/products" ? (
              <></>
            ) : (
              <FormControl sx={{ m: 1 }} variant="outlined">
                <InputLabel
                  sx={{
                    lineHeight: "1rem",
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
                  onKeyDown={handleKeyDown}
                  autoComplete="off"
                  endAdornment={
                    <InputAdornment position="end">
                      {/* <Button
                        component="label"
                        variant="outlined"
                        color="neutral"
                        style={{ border: "none", backgroundColor: "transparent", padding: "0px" }}
                      >
                        <SvgIcon>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            style={{ color: "white" }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                            />
                          </svg>
                        </SvgIcon>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={imageUpload}
                          style={{ display: "none" }}
                        />
                      </Button> */}
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
                    height: 45,
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
              <StyledBadge
                badgeContent={wishListValue}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <FavoriteBorderIcon
                  sx={{ color: "white", fontSize: "30px" }}
                  onClick={handleWishListComponent}
                />
              </StyledBadge>

              {/* will use later for login signup form open only*/}
              <StyledBadge
                badgeContent={cartValue}
                color="error"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
              >
                <ShoppingBagOutlinedIcon
                  sx={{ color: "white", fontSize: "30px" }}
                  onClick={handleCartComponent}
                />
              </StyledBadge>

              <QuestionAnswerOutlinedIcon
                sx={{ color: "white", fontSize: "30px" }}
                onClick={handleChatComponent}
              />
              {/* this is for logout*/}
              {token !== undefined && token !== null ? (
                <Dropdown
                  menu={{
                    items,
                    onClick: userDropdown,
                  }}
                  placement="bottom"
                >
                  <PersonOutlineIcon
                    sx={{ color: "white", fontSize: "30px" }}
                  />
                </Dropdown>
              ) : (
                <>
                  <PersonOutlineIcon
                    onClick={userDropdown}
                    sx={{ color: "white", fontSize: "30px" }}
                  />
                </>
              )}
              {/* this is for logout*/}
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
              {/* <Badge
                badgeContent={2}
                color="error"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
              >
                <FavoriteBorderIcon sx={{ color: "white", fontSize: "30px" }} />
              </Badge> */}
              <QuestionAnswerOutlinedIcon
                sx={{ color: "white", fontSize: "30px", paddingTop: "5px" }}
                onClick={handleChatComponent}
              />

              {token !== undefined && token !== null ? (
                <Dropdown
                  menu={{
                    items,
                    onClick: userDropdown,
                  }}
                  placement="bottom"
                >
                  <PersonOutlineIcon
                    sx={{ color: "white", fontSize: "30px" }}
                  />
                </Dropdown>
              ) : (
                <>
                  <PersonOutlineIcon
                    onClick={userDropdown}
                    sx={{ color: "white", fontSize: "30px" }}
                  />
                </>
              )}
              {/* <Badge
                badgeContent={2}
                color="error"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
              >
                <ShoppingBagOutlinedIcon
                  sx={{ color: "white", fontSize: "30px" }}
                />
              </Badge> */}
            </div>
          </div>
          {location?.pathname === "/products" ? (
            <></>
          ) : (
            <div className="mobile-search-input search-input-below-900px">
              <FormControl sx={{ m: 1 }} variant="outlined">
                <InputLabel
                  sx={{
                    lineHeight: "1rem",
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
                  value={searchValue}
                  onChange={onChangeSearchValue}
                  onKeyDown={handleKeyDown}
                  autoComplete="off"
                  endAdornment={
                    <InputAdornment position="end">
                      <input
                          type="file"
                          accept="image/*"
                          onChange={imageUpload}
                          style={{ display: "none" }}
                        />
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
                    height: 45,
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
            <GenericDropdownMenu
              menuData={menuData}
              handleChange={handleDropdownClick}
            />
          </div>
          {/* Header Dropdowns */}
        </div>
      </div>
    </>
  );
}

export default Headermenu;
