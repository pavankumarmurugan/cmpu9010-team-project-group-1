import { Modal } from "antd";
import React, { useRef, useState } from "react";
import Draggable from "react-draggable";
import "../../Styles/VirtualTryOn.css";
import Homeproductimage_3 from "../../Assets/Homeproductimage_3.jpg";
import Homeproductimage_4 from "../../Assets/Homeproductimage_4.jpg";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import styled from "styled-components";
import { Tooltip, tooltipClasses } from "@mui/material";

const VirtualTryOn = (props) => {
  const [disabled, setDisabled] = useState(true);
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

  return (
    <div>
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
              <ShoppingBagOutlinedIcon
                className="hover-icon"
                sx={{
                  color: "white",
                  fontSize: "30px",
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  transition: "transform 0.3s, color 0.3s",
                  "&:hover": {
                    cursor: "pointer",
                    // color: "#ffcc00",
                    transform: "scale(1.5)",
                  },
                }}
              />
              <img
                className="Result-Image"
                loading="lazy"
                src={Homeproductimage_4}
                alt="product image"
              />
            </div>
            <div className="predefined-models">
              {/* <div className="Right-Div-heading">
                    <h1 style={{marginBottom:"15px", marginTop:"15px"}}>Choose a Model</h1>
                </div> */}
              <div className="Model-Images-div">
                <div className="VTO-card">
                  <div className="VTO-image-container">
                    <HtmlTooltip
                      title={
                        <React.Fragment>
                          <p>Size: 22</p>
                          <p>Color: red</p>
                        </React.Fragment>
                      }
                    >
                      <img
                      className="VTO-model--image"
                      loading="lazy"
                      src={Homeproductimage_3}
                      alt="product image"
                    />
                    </HtmlTooltip>
                  </div>
                </div>
                <div className="VTO-card">
                  <div className="VTO-image-container">
                    <img
                      className="VTO-model--image"
                      loading="lazy"
                      src={Homeproductimage_3}
                      alt="product image"
                    />
                  </div>
                </div>
                <div className="VTO-card">
                  <div className="VTO-image-container">
                    <img
                      className="VTO-model--image"
                      loading="lazy"
                      src={Homeproductimage_3}
                      alt="product image"
                    />
                  </div>
                </div>
                <div className="VTO-card">
                  <div className="VTO-image-container">
                    <img
                      className="VTO-model--image"
                      loading="lazy"
                      src={Homeproductimage_3}
                      alt="product image"
                    />
                  </div>
                </div>
                <div className="VTO-card">
                  <div className="VTO-image-container">
                    <img
                      className="VTO-model--image"
                      loading="lazy"
                      src={Homeproductimage_3}
                      alt="product image"
                    />
                  </div>
                </div>
                <div className="VTO-card">
                  <div className="VTO-image-container">
                    <img
                      className="VTO-model--image"
                      loading="lazy"
                      src={Homeproductimage_3}
                      alt="product image"
                    />
                  </div>
                </div>
                <div className="VTO-card">
                  <div className="VTO-image-container">
                    <img
                      className="VTO-model--image"
                      loading="lazy"
                      src={Homeproductimage_3}
                      alt="product image"
                    />
                  </div>
                </div>
                <div className="VTO-card">
                  <div className="VTO-image-container">
                    <img
                      className="VTO-model--image"
                      loading="lazy"
                      src={Homeproductimage_3}
                      alt="product image"
                    />
                  </div>
                </div>
                <div className="VTO-card">
                  <div className="VTO-image-container">
                    <img
                      className="VTO-model--image"
                      loading="lazy"
                      src={Homeproductimage_3}
                      alt="product image"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="Mobile-models-div">
              <div className="mobile-model-image-div">
                {/* {productimages.map((image, index) => ( */}
                <img
                  src={Homeproductimage_3}
                  loading="lazy"
                  alt="Product Imgae"
                  className="mobile-model-images"
                />
                <img
                  src={Homeproductimage_3}
                  loading="lazy"
                  alt="Product Imgae"
                  className="mobile-model-images"
                />
                <img
                  src={Homeproductimage_3}
                  loading="lazy"
                  alt="Product Imgae"
                  className="mobile-model-images"
                />
                <img
                  src={Homeproductimage_3}
                  loading="lazy"
                  alt="Product Imgae"
                  className="mobile-model-images"
                />
                <img
                  src={Homeproductimage_3}
                  loading="lazy"
                  alt="Product Imgae"
                  className="mobile-model-images"
                />
                <img
                  src={Homeproductimage_3}
                  loading="lazy"
                  alt="Product Imgae"
                  className="mobile-model-images"
                />
                <img
                  src={Homeproductimage_3}
                  loading="lazy"
                  alt="Product Imgae"
                  className="mobile-model-images"
                />
                {/* ))} */}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default VirtualTryOn;
