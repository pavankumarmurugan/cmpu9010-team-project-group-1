import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./Components/Homepage/Homepage";
import { Fragment, useEffect, useState } from "react";
import ProductPage from "./Components/ProductPage/ProductPage";
import { ChatButton, ScrollButton } from "./Components/GenericCode/GenericCode";
import ProductDetails from "./Components/ProductDetails/ProductDetails";
import ScrollToTop from "./Components/ScrollToTop/ScrollToTop";
import { Provider } from 'react-redux';
import store from './redux/store';
import WishListComponent from "./Components/WishListComponent/WishListComponent";
import CategoryComponent from "./Components/CategoryComponent/CategoryComponent";
// import { io, Socket } from "socket.io-client";
// import apiCall from "./Components/GenericApiCallFunctions/GenericApiCallFunctions";
// import { showToastInfo } from "./Components/GenericToasters/GenericToasters";


// const backendUrl = "https://smartwardrobe-backend.azurewebsites.net/";

function App() {
  let token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  // let userId = token?.userId;
  //   // State for friend and group IDs
  // const [friendIds, setFriendIds] = useState([]);
  // const [groupIds, setGroupIds] = useState([]);
  // const [socket, setSocket] = useState(null);

  // // Mock API call to get friend IDs and group IDs (replace with actual API call)
  // const fetchFriendAndGroupIds = async () => {
  //   // Simulate an API call
  //   debugger
  //   const getFriendsList = await apiCall(
  //     "GET",
  //     "https://smartwardrobe-backend.azurewebsites.net/friends/get-all-my-friends",
  //     null,
  //     token?.token
  //   );
  //   if(getFriendsList?.data?.length > 0){
  //     setFriendIds(getFriendsList.data.map((x) => x.userId));
  //   }
  //   console.log(getFriendsList);
  //   const getGroupsList = await apiCall(
  //     "GET",
  //     "https://smartwardrobe-backend.azurewebsites.net/group/get-my-groups",
  //     null,
  //     token?.token
  //   );
  //   if(getGroupsList?.data?.length > 0){
  //     setGroupIds(getGroupsList.data.map((x) => x.groupId));
  //   }
  //   console.log(getGroupsList);
  //   console.log(friendIds);
  //   console.log(groupIds);
  // };

  // useEffect(() => {
  //   // Fetch friend and group IDs when component mounts
  //   if(token){
  //     fetchFriendAndGroupIds();
  //   }
  // }, []);

  // useEffect(() => {
  //   debugger
  //   if (friendIds.length === 0 && groupIds.length === 0) return; // Only initialize socket if we have IDs

  //   // Initialize WebSocket connection
  //   const newSocket = io(backendUrl, {
  //     withCredentials: true,
  //     reconnection: true, // enables automatic reconnection
  //     reconnectionAttempts: Infinity, // retry indefinitely
  //     reconnectionDelay: 2000, // time before the first retry in milliseconds
  //     reconnectionDelayMax: 10000, // maximum time delay between retries
  //     timeout: 20000, // connection timeout before trying to reconnect
  //   });
  //   setSocket(newSocket);

  //   newSocket.on("connect", () => {
  //     console.log("Connected to WebSocket server with id:", newSocket.id);

  //     // Dynamically join friend chat rooms
  //     friendIds.forEach((friendId) => {
  //       const roomId = `room_${Math.min(userId, friendId)}_${Math.max(
  //         userId,
  //         friendId
  //       )}`;
  //       newSocket.emit("joinChatRoom", { roomId, userId });
  //       console.log(`User ${userId} joined friend chat room: ${roomId}`);
  //     });

  //     // Dynamically join group chat rooms
  //     groupIds.forEach((groupId) => {
  //       newSocket.emit("joinGroupRoom", { groupId, userId });
  //       console.log(`User ${userId} joined group chat room: group_${groupId}`);
  //     });
  //   });

  //   // Listener for friend messages
  //   newSocket.on("newMessage", (data) => {
  //     console.log("New friend message received:", data);
  //     // Display a notification or update UI with the new friend message
  //   });

  //   // Listener for group messages
  //   newSocket.on("newGroupMessage", (data) => {
  //     console.log("New group message received:", data);
  //     if(data?.senderId !== userId){
  //       showToastInfo('New group message received');

  //     }
  //     // Display a notification or update UI with the new group message
  //   });

  //   // Handle disconnection
  //   newSocket.on("disconnect", () => {
  //     console.log("Disconnected from WebSocket server");
  //   });

  //   // Clean up WebSocket connection when the component unmounts
  //   return () => {
  //     newSocket.disconnect();
  //   };
  // }, [userId, friendIds, groupIds]); // Re-run effect when friendIds or groupIds change


  return (
    <Provider store={store}>
    <div className="App" role="main">
      <ScrollButton />
      <Fragment>
        <BrowserRouter>
      <ScrollToTop /> 
          <Routes>
            {/* <Route path="/" element={<Headermenu />} /> */}
            <Route path="/" element={<Homepage />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/products/:category" element={<CategoryComponent />} />
            <Route path="/productdetails/:id" element={<ProductDetails />} />
            <Route path="/wishlist" element={<WishListComponent />} />
          </Routes>
        </BrowserRouter>
      </Fragment>
    </div>
    </Provider>
  );
}

export default App;
