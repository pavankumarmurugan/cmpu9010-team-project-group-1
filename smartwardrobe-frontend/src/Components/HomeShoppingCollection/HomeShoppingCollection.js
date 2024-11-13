import React, { useEffect, useState } from "react";
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
import { ImageList, ImageListItem } from "@mui/material";
import { headerSearchValueSuccess } from "../../redux/slices/HomeDataSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

function HomeShoppingCollection({ data }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [homeData, setHomeData] = useState({});
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

  const itemData = [
    {
      img: "https://sw-uploads-img.s3.eu-north-1.amazonaws.com/home_page_images/home_page_image_6.jpeg",
      title: "red sleeveless top",
    },
    {
      img: "https://sw-uploads-img.s3.eu-north-1.amazonaws.com/home_page_images/home_page_image_2.jpeg",
      title: "Ruffled Black Blouse",
    },
    {
      img: "https://sw-uploads-img.s3.eu-north-1.amazonaws.com/home_page_images/home_page_image_3.jpeg",
      title: "white Long-Sleeve t-shirt",
    },
  ];

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

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", background: "red" }}
        onClick={onClick}
      />
    );
  }
  
  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", background: "green" }}
        onClick={onClick}
      />
    );
  }

  const carouselSettings = {
    autoplay: true,
    autoplaySpeed: 2000,
    dots: true,
    arrows: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    style: { cursor: "pointer" },
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
        height: "100%",
        position: "relative",
        overflow: "hidden", // Ensure content stays within bounds
      }}
    >
      <img
        src={props.imageSrc}
        alt={props.altText}
        loading="lazy"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "white",
          backgroundColor: "#014D4E",
          fontSize: "24px",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
          textAlign: "center",
        }}
      >
        {props.text}
      </div>
    </Flex>
  );

  useEffect(() => {
    if (data) {
      debugger;
      let top10Data = data?.slice(0, 10);
      setHomeData(top10Data);
    }
  }, [data]);

  const handleSplitter = (item) => {
    debugger;
    console.log("Splitter clicked", item);
    dispatch(headerSearchValueSuccess({ headerSearchValue: item?.title }));
      navigate("/products");
  };

  const handleSliderClick = (item) => {
    debugger;
    console.log("Splitter clicked", item);
    dispatch(headerSearchValueSuccess({ headerSearchValue: item }));
    navigate("/products");
  };

  return (
    <>
      <div className="HomeShoppingCollection-main">
        <div className="HomeShoppingCollection-heading">
          <h3>SHOP BY COLLECTION</h3>
        </div>
        <div className="HomeShoppingCollectioncollection-buttons">
          <div className="first2buttons">
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
          </div>
          <div className="last2buttons">
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
        </div>
        <div
          className="carousel-container"
          style={{ width: "80%", height: "100%", margin: "30px auto" }}
        >
          <Carousel {...carouselSettings}>
            <div style={contentStyle}>
              <img
                src="https://sw-uploads-img.s3.eu-north-1.amazonaws.com/home_page_images/home_page_image_7.jpeg"
                alt=""
                loading="lazy"
                style={{
                  // height: "300px",
                  width: "100%",
                  objectFit: "cover",
                  borderRadius: "4px",
                  border: "15px solid #fff",
                }}
                onClick={() => handleSliderClick("striped long sleeve")}
              />
            </div>
            <div style={contentStyle}>
              <img
                src="https://sw-uploads-img.s3.eu-north-1.amazonaws.com/home_page_images/home_page_image_8.jpeg"
                alt=""
                loading="lazy"
                style={{
                  // height: "300px",
                  width: "100%",
                  objectFit: "cover",
                  borderRadius: "4px",
                  border: "15px solid #fff",
                }}
                onClick={() => handleSliderClick("Black long sleeve tshirt")}
              />
            </div>
            <div style={contentStyle}>
              <img
                src="https://sw-uploads-img.s3.eu-north-1.amazonaws.com/home_page_images/home_page_image_9.jpeg"
                alt=""
                loading="lazy"
                style={{
                  // height: "300px",
                  width: "100%",
                  objectFit: "cover",
                  borderRadius: "4px",
                  border: "15px solid #fff",
                }}
                onClick={() => handleSliderClick("black floral dress")}
              />
            </div>
            <div style={contentStyle}>
              <img
                src="https://sw-uploads-img.s3.eu-north-1.amazonaws.com/home_page_images/home_page_image_10.jpeg"
                alt=""
                loading="lazy"
                style={{
                  // height: "300px",
                  width: "100%",
                  objectFit: "cover",
                  borderRadius: "4px",
                  border: "15px solid #fff",
                }}
                onClick={() => handleSliderClick("pink long sleeve tshirt")}
              />
            </div>
            <div style={contentStyle}>
              <img
                src="https://sw-uploads-img.s3.eu-north-1.amazonaws.com/home_page_images/home_page_image_11.jpeg"
                alt=""
                loading="lazy"
                style={{
                  // height: "300px",
                  width: "100%",
                  objectFit: "cover",
                  borderRadius: "4px",
                  border: "15px solid #fff",
                }}
                onClick={() => handleSliderClick("green sleeveless")}
              />
            </div>
          </Carousel>
          <div className="homeproductsection-main">
            {/* <HomeProductSection data={dummyData} /> */}{" "}
            {/** will uncomment when data comes */}
            {homeData && homeData?.length > 0 && (
              <HomeProductSection data={homeData} />
            )}
          </div>
        </div>
        <div className="splitter-div">
          <div
            className="bestselling-div"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              margin: "20px auto",
              fontSize: "20px",
              fontFamily: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.3rem",
            }}
          >
            <h3>Best Selling Collections</h3>
          </div>
          {/* <Splitter
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
          </Splitter> */}

          {/* <Splitter
            style={{
              height: "90vh", // Set height to viewport height
              width: "100%", // Ensure it stretches across the screen
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Splitter.Panel
              collapsible
              style={{
                border: "5px solid white",
                display: "flex",
                flexDirection: "column",
              }}
              onClick={() => console.log("Panel 1 clicked")}
            >
              <Desc
                imageSrc="https://sw-uploads-img.s3.eu-north-1.amazonaws.com/home_page_images/home_page_image_2.jpeg"
                altText="Image 1"
                onClick={() => alert("Image 1 clicked")}
                
              />
            </Splitter.Panel>
            <Splitter.Panel
              collapsible={{ start: true }}
              style={{
                border: "5px solid white",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Desc
                imageSrc="https://sw-uploads-img.s3.eu-north-1.amazonaws.com/home_page_images/home_page_image_5.jpeg"
                altText="Image 1"
                // text="Image 1"
              />
            </Splitter.Panel>
            <Splitter.Panel
              style={{
                border: "5px solid white",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Desc
                imageSrc="https://sw-uploads-img.s3.eu-north-1.amazonaws.com/home_page_images/home_page_image_4.jpeg"
                altText="Image 1"
                // text="Image 1"
              />
            </Splitter.Panel>
          </Splitter> */}

          <ImageList sx={{ width: "100%", height: "90vh", cursor: "pointer" }} cols={3} tabindex="0">
            {itemData.map((item) => (
              <ImageListItem key={item.img}>
                <img
                  srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                  src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                  alt={item.title}
                  loading="lazy"
                  onClick={() => handleSplitter(item)}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </div>
      </div>
    </>
  );
}

export default HomeShoppingCollection;
