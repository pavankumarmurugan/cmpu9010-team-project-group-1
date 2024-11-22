import React, { Children, useEffect, useRef, useState } from "react";
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
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import { MegaMenu } from "primereact/megamenu";
import { IoMdClose, IoMdStar } from "react-icons/io";
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
  categoryValueSuccess,
  headerSearchValue,
  headerSearchValueSuccess,
  wishListValueSuccess,
} from "../../redux/slices/HomeDataSlice";
import { useDispatch, useSelector } from "react-redux";
import apiCall from "../GenericApiCallFunctions/GenericApiCallFunctions";
import CartComponent from "../CartComponent/CartComponent";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import Profile from "../Profile/Profile";
import { FaSearch } from "react-icons/fa";
import Homelogo2 from "../../Assets/Homelogo2.png";
import Marquee from "react-fast-marquee";
import { GoDotFill } from "react-icons/go";

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
  const [openWomen, setOpenWomen] = useState(false);
  const [openTop, setOpenTop] = useState(false);
  const [openFootwear, setOpenFootwear] = useState(false);
  const [openMenFootwear, setOpenMenFootwear] = useState(false);
  const [openWomenenFootwear, setOpenWomenFootwear] = useState(false);
  const [openLoader, setOpenLoader] = useState(false);
  const [openAccessories, setOpenAccessories] = useState(false);
  const [OpenLoginModal, setOpenLoginModal] = useState(false);
  const [checkingLoginOrSignup, setCheckingLoginOrSignup] = useState("");
  const [openChatComponent, setOpenChatComponent] = useState(false);
  const [searchShow, setSearchShow] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [categoryData, setCategoryData] = useState([]);
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
    debugger;
    const getFriendsList = await apiCall(
      "GET",
      "https://smartwardrobe-backend.azurewebsites.net/friends/get-all-my-friends",
      null,
      token?.token
    );
    if (getFriendsList?.data?.length > 0) {
      setFriendIds(getFriendsList.data.map((x) => x.userId));
    }
    console.log(getFriendsList);
    const getGroupsList = await apiCall(
      "GET",
      "https://smartwardrobe-backend.azurewebsites.net/group/get-my-groups",
      null,
      token?.token
    );
    if (getGroupsList?.data?.length > 0) {
      setGroupIds(getGroupsList.data.map((x) => x.groupId));
    }
    console.log(getGroupsList);
    console.log(friendIds);
    console.log(groupIds);
  };

  useEffect(() => {
    // Fetch friend and group IDs when component mounts
    if (token) {
      fetchFriendAndGroupIds();
    }
  }, []);

  useEffect(() => {
    debugger;
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
      if (data?.senderId !== userId) {
        showToastInfo("Message received");
      }
    });

    // Listener for group messages
    newSocket.on("newGroupMessage", (data) => {
      console.log("New group message received:", data);
      if (data?.senderId !== userId) {
        showToastInfo("New group message received");
      }
      // Display a notification or update UI with the new group message
    });

    newSocket.emit("joinNotificationRoom", { userId });
    console.log(`User ${userId} joined their notification room user_${userId}`);

    // To get notifications

    // Friend request event listeners
    newSocket.on("friendRequestCreated", (data) => {
      console.log("New friend request received:", data);
      // Display a notification or update UI with new friend request
      showToastInfo("Friend request received.");
    });

    newSocket.on("friendRequestUpdated", (data) => {
      console.log("Friend request updated:", data);
      // Display a notification or update UI with friend request update
      showToastInfo(
        `Your friend request status with user ${data.receiverId} is now ${data.status}`
      );
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

  const contentStyle = {
    margin: 0,
    // height: '30px',
    color: "#fff",
    textAlign: "center",
    background: "#e8e4e0",
    color: "black",
    fontWeight: "500",
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
          <a href="/wishlist" className="item">
            <CiBookmark className="icons" />
            Collections
          </a>
          <div
            className="item"
            onClick={() => {
              // Your custom onClick function logic here
              handleCartComponent();
            }}
          >
            <MdOutlineShoppingBag className="icons" />
            Cart
          </div>
        </div>
      </List>
      <List>
        <div>
          <h1 className="history-heading">CATEGORIES</h1>
        </div>

        <Collapse in={openWomen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              className="submenu-item"
              onClick={() => handleItemClick("Men T-Shirts")}
            >
              <ListItemText primary="T-Shirts" />
            </ListItem>
          </List>
        </Collapse>
        <div className="menu-item">
          <div className="item" onClick={handleFootwear}>
            Women {openWomenenFootwear ? <MdExpandLess /> : <MdExpandMore />}
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

  const primeMenu = [
    {
      label: "Women",
      key: "Ladieswear",
      icon: "pi pi-box",
      items: [
        [
          {
            label: "Top",
            key: "Ladieswear Tops submenu",
            items: [
              {
                label: "T-shirt",
                key: "Ladieswear//T-shirt",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Long-sleeve top",
                key: "Ladieswear//Long-sleeve top",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Crop top and skirt",
                key: "Ladieswear//Crop top and skirt",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Tank top",
                key: "Ladieswear//Tank top",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Vest top",
                key: "Ladieswear//Vest top",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Casual top",
                key: "Ladieswear//Casual top",
                command: (e) => handleDropdownClick(e),
              },
            ],
          },
          {
            label: "Bottoms",
            key: "Ladieswear Bottoms submenu",
            items: [
              {
                label: "Outdoor trousers",
                key: "Ladieswear//Outdoor trousers",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Skirt",
                key: "Ladieswear//Skirt",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Shorts",
                key: "Ladieswear//Shorts",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Pyjama bottom",
                key: "Ladieswear//Pyjama bottom",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Swimwear bottom",
                key: "Ladieswear//Swimwear bottom",
                command: (e) => handleDropdownClick(e),
              },
            ],
          },
        ],
        [
          {
            label: "Outwear",
            key: "Ladieswear Outdoor submenu",
            items: [
              {
                label: "Jacket",
                key: "Ladieswear//Jacket",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Waistcoat",
                key: "Ladieswear//Outdoor Waistcoat",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Trousers",
                key: "Ladieswear//Outdoor trousers",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Cardigan",
                key: "Ladieswear//Cardigan",
                command: (e) => handleDropdownClick(e),
              },
            ],
          },
        ],
        [
          {
            label: "Footwear",
            key: "Ladieswear Footwear submenu",
            items: [
              {
                label: "Boots",
                key: "Ladieswear//Boots",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Flat shoes",
                key: "Ladieswear//Flat shoes",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Heels",
                key: "Ladieswear//Heels",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Heeled sandals",
                key: "Ladieswear//Heeled sandals",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Sneakers",
                key: "Ladieswear//Sneakers",
                command: (e) => handleDropdownClick(e),
              },
            ],
          },
        ],
        [
          {
            label: "Accessories",
            key: "Ladieswear Accessories submenu",
            items: [
              {
                label: "Bag",
                key: "Ladieswear//Bag",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Earrings",
                key: "Ladieswear//Earrings",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Ring",
                key: "Ladieswear//Ring",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Bracelet",
                key: "Ladieswear//Bracelet",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Hair clip",
                key: "Ladieswear//Hair clip",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Belt",
                key: "Ladieswear//Belt",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Sunglasses",
                key: "Ladieswear//Sunglasses",
                command: (e) => handleDropdownClick(e),
              },
            ],
          },
        ],
      ],
    },
    {
      label: "Men",
      key: "Menswear",
      icon: "pi pi-box",
      items: [
        [
          {
            label: "Top",
            key: "Menswear Tops submenu",
            items: [
              {
                label: "T-shirt",
                key: "Menswear//T-shirt",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Shirt",
                key: "Menswear//Shirt",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Polo Shirt",
                key: "Menswear//Polo shirt",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Hoodie",
                key: "Menswear//Hoodie",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Sweater",
                key: "Menswear//Sweater",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Vest top",
                key: "Menswear//Vest top",
                command: (e) => handleDropdownClick(e),
              },
            ],
          },
          {
            label: "Bottoms",
            key: "Menswear Bottoms submenu",
            items: [
              {
                label: "Trousers",
                key: "Menswear//Trousers",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Shorts",
                key: "Menswear//Shorts",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Pyjama",
                key: "Menswear//Pyjama bottom",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Swimwear bottom",
                key: "Menswear//Swimwear bottom",
                command: (e) => handleDropdownClick(e),
              },
            ],
          },
        ],
        [
          {
            label: "Outwear",
            key: "Menswear Outdoor submenu",
            items: [
              {
                label: "Jacket",
                key: "Menswear//Jacket",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Waistcoat",
                key: "Menswear//Outdoor Waistcoat",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Blazer",
                key: "Menswear//Blazer",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Cardigan",
                key: "Menswear//Cardigan",
                command: (e) => handleDropdownClick(e),
              },
            ],
          },
          {
            label: "Footwear",
            key: "Menswear Footwear submenu",
            items: [
              {
                label: "Sneakers",
                key: "Menswear//Sneakers",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Boots",
                key: "Menswear//Boots",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Slippers",
                key: "Menswear//Slippers",
                command: (e) => handleDropdownClick(e),
              },
            ],
          },
        ],
        [
          {
            label: "Accessories",
            key: "Menswear Accessories submenu",
            items: [
              {
                label: "Bag",
                key: "Menswear//Bag",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Cross-body bag",
                key: "Menswear//Cross-body bag",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Cap",
                key: "Menswear//Cap",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Sunglasses",
                key: "Menswear//Sunglasses",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Watch",
                key: "Menswear//Watch",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Belt",
                key: "Menswear//Belt",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Wallet",
                key: "Menswear//Wallet",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Gloves",
                key: "Menswear//Gloves",
                command: (e) => handleDropdownClick(e),
              },
            ],
          },
        ],
      ],
    },
    {
      label: "Kids",
      key: "Baby Children",
      icon: "pi pi-box",
      items: [
        [
          {
            label: "Clothing",
            key: "Baby Children Tops submenu",
            items: [
              {
                label: "T-shirt",
                key: "Baby Children//T-shirt",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Shirt",
                key: "Baby Children//Shirt",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Trousers",
                key: "Baby Children//Trousers",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Cardigan",
                key: "Baby Children//Cardigan",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Bodysuit",
                key: "Baby Children//Bodysuit",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Sweater",
                key: "Baby Children//Sweater",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Swimsuit",
                key: "Baby Children//Swimsuit",
                command: (e) => handleDropdownClick(e),
              },
            ],
          },
          {
            label: "Outerwear",
            key: "Baby Children Outerwear submenu",
            items: [
              {
                label: "Jacket",
                key: "Baby Children//Jacket",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Coat",
                key: "Baby Children//Coat",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Outdoor trousers",
                key: "Baby Children//Outdoor trousers",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Jumpsuit",
                key: "Baby Children//Jumpsuit",
                command: (e) => handleDropdownClick(e),
              },
            ],
          },
        ],
        [
          {
            label: "Footwear",
            key: "Baby Children Footwear submenu",
            items: [
              {
                label: "Sneakers",
                key: "Baby Children//Sneakers",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Boots",
                key: "Baby Children//Boots",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Slippers",
                key: "Baby Children//Slippers",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Pre-walkers",
                key: "Baby Children//Pre-walkers",
                command: (e) => handleDropdownClick(e),
              },
            ],
          },
        ],
        [
          {
            label: "Accessories",
            key: "Baby Children Accessories submenu",
            items: [
              {
                label: "Hat",
                key: "Baby Children//Hat",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Cap",
                key: "Baby Children//Cap",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Sunglasses",
                key: "Baby Children//Sunglasses",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Hair ties",
                key: "Baby Children//Hair ties",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Hair clip",
                key: "Baby Children//Hair clip",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Towel",
                key: "Baby Children//Towel",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Toy",
                key: "Baby Children//Toy",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Soft Toys",
                key: "Baby Children//Soft Toys",
                command: (e) => handleDropdownClick(e),
              },
            ],
          },
        ],
      ],
    },
    {
      label: "Sports",
      key: "Sport",
      icon: "pi pi-box",
      items: [
        [
          {
            label: "Clothing",
            key: "Sport Clothing submenu",
            items: [
              {
                label: "T-shirt",
                key: "Sport//T-shirt",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Trousers",
                key: "Sport//Trousers",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Shorts",
                key: "Sport//Shorts",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Socks",
                key: "Sport//Socks",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Swimwear bottom",
                key: "Sport//Swimwear bottom",
                command: (e) => handleDropdownClick(e),
              },
            ],
          },
        ],
        [
          {
            label: "Accessories",
            key: "Sport Accessories submenu",
            items: [
              // { label: "Cap", key: "Sport//Cap" },
              {
                label: "Waterbottle",
                key: "Sport//Waterbottle",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Giftbox",
                key: "Sport//Giftbox",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Gloves",
                key: "Sport//Gloves",
                command: (e) => handleDropdownClick(e),
              },
              {
                label: "Other accessories",
                key: "Sport//Other accessories",
                command: (e) => handleDropdownClick(e),
              },
            ],
          },
        ],
      ],
    },
  ];

  const menuData = [
    {
      label: "Women",
      key: "Ladieswear",
      children: [
        // Define children for the Footwear category
        {
          label: "Dress",
          key: "Ladieswear//Dress",
        },
        {
          label: "Top",
          key: "Ladieswear Tops submenu",
          children: [
            { label: "T-shirt", key: "Ladieswear//T-shirt" },
            { label: "Long-sleeve top", key: "Ladieswear//Long-sleeve top" },
            {
              label: "Crop top and skirt",
              key: "Ladieswear//Crop top and skirt",
            },
            { label: "Tank top", key: "Ladieswear//Tank top" },
            { label: "Vest top", key: "Ladieswear//Vest top" },
            { label: "Casual top", key: "Ladieswear//Casual top" },
          ],
        },
        {
          label: "Bottoms",
          key: "Ladieswear Bottoms submenu",
          children: [
            { label: "Outdoor trousers", key: "Ladieswear//Outdoor trousers" },
            { label: "Skirt", key: "Ladieswear//Skirt" },
            { label: "Shorts", key: "Ladieswear//Shorts" },
            { label: "Pyjama bottom", key: "Ladieswear//Pyjama bottom" },
            { label: "Swimwear bottom", key: "Ladieswear//Swimwear bottom" },
          ],
        },
        {
          label: "Outwear",
          key: "Ladieswear Outdoor submenu",
          children: [
            { label: "Jacket", key: "Ladieswear//Jacket" },
            { label: "Waistcoat", key: "Ladieswear//Outdoor Waistcoat" },
            { label: "Trousers", key: "Ladieswear//Outdoor trousers" },
            { label: "Cardigan", key: "Ladieswear//Cardigan" },
          ],
        },
        {
          label: "Footwear",
          key: "Ladieswear Footwear submenu",
          children: [
            { label: "Boots", key: "Ladieswear//Boots" },
            { label: "Flat shoes", key: "Ladieswear//Flat shoes" },
            { label: "Heels", key: "Ladieswear//Heels" },
            { label: "Heeled sandals", key: "Ladieswear//Heeled sandals" },
            { label: "Sneakers", key: "Ladieswear//Sneakers" },
          ],
        },
        {
          label: "Accessories",
          key: "Ladieswear Accessories submenu",
          children: [
            { label: "Bag", key: "Ladieswear//Bag" },
            { label: "Earrings", key: "Ladieswear//Earrings" },
            { label: "Ring", key: "Ladieswear//Ring" },
            { label: "Bracelet", key: "Ladieswear//Bracelet" },
            { label: "Hair clip", key: "Ladieswear//Hair clip" },
            { label: "Belt", key: "Ladieswear//Belt" },
            { label: "Sunglasses", key: "Ladieswear//Sunglasses" },
          ],
        },
      ],
    },
    {
      label: "Men",
      key: "Menswear",
      children: [
        {
          label: "Top",
          key: "Menswear Tops submenu",
          children: [
            { label: "T-shirt", key: "Menswear//T-shirt" },
            { label: "Shirt", key: "Menswear//Shirt" },
            { label: "Polo Shirt", key: "Menswear//Polo shirt" },
            { label: "Hoodie", key: "Menswear//Hoodie" },
            { label: "Sweater", key: "Menswear//Sweater" },
            { label: "Vest top", key: "Menswear//Vest top" },
          ],
        },
        {
          label: "Bottoms",
          key: "Menswear Bottoms submenu",
          children: [
            { label: "Trousers", key: "Menswear//Trousers" },
            { label: "Shorts", key: "Menswear//Shorts" },
            { label: "Pyjama", key: "Menswear//Pyjama bottom" },
            { label: "Swimwear bottom", key: "Menswear//Swimwear bottom" },
          ],
        },
        {
          label: "Outwear",
          key: "Menswear Outdoor submenu",
          children: [
            { label: "Jacket", key: "Menswear//Jacket" },
            { label: "Waistcoat", key: "Menswear//Outdoor Waistcoat" },
            { label: "Blazer", key: "Menswear//Blazer" },
            { label: "Cardigan", key: "Menswear//Cardigan" },
          ],
        },
        {
          label: "Footwear",
          key: "Menswear Footwear submenu",
          children: [
            { label: "Sneakers", key: "Menswear//Sneakers" },
            { label: "Boots", key: "Menswear//Boots" },
            { label: "Slippers", key: "Menswear//Slippers" },
          ],
        },
        {
          label: "Accessories",
          key: "Menswear Accessories submenu",
          children: [
            { label: "Bag", key: "Menswear//Bag" },
            { label: "Cross-body bag", key: "Menswear//Cross-body bag" },
            { label: "Cap", key: "Menswear//Cap" },
            { label: "Sunglasses", key: "Menswear//Sunglasses" },
            { label: "Watch", key: "Menswear//Watch" },
            { label: "Belt", key: "Menswear//Belt" },
            { label: "Wallet", key: "Menswear//Wallet" },
            { label: "Gloves", key: "Menswear//Gloves" },
          ],
        },
      ],
    },
    {
      label: "Kids",
      key: "Baby Children",
      children: [
        {
          label: "Clothing",
          key: "Baby Children Tops submenu",
          children: [
            { label: "T-shirt", key: "Baby Children//T-shirt" },
            { label: "Shirt", key: "Baby Children//Shirt" },
            { label: "Trousers", key: "Baby Children//Trousers" },
            { label: "Cardigan", key: "Baby Children//Cardigan" },
            { label: "Bodysuit", key: "Baby Children//Bodysuit" },
            { label: "Sweater", key: "Baby Children//Sweater" },
            { label: "Swimsuit", key: "Baby Children//Swimsuit" },
          ],
        },
        {
          label: "Outerwear",
          key: "Baby Children Outerwear submenu",
          children: [
            { label: "Jacket", key: "Baby Children//Jacket" },
            { label: "Coat", key: "Baby Children//Coat" },
            {
              label: "Outdoor trousers",
              key: "Baby Children//Outdoor trousers",
            },
            { label: "Jumpsuit", key: "Baby Children//Jumpsuit" },
          ],
        },
        {
          label: "Footwear",
          key: "Baby Children Footwear submenu",
          children: [
            { label: "Sneakers", key: "Baby Children//Sneakers" },
            { label: "Boots", key: "Baby Children//Boots" },
            { label: "Slippers", key: "Baby Children//Slippers" },
            { label: "Pre-walkers", key: "Baby Children//Pre-walkers" },
          ],
        },
        {
          label: "Accessories",
          key: "Baby Children Accessories submenu",
          children: [
            { label: "Hat", key: "Baby Children//Hat" },
            { label: "Cap", key: "Baby Children//Cap" },
            { label: "Sunglasses", key: "Baby Children//Sunglasses" },
            { label: "Hair ties", key: "Baby Children//Hair ties" },
            { label: "Hair clip", key: "Baby Children//Hair clip" },
            { label: "Towel", key: "Baby Children//Towel" },
            { label: "Toy", key: "Baby Children//Toy" },
            { label: "Soft Toys", key: "Baby Children//Soft Toys" },
          ],
        },
      ],
    },
    {
      label: "Sports",
      key: "Sport",
      children: [
        {
          label: "Clothing",
          key: "Sport Clothing submenu",
          children: [
            { label: "T-shirt", key: "Sport//T-shirt" },
            { label: "Trousers", key: "Sport//Trousers" },
            { label: "Shorts", key: "Sport//Shorts" },
            { label: "Socks", key: "Sport//Socks" },
            { label: "Swimwear bottom", key: "Sport//Swimwear bottom" },
          ],
        },
        {
          label: "Accessories",
          key: "Sport Accessories submenu",
          children: [
            // { label: "Cap", key: "Sport//Cap" },
            { label: "Waterbottle", key: "Sport//Waterbottle" },
            { label: "Giftbox", key: "Sport//Giftbox" },
            { label: "Gloves", key: "Sport//Gloves" },
            { label: "Other accessories", key: "Sport//Other accessories" },
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
    } else if (e.key === "2") {
      setOpenProfile(true);
    } else if (e.key === "1") {
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

  const handlePrimeMenu = (e) => {
    debugger;
    console.log(e);
  };

  const handlePrime = (e) => {
    debugger;
    console.log(e);
  };

  const handleDropdownClick = (e) => {
    debugger;
    console.log("Selected value:", e);
    let value = e?.item?.key;
    dispatch(categoryValueSuccess({ categoryValue: value }));
    if (location?.pathname !== "/products") {
      navigate("/products");
    }
  };

  const handleChatComponent = () => {
    if (token !== undefined && token !== null) {
      /** will uncomment after login signup setup to email */
      setOpenChatComponent(true);
    } else {
      setCheckingLoginOrSignup("Login");
      setOpenLoginModal(true);
      // showToastInfo("Please login first to chat with your friends.");
    }
  };
  const CloseChatComponent = () => {
    setOpenChatComponent(!openChatComponent);
    fetchFriendAndGroupIds();
  };

  const CloseProfileComponent = () => {
    setOpenProfile(!openProfile);
  };

  /** handle dropdown click */

  /** wishlist component  */

  const handleWishListComponent = () => {
    if (!token) {
      setCheckingLoginOrSignup("Login");
      setOpenLoginModal(true);
      // showToastInfo("Please login first.");
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
    if (token?.token) {
      getWishListCount();
    }
    // getCategoryData();
  }, []);

  // const getCategoryData = async () => {
  //   debugger;

  //   const getCategories = await apiCall("GET", "https://smartwardrobe-backend.azurewebsites.net/product-category/get-all", null, token?.token);

  //   if(getCategories?.data?.length){
  //     console.log(getCategories?.data);
  //     localStorage.setItem("CategoryData", JSON.stringify(getCategories?.data));
  //     setCategoryData(getCategories?.data);
  //   }
  // };

  const getWishListCount = async () => {
    debugger;
    if (token?.token) {
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
      }
    }
  };

  /** wish list count */

  /** Cart component */

  const handleCartComponent = () => {
    if (!token) {
      setCheckingLoginOrSignup("Login");
      setOpenLoginModal(true);
      // showToastInfo("Please login first.");
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

  const handleSearchShow = () => {
    debugger;
    setSearchShow(!searchShow);
  };

  const handleSearchOnBlur = () => {
    setSearchShow(false);
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

      {/*  Profile component */}
      {openProfile && (
        <Profile isShowModel={openProfile} closeModal={CloseProfileComponent} />
      )}

      {/*  Profile component */}

      {/*  Chat component */}
      {openChatComponent && (
        <ChatComponent
          isShowModel={openChatComponent}
          closeModal={CloseChatComponent}
        />
      )}

      {/*  Chat component */}

      {/* Signup/Login Modal */}

      <SignupModal
        isShowModel={OpenLoginModal}
        closeModal={CloseLoginForm}
        checkingLoginOrSignup={checkingLoginOrSignup}
        accountCreate={accountCreate}
      />
      {/*  Signup/Login Modal */}

      {/* <Carousel
        dotPosition="left"
        dots={false}
        infinite={true}
        autoplay={true}
        autoplaySpeed={2500}
        style={{ maxHeight: "25px" }}
      >
        <div>
          <h3 style={contentStyle}>Collaborative Chat</h3>
        </div>
        <div>
          <h3 style={contentStyle}>Virtual Try-On</h3>
        </div>
        <div>
          <h3 style={contentStyle}>Customization option</h3>
        </div>
      </Carousel> */}

      <Marquee
        pauseOnHover
        gradient={false}
        style={{ height: "40px", backgroundColor: "black", color:"white"}}
      >
        <div style={{ display: "flex", gap: "0px", minWidth: "100%" }}>
        <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 40px",
              whiteSpace: "nowrap",
            }}
          >
            <GoDotFill />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0 40px",
              whiteSpace: "nowrap",
            }}
          >
            Virtual Try-On Using Preset Models & Its Customizations
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 40px",
              whiteSpace: "nowrap",
              
            }}
          >
            <GoDotFill />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0 40px",
              whiteSpace: "nowrap",
            }}
          >
            Collaborative Chat & Share Products
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 40px",
              whiteSpace: "nowrap",
            }}
          >
            <GoDotFill />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0 40px",
              whiteSpace: "nowrap",
            }}
          >
            Image Search
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 40px",
              whiteSpace: "nowrap",
            }}
          >
            <GoDotFill />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0 40px",
              whiteSpace: "nowrap",
            }}
          >
            Natural Language Search & Predictive Search
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 40px",
              whiteSpace: "nowrap",
            }}
          >
            <GoDotFill />
          </div>
          {/* Duplicate content for seamless transition */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0 40px",
              whiteSpace: "nowrap",
            }}
          >
            Virtual Try-On Using Preset Models & Its Customizations
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 40px",
              whiteSpace: "nowrap",
            }}
          >
            <GoDotFill />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0 40px",
              whiteSpace: "nowrap",
            }}
          >
            Collaborative Chat & Share Products
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 40px",
              whiteSpace: "nowrap",
            }}
          >
            <GoDotFill />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0 40px",
              whiteSpace: "nowrap",
            }}
          >
            Image Search
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 40px",
              whiteSpace: "nowrap",
            }}
          >
            <GoDotFill />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0 40px",
              whiteSpace: "nowrap",
            }}
          >
            Natural Language Search & Predictive Search
          </div>
        </div>
      </Marquee>

      <div className="header-main">
        <div className="header-conatiner page-width">
          <div
            className="search-div-laptop search-input-above-900px"
            // className={
            //   location?.pathname === "/products"
            //     ? "search-div-laptop-productspage search-input-above-900px"
            //     : "search-div-laptop search-input-above-900px"
            // }
          >
            <>
              <a href="/" className="anchor-tag">
                <h2 className="header-logo">
                  <img
                    src={Homelogo2}
                    alt="logo"
                    style={{
                      width: "60px",
                      height: "50px",
                      objectFit: "contain",
                    }}
                  />
                  SMARTWARDROBE
                </h2>
              </a>
              {/* <FormControl sx={{ m: 1 }} variant="outlined">
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
                  Search11
                </InputLabel>
                <OutlinedInput
                  label="outlined-Input"
                  type={"text"}
                  style={{ color: "white" }}
                  placeholder="Search"
                  value={searchValue}
                  onChange={onChangeSearchValue}
                  onKeyDown={handleKeyDown}
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
                  }}
                />
              </FormControl> */}
              <div className="search-input-above-900px">
                <MegaMenu model={primeMenu} breakpoint="900px" />
              </div>
            </>

            <div className="header-icons">
              {searchShow ? (
                <FormControl sx={{ m: 1, width: "100%" }} variant="outlined">
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
                    label="outlined-Input"
                    type={"text"}
                    style={{ color: "white" }}
                    placeholder="Search"
                    value={searchValue}
                    onChange={onChangeSearchValue}
                    onKeyDown={handleKeyDown}
                    onBlur={handleSearchOnBlur}
                    autoComplete="off"
                    autoFocus={true}
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
                    }}
                  />
                </FormControl>
              ) : (
                <>
                  <SearchIcon
                    sx={{
                      color: "white",
                      fontSize: "34px",
                      marginRight: "-8px",
                      paddingTop: "1px",
                      display: `${
                        location?.pathname !== "/products" ? "block" : "none"
                      }`,
                    }}
                    onClick={handleSearchShow}
                  />
                  <StyledBadge
                    badgeContent={wishListValue}
                    anchorOrigin={{
                      vertical: "bottom",
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
              <h1 className="header-logo">
                <img
                  src={Homelogo2}
                  alt="logo"
                  style={{
                    width: "60px",
                    height: "50px",
                    objectFit: "contain",
                  }}
                />
                SMARTWARDROBE
              </h1>
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
                  // htmlFor="outlined-adornment-password"
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
            {/* <GenericDropdownMenu
              menuData={menuData}
              handleChange={handleDropdownClick}
            /> */}
            {/* <MegaMenu model={primeMenu} breakpoint="900px" /> */}
          </div>
          {/* Header Dropdowns */}
        </div>
      </div>
    </>
  );
}

export default Headermenu;
