import React, { useState } from "react";
import Headermenu from "../Headermenu/Headermenu";
import "../../Styles/ProductPage.css";
import ChatSection from "../ChatSection/ChatSection";
import SearchIcon from "@mui/icons-material/Search";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  SvgIcon,
} from "@mui/material";
import { styled } from "@mui/joy";
import Button from "@mui/joy/Button";
import { handleImageUpload } from "../GenericCode/GenericCode";
import Homeproductimage_1 from "../../Assets/Homeproductimage_1.jpg";
import Homeproductimage_2 from "../../Assets/Homeproductimage_2.jpg";
import Homeproductimage_4 from "../../Assets/Homeproductimage_4.jpg";
import { IoMdAdd } from "react-icons/io";
import { RiSubtractFill } from "react-icons/ri";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import Footer from "../Footer/Footer";
import AccordionGroup from "@mui/joy/AccordionGroup";
import Accordion from "@mui/joy/Accordion";
import AccordionDetails from "@mui/joy/AccordionDetails";
import AccordionSummary from "@mui/joy/AccordionSummary";

import { Input } from "antd";

const ProductDetails = () => {
  const [quantityvalue, setQuantityValue] = useState(1);
  const [showHideWishlist, setShowHideWishlist] = useState(true);
  const [selectedSize, setSelectedSize] = useState(1);
  const [productimages, setProductImages] = useState([
    Homeproductimage_1,
    Homeproductimage_2,
    Homeproductimage_4,
    Homeproductimage_1,
    Homeproductimage_2,
    Homeproductimage_4,
  ]);
  const [currentImage, setCurrentImage] = useState(0);
  const imageUrl = productimages[currentImage];

  const VisuallyHiddenInput = styled("input")`
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    bottom: 0;
    left: 0;
    white-space: nowrap;
    width: 1px;
  `;

  const handleQuantityChange = (e) => {
    if (e === "add") {
      setQuantityValue(quantityvalue + 1);
    } else {
      if (quantityvalue > 1) {
        setQuantityValue(quantityvalue - 1);
      }
    }
  };

  const handleWishlist = (e) => {
    debugger;
    if (e === "add") {
      setShowHideWishlist(false);
    } else {
      setShowHideWishlist(true);
    }
  };

  
const imageUpload = async (e) => {
  debugger;
  let imageData = await handleImageUpload(e);

  console.log(imageData)
}

  return (
    <div>
      <Headermenu />
      <div className="SearchedContent-div product-details-content">
        <div className="products">
          <div className="product-details-conatiner">
            <div className="vertical-product-image-div">
              <div className="vertical-product-images">
                {productimages.map((image, index) => (
                  <img
                    src={image}
                    loading="lazy"
                    alt="Product Imgae"
                    className="product-details-side-images"
                    key={index}
                    onClick={(e) => setCurrentImage(index)}
                  />
                ))}
              </div>
            </div>
            <div className="main-iamge-and-description">
              <div className="product-details-main-image-div">
                <img
                  src={productimages[currentImage]}
                  loading="lazy"
                  alt="Product Image"
                  className="product-details-main-image"
                />
                <button className="product-detailsimage-top-right-button">Try Out</button>
                <button className="product-detailsimage-bottom-right-button">Create Your Avatar</button>
              </div>
              <div className="Products-Details-div">
                <div>
                  <h1>Zapara Wedding Suit</h1>
                  <h3>&#8364;49.99</h3>
                </div>
                <div>
                  <div className="colour-div">
                    <h5 className="colour-text">COLOUR</h5>
                    {/** this is for when data comes */}
                    {/* <div class="color-swatch-container"> 
                {data?.map((color, index) => (
                  <div
                  class="color-swatch"
                  style={{ backgroundColor: color }}
                ></div>
                ))}
                </div> */}
                    <div class="color-swatch-container">
                      <div
                        class="color-swatch"
                        style={{ backgroundColor: "lightsalmon" }}
                      ></div>
                      <div
                        class="color-swatch"
                        style={{ backgroundColor: "lightblue" }}
                      ></div>
                      <div
                        class="color-swatch"
                        style={{ backgroundColor: "lightslategray" }}
                      ></div>
                      <div
                        class="color-swatch"
                        style={{ backgroundColor: "lightsteelblue" }}
                      ></div>
                      <div
                        class="color-swatch"
                        style={{ backgroundColor: "lightpink" }}
                      ></div>
                    </div>
                  </div>
                  <div className="size-div">
                    <h5 className="size-text">Size</h5>
                    {/** this is for when data comes */}
                    {/* <div className="size-container"> 
                {data?.map((size, index) => (
                  <div
                  className={`size-options ${selectedSize === size ? 'selected' : ''}`}
                >{size}</div>
                ))}
                </div> */}
                    <div class="size-container">
                      <Button className="size-options">8</Button>
                      <Button className="size-options">9</Button>
                      <Button className="size-options">10</Button>
                    </div>
                  </div>
                  <div className="quantity-contianer">
                    <h5 className="quantity-text">Quantity</h5>
                    <div className="quantity-input-div">
                      <Input
                        className="quantity-button"
                        prefix={
                          <RiSubtractFill
                            onClick={(e) => handleQuantityChange("sub")}
                          />
                        }
                        suffix={
                          <IoMdAdd
                            onClick={(e) => handleQuantityChange("add")}
                          />
                        }
                        value={quantityvalue}
                      />
                    </div>
                  </div>
                </div>
                <div className="add-to-cart-buttons-div">
                  <div className="whishlist-div">
                    {showHideWishlist ? (
                      <>
                        <FaRegHeart
                          style={{
                            width: "25px",
                            height: "25px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleWishlist("add")}
                        />
                        <p className="wishlist-text">Add to Wishlist</p>
                      </>
                    ) : (
                      <>
                        <FaHeart
                          style={{
                            width: "25px",
                            height: "25px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleWishlist("remove")}
                        />
                        <p className="wishlist-text">Remove from Wishlist</p>
                      </>
                    )}
                  </div>
                  <div className="cart-buttons-div">
                    <Button className="cart-button">ADD TO CART</Button>
                    <Button className="buy-button">BUY NOW</Button>
                  </div>
                </div>
                <div className="accordian-div">
                  <AccordionGroup sx={{ maxWidth: 800, gap: 1 }}>
                    <Accordion
                      sx={{
                        backgroundColor: "#f0f0f0",
                        // marginBottom: "10px",
                        borderBottom: "none",
                      }}
                    >
                      <AccordionSummary>DESCRIPTION</AccordionSummary>
                      <AccordionDetails>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                      </AccordionDetails>
                    </Accordion>
                    <Accordion
                    sx={{
                      backgroundColor: "#f0f0f0",
                      // marginBottom: "10px",
                      borderBottom: "none",
                    }}>
                      <AccordionSummary>
                        FABRIC & HOW TO LOOK AFTER ME
                      </AccordionSummary>
                      <AccordionDetails>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                      </AccordionDetails>
                    </Accordion>
                    <Accordion
                    sx={{
                      backgroundColor: "#f0f0f0",
                      // marginBottom: "10px",
                      borderBottom: "none",
                    }}>
                      <AccordionSummary>SIZE GUIDE</AccordionSummary>
                      <AccordionDetails>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                      </AccordionDetails>
                    </Accordion>
                  </AccordionGroup>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="chat">
          <div className="chat-content">
            <ChatSection />
          </div>

          <div className="search-input-container">
            <FormControl
              sx={{ m: 1, width: "100%", maxWidth: "800px" }}
              variant="outlined"
            >
              <InputLabel
                sx={{
                  color: "black",
                  letterSpacing: "normal",
                  textTransform: "capitalize",
                  "&.Mui-focused": {
                    color: "black",
                    fontSize: "18px",
                  },
                }}
                htmlFor="outlined-adornment-password"
              >
                Search
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={"text"}
                style={{ width: "100%", backgroundColor: "#e9ecef" }}
                className="productsearch-input"
                autoComplete="off"
                endAdornment={
                  <InputAdornment position="end">
                    <Button
                      component="label"
                      role={undefined}
                      tabIndex={-1}
                      variant="outlined"
                      color="neutral"
                      style={{
                        border: "none",
                        width: "10px",
                        borderRadius: "50%",
                      }}
                      startDecorator={
                        <SvgIcon>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                            />
                          </svg>
                        </SvgIcon>
                      }
                    >
                      <VisuallyHiddenInput
                        type="file"
                        onChange={imageUpload}
                      />
                    </Button>
                    <IconButton
                      aria-label="toggle password visibility"
                      edge="end"
                    >
                      <SearchIcon style={{ color: "black" }} />
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                sx={{
                  height: "50px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "transparent",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(0, 0, 0, 0.5)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "black",
                    borderWidth: "2px",
                  },
                }}
              />
            </FormControl>
          </div>
        </div> */}
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetails;
