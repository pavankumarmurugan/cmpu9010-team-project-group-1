import React from "react";
import "../../Styles/header.css";
import { Button } from "antd";
import { Carousel } from "antd";
import carousel_image1 from "../../Assets/carousel_image1.jpg";
import carousel_image2 from "../../Assets/carousel_image2.jpg";
import carousel_image3 from "../../Assets/carousel_image3.jpg";
import carousel_image4 from "../../Assets/carousel_image4.jpg";
import carousel_image5 from "../../Assets/carousel_image5.jpg";
import { Flex, Splitter, Typography } from "antd";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import { HomeProductSection } from "../GenericCode/GenericCode"; /** will uncomment when data comes */
import Homeproductimage_1 from "../../Assets/Homeproductimage_1.jpg";
import Homeproductimage_2 from "../../Assets/Homeproductimage_2.jpg";
import Homeproductimage_3 from "../../Assets/Homeproductimage_3.jpg";
import Homeproductimage_4 from "../../Assets/Homeproductimage_4.jpg";
import Homeproductimage_5 from "../../Assets/Homeproductimage_5.jpg";
import Homeproductimage_6 from "../../Assets/Homeproductimage_6.jpg";
import HomeProductSection from "../HomeProductsSection/HomeProductSection";

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

  /* Home page product section dummy data for now */

const dummyData = [
  {
    image: Homeproductimage_1,
    name: "Zapara",
    description: "Wedding Suit",
    price: "$1200",
  },
  {
    image: Homeproductimage_2,
    name: "Harper",
    description: "Long Sleeves T-Shirt",
    price: "$130",
  },
  {
    image: Homeproductimage_3,
    name: "Zara",
    description: "Urban Style Hoodeis",
    price: "$250",
  },
  {
    image: Homeproductimage_4,
    name: "H&M",
    description: "Printed Dress for Summer",
    price: "$120",
  },
  {
    image: Homeproductimage_5,
    name: "Next Direct",
    description: "Leopard Printed Shoes For Women",
    price: "$1200",
  },
  {
    image: Homeproductimage_6,
    name: "Converse",
    description: "Black Converse Shoes",
    price: "$230",
  },
];

/* Home page product section dummy data for now */


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

    const carouselSettings = {
      autoplay: true,
      autoplaySpeed: 1500,
      dots: true,
      arrows: false,
      slidesToShow: 3,
      slidesToScroll: 1,
      style: { height: "300px" },
      responsive: [
        {
          breakpoint: 1024, // For tablets and large screens
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 768, // For medium-sized screens
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 480, // For small screens (mobile devices)
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
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
        loading="lazy"
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
          <h3>SHOP BY COLLECTION</h3>
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
          <Carousel {...carouselSettings}
          >
            <div style={contentStyle}>
              <img
                src={carousel_image1}
                alt=""
                loading="lazy"
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
                loading="lazy"
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
                loading="lazy"
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
                loading="lazy"
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
                loading="lazy"
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

          {/* <HomeProductSection data={dummyData} /> */}  {/** will uncomment when data comes */}
          <HomeProductSection data={dummyData}/>
        </div>
        <div className="splitter-div">
            <div className="bestselling-div" style={{display: "flex", justifyContent: "center", alignItems: "center", margin: "20px auto", fontSize:"20px", fontFamily:"bold", textTransform:"uppercase", letterSpacing:"0.3rem"}}>
                <h3>Best Selling Collections</h3>
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
                border: '5px solid white',
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
                border: '5px solid white',
                flex: '1',
                overflow: 'hidden',
              }}
            >
              <Desc imageSrc={carousel_image4} altText="Image 3" text="Image 3" />
            </Splitter.Panel>
            <Splitter.Panel
              style={{
                border: '5px solid white',
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
