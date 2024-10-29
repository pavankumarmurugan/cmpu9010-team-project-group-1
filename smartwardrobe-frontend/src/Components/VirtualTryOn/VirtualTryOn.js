import { Modal } from "antd";
import React, { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import "../../Styles/VirtualTryOn.css";
import Homeproductimage_3 from "../../Assets/Homeproductimage_3.jpg";
import Homeproductimage_4 from "../../Assets/Homeproductimage_4.jpg";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import styled from "styled-components";
import {
  Backdrop,
  CircularProgress,
  Tooltip,
  tooltipClasses,
} from "@mui/material";
import apiCall from "../GenericApiCallFunctions/GenericApiCallFunctions";
import RecentlyViewed from "../RecentlyViewed/RecentlyViewed";
import Carousel from "react-multi-carousel";

const VirtualTryOn = (props) => {
  let DataClicked = JSON.parse(localStorage.getItem("VTOData")) || {};
  const [disabled, setDisabled] = useState(true);
  // const [currentImage, setCurrentImage] = useState(-1);
  const [resultImage, setResultImage] = useState(DataClicked?.imageUrl);
  const [openLoader, setOpenLoader] = useState(false);
  const [modelsDataFromApi, setModelsDataFromApi] = useState([]);
  const [similarProductsData, setSimilarProductsData] = useState([]);
  console.log(DataClicked, "DataClicked");
  const [dummyData, setDummyData] = useState([
    {
      image_id: "01066_00",
      url: "https://sw-uploads-img.s3.eu-north-1.amazonaws.com/models/01066_00.jpg",
    },
    {
      image_id: "00034_00",
      url: "https://sw-uploads-img.s3.eu-north-1.amazonaws.com/models/00035_00.jpg",
    },
    {
      image_id: "00034_00",
      url: "https://sw-uploads-img.s3.eu-north-1.amazonaws.com/models/00071_00.jpg",
    },
    {
      image_id: "00034_00",
      url: "https://sw-uploads-img.s3.eu-north-1.amazonaws.com/models/00135_00.jpg",
    },
    {
      image_id: "00034_00",
      url: "https://sw-uploads-img.s3.eu-north-1.amazonaws.com/models/00373_00.jpg",
    },
    {
      image_id: "00034_00",
      url: "https://sw-uploads-img.s3.eu-north-1.amazonaws.com/models/00814_00.jpg",
    },
  ]);
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
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const draggleRef = useRef(null);
  const handleCancel = (e) => {
    props?.closeModal();
  };
  const onStart = (_event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

  const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "black",
      color: "white",
      maxWidth: 220,
      fontSize: "14px",
      border: "1px solid #dadde9",
    },
  }));

  useEffect(() => {
    callApiForModels();
  }, []);

  const callApiForModels = async () => {
    debugger;
    if (!modelsDataFromApi?.length) {
      const data = {
        cloth_image_name: DataClicked?.imageName,
      };
      setOpenLoader(true);
      const getModels = await apiCall(
        "POST",
        "https://4001-34-143-156-185.ngrok-free.app/try-on",
        data
      );
      if (getModels) {
        setModelsDataFromApi(getModels?.image_links);
      }
      let similarProductsHeaders = {
        topN: 10,
        imageName: DataClicked?.imageName,
      };
      const getSimilarProducts = await apiCall(
        "POST",
        "https://smartwardrobe-backend.azurewebsites.net/recommend/similar-products",
        similarProductsHeaders
      );
      setOpenLoader(false);
      if (getSimilarProducts) {
        setSimilarProductsData(getSimilarProducts?.data);
      }
    }
  };

  const changeModalOnModelClick = (index) => {
    // setCurrentImage(-1);
    setResultImage(modelsDataFromApi?.[index]);
  };

  const handleSimilarProductsClick = (item) => {
    debugger
    console.log(item) 
    setResultImage(item?.imageUrl)
  }

  return (
    <div>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={openLoader}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Modal
        title={
          <div
            style={{
              width: "100%",
              cursor: "move",
            }}
            onMouseOver={() => {
              if (disabled) {
                setDisabled(false);
              }
            }}
            onMouseOut={() => {
              setDisabled(true);
            }}
            onFocus={() => {}}
            onBlur={() => {}}
          ></div>
        }
        style={{ top: 50 }}
        classNames="custom-modal"
        width={"80%"}
        open={props.isShowModel}
        onCancel={handleCancel}
        className="custom-modal"
        footer={[]}
        modalRender={(modal) => (
          <Draggable
            disabled={disabled}
            bounds={bounds}
            nodeRef={draggleRef}
            onStart={(event, uiData) => onStart(event, uiData)}
          >
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}
      >
        <div className="modal-container">
          {/* <h1> </h1> */}
          <h1 className="vto-heading">
            Find your fit: choose a model and let the virtual magic begin!
          </h1>
          <div className="Models-separation-div">
            <div className="model-result">
              <FavoriteBorderIcon
                className="hover-icon"
                sx={{
                  color: "black",
                  fontSize: "40px",
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                  transition: "transform 0.3s, color 0.3s",
                  "&:hover": {
                    cursor: "pointer",
                    transform: "scale(1.2)",
                  },
                }}
              />
              <ShoppingBagOutlinedIcon
                className="hover-icon"
                sx={{
                  color: "black",
                  fontSize: "40px",
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  transition: "transform 0.3s, color 0.3s",
                  "&:hover": {
                    cursor: "pointer",
                    // color: "#ffcc00",
                    transform: "scale(1.2)",
                  },
                }}
              />
              <img
                className="Result-Image"
                loading="lazy"
                src={resultImage}
                alt="product image"
              />
            </div>
            <div className="predefined-models">
              {/* <div className="Right-Div-heading">
                    <h1 style={{marginBottom:"15px", marginTop:"15px"}}>Choose a Model</h1>
                </div> */}
              <div className="Model-Images-div">
                {dummyData?.map((item, index) => (
                  <div className="VTO-card">
                    <div className="VTO-image-container">
                      <img
                        className="VTO-model--image"
                        loading="lazy"
                        src={item?.url}
                        alt="product image"
                        onClick={() => changeModalOnModelClick(index)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="Mobile-models-div">
              <div className="mobile-model-image-div">
                {dummyData?.map((item, index) => (
                  <img
                    src={item?.url}
                    loading="lazy"
                    alt="Product Imgae"
                    className="mobile-model-images"
                  />
                ))}
              </div>
            </div>
          </div>

          {similarProductsData?.length > 0 && (
            <div className="Similar-Products-div">
              <h1 className="similar-products-heading">SIMILAR PRODUCTS</h1>
              <div className="Similar-Products-Images">
                <Carousel responsive={responsive} autoPlaySpeed={1500}>
                  {similarProductsData?.map((items, index) => (
                    <div className="card">
                      <img
                        className="product--image"
                        loading="lazy"
                        src={items?.imageUrl}
                        alt="product image"
                        onClick={() => handleSimilarProductsClick(items)}
                      />
                    </div>
                  ))}
                </Carousel>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default VirtualTryOn;
