import React, { useEffect, useState } from "react";
import HomePage_FinalImage from "../../Assets/HomePage_FinalImage.jpeg";

function ImageWithTextOverlay() {
  const [topValue, setTopValue] = useState("27%");
  const [FontSize, setFontSize] = useState("65px");

  useEffect(() => {
    // Function to check screen width and update the top value
    const updateTopValue = () => {
      if (window.innerWidth > 1200) {
        setTopValue("27%");
        setFontSize("65px");
      } else {
        setTopValue("79%");
        setFontSize("40px");
      }
    };

    // Initial check when component mounts
    updateTopValue();

    // Add event listener for window resize
    window.addEventListener("resize", updateTopValue);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateTopValue);
    };
  }, [window.innerWidth]);

  const styles = getStyles(topValue,FontSize);
  return (
    <div style={styles.container}>
      <img
        src={HomePage_FinalImage}
        loading="lazy"
        alt="homepage_branding"
        style={styles.image}
      />
      <div style={styles.textOverlay}>
        <h1 style={styles.text}>Smart Choices, Smarter Wardrobe.</h1>
      </div>
      {/* <p style={styles.paratext} className="text-lg text-muted-foreground">
        Explore our enhanced platform with personalized recommendations,
        sustainable fashion options, and a seamless shopping experience.
      </p> */}
    </div>
  );
}

const getStyles = (topValue,FontSize) => {
  return {
    container: {
      position: "relative",
      width: "100%",
      height: "calc(100vh - 200px)",
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
      top: window.innerWidth < 500 ? "70%" : window.innerWidth < 681 ? "74%" : topValue,
      left: topValue === "79%" ? "50%" : "13%",
      transform: "translate(-50%, -50%)",
      color: "#014D4E",
      padding: "10px 20px",
      borderRadius: "5px",
      width: topValue === "79%" ? "100%" : "20%",
      display: "flex",
      justifyContent: "center",
      textAlign: FontSize === "40px" && "center",
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
