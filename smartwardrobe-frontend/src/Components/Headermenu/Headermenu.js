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
import { IoCloseCircleOutline, IoSearch } from "react-icons/io5";
import MenuIcon from "@mui/icons-material/Menu";
import { Button, Carousel, Dropdown } from "antd";
import { GenericDropdownMenu } from "../GenericCode/GenericCode";
import SignupModal from "../Signup/Signup";
import { useLocation, useNavigate } from "react-router-dom";
import ChatComponent from "../ChatComponent/ChatComponent";
import { showToastInfo } from "../GenericToasters/GenericToasters";
import {
  addToCartValueSuccess,
  categoryDataRouteSuccess,
  categoryValueSuccess,
  headerSearchValue,
  headerSearchValueSuccess,
  wishListValueSuccess,
} from "../../redux/slices/HomeDataSlice";
import { useDispatch, useSelector } from "react-redux";
import apiCall, {
  baseUrl,
} from "../GenericApiCallFunctions/GenericApiCallFunctions";
import CartComponent from "../CartComponent/CartComponent";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import Profile from "../Profile/Profile";
import { FaSearch } from "react-icons/fa";
import Homelogo2 from "../../Assets/Homelogo2.png";
import Marquee from "react-fast-marquee";
import { GoDotFill } from "react-icons/go";
import WelcomeBanner from "../WelcomeBanner/WelcomeBanner";
import { HiSparkles } from "react-icons/hi";
import { BsChevronUp } from "react-icons/bs";
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import { FaChevronDown } from "react-icons/fa6";

const backendUrl =
  "https://smartwardrobe-backend-audvfgbjf6bkadgu.westeurope-01.azurewebsites.net";

