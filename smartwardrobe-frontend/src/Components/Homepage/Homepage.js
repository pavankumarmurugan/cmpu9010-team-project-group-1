import React, { useEffect, useRef, useState } from "react";
import "../../App.css";
import Headermenu from "../Headermenu/Headermenu";
import ImageWithTextOverlay from "../Homepage_ImageTextOverlay/Homepage_ImageTextOverlay";
import HomeShoppingCollection from "../HomeShoppingCollection/HomeShoppingCollection";
import Footer from "../Footer/Footer";
import { useLocation } from "react-router-dom";
import RecentlyViewed from "../RecentlyViewed/RecentlyViewed";
import apiCall, { baseUrl } from "../GenericApiCallFunctions/GenericApiCallFunctions";
import { Backdrop, CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { categoryValueSuccess, homeDataSuccess } from "../../redux/slices/HomeDataSlice";
import WelcomeBanner from "../WelcomeBanner/WelcomeBanner";

function Homepage() {
  const location = useLocation();
  let token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  let firstlogin = localStorage.getItem("firstlogin")
    ? JSON.parse(localStorage.getItem("firstlogin"))
    : null;
  const [showBanner, setShowBanner] = useState(false);
  let { state } = location;
  const dispatch = useDispatch();
  const [openLoader, setOpenLoader] = useState(false);
  const [homeData, setHomeData] = useState(null);

  useEffect(() => {
    debugger;
    if(firstlogin === null){
      localStorage.setItem("firstlogin", JSON.stringify(true));
    }
    dispatch(categoryValueSuccess({ categoryValue: "" }));
    localStorage.removeItem("categoryPaths");
    localStorage.removeItem("headerSearchValueLocal");
    localStorage.removeItem("scrollPosition");
    // getHomeData();
  }, []);

  const getHomeData = async () => {
    debugger;
    // setOpenLoader(true);
    // const response = await apiCall(
    //   "GET",
    //   `${baseUrl}/product/get-all/1/20`,
    //   null,
    //   token?.token
    // );
    // setOpenLoader(false);
    // if (response) {
    //   setHomeData(response?.data);
    //   dispatch(homeDataSuccess({ homeData: response?.data }));
    // }
    if (firstlogin) {
      setShowBanner(true);
    }
  };

  const handleCloseBanner = () => {
    setShowBanner(false);
  };

  return (
    <>
      {showBanner && (
        <WelcomeBanner
          isShowModel={showBanner}
          closeModal={handleCloseBanner}
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
      <Headermenu />
      <ImageWithTextOverlay />
      <HomeShoppingCollection />
      <RecentlyViewed />
      <Footer />
    </>
  );
}

export default Homepage;
