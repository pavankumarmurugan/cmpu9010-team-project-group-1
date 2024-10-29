import React, { useEffect, useRef, useState } from "react";
import "../../App.css";
import Headermenu from "../Headermenu/Headermenu";
import ImageWithTextOverlay from "../Homepage_ImageTextOverlay/Homepage_ImageTextOverlay";
import HomeShoppingCollection from "../HomeShoppingCollection/HomeShoppingCollection";
import Footer from "../Footer/Footer";
import { useLocation } from "react-router-dom";
import RecentlyViewed from "../RecentlyViewed/RecentlyViewed";
import apiCall from "../GenericApiCallFunctions/GenericApiCallFunctions";
import { Backdrop, CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { homeDataSuccess } from "../../redux/slices/HomeDataSlice";

function Homepage() {
  const location = useLocation();
  let token = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  let { state } = location;
  const dispatch = useDispatch();
  const [openLoader, setOpenLoader] = useState(false);
  const [homeData, setHomeData] = useState(null);

  useEffect(() => {
    debugger;
    getHomeData();
  },[])

  const getHomeData = async () => {
    debugger
    setOpenLoader(true);
    const response = await apiCall("GET", "https://smartwardrobe-backend.azurewebsites.net/product/get-all", null, token?.token);
    setOpenLoader(false)
    if (response) {
      setHomeData(response?.data);
      dispatch(homeDataSuccess({ homeData: response?.data}));
    }
  }


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
    <Headermenu />
    <ImageWithTextOverlay />
    <HomeShoppingCollection data={homeData} />
    <RecentlyViewed />
    <Footer />
    </>
  );
}

export default Homepage;
