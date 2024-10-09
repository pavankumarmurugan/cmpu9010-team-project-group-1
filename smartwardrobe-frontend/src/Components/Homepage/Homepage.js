import React from "react";
import "../../App.css";
import Headermenu from "../Headermenu/Headermenu";
import ImageWithTextOverlay from "../Homepage_ImageTextOverlay/Homepage_ImageTextOverlay";
import HomeShoppingCollection from "../HomeShoppingCollection/HomeShoppingCollection";
import Footer from "../Footer/Footer";

function Homepage() {
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
