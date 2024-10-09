import React from 'react';
import brandingimage from "../../Assets/brandingimage.jpg";
import carousel_image6 from "../../Assets/carousel_image6.jpg";

function ImageWithTextOverlay() {
  const styles = getStyles();
  return (
    <div style={styles.container}>
      <img src={carousel_image6} alt="Sample" style={styles.image} />
      <div style={styles.textOverlay}>
        <h1 style={styles.text}>Don’t just shop, shop smarter! Explore our enhanced platform now</h1>
      </div>
    </div>
  );
}

const getStyles = () => {
  const screenwidth = window.innerWidth; // Get the window width

  return {
  container: {
    position: 'relative',
    width: '100%',
    height: 'calc(100vh - 220px)', // Set height to 100% of the viewport height
    overflow: 'hidden', // Ensure no overflow below the screen
    margin: 0, // Remove default margins
    padding: 0, // Remove default padding
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover', // Ensures the image covers the entire container
    objectPosition: 'center', // Center the image within the container
  },
  textOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: '#014D4E',
    // backgroundColor: 'white', // Optional: semi-transparent background for text
    padding: '10px 20px',
    borderRadius: '5px',
    textAlign: 'center',
  },
  text: {
    margin: 0,
    fontSize: "44px",
    color: 'white',
  },
}}

export default ImageWithTextOverlay;
