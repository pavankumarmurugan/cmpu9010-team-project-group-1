import React from "react";
import "../../Styles/header.css";
import { Button } from "antd";
import CarouselComponent from "../Carousel/Carousel";
import { Carousel } from "antd";
import carousel_image1 from "../../Assets/carousel_image1.jpg";
import carousel_image2 from "../../Assets/carousel_image2.jpg";
import carousel_image3 from "../../Assets/carousel_image3.jpg";
import carousel_image4 from "../../Assets/carousel_image4.jpg";
import carousel_image5 from "../../Assets/carousel_image5.jpg";
import { Flex, Splitter, Typography } from "antd";

function HomeShoppingCollection() {
  //   const carouseldata = [
  //     {
  //       src: "https://images.unsplash.com/photo-1502657877623-f66bf489d236",
  //       title: "Dress 1",
  //     },
  //     {
  //       src: "https://images.unsplash.com/photo-1502657877623-f66bf489d236",
  //       title: "Dress 2",
  //     },
  //     {
  //       src: "https://images.unsplash.com/photo-1502657877623-f66bf489d236",
  //       title: "Dress 3",
  //     },
  //     {
  //       src: "https://images.unsplash.com/photo-1502657877623-f66bf489d236",
  //       title: "Dress 4",
  //     },
  //   ];
  const contentStyle = {
    height: "200px",
    color: "#fff",
    lineHeight: "200px",
    width: "500px",
    textAlign: "center",
    background: "#364d79",
    width: "100%", // Adjust this to control how many slides are visible
    display: "inline-block", // Ensure slides are displayed inline
    border: "2px solid #fff", // Add border to each slide
    boxSizing: "border-box",
  };
  
  const Desc = (props) => (
    <Flex
      justify="center"
      align="center"
      style={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden', // Ensure content stays within bounds
      }}
    >
      <img 
        src={props.imageSrc} 
        alt={props.altText} 
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }} 
      />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'white',
        backgroundColor: "#014D4E",
        fontSize: '24px',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
        textAlign: 'center',
      }}>
        {props.text} 
      </div>
    </Flex>
  );

  return (
    <>
      <div className="HomeShoppingCollection-main">
        <div className="HomeShoppingCollection-heading">
          <h2>SHOP BY COLLECTION</h2>
        </div>
        <div className="HomeShoppingCollectioncollection-buttons">
          <Button
            className="collection-buttons"
            color="default"
            variant="filled"
          >
            Clothing
          </Button>
          <Button
            className="collection-buttons"
            color="default"
            variant="filled"
          >
            Footwear
          </Button>
          <Button
            className="collection-buttons"
            color="default"
            variant="filled"
          >
            Accessories
          </Button>
          <Button
            className="collection-buttons"
            color="default"
            variant="filled"
          >
            Jewellery
          </Button>
        </div>
        <div
          className="carousel-container"
          style={{ width: "80%", height: "100%", margin: "30px auto" }}
        >
          <Carousel
            autoplay
            autoplaySpeed={1500}
            dots={true}
            arrows={false}
            draggable
            slidesToShow={3}
            slidesToScroll={1}
            style={{ height: "300px" }}
          >
            <div style={contentStyle}>
              <img
                src={carousel_image1}
                alt=""
                style={{
                  height: "300px",
                  width: "100%",
                  objectFit: "cover",
                  borderRadius: "4px",
                  border: "15px solid #fff",
                }}
              />
            </div>
            <div style={contentStyle}>
              <img
                src={carousel_image2}
                alt=""
                style={{
                  height: "300px",
                  width: "100%",
                  objectFit: "cover",
                  borderRadius: "4px",
                  border: "15px solid #fff",
                }}
              />
            </div>
            <div style={contentStyle}>
              <img
                src={carousel_image3}
                alt=""
                style={{
                  height: "300px",
                  width: "100%",
                  objectFit: "cover",
                  borderRadius: "4px",
                  border: "15px solid #fff",
                }}
              />
            </div>
            <div style={contentStyle}>
              <img
                src={carousel_image4}
                alt=""
                style={{
                  height: "300px",
                  width: "100%",
                  objectFit: "cover",
                  borderRadius: "4px",
                  border: "15px solid #fff",
                }}
              />
            </div>
            <div style={contentStyle}>
              <img
                src={carousel_image5}
                alt=""
                style={{
                  height: "300px",
                  width: "100%",
                  objectFit: "cover",
                  borderRadius: "4px",
                  border: "15px solid #fff",
                }}
              />
            </div>
          </Carousel>
        </div>
        <div className="splitter-div">
            <div className="bestselling-div" style={{display: "flex", justifyContent: "center", alignItems: "center", margin: "20px auto", fontSize:"20px", fontFamily:"bold", textTransform:"uppercase"}}>
                <h2>Best Selling Categories</h2>
            </div>
        <Splitter
            style={{
              height: '100vh', // Set height to viewport height
              width: '100%', // Ensure it stretches across the screen
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Splitter.Panel
              style={{
                border: '5px solid #ccc',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Splitter layout="vertical">
                <Splitter.Panel style={{ flex: '1', overflow: 'hidden' }}>
                  <Desc imageSrc={carousel_image1} altText="Image 1" text="Image 1" />
                </Splitter.Panel>
                <Splitter.Panel style={{ flex: '1', overflow: 'hidden' }}>
                  <Desc imageSrc={carousel_image2} altText="Image 2" text="Image 2" />
                </Splitter.Panel>
              </Splitter>
            </Splitter.Panel>
            <Splitter.Panel
              style={{
                border: '5px solid #ccc',
                flex: '1',
                overflow: 'hidden',
              }}
            >
              <Desc imageSrc={carousel_image4} altText="Image 3" text="Image 3" />
            </Splitter.Panel>
            <Splitter.Panel
              style={{
                border: '5px solid #ccc',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Splitter layout="vertical">
                <Splitter.Panel style={{ flex: '1', overflow: 'hidden' }}>
                  <Desc imageSrc={carousel_image3} altText="Image 4" text="Image 4" />
                </Splitter.Panel>
                <Splitter.Panel style={{ flex: '1', overflow: 'hidden' }}>
                  <Desc imageSrc={carousel_image5} altText="Image 5" text="Image 5" />
                </Splitter.Panel>
              </Splitter>
            </Splitter.Panel>
          </Splitter>
        </div>
      </div>
    </>
  );
}

export default HomeShoppingCollection;
