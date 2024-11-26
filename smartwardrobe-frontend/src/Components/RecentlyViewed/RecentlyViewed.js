import React, { useState } from "react";
import HomeProductSection from "../HomeProductsSection/HomeProductSection";
import "../../Styles/RecentlyViewed.css";

function RecentlyViewed() {
  let visitedProductsData = JSON.parse(localStorage.getItem("visitedProducts"));
  return (
    <div className="recently-viewed-div">
      {visitedProductsData && visitedProductsData?.length > 0 && (
        <div className="recently-viewed-main">
          <div
            className="bestselling-div"
            style={{
              margin: "45px auto 20px auto",
              fontSize: "24px",
              fontFamily: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.3rem",
              marginLeft: "16px",
              display:"flex",
              justifyContent:"center"
            }}
          >
            <h2>RECENTLY VIEWED</h2>
          </div>
          <HomeProductSection
            data={visitedProductsData}
            from="RecentlyViewed"
          />
        </div>
      )}
    </div>
  );
}

export default RecentlyViewed;
