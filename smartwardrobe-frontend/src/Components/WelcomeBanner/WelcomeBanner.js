import { Button, Modal, Progress } from "antd";
import React, { useRef, useState } from "react";
import Draggable from "react-draggable";
import "../../Styles/WelcomeBanner.css";
import video3 from "../../Assets/video3.mp4";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const WelcomeBanner = (props) => {
  const [disabled, setDisabled] = useState(true);
  const [progressPercentage, setProgressPercentage] = useState(25);

  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const draggleRef = useRef(null);
  //   const handleCancel = (e) => {
  //     props?.closeModal();
  //   };
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

  const handleCloseModalBanner = () => {
    localStorage.setItem("firstlogin", JSON.stringify(false));
    props?.closeModal();
  };

  const handleBankForwardButton = (event) => {
    debugger;
    if (event === "back") {
      if (progressPercentage === 25) return;
      setProgressPercentage(progressPercentage - 25);
    } else {
      if (progressPercentage === 100){
        handleCloseModalBanner();
       return;
      }
      setProgressPercentage(progressPercentage + 25);
    }
  };

  return (
    <>
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
        open={props?.isShowModel}
        // width={"50%"}
        style={{ top: 20 }}
        onCancel={handleCloseModalBanner}
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
        <div className="banner-main-div">
          <div className="banner-heading">
            <h1 className="banner-mainheading">
              Discover Our Exciting Features
            </h1>
            <div className="sub-heading-skip">
              <p className="sub-heading">
                Watch these short videos to see how our new tools can elevate
                your shopping experience!
              </p>
            </div>
          </div>
          <div className="feature-description-div">
            {/* <Button
                className="Create-Button"
                color="default"
                // onClick={handleShareProduct}
              >
                Skip Preview
              </Button> */}
          </div>
          <div className="video-main-div" style={{ marginTop: "0px" }}>
            <video
              autoPlay
              muted
              loop
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "none",
                opacity: 1,
                transition: "none",
                position: "relative",
              }}
            >
              <source src={video3} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="progress-main-div">
            <p className="feature-description">
              {progressPercentage === 25 ? (
                <>
                  <b>
                    Virtual Try-On Using Preset Models & Its Customizations{" "}
                  </b>
                  <p>
                    <i>
                      Visualize outfits on preset models or customize to match
                      your style.
                    </i>
                  </p>
                </>
              ) : progressPercentage === 50 ? (
                <>
                  <b>Collaborative Chat & Share Products </b>

                  <p>
                    <i>
                      Chat with friends and share your favorite fashion finds
                      effortlessly.
                    </i>
                  </p>
                </>
              ) : progressPercentage === 75 ? (
                <>
                  <b>Image Search </b>
                  <p>
                    <i>Upload a photo to discover similar styles instantly.</i>
                  </p>
                </>
              ) : (
                <>
                  <b>Natural Language Search </b>
                  <p>
                    <i>
                      Search for products the way you talk—quick, easy, and
                      intuitive.
                    </i>
                  </p>
                </>
              )}
            </p>
            <div className="progress-bar">
              <Progress percent={progressPercentage} />
            </div>
            <div className="back-forward-buttons-div">
              {progressPercentage !== 25 && (
                <button
                  className="back-forward-buttons"
                  onClick={() => handleBankForwardButton("back")}
                >
                  Previous
                </button>
              )}
              <div>
                <p className="featurecount-text">{progressPercentage === 25 ? "1 of 4" : progressPercentage === 50 ? "2 of 4" : progressPercentage === 75 ? "3 of 4" : "4 of 4"}</p>
              </div>
              <button
                className="back-forward-buttons"
                onClick={() => handleBankForwardButton("forward")}
              >
                {progressPercentage === 100 ? "Done" : "Next"}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default WelcomeBanner;
