import React, { useEffect, useState } from "react";
import HomePage_FinalImage from "../../Assets/HomePage_FinalImage.jpeg";

function ImageWithTextOverlay() {
  const [topValue, setTopValue] = useState("27%");
  const [FontSize, setFontSize] = useState("65px");
  const [imageHeight, setImageHeight] = useState("calc(100vh - 200px)");

  useEffect(() => {
    const updateTopValue = () => {
      if(window.innerWidth <400){
        setFontSize("35px");
      } else if (window.innerWidth < 500) {
        setFontSize("50px")
      }else {
        setFontSize("60px");
      }

      if(window.innerWidth > 768){
        setImageHeight("calc(100vh - 200px)");
      }else{
        setImageHeight("calc(100vh - 250px)")
      }
    };

    updateTopValue();

    window.addEventListener("resize", updateTopValue);

    return () => {
      window.removeEventListener("resize", updateTopValue);
    };
  }, [window.innerWidth]);

  const styles = getStyles(topValue,FontSize,imageHeight);
  return (
    <div style={styles.container}>
      <img
        src={HomePage_FinalImage}
        loading="lazy"
        alt="homepage_branding"
        style={styles.image}
      />
      <div style={styles.textOverlay}>
        <h1 style={styles.text}>Smart Choices, Smarter Wardrobe</h1>
      </div>
    </div>
  );
}

const getStyles = (topValue,FontSize,imageHeight) => {
  return {
    container: {
      position: "relative",
      width: "100%",
      height: imageHeight,
      overflow: "hidden",
      margin: 0,
      padding: 0,
    },
    image: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: "center",
    },
    textOverlay: {
      position: "absolute",
      top: "85%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      color: "#014D4E",
      padding: "10px 20px",
      borderRadius: "5px",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      textAlign: "center",
    },
    text: {
      margin: 0,
      fontSize: FontSize,
      color: "white",
      borderRadius: "5px",
    },
    paratext: {
      margin: 0,
      position: "absolute",
      bottom: window.innerWidth < 768 ? "5%" : "8%",
      left: topValue === "79%" ? "1%" : "76%",
      fontSize: "24px",
      color: "white",
      borderRadius: "5px",
      display: "flex",
      justifyContent: "center",
      textAlign: "center",
    },
  };
};

export default ImageWithTextOverlay;
