import React from "react";
import brandingimage from "../../Assets/brandingimage.jpg";
import carousel_image6 from "../../Assets/carousel_image6.jpg";

function ImageWithTextOverlay() {
  const styles = getStyles();
  return (
    <div style={styles.container}>
      <img
        src={carousel_image6}
        loading="lazy"
        alt="Sample"
        style={styles.image}
      />
      <div style={styles.textOverlay}>
        <h1 style={styles.text}>
          Don’t just shop, shop smarter! Explore our enhanced platform now
        </h1>
      </div>
    </div>
  );
}

const getStyles = () => {
  const screenwidth = window.innerWidth;

  // const fontSize =
  //   screenwidth < 600
  //     ? "30px" // Small screens
  //     : screenwidth < 1024
  //     ? "36px" // Medium screens
  //     : "44px"; // Large screens

  return {
    container: {
      position: "relative",
      width: "100%",
      height: "calc(100vh - 220px)",
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
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      color: "#014D4E",
      padding: "10px 20px",
      borderRadius: "5px",
      textAlign: "center",
    },
    text: {
      margin: 0,
      fontSize: "30px",
      color: "white",
    },
  };
};

export default ImageWithTextOverlay;
