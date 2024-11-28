import React, { useEffect, useState } from "react";
import Headermenu from "../Headermenu/Headermenu";
import "../../Styles/ProductPage.css";
import ChatSection from "../ChatSection/ChatSection";
import SearchIcon from "@mui/icons-material/Search";
import {
  Backdrop,
  CircularProgress,
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
// import Homeproductimage_1 from "../../Assets/Homeproductimage_1.jpg";
// import Homeproductimage_2 from "../../Assets/Homeproductimage_2.jpg";
// import Homeproductimage_4 from "../../Assets/Homeproductimage_4.jpg";
import Carousel from "react-multi-carousel";
import { IoMdAdd, IoMdHeartEmpty, IoMdShare } from "react-icons/io";
import { RiFontSize, RiSubtractFill } from "react-icons/ri";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart, FaShare } from "react-icons/fa6";
import { WiStars } from "react-icons/wi";
import Footer from "../Footer/Footer";
import AccordionGroup from "@mui/joy/AccordionGroup";
import Accordion from "@mui/joy/Accordion";
import AccordionDetails from "@mui/joy/AccordionDetails";
import AccordionSummary from "@mui/joy/AccordionSummary";
import { Input } from "antd";
import { useLocation, useParams } from "react-router-dom";
import apiCall, { baseUrl } from "../GenericApiCallFunctions/GenericApiCallFunctions";
import VirtualTryOn from "../VirtualTryOn/VirtualTryOn";
import {
  addToCartValueSuccess,
  wishListValueSuccess,
} from "../../redux/slices/HomeDataSlice";
import { useDispatch, useSelector } from "react-redux";
import { showToastInfo } from "../GenericToasters/GenericToasters";
import NewChatModal from "../NewChatModal/NewChatModal";
import { Helmet } from "react-helmet";
import sizeChartImage from "../../Assets/sizeChartImage.webp";
import { IoHeart, IoShareOutline, IoShirtOutline } from "react-icons/io5";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  let { state } = location;
  const { id } = useParams();
  let token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  console.log(state?.item?.imageName, "productData");
  const [quantityvalue, setQuantityValue] = useState(1);
  const [showHideWishlist, setShowHideWishlist] = useState(true);
  const [openLoader, setOpenLoader] = useState(false);
  const [selectedSize, setSelectedSize] = useState("S");
  const [productimages, setProductImages] = useState([]);
  const [friendsListForShare, setFriendsListForShare] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [openTryOnModal, setOpenTryOnModal] = useState(false);
  const [showFriendsForShare, setShowFriendsForShare] = useState(false);
  const [showSection, setShowSection] = useState("ShareProductsToFriends");
  const [forAddFriendorCreateGroup, setforAddFriendorCreateGroup] = useState("");
  const imageUrl = productimages[currentImage];
  const [similarProductsData, setSimilarProductsData] = useState([]);
  const [likeData, setLikeData] = useState([]);
  const [cartData, setCartData] = useState([]);
  const cartValue = useSelector((state) => state.homeData.cartValue);

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

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

  const handleWishlist = async (e, productimages) => {
    debugger;
    if (!token) {
      showToastInfo("Please login to add to wishlist");
      return;
    }
    let data = {
      productId: productimages?.id,
      productSize: selectedSize,
    };
    if (e === "add") {
      setOpenLoader(true);
      let addWishlist = await apiCall(
        "POST",
       `${baseUrl}/likes/create`,
        data,
        token?.token
      );
      if (addWishlist?.statusCode?.text === "Success") {
        setShowHideWishlist(false);
      }
    } else {
      setOpenLoader(true);
      let addWishlist = await apiCall(
        "DELETE",
       `${baseUrl}/likes/delete/${productimages?.id}`,
        data,
        token?.token
      );
      if (addWishlist?.statusCode?.text === "Success") {
        setShowHideWishlist(true);
      }
    }
    if (token?.token) {
      const getLikeProducts = await apiCall(
        "GET",
        `${baseUrl}/likes/get-all`,
        null,
        token?.token
      );
      setOpenLoader(false);
      if (getLikeProducts.statusCode.text === "Success") {
        dispatch(
          wishListValueSuccess({ wishListValue: getLikeProducts?.data?.length })
        );
      }
    }
  };

  const handleAddToCart = async () => {
    debugger;

    if (!token) {
      showToastInfo("Please login to add to cart");
      return;
    }

    const getAllCartValues = await apiCall(
      "GET",
      `${baseUrl}/cart-item/get-all`,
      null,
      token?.token
    );
    if (getAllCartValues?.data?.length) {
      let check = getAllCartValues?.data?.find(
        (item) => item?.productId === productimages?.id
      );
      if (check) {
        const data = {
          id: check?.id,
          quantity: check?.quantity + quantityvalue,
        };
        setOpenLoader(true);
        const addToCart = await apiCall(
          "PATCH",
          `${baseUrl}/cart-item/update`,
          data,
          token?.token
        );
        if (addToCart.statusCode.text === "Success") {
          // dispatch(addToCartValueSuccess({ cartValue: cartValue + 1 }));
          setOpenLoader(false);
          return;
        }
      }
    }

    let data = {
      productId: productimages?.id,
      quantity: quantityvalue,
      size: selectedSize
    };
    setOpenLoader(true);
    const addToCart = await apiCall(
      "POST",
      `${baseUrl}/cart-item/create`,
      data,
      token?.token
    );
    setOpenLoader(false);
    if (addToCart.statusCode.text === "Success") {
      dispatch(addToCartValueSuccess({ cartValue: cartValue + 1 }));
    }
  };

  useEffect(() => {
    debugger;
    console.log('reload')
    callApiForModels();
  }, []);

  const callApiForModels = async () => {
    debugger;
    let numberString = Number(id);

    // let number = parseInt(numberString);
    setOpenLoader(true);
    const getModels = await apiCall(
      "GET",
      `${baseUrl}/product/get-one/${numberString}`,
      null
    );
    setOpenLoader(false);
    if (getModels) {
      console.log(getModels?.data, "details");
      setProductImages(getModels?.data);
    }
    if (token?.token) {
      setOpenLoader(true);
      const getLikeProducts = await apiCall(
        "GET",
        `${baseUrl}/likes/get-all`,
        null,
        token?.token
      );
      setOpenLoader(false);
      if (getLikeProducts) {
        setLikeData(getLikeProducts?.data);
        let check = getLikeProducts?.data?.find(
          (item) =>
            item?.productId === numberString ||
            item?.productId === productimages?.id
        );
        if (check) {
          setShowHideWishlist(false);
        }
      }
      setOpenLoader(false);

      setOpenLoader(true);
      let similarProductsHeaders = {
        topN: 10,
        imageName: getModels?.data?.imageName,
      };
      const getSimilarProducts = await apiCall(
        "POST",
        `${baseUrl}/recommend/similar-products`,
        similarProductsHeaders
      );
      setOpenLoader(false);
      if (getSimilarProducts) {
        setSimilarProductsData(getSimilarProducts?.data);
      }
    }
  };

  /** this is to handle tryon modal */
  const handleTryon = (data) => {
    debugger;
    localStorage.setItem("VTOData", JSON.stringify(data));
    setOpenTryOnModal(true);
  };

  const handleShare = async (data) => {
    debugger;

    if (!token) {
      showToastInfo("Please login to share products");
      return;
    }

    // setOpenLoader(true);
    // const getGroupsList = await apiCall(
    //   "GET",
    //   `${baseUrl}/group/get-my-groups`,
    //   null,
    //   token?.token
    // );

    // const getFriendsList = await apiCall(
    //   "GET",
    //   `${baseUrl}/friends/get-all-my-friends`,
    //   null,
    //   token?.token
    // );
    // setOpenLoader(false);
    let friends = localStorage.getItem("friendIds")
  ? JSON.parse(localStorage.getItem("friendIds"))
  : null;
  let groups = localStorage.getItem("groupIds")
  ? JSON.parse(localStorage.getItem("groupIds"))
  : null;
    setFriendsListForShare([...friends, ...groups]);
    setShowFriendsForShare(true);
  };

  const closeNewChat = () => {
    setShowFriendsForShare(false);
    setShowSection("ShareProductsToFriends");
  };

  const closeTryOnModal = () => {
    setOpenTryOnModal(false);
  };
  /** this is to handle tryon modal */

  const handleButtonClick = (size) => {
    setSelectedSize(size);
  };

  const handleSimilarProductsClick = async (item) => {
    debugger;
    setOpenLoader(true);
    let productId = item?.id;
    const getModels = await apiCall(
      "GET",
      `${baseUrl}/product/get-one/${productId}`,
      null
    );
    setOpenLoader(false);
    if (getModels) {
      console.log(getModels?.data, "details");
      setProductImages(getModels?.data);
    }
    if (token?.token) {
      setOpenLoader(true);
      const getLikeProducts = await apiCall(
        "GET",
        `${baseUrl}/likes/get-all`,
        null,
        token?.token
      );
      setOpenLoader(false);
      if (getLikeProducts) {
        let check = getLikeProducts?.data?.find(
          (item) => item?.productId === productId
        );
        if (check) {
          setShowHideWishlist(false);
        } else {
          setShowHideWishlist(true);
        }
      }
    }
  };

  const handleTryOn = () => {
    debugger
    handleTryon(productimages);
  }

  const handleChangeContent = (value) => {
    debugger;
    setShowSection(value);
    setforAddFriendorCreateGroup(value);
  }

  return (
    <div>
      <Helmet>
        <title>{productimages?.type || "Product Details"}</title>
        <meta
          name="description"
          content={
            productimages?.description || "Product description goes here."
          }
        />
        {/* OpenGraph Tags */}
        <meta
          property="og:title"
          content={productimages?.type || "Product Title"}
        />
        <meta
          property="og:description"
          content={
            productimages?.description || "Product description goes here."
          }
        />
        <meta
          property="og:image"
          content={productimages?.imageUrl || "default-image-url.jpg"}
        />
        <meta
          property="og:url"
          content={`${window.location.origin}${location.pathname}${location.search}`}
        />
        <meta property="og:type" content="product" />
        {/* Twitter Cards */}
        <meta
          name="twitter:title"
          content={productimages?.type || "Product Title"}
        />
        <meta
          name="twitter:description"
          content={
            productimages?.description || "Product description goes here."
          }
        />
        <meta
          name="twitter:image"
          content={productimages?.imageUrl || "default-image-url.jpg"}
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {showFriendsForShare && (
        <NewChatModal
          isShowModel={showFriendsForShare}
          closeModal={closeNewChat}
          showSection={showSection}
          data={null}
          changeSection={handleChangeContent}
          fromProductsDetails={forAddFriendorCreateGroup}
          friendsListForShare={friendsListForShare}
          productUrl={`${window.location.origin}${location.pathname}${location.search}`}
        />
      )}
      {/** Virtual Tryon Component */}

      {openTryOnModal && (
        <VirtualTryOn
          isShowModel={openTryOnModal}
          closeModal={closeTryOnModal}
        />
      )}

      {/** Virtual Tryon Component */}

      {/** loader code */}
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={openLoader}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/** loader code */}
      <Headermenu />
      <div className="SearchedContent-div product-details-content">
        <div className="products">
          <div className="product-details-conatiner">
            <div className="vertical-product-image-div">
              <div className="vertical-product-images">
                {/* {productimages?.map((image, index) => (
                  <img
                    src={image}
                    loading="lazy"
                    alt="Product Imgae"
                    className="product-details-side-images"
                    key={index}
                    onClick={(e) => setCurrentImage(index)}
                  />
                ))} */}
              </div>
            </div>
            <div className="main-iamge-and-description">
              <div className="product-details-main-image-div">
                <img
                  src={productimages?.imageUrl}
                  loading="lazy"
                  alt={
                    productimages?.description?.length > 70
                      ? productimages?.description.slice(0, 70) + "..."
                      : productimages?.description
                  }
                  className="product-details-main-image"
                />
                {/* <button
                  className="product-detailsimage-top-left-button"
                  onClick={() => handleShare(productimages)}
                >
                  Share
                </button> */}
                {/* {productimages?.trail && (
                  <button
                    className="product-detailsimage-top-right-button"
                    onClick={() => handleTryon(productimages)}
                  >
                    Try On
                  </button>
                )} */}
                {/* <button className="product-detailsimage-bottom-right-button">
                  Create Your Avatar
                </button> */}
              </div>
              <div className="Products-Details-div">
                <div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <h1>{productimages?.name}</h1>
                    <div className="share-details-main-div share-deatils-laptop">
                      {productimages && productimages?.trail && (
                        <div className="details-virtualtryon-buttons" onClick={handleTryOn}>
                          {/* <IoShirtOutline
                            style={{ width: "20px", height: "20px" }}
                          /> */}
                          <WiStars style={{ width: "30px", height: "30px" }} />
                          <b>Virtual Try-on</b>
                        </div>
                      )}
                      <div
                        className="details-share-buttons"
                        onClick={() => handleShare(productimages)}
                      >
                        <IoShareOutline
                          style={{ width: "25px", height: "25px" }}
                        />
                      </div>
                      <div className="details-heart-buttons">
                        {showHideWishlist ? (
                          <>
                            <IoMdHeartEmpty
                              style={{
                                width: "25px",
                                height: "25px",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                handleWishlist("add", productimages)
                              }
                            />
                          </>
                        ) : (
                          <>
                            <FaHeart
                              style={{
                                width: "25px",
                                height: "25px",
                                cursor: "pointer",
                                color: "red",
                              }}
                              onClick={() =>
                                handleWishlist("remove", productimages)
                              }
                            />
                          </>
                        )}
                      </div>
                    </div>
                    {/* <button
                  className="product-detailsimage-share-button"
                  onClick={() => handleShare(productimages)}
                >
                  <IoMdShare style={{width:"20px", height:"20px", color:"white"}}/>
                  Share
                </button> */}
                    {/* <Button className="share-button" onClick={handleAddToCart}>
                <IoShareOutline style={{width:"25px", height:"25px", color:"white"}} />
                      Share
                </Button> */}
                  </div>
                  <h3>&#8364;{Number(productimages?.price)}</h3>
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
                        style={{ backgroundColor: productimages?.color }}
                      ></div>
                      {/* <div
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
                      ></div> */}
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
                      {["S", "M", "L", "XL"].map((size) => (
                        <button
                          key={size}
                          className={`size-options ${
                            selectedSize === size ? "selected" : ""
                          }`}
                          onClick={() => handleButtonClick(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="quantity-contianer">
                    <h5 className="quantity-text">Quantity</h5>
                    <div className="quantity-input-div">
                      <Input
                        className="quantity-button"
                        aria-label="quantity"
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
                <div className="share-details-main-div share-deatils-mobile">
                      {productimages && productimages?.trail && (
                        <div className="details-virtualtryon-buttons" onClick={handleTryOn}>
                          <IoShirtOutline
                            style={{ width: "20px", height: "20px" }}
                          />
                          Virtual Try on
                        </div>
                      )}
                      <div
                        className="details-share-buttons"
                        onClick={() => handleShare(productimages)}
                      >
                        <IoShareOutline
                          style={{ width: "25px", height: "25px" }}
                        />
                      </div>
                      <div className="details-heart-buttons">
                        {showHideWishlist ? (
                          <>
                            <IoMdHeartEmpty
                              style={{
                                width: "25px",
                                height: "25px",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                handleWishlist("add", productimages)
                              }
                            />
                          </>
                        ) : (
                          <>
                            <FaHeart
                              style={{
                                width: "25px",
                                height: "25px",
                                cursor: "pointer",
                                color: "red",
                              }}
                              onClick={() =>
                                handleWishlist("remove", productimages)
                              }
                            />
                          </>
                        )}
                      </div>
                    </div>
                <div className="add-to-cart-buttons-div">
                  <div className="cart-buttons-div">
                    <Button className="cart-button" onClick={handleAddToCart}>
                      ADD TO CART
                    </Button>
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
                      <AccordionDetails
                        sx={{
                          fontSize: "smaller",
                          textTransform: "capitalize",
                          letterSpacing: "0.1rem",
                        }}
                      >
                        {productimages?.description}
                      </AccordionDetails>
                    </Accordion>
                    <Accordion
                      sx={{
                        backgroundColor: "#f0f0f0",
                        // marginBottom: "10px",
                        borderBottom: "none",
                      }}
                    >
                      <AccordionSummary>
                        FABRIC & HOW TO LOOK AFTER ME
                      </AccordionSummary>
                      <AccordionDetails
                        sx={{
                          fontSize: "smaller",
                          textTransform: "capitalize",
                          letterSpacing: "0.1rem",
                        }}
                      >
                        {`${productimages?.material} Wash in cold water, tumble dry low, and iron as needed for best care.`}
                      </AccordionDetails>
                    </Accordion>
                    <Accordion
                      sx={{
                        backgroundColor: "#f0f0f0",
                        // marginBottom: "10px",
                        borderBottom: "none",
                      }}
                    >
                      <AccordionSummary>SIZE GUIDE</AccordionSummary>
                      <AccordionDetails
                        sx={{
                          fontSize: "smaller",
                          textTransform: "capitalize",
                          letterSpacing: "0.1rem",
                        }}
                      >
                        <img src={sizeChartImage} alt="size chart" />
                      </AccordionDetails>
                    </Accordion>
                  </AccordionGroup>
                </div>
              </div>
            </div>
          </div>
        </div>

        {similarProductsData?.length > 0 && (
          <div className="Similar-Products-div">
            <h3 className="similar-products-heading-deatils">
              SIMILAR PRODUCTS
            </h3>
            <div className="Similar-Products-Images">
              <Carousel responsive={responsive} autoPlaySpeed={1500}>
                {similarProductsData?.map((items, index) => (
                  <div className="card">
                    <img
                      className="product--image"
                      loading="lazy"
                      src={items?.imageUrl}
                      alt="Similar_productimage"
                      onClick={() => handleSimilarProductsClick(items)}
                    />
                    <h3 style={{ fontSize: "18px" }}>{items?.name}</h3>
                    <p className="description">{items?.type}</p>
                    <p className="price" style={{ fontSize: "15px" }}>
                      {items?.price}
                    </p>
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetails;
