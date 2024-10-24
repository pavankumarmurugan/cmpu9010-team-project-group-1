import React from "react";
import "../../App.css";
import Headermenu from "../Headermenu/Headermenu";
import ImageWithTextOverlay from "../Homepage_ImageTextOverlay/Homepage_ImageTextOverlay";
import HomeShoppingCollection from "../HomeShoppingCollection/HomeShoppingCollection";
import Footer from "../Footer/Footer";
import { useLocation } from "react-router-dom";

function Homepage() {
  const location = useLocation();
  let { state } = location;
  console.log(state);
  return (
    // <div className="layout">
    //   <Sidebar />
    //   <div className="layout--content">
    //     <Content />
    //   </div>
    // </div>
    <>
    <Headermenu />
    <ImageWithTextOverlay />
    <HomeShoppingCollection />
    <Footer />
    </>
  );
}

export default Homepage;