function Headermenu() {
  console.log("rendered header");
  {
    /*  Use State*/
  }
  let token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  let friends = localStorage.getItem("friendIds")
    ? JSON.parse(localStorage.getItem("friendIds"))
    : null;
  let groups = localStorage.getItem("groupIds")
    ? JSON.parse(localStorage.getItem("groupIds"))
    : null;
    let categoryPaths = localStorage.getItem("categoryPaths")
    ? JSON.parse(localStorage.getItem("categoryPaths"))
    : null;
    let headerSearchValueLocal = localStorage.getItem("headerSearchValueLocal")
    ? JSON.parse(localStorage.getItem("headerSearchValueLocal"))
    : null;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [login, setlogin] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [openTrending, setOpenTrending] = useState(false);
  const [openWomen, setOpenWomen] = useState(false);
  const [openMen, setOpenMen] = useState(false);
  const [openKids, setOpenKids] = useState(false);
  const [openSports, setOpenSports] = useState(false);
  const [openWomenTop, setOpenWomenTop] = useState(false);
  const [openMenTop, setOpenMenTop] = useState(false);
  const [openKidsTop, setOpenKidsTop] = useState(false);
  const [openSportsClothing, setOpenSportsClothing] = useState(false);
  const [openWomenBottom, setOpenWomenBottom] = useState(false);
  const [openMenBottom, setOpenMenBottom] = useState(false);
  const [openKidsOutwear, setOpenKidsOutwear] = useState(false);
  const [openSportsAccessories, setOpenSportsAccessories] = useState(false);
  const [openWomenOutwear, setOpenWomenOutwear] = useState(false);
  const [openMenOutwear, seOpenMenOutwear] = useState(false);
  const [openKidsFootwear, seOpenKidsFootwear] = useState(false);
  const [openTop, setOpenTop] = useState(false);
  const [openFootwear, setOpenFootwear] = useState(false);
  const [openMenFootwear, setOpenMenFootwear] = useState(false);
  const [openKidsAccessories, setOpenKidsAccessories] = useState(false);
  const [openWomenenFootwear, setOpenWomenFootwear] = useState(false);
  const [openWomenenAccessories, setOpenWomenenAccessories] = useState(false);
  const [openMenAccessories, setOpenMenAccessories] = useState(false);
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
  // const categoryPaths = useSelector((state) => state.homeData.categoryPaths);
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
      `${baseUrl}/friends/get-all-my-friends`,
      null,
      token?.token
    );
    if (getFriendsList?.data?.length > 0) {
      localStorage.setItem("friendIds", JSON.stringify(getFriendsList?.data));
      setFriendIds(getFriendsList.data.map((x) => x.userId));
    }
    console.log(getFriendsList);
    const getGroupsList = await apiCall(
      "GET",
      `${baseUrl}/group/get-my-groups`,
      null,
      token?.token
    );
    if (getGroupsList?.data?.length > 0) {
      localStorage.setItem("groupIds", JSON.stringify(getGroupsList?.data));
      setGroupIds(getGroupsList.data.map((x) => x.groupId));
    }
    console.log(getGroupsList);
    console.log(friendIds);
    console.log(groupIds);
  };

  useEffect(() => {
    // Fetch friend and group IDs when component mounts
    if (token) {
      debugger;
      if (friends && groups) {
        setFriendIds(friends);
        setGroupIds(groups);
        return;
      }
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
    textAlign: "center",
    background: "black",
    color: "white",
    fontWeight: "500",
    fontSize:"16px"
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
  const handleWomen = () => {
    setOpenWomen(!openWomen);
  };
  const handleMen = () => {
    setOpenMen(!openMen);
  };
  const handleKids = () => {
    setOpenKids(!openKids);
  };
  const handleSports = () => {
    setOpenSports(!openSports);
  };
  const handleMenFootwear = () => {
    setOpenMenFootwear(!openMenFootwear);
  };

  const handleKidsAccessories = () => {
    setOpenKidsAccessories(!openKidsAccessories);
  };

  const handleWomenTop = () => {
    setOpenWomenTop(!openWomenTop);
  };

  const handleMenTop = () => {
    setOpenMenTop(!openMenTop);
  };

  const handleKidsTop = () => {
    setOpenKidsTop(!openKidsTop);
  };
  const handleSportsClothing = () => {
    setOpenSportsClothing(!openSportsClothing);
  };

  const handleWomenFootwear = () => {
    setOpenWomenFootwear(!openWomenenFootwear);
  };

  const handleWomenAccessories = () => {
    setOpenWomenenAccessories(!openWomenenAccessories);
  };

  const handleMenAccessories = () => {
    setOpenMenAccessories(!openMenAccessories);
  };

  const handleWomenBottom = () => {
    setOpenWomenBottom(!openWomenBottom);
  };

  const handleMenBottom = () => {
    setOpenMenBottom(!openMenBottom);
  };

  const handleKidsOutwear = () => {
    setOpenKidsOutwear(!openKidsOutwear);
  };

  const handleSportsAccessories = () => {
    setOpenSportsAccessories(!openSportsAccessories);
  };

  const handleWomenOutwear = () => {
    setOpenWomenOutwear(!openWomenOutwear);
  };

  const handleMenOutwear = () => {
    seOpenMenOutwear(!openMenOutwear);
  };

  const handleKidsFootwear = () => {
    seOpenKidsFootwear(!openKidsFootwear);
  };

  const handlesetAccessories = () => {
    setOpenAccessories(!openAccessories);
  };

  const handleItemClick = (item) => {
    debugger;
    let value = item;
    dispatch(categoryValueSuccess({ categoryValue: value }));
    setOpen(false);
    if (location?.pathname !== "/products") {
      navigate("/products");
    }
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

        {/* <Collapse in={openWomen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              className="submenu-item"
              onClick={() => handleItemClick("Men T-Shirts")}
            >
              <ListItemText primary="T-Shirts" />
            </ListItem>
          </List>
        </Collapse> */}
        <div className="menu-item">
          <div className="item" onClick={handleWomen}>
            Women {openWomen ? <MdExpandLess /> : <MdExpandMore />}
          </div>
        </div>
        <Collapse in={openWomen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {/* Men Category */}
            <ListItem
              button
              className="submenu-item footwear-submenu"
              onClick={handleWomenTop}
            >
              <ListItemText primary="Top" />
              {openWomenTop ? <MdExpandLess /> : <MdExpandMore />}
            </ListItem>
            <Collapse in={openWomenTop} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Ladieswear//T-shirt")}
                >
                  <ListItemText primary="T-shirt" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Ladieswear//Long-sleeve top")}
                >
                  <ListItemText primary="Long-sleeve top" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() =>
                    handleItemClick("Ladieswear//Crop top and skirt")
                  }
                >
                  <ListItemText primary="Crop top and skirt" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Ladieswear//Tank top")}
                >
                  <ListItemText primary="Tank top" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Ladieswear//Vest top")}
                >
                  <ListItemText primary="Vest top" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Ladieswear//Casual top")}
                >
                  <ListItemText primary="Casual top" />
                </ListItem>
              </List>
            </Collapse>

            {/* Women Category */}
            <ListItem
              button
              className="submenu-item footwear-submenu"
              onClick={handleWomenBottom}
            >
              <ListItemText primary="Bottom" />
              {openWomenBottom ? <MdExpandLess /> : <MdExpandMore />}
            </ListItem>
            <Collapse in={openWomenBottom} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() =>
                    handleItemClick("Ladieswear//Outdoor trousers")
                  }
                >
                  <ListItemText primary="Outdoor trousers" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Ladieswear//Skirt")}
                >
                  <ListItemText primary="Skirt" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Ladieswear//Shorts")}
                >
                  <ListItemText primary="Shorts" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Ladieswear//Pyjama bottom")}
                >
                  <ListItemText primary="Pyjama bottom" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Ladieswear//Swimwear bottom")}
                >
                  <ListItemText primary="Swimwear bottom" />
                </ListItem>
              </List>
            </Collapse>

            <ListItem
              button
              className="submenu-item footwear-submenu"
              onClick={handleWomenOutwear}
            >
              <ListItemText primary="Outwear" />
              {openWomenOutwear ? <MdExpandLess /> : <MdExpandMore />}
            </ListItem>
            <Collapse in={openWomenOutwear} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Ladieswear//Jacket")}
                >
                  <ListItemText primary="Jacket" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() =>
                    handleItemClick("Ladieswear//Outdoor Waistcoat")
                  }
                >
                  <ListItemText primary="Waistcoat" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() =>
                    handleItemClick("Ladieswear//Outdoor trousers")
                  }
                >
                  <ListItemText primary="Trousers" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Ladieswear//Cardigan")}
                >
                  <ListItemText primary="Cardigan" />
                </ListItem>
              </List>
            </Collapse>

            <ListItem
              button
              className="submenu-item footwear-submenu"
              onClick={handleWomenFootwear}
            >
              <ListItemText primary="Footwear" />
              {openWomenenFootwear ? <MdExpandLess /> : <MdExpandMore />}
            </ListItem>
            <Collapse in={openWomenenFootwear} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Ladieswear//Boots")}
                >
                  <ListItemText primary="Boots" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Ladieswear//Flat shoes")}
                >
                  <ListItemText primary="Flat shoes" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Ladieswear//Heels")}
                >
                  <ListItemText primary="Heels" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Ladieswear//Heeled sandals")}
                >
                  <ListItemText primary="Heeled sandals" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Ladieswear//Sneakers")}
                >
                  <ListItemText primary="Sneakers" />
                </ListItem>
              </List>
            </Collapse>

            <ListItem
              button
              className="submenu-item footwear-submenu"
              onClick={handleWomenAccessories}
            >
              <ListItemText primary="Accessories" />
              {openWomenenAccessories ? <MdExpandLess /> : <MdExpandMore />}
            </ListItem>
            <Collapse in={openWomenenAccessories} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Ladieswear//Bag")}
                >
                  <ListItemText primary="Bag" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Ladieswear//Earrings")}
                >
                  <ListItemText primary="Earrings" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Ladieswear//Ring")}
                >
                  <ListItemText primary="Ring" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Ladieswear//Bracelet")}
                >
                  <ListItemText primary="Bracelet" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Ladieswear//Hair clip")}
                >
                  <ListItemText primary="Hair clip" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Ladieswear//Belt")}
                >
                  <ListItemText primary="Belt" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Ladieswear//Sunglasses")}
                >
                  <ListItemText primary="Sunglasses" />
                </ListItem>
              </List>
            </Collapse>
          </List>
        </Collapse>

        <div className="menu-item">
          <div className="item" onClick={handleMen}>
            Men {openMen ? <MdExpandLess /> : <MdExpandMore />}
          </div>
        </div>
        <Collapse in={openMen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {/* Men Category */}
            <ListItem
              button
              className="submenu-item footwear-submenu"
              onClick={handleMenTop}
            >
              <ListItemText primary="Top" />
              {openMenTop ? <MdExpandLess /> : <MdExpandMore />}
            </ListItem>
            <Collapse in={openMenTop} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Menswear//T-shirt")}
                >
                  <ListItemText primary="T-shirt" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Menswear//Shirt")}
                >
                  <ListItemText primary="Shirt" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Menswear//Polo shirt")}
                >
                  <ListItemText primary="Polo Shirt" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Menswear//Hoodie")}
                >
                  <ListItemText primary="Hoodie" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Menswear//Sweater")}
                >
                  <ListItemText primary="Sweater" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Menswear//Vest top")}
                >
                  <ListItemText primary="Vest top" />
                </ListItem>
              </List>
            </Collapse>

            {/* Women Category */}
            <ListItem
              button
              className="submenu-item footwear-submenu"
              onClick={handleMenBottom}
            >
              <ListItemText primary="Bottom" />
              {openMenBottom ? <MdExpandLess /> : <MdExpandMore />}
            </ListItem>
            <Collapse in={openMenBottom} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Menswear//Trousers")}
                >
                  <ListItemText primary="Trousers" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Menswear//Shorts")}
                >
                  <ListItemText primary="Shorts" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Menswear//Pyjama bottom")}
                >
                  <ListItemText primary="Pyjama" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Menswear//Swimwear bottom")}
                >
                  <ListItemText primary="Swimwear bottom" />
                </ListItem>
              </List>
            </Collapse>

            <ListItem
              button
              className="submenu-item footwear-submenu"
              onClick={handleMenOutwear}
            >
              <ListItemText primary="Outwear" />
              {openMenOutwear ? <MdExpandLess /> : <MdExpandMore />}
            </ListItem>
            <Collapse in={openMenOutwear} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Menswear//Jacket")}
                >
                  <ListItemText primary="Jacket" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Menswear//Outdoor Waistcoat")}
                >
                  <ListItemText primary="Waistcoat" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Menswear//Blazer")}
                >
                  <ListItemText primary="Blazer" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Menswear//Cardigan")}
                >
                  <ListItemText primary="Cardigan" />
                </ListItem>
              </List>
            </Collapse>

            <ListItem
              button
              className="submenu-item footwear-submenu"
              onClick={handleMenFootwear}
            >
              <ListItemText primary="Footwear" />
              {openMenFootwear ? <MdExpandLess /> : <MdExpandMore />}
            </ListItem>
            <Collapse in={openMenFootwear} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Menswear//Sneakers")}
                >
                  <ListItemText primary="Sneakers" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Menswear//Boots")}
                >
                  <ListItemText primary="Boots" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Menswear//Slippers")}
                >
                  <ListItemText primary="Slippers" />
                </ListItem>
              </List>
            </Collapse>

            <ListItem
              button
              className="submenu-item footwear-submenu"
              onClick={handleMenAccessories}
            >
              <ListItemText primary="Accessories" />
              {openMenAccessories ? <MdExpandLess /> : <MdExpandMore />}
            </ListItem>
            <Collapse in={openMenAccessories} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Menswear//Bag")}
                >
                  <ListItemText primary="Bag" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Menswear//Cross-body bag")}
                >
                  <ListItemText primary="Cross-body bag" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Menswear//Cap")}
                >
                  <ListItemText primary="Cap" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Menswear//Sunglasses")}
                >
                  <ListItemText primary="Sunglasses" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Menswear//Watch")}
                >
                  <ListItemText primary="Watch" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Menswear//Belt")}
                >
                  <ListItemText primary="Belt" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Menswear//Wallet")}
                >
                  <ListItemText primary="Wallet" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Menswear//Wallet")}
                >
                  <ListItemText primary="Gloves" />
                </ListItem>
              </List>
            </Collapse>
          </List>
        </Collapse>

        <div className="menu-item">
          <div className="item" onClick={handleKids}>
            Kids {openKids ? <MdExpandLess /> : <MdExpandMore />}
          </div>
        </div>
        <Collapse in={openKids} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {/* Men Category */}
            <ListItem
              button
              className="submenu-item footwear-submenu"
              onClick={handleKidsTop}
            >
              <ListItemText primary="Clothing" />
              {openKidsTop ? <MdExpandLess /> : <MdExpandMore />}
            </ListItem>
            <Collapse in={openKidsTop} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Baby Children//T-shirt")}
                >
                  <ListItemText primary="T-shirt" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Baby Children//Shirt")}
                >
                  <ListItemText primary="Shirt" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Baby Children//Trousers")}
                >
                  <ListItemText primary="Trousers" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Baby Children//Cardigan")}
                >
                  <ListItemText primary="Cardigan" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Baby Children//Bodysuit")}
                >
                  <ListItemText primary="Bodysuit" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Baby Children//Sweater")}
                >
                  <ListItemText primary="Sweater" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Baby Children//Swimsuit")}
                >
                  <ListItemText primary="Swimsuit" />
                </ListItem>
              </List>
            </Collapse>

            {/* Women Category */}
            <ListItem
              button
              className="submenu-item footwear-submenu"
              onClick={handleKidsOutwear}
            >
              <ListItemText primary="Outerwear" />
              {openKidsOutwear ? <MdExpandLess /> : <MdExpandMore />}
            </ListItem>
            <Collapse in={openKidsOutwear} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Baby Children//Jacket")}
                >
                  <ListItemText primary="Jacket" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Baby Children//Coat")}
                >
                  <ListItemText primary="Coat" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() =>
                    handleItemClick("Baby Children//Outdoor trousers")
                  }
                >
                  <ListItemText primary="Outdoor trousers" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Baby Children//Jumpsuit")}
                >
                  <ListItemText primary="Jumpsuit" />
                </ListItem>
              </List>
            </Collapse>

            <ListItem
              button
              className="submenu-item footwear-submenu"
              onClick={handleKidsFootwear}
            >
              <ListItemText primary="Footwear" />
              {openKidsFootwear ? <MdExpandLess /> : <MdExpandMore />}
            </ListItem>
            <Collapse in={openKidsFootwear} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Baby Children//Sneakers")}
                >
                  <ListItemText primary="Sneakers" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Baby Children//Boots")}
                >
                  <ListItemText primary="Boots" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Baby Children//Slippers")}
                >
                  <ListItemText primary="Slippers" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Baby Children//Pre-walkers")}
                >
                  <ListItemText primary="Pre-walkers" />
                </ListItem>
              </List>
            </Collapse>

            <ListItem
              button
              className="submenu-item footwear-submenu"
              onClick={handleKidsAccessories}
            >
              <ListItemText primary="Accessories" />
              {openKidsAccessories ? <MdExpandLess /> : <MdExpandMore />}
            </ListItem>
            <Collapse in={openKidsAccessories} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Baby Children//Hat")}
                >
                  <ListItemText primary="Hat" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Baby Children//Cap")}
                >
                  <ListItemText primary="Cap" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Baby Children//Sunglasses")}
                >
                  <ListItemText primary="Sunglasses" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Baby Children//Hair ties")}
                >
                  <ListItemText primary="Hair ties" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Baby Children//Hair clip")}
                >
                  <ListItemText primary="Hair clip" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Baby Children//Towel")}
                >
                  <ListItemText primary="Towel" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Baby Children//Toy")}
                >
                  <ListItemText primary="Toy" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Baby Children//Soft Toys")}
                >
                  <ListItemText primary="Soft Toys" />
                </ListItem>
              </List>
            </Collapse>
          </List>
        </Collapse>

        <div className="menu-item">
          <div className="item" onClick={handleSports}>
            Sports {openSports ? <MdExpandLess /> : <MdExpandMore />}
          </div>
        </div>
        <Collapse in={openSports} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {/* Men Category */}
            <ListItem
              button
              className="submenu-item footwear-submenu"
              onClick={handleSportsClothing}
            >
              <ListItemText primary="Clothing" />
              {openSportsClothing ? <MdExpandLess /> : <MdExpandMore />}
            </ListItem>
            <Collapse in={openSportsClothing} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Sport//T-shirt")}
                >
                  <ListItemText primary="T-shirt" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Sport//Trousers")}
                >
                  <ListItemText primary="Trousers" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Sport//Shorts")}
                >
                  <ListItemText primary="Shorts" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Sport//Socks")}
                >
                  <ListItemText primary="Socks" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Sport//Swimwear bottom")}
                >
                  <ListItemText primary="Swimwear bottom" />
                </ListItem>
              </List>
            </Collapse>

            {/* Women Category */}
            <ListItem
              button
              className="submenu-item footwear-submenu"
              onClick={handleSportsAccessories}
            >
              <ListItemText primary="Accessories" />
              {openSportsAccessories ? <MdExpandLess /> : <MdExpandMore />}
            </ListItem>
            <Collapse in={openSportsAccessories} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Sport//Waterbottle")}
                >
                  <ListItemText primary="Waterbottle" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Sport//Giftbox")}
                >
                  <ListItemText primary="Giftbox" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Sport//Gloves")}
                >
                  <ListItemText primary="Gloves" />
                </ListItem>
                <ListItem
                  button
                  className="submenu-item"
                  onClick={() => handleItemClick("Sport//Other accessories")}
                >
                  <ListItemText primary="Other accessories" />
                </ListItem>
              </List>
            </Collapse>
          </List>
        </Collapse>

        {/* <div className="menu-item">
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
        </div> */}
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
      localStorage.removeItem("friends");
      localStorage.removeItem("groups");
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
    debugger
    if(!/[^\w\s]/gm.test(e.target.value)){
      setSearchValue(e.target.value);
    }
  };

  const handleKeyDown = (e) => {
    // debugger;
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    debugger;
    if (searchValue.trim() !== "" || file !== null) {
      let data = {};
      data.searchValue = searchValue;
      data.file = file;
      console.log(data);
      dispatch(headerSearchValueSuccess({ headerSearchValue: data }));
      let headerSearchValueLocalArray = [];
      headerSearchValueLocalArray.push(data.searchValue);
      localStorage.setItem("headerSearchValueLocal", JSON.stringify(headerSearchValueLocalArray));
      navigate("/products");
    }
    // if (file !== null) {
    //   dispatch(headerSearchValueSuccess({ headerSearchValue: file }));
    //   navigate("/products");
    // }
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

  function createSlug(str) {
    return str
      .toLowerCase()                     // Convert to lowercase
      .replace(/[^a-z0-9\s-]/g, '')       // Remove special characters
      .replace(/\s+/g, '-')               // Replace spaces with hyphens
      .replace(/-+/g, '-');               // Replace multiple hyphens with a single hyphen
  }

  const handleDropdownClick = (e) => {
    debugger;
    console.log("Selected value:", e);
    let value = e?.item?.key;
    const slug = createSlug(value);
    let catpath = [];
    if(categoryPaths?.length > 0){
      catpath = [...categoryPaths, value];
    }else{
      catpath = [value];
    }
    localStorage.setItem("categoryPaths", JSON.stringify(catpath));
    // dispatch(categoryDataRouteSuccess({ categoryPaths: catpath }));
    // dispatch(categoryValueSuccess({ categoryValue: value }));
    // if (!location?.pathname.includes('/products/')) {
      // navigate("/products");
      navigate(`/products/${slug}`);
      setTimeout(() => {
        window.location.reload();
      }, 1);
    // }
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
        `${baseUrl}/likes/get-all`,
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
        `${baseUrl}/cart-item/get-all`,
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
    const files = e.target.files[0];
    if (files) {
      setFile(files);
      // setFormData((prevData) => ({
      //   ...prevData,
      //   imagePreview: URL.createObjectURL(file),
      // }));
    }
    // console.log(formData.image);
  };

  const removeImage = () => {
    setFile(null);
  };

  const handleSearchShow = () => {
    debugger;
    setSearchShow(!searchShow);
  };

  const handleSearchOnBlur = () => {
    debugger;
    // setSearchShow(false);
  };

  const inputRefFile = useRef(null);
  const bannerclickvalue = useRef(0);

  const handleButtonClick = () => {
    debugger;
    if (inputRefFile.current) {
      inputRefFile.current.click(); // Trigger file input click
    }
  };
  const hanldeBannerClick = (value) => {
    debugger;
    bannerclickvalue.current = value;
    setShowBanner(true);
  }

  const handleCloseBanner = () => {
    debugger;
    setShowBanner(false);
  }

  const [isOpen, setIsOpen] = useState(false)
  const showcaseRef = useRef(null)
  const features = [
    "Virtual Try-On Using Preset Models & Its Customizations",
    "Collaborative Chat & Share Products",
    "Image Search Natural Language Search & Predictive Search"
  ]
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showcaseRef.current && !showcaseRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleItemClickFeature = (index) => {
    debugger
    bannerclickvalue.current = index + 1;
    setShowBanner(true);
    setIsOpen(false)
  }

  return (
    <>
    {showBanner && (
        <WelcomeBanner
          isShowModel={showBanner}
          closeModal={handleCloseBanner}
          bannerclickvalue={bannerclickvalue.current}
        />
      )}
      
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

{/* <div className="headercarousel">
      <Carousel
        // dotPosition="left"
        dots={false}
        infinite={true}
        autoplay={true}
        autoplaySpeed={3000}
        // style={{ height: "40px" }}
      >
        <div onClick={() => hanldeBannerClick(1)}>
          <h3 style={contentStyle}>Virtual Try-On Using Preset Models & Its Customizations</h3>
        </div>
        <div onClick={() => hanldeBannerClick(2)}>
          <h3 style={contentStyle}>Collaborative Chat & Share Products</h3>
        </div>
        <div onClick={() => hanldeBannerClick(3)}>
          <h3 style={contentStyle}>Image Search Natural Language Search & Predictive Search</h3>
        </div>
      </Carousel></div>
      <div className="headerbanner-main">
        <div
          style={{
            // display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "5px 40px 0px 40px",
            // whiteSpace: "nowrap",
            backgroundColor: "black",
            color: "white",
            cursor:"pointer"
          }}
          onClick={() => hanldeBannerClick(1)}
        >
          <p> Virtual Try-On </p>
          <p> Using Preset Models & Its Customizations</p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "0 40px",
            whiteSpace: "nowrap",
            backgroundColor: "gray",
            color: "white",
            cursor:"pointer"
          }}
          onClick={() => hanldeBannerClick(2)}
        >
          Collaborative Chat & Share Products
        </div>
        <div
          style={{
            // display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "5px 40px 0px 40px",
            whiteSpace: "nowrap",
            backgroundColor: "black",
            color: "white",
            cursor:"pointer"
          }}
          onClick={() => hanldeBannerClick(3)}
        >
          <p>Image Search</p>{" "}
          <p> Natural Language Search & Predictive Search</p>
        </div>
      </div> */}

<div ref={showcaseRef} className="feature-showcase">
      <input
        type="checkbox"
        id="feature-toggle"
        className="feature-toggle"
        checked={isOpen}
        onChange={() => setIsOpen(!isOpen)}
      />
      <label htmlFor="feature-toggle" className="feature-button" style={{ display: "flex", justifyContent:"center", alignItems:"center", gap:"10px" }}>
        <span>Discover Our Amazing Features</span>
        <FaChevronDown className="chevron-up" style={{ fontWeight:"bold" }} />
      </label>
      <div className="feature-content">
        <ul style={{ display: "flex", justifyContent:"center", flexDirection:"column", alignItems:"center"}}>
          {features.map((feature, index) => (
            <li key={index} className="banner-feature-li" onClick={() => handleItemClickFeature(index)}>
              <HiSparkles className="sparkles" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      </div>

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
                <>
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
                      // autoComplete="off"
                      autoFocus={true}
                      startAdornment={
                        file && (
                          <InputAdornment
                            position="start"
                            sx={{
                              mr: 1,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <div
                              style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer", // Make sure the entire area is interactive
                              }}
                              className="thumbnail-container" // Add a class for styling hover
                            >
                              {/* Thumbnail Image */}
                              <img
                                src={URL.createObjectURL(file)}
                                alt="Uploaded preview"
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "5px",
                                  marginRight: "8px",
                                }}
                                className="thumbnail-image"
                              />

                              <IconButton
                                onClick={removeImage}
                                size="small"
                                sx={{
                                  position: "absolute",
                                  top: "-8px",
                                  right: "-8px",
                                  backgroundColor: "white",
                                  boxShadow: 1,
                                  "&:hover": { backgroundColor: "#f0f0f0" },
                                }}
                              >
                                <IoCloseCircleOutline fontSize="small" />
                              </IconButton>
                            </div>
                          </InputAdornment>
                        )
                      }
                      endAdornment={
                        <InputAdornment position="end">
                          <Button
                            onClick={handleButtonClick}
                            variant="outlined"
                            style={{
                              border: "none",
                              borderRadius: "50%",
                              backgroundColor: "transparent",
                              color: "white",
                              cursor: "pointer",
                            }}
                          >
                            <ImageSearchIcon />
                            {/* <SvgIcon>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                                />
                              </svg>
                            </SvgIcon> */}
                            {/* Hidden file input */}
                            <input
                              ref={inputRefFile}
                              type="file"
                              accept="image/*"
                              onChange={imageUpload}
                              style={{ display: "none" }}
                              aria-label="Upload Image"
                            />
                          </Button>
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
                  <div
                    onClick={() => setSearchShow(false)}
                    style={{ display: "flex" }}
                  >
                    <IoMdClose
                      style={{
                        width: "25px",
                        height: "25px",
                        color: "white",
                        marginTop: "auto",
                        marginBottom: "auto",
                      }}
                    />
                  </div>
                </>
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
                  // autoComplete="off"
                  autoFocus={true}
                  startAdornment={
                    file && (
                      <InputAdornment
                        position="start"
                        sx={{ mr: 1, display: "flex", alignItems: "center" }}
                      >
                        <div
                          style={{
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer", // Make sure the entire area is interactive
                          }}
                          className="thumbnail-container" // Add a class for styling hover
                        >
                          {/* Thumbnail Image */}
                          <img
                            src={URL.createObjectURL(file)}
                            alt="Uploaded preview"
                            style={{
                              width: "30px",
                              height: "30px",
                              borderRadius: "5px",
                              marginRight: "8px",
                            }}
                            className="thumbnail-image"
                          />

                          <IconButton
                            onClick={removeImage}
                            size="small"
                            sx={{
                              position: "absolute",
                              top: "-8px",
                              right: "-8px",
                              backgroundColor: "white",
                              boxShadow: 1,
                              "&:hover": { backgroundColor: "#f0f0f0" },
                            }}
                          >
                            <IoCloseCircleOutline fontSize="small" />
                          </IconButton>
                        </div>
                      </InputAdornment>
                    )
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <Button
                        onClick={handleButtonClick}
                        variant="outlined"
                        style={{
                          border: "none",
                          borderRadius: "50%",
                          backgroundColor: "transparent",
                          color: "white",
                          cursor: "pointer",
                        }}
                      >
                        <SvgIcon>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                            />
                          </svg>
                        </SvgIcon>
                        {/* Hidden file input */}
                        <input
                          ref={inputRefFile}
                          type="file"
                          accept="image/*"
                          onChange={imageUpload}
                          style={{ display: "none" }}
                          aria-label="Upload Image"
                        />
                      </Button>
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
