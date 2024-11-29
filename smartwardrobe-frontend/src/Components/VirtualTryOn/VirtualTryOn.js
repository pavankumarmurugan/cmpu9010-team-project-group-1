import { Button, Modal } from "antd";
import React, { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import "../../Styles/VirtualTryOn.css";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import styled from "styled-components";
import {
  Backdrop,
  CircularProgress,
  Tooltip,
  tooltipClasses,
} from "@mui/material";
import apiCall, {
  baseUrl,
} from "../GenericApiCallFunctions/GenericApiCallFunctions";
import RecentlyViewed from "../RecentlyViewed/RecentlyViewed";
import Carousel from "react-multi-carousel";
import {
  showToastInfo,
  showToastSuccess,
} from "../GenericToasters/GenericToasters";
import { wishListValueSuccess } from "../../redux/slices/HomeDataSlice";
import { useDispatch } from "react-redux";
import { MdAddPhotoAlternate } from "react-icons/md";

const VirtualTryOn = (props) => {
  let token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const dispatch = useDispatch();
  let DataClicked = JSON.parse(localStorage.getItem("VTOData")) || {};
  const [disabled, setDisabled] = useState(true);
  // const [currentImage, setCurrentImage] = useState(-1);
  const [resultImage, setResultImage] = useState(DataClicked?.imageUrl);
  const [openLoader, setOpenLoader] = useState(false);
  const [modelsDataFromApi, setModelsDataFromApi] = useState([]);
  const [similarProductsClick, setSimilarProductsClick] = useState({});
  const [showHideWishlist, setShowHideWishlist] = useState(true);
  const [similarProductsData, setSimilarProductsData] = useState([]);
  const [personalizeModels, setPersonalizeModels] = useState(false);
  const [deletePersonalizeModels, setDeletePersonalizeModels] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [deleteButtonText, setDeleteButtonText] =
    useState("Delete Demo Models");
  const [userModels, setUserModels] = useState(0);
  const [selectedCustomModels, setSelectedCustomModels] = useState([]);
  const [selectedModelsUpdate, setSelectedModelsUpdate] = useState([]);
  const [apiData, setApiData] = useState([]);
  const [duplicateDummyData, setDuplicateDummyData] = useState([
    {
      modelImageName: "01066_00",
      modelImageUrl:
        "https://sw-uploads-img.s3.eu-north-1.amazonaws.com/models/01066_00.jpg",
    },
    {
      modelImageName: "00035_00",
      modelImageUrl:
        "https://sw-uploads-img.s3.eu-north-1.amazonaws.com/models/00035_00.jpg",
    },
    {
      modelImageName: "00071_00",
      modelImageUrl:
        "https://sw-uploads-img.s3.eu-north-1.amazonaws.com/models/00071_00.jpg",
    },
    {
      modelImageName: "00373_00",
      modelImageUrl:
        "https://sw-uploads-img.s3.eu-north-1.amazonaws.com/models/00373_00.jpg",
    },
    {
      modelImageName: "00814_00",
      modelImageUrl:
        "https://sw-uploads-img.s3.eu-north-1.amazonaws.com/models/00814_00.jpg",
    },
    {
      modelImageName: "06206_00",
      modelImageUrl:
        "https://sw-uploads-img.s3.eu-north-1.amazonaws.com/models/06206_00.jpg",
    },
  ]);
  const [dummyData, setDummyData] = useState([
    {
      modelImageName: "01066_00",
      modelImageUrl:
        "https://sw-uploads-img.s3.eu-north-1.amazonaws.com/models/01066_00.jpg",
    },
    {
      modelImageName: "00035_00",
      modelImageUrl:
        "https://sw-uploads-img.s3.eu-north-1.amazonaws.com/models/00035_00.jpg",
    },
    {
      modelImageName: "00071_00",
      modelImageUrl:
        "https://sw-uploads-img.s3.eu-north-1.amazonaws.com/models/00071_00.jpg",
    },
    {
      modelImageName: "00373_00",
      modelImageUrl:
        "https://sw-uploads-img.s3.eu-north-1.amazonaws.com/models/00373_00.jpg",
    },
    {
      modelImageName: "00814_00",
      modelImageUrl:
        "https://sw-uploads-img.s3.eu-north-1.amazonaws.com/models/00814_00.jpg",
    },
    // {
    //   modelImageName: "06206_00",
    //   modelImageUrl:
    //     "https://sw-uploads-img.s3.eu-north-1.amazonaws.com/models/06206_00.jpg",
    // },
  ]);
  const [customModels, setcustomModels] = useState([
    {
      modelImageName: "00279_00",
      modelImageUrl:
        "https://sw-uploads-img.s3.eu-north-1.amazonaws.com/models/00279_00.jpg",
    },
    {
      modelImageName: "00491_00",
      modelImageUrl:
        "https://sw-uploads-img.s3.eu-north-1.amazonaws.com/models/00491_00.jpg",
    },
    {
      modelImageName: "00548_00",
      modelImageUrl:
        "https://sw-uploads-img.s3.eu-north-1.amazonaws.com/models/00548_00.jpg",
    },
    {
      modelImageName: "02732_00",
      modelImageUrl:
        "https://sw-uploads-img.s3.eu-north-1.amazonaws.com/models/02732_00.jpg",
    },
    {
      modelImageName: "00373_00",
      modelImageUrl:
        "https://sw-uploads-img.s3.eu-north-1.amazonaws.com/models/00373_00.jpg",
    },
    {
      modelImageName: "00814_00",
      modelImageUrl:
        "https://sw-uploads-img.s3.eu-north-1.amazonaws.com/models/00814_00.jpg",
    },
    {
      modelImageName: "03085_00",
      modelImageUrl:
        "https://sw-uploads-img.s3.eu-north-1.amazonaws.com/models/03085_00.jpg",
    },
    {
      modelImageName: "00071_00",
      modelImageUrl:
        "https://sw-uploads-img.s3.eu-north-1.amazonaws.com/models/00071_00.jpg",
    },
    {
      modelImageName: "05576_00",
      modelImageUrl:
        "https://sw-uploads-img.s3.eu-north-1.amazonaws.com/models/05576_00.jpg",
    },
    {
      modelImageName: "05941_00",
      modelImageUrl:
        "https://sw-uploads-img.s3.eu-north-1.amazonaws.com/models/05941_00.jpg",
    },
    {
      modelImageName: "06206_00",
      modelImageUrl:
        "https://sw-uploads-img.s3.eu-north-1.amazonaws.com/models/06206_00.jpg",
    },
    {
      modelImageName: "08137_00",
      modelImageUrl:
        "https://sw-uploads-img.s3.eu-north-1.amazonaws.com/models/08137_00.jpg",
    },
    {
      modelImageName: "08151_00",
      modelImageUrl:
        "https://sw-uploads-img.s3.eu-north-1.amazonaws.com/models/08151_00.jpg",
    },
    {
      modelImageName: "09958_00",
      modelImageUrl:
        "https://sw-uploads-img.s3.eu-north-1.amazonaws.com/models/09958_00.jpg",
    },
    {
      modelImageName: "10228_00",
      modelImageUrl:
        "https://sw-uploads-img.s3.eu-north-1.amazonaws.com/models/10228_00.jpg",
    },
    {
      modelImageName: "01066_00",
      modelImageUrl:
        "https://sw-uploads-img.s3.eu-north-1.amazonaws.com/models/01066_00.jpg",
    },
    {
      modelImageName: "00035_00",
      modelImageUrl:
        "https://sw-uploads-img.s3.eu-north-1.amazonaws.com/models/00035_00.jpg",
    },
    {
      modelImageName: "11486_00",
      modelImageUrl:
        "https://sw-uploads-img.s3.eu-north-1.amazonaws.com/models/11486_00.jpg",
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
    callApiForModels(null, null);
  }, []);

  const callApiForModels = async (from, imageName) => {
    debugger;
    let data;
    if (!modelsDataFromApi?.length || from === "fromSimilarProducts") {
      data = imageName ? imageName : DataClicked?.imageName;
      setSelectedProduct(data);
      // setOpenLoader(true);
      // let similarProductsHeaders = {
      //   topN: 10,
      //   imageName: DataClicked?.imageName,
      // };
      // const getSimilarProducts = await apiCall(
      //   "POST",
      //   `${baseUrl}/recommend/similar-products`,
      //   similarProductsHeaders
      // );
      // setOpenLoader(false);
      // if (getSimilarProducts) {
      //   setSimilarProductsData(getSimilarProducts?.data);
      // }
    }
    let createDataForVTOModels = {
      modelImageName: [],
      imageName: data,
    };
    setOpenLoader(true);
    let dataForVTOModels = [];
    if (token?.token) {
      const getLikedModels = await apiCall(
        "GET",
        `${baseUrl}/user-liked-models/user-liked-models`,
        null,
        token?.token
      );
      dataForVTOModels = dummyData;
      if (getLikedModels?.data?.length > 0) {
        debugger;
        setApiData(getLikedModels?.data);
        setDummyData(getLikedModels?.data);
        setSelectedCustomModels(getLikedModels?.data);
        dataForVTOModels = getLikedModels?.data;
        // setSelectedCustomModels( [ ...selectedCustomModels , ...getLikedModels?.data]);
        // setUserModels(getLikedModels?.data?.length);
        // getLikedModels?.data?.map((item) => {
        //   createDataForVTOModels.modelImageName.push(
        //     item?.modelImageName + ".jpg"
        //   );
        //   setDeletePersonalizeModels(true);
        // });
      }
    } else {
      dataForVTOModels = duplicateDummyData;
    }

    dataForVTOModels?.map((item) => {
      createDataForVTOModels.modelImageName.push(item?.modelImageName + ".jpg");
    });

    const getModelsAccordingTOImage = await apiCall(
      "POST",
      `${baseUrl}/vto-image-search/get-all-v2`,
      createDataForVTOModels,
      token?.token
    );
    setOpenLoader(false);
    if (getModelsAccordingTOImage) {
      setModelsDataFromApi(getModelsAccordingTOImage?.data);
    }
  };

  const changeModalOnModelClick = (index) => {
    // setCurrentImage(-1);
    debugger;
    if (modelsDataFromApi?.length && !personalizeModels) {
      setResultImage(modelsDataFromApi?.[index].vtoS3Url);
    }

    if (personalizeModels) {
      setResultImage(customModels?.[index].modelImageUrl);
    }
  };

  const handleSimilarProductsClick = (item) => {
    debugger;
    setShowHideWishlist(true);
    setSimilarProductsClick(item);
    setResultImage(item?.imageUrl);
    callApiForModels("fromSimilarProducts", item?.imageName);
  };

  const handleSelectCustomModelCheckbox = async (e, item) => {
    debugger;

    // if (selectedCustomModels?.length >= 6 && e.target.checked) {
    //   showToastInfo("You can select only 6 custom models");
    //   e.target.checked = false;
    //   return;
    // }

    if (e.target.checked) {
      setSelectedCustomModels([...selectedCustomModels, item]);
      setSelectedModelsUpdate([...selectedModelsUpdate, item]);
    } else {
      console.log(dummyData);
      console.log(apiData);
      setSelectedCustomModels(
        selectedCustomModels.filter(
          (x) => x.modelImageName !== item?.modelImageName
        )
      );
      setUserModels(userModels - 1);
      let dataCorrection = selectedCustomModels?.map((model) => {
        const updatedModel = dummyData?.find(
          (data) => data?.modelImageName === model?.modelImageName
        );
        return updatedModel ? updatedModel : model;
      });
      let createDataForDeleteModel = apiData.filter(
        (x) => x.modelImageName === item?.modelImageName
      );
      setOpenLoader(true);
      if (createDataForDeleteModel[0]?.id) {
        const deleteModel = await apiCall(
          "DELETE",
          `${baseUrl}/user-liked-models/delete/${createDataForDeleteModel[0]?.id}`,
          null,
          token?.token
        );
        if (deleteModel?.message === "SUCCESSFULLY DELETED USER LIKED MODEL") {
          console.log(deleteModel);
          debugger;
          setSelectedModelsUpdate(
            selectedModelsUpdate.filter(
              (x) =>
                x.modelImageName !== createDataForDeleteModel[0]?.modelImageName
            )
          );
          setDummyData(
            selectedCustomModels.filter(
              (x) =>
                x.modelImageName !== createDataForDeleteModel[0]?.modelImageName
            )
          );
        }
      }

      setOpenLoader(false);
    }
  };

  const handleCustomModels = async (e, fromImage) => {
    debugger;
    if (deleteButtonText === "Done") {
      return;
    }
    if (
      e?.target?.innerHTML === "Custom Demo Models" ||
      fromImage === "Custom Demo Models"
    ) {
      if (!token) {
        showToastInfo("Please login to add custom models");
        return;
      }
      setPersonalizeModels(true);
    } else {
      if (selectedCustomModels?.length > 0) {
        if (selectedCustomModels?.length === 0) {
          setPersonalizeModels(false);
          return;
        }

        const apiCalls = selectedModelsUpdate?.map((item) => {
          const data = {
            modelImageName: item?.modelImageName,
            modelImageUrl: item?.modelImageUrl,
          };
          return apiCall(
            "POST",
            `${baseUrl}/user-liked-models/create`,
            data,
            token?.token
          );
        });
        let createDataForVTOModels = {
          modelImageName: [],
          imageName: selectedProduct,
        };
        setOpenLoader(true);
        const addCustomModels = await Promise.all(apiCalls);
        setOpenLoader(false);
        if (addCustomModels) {
          console.log(apiData);
          let dataforApiData = addCustomModels
            .map((item) => item?.data)
            .filter((data) => data !== undefined);
          setApiData([...apiData, ...dataforApiData]);
          setPersonalizeModels(false);
          // showToastSuccess("Custom models added successfully");
          let updatedData = addCustomModels.map((item) => item?.data);
          let dataCorrection = selectedCustomModels?.map((model) => {
            const updatedModel = updatedData?.find(
              (data) => data?.modelImageName === model?.modelImageName
            );
            return updatedModel ? updatedModel : model;
          });
          debugger;
          setDummyData(dataCorrection);
          console.log(selectedCustomModels);

          selectedCustomModels?.map((item) => {
            createDataForVTOModels.modelImageName.push(
              item?.modelImageName + ".jpg"
            );
          });

          const getModelsAccordingTOImage = await apiCall(
            "POST",
            `${baseUrl}/vto-image-search/get-all-v2`,
            createDataForVTOModels,
            token?.token
          );
          setOpenLoader(false);
          if (getModelsAccordingTOImage) {
            setModelsDataFromApi(getModelsAccordingTOImage?.data);
          }
        }
      } else {
        debugger;
        setDummyData(duplicateDummyData);
        setPersonalizeModels(false);
        let createDataForVTOModels = {
          modelImageName: [],
          imageName: selectedProduct,
        };
        duplicateDummyData?.map((item) => {
          createDataForVTOModels.modelImageName.push(
            item?.modelImageName + ".jpg"
          );
        });

        const getModelsAccordingTOImage = await apiCall(
          "POST",
          `${baseUrl}/vto-image-search/get-all-v2`,
          createDataForVTOModels,
          token?.token
        );
        setOpenLoader(false);
        if (getModelsAccordingTOImage) {
          setModelsDataFromApi(getModelsAccordingTOImage?.data);
        }
      }
    }
  };

  const handleCustomModelsDelete = async (e) => {
    debugger;
    if (personalizeModels) {
      return;
    }

    if (e?.target?.innerHTML === "Delete Demo Models") {
      setDeletePersonalizeModels(true);
      setDeleteButtonText("Done");
      return;
    } else {
      // setDeletePersonalizeModels(false);
      setDeleteButtonText("Delete Demo Models");
    }

    if (selectedCustomModels?.length > 0) {
      const apiCalls = selectedCustomModels.map((item) => {
        return apiCall(
          "DELETE",
          `${baseUrl}/user-liked-models/delete/${item?.id}`,
          null,
          token?.token
        );
      });
      setOpenLoader(true);
      const deleteCustomModels = await Promise.all(apiCalls);
      setOpenLoader(false);
      if (deleteCustomModels?.length > 0) {
        setUserModels(userModels - deleteCustomModels?.length);
        showToastInfo("Custom models deleted successfully");
        let filterDummyData = dummyData.filter(
          (item) => !selectedCustomModels.includes(item)
        );
        debugger;
        setDummyData(filterDummyData);
        setSelectedCustomModels([]);
      }
    }
  };

  const handleWishlist = async (e) => {
    debugger;
    if (!token) {
      showToastInfo("Please login to add to wishlist");
      return;
    }
    let data = {
      productId: similarProductsClick?.id
        ? similarProductsClick?.id
        : DataClicked?.id,
      productSize: "S",
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
        `${baseUrl}/likes/delete/${data?.productId}`,
        data,
        token?.token
      );
      if (addWishlist?.statusCode?.text === "Success") {
        setShowHideWishlist(true);
      }
    }
    // if(token?.token){

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

    // }
  };

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
        style={{ top: 20 }}
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
              marginTop: "15px",
            }}
          >
            <h1 className="vto-heading">
              {!personalizeModels
                ? "Find your fit: choose a model and let the virtual magic begin!"
                : "You can select custom models"}
            </h1>

            {/* <button
                className="asd"
                onClick={handleCustomModels}
              >
                {personalizeModels ? "Done" : "Custom Demo Models"}
          </button> */}
          </div>
          <div className="Models-separation-div">
            <div className="model-result">
              {/* {showHideWishlist ? (
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
                  onClick={() => handleWishlist("add")}
                />
              ) : (
                <FavoriteOutlinedIcon
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
                  onClick={() => handleWishlist("remove")}
                />
              )} */}
              {/* <button
                className="Select-Custom-Model-button"
                onClick={handleCustomModels}
              >
                {personalizeModels ? "Done" : "Custom Demo Models"}
              </button> */}
              <img
                className="Result-Image"
                loading="lazy"
                src={resultImage}
                alt="result_image"
              />
              <img
                src={DataClicked?.imageUrl}
                className="result-iamge-product"
                alt="product-selected-iamge"
              />
            </div>
            <div className="predefined-models">
              <div className="Model-Images-div">
                {personalizeModels ? (
                  <>
                    {customModels?.map((item, index) => (
                      <div className="VTO-card">
                        <div className="VTO-image-container">
                          <img
                            className="VTO-model--image"
                            loading="lazy"
                            src={item?.modelImageUrl}
                            alt="models_images"
                            onClick={() => changeModalOnModelClick(index)}
                          />
                          <input
                            type="checkbox"
                            className="custom-model-checkbox"
                            onClick={(e) =>
                              handleSelectCustomModelCheckbox(e, item)
                            }
                            defaultChecked={selectedCustomModels?.some(
                              (data) =>
                                data.modelImageName === item.modelImageName
                            )}
                          />
                        </div>
                      </div>
                    ))}
                    <button className="asd" onClick={handleCustomModels}>
                      {personalizeModels ? "Finish" : "Custom Demo Models"}
                    </button>
                  </>
                ) : (
                  <>
                    {Array.from({
                      length: Math.max(0, 1),
                    }).map((item, index) => (
                      <>
                        <div className="VTO-card" onClick={(e) =>
                                handleCustomModels(e, "Custom Demo Models")
                              }>
                          <div className="VTO-image-container">
                            <img
                              className="VTO-model--image"
                              loading="lazy"
                              src="https://sw-uploads-img.s3.eu-north-1.amazonaws.com/models/white_image.png"
                              alt="models_images"
                              // style={{ visibility: "hidden"}}
                              // onClick={() => changeModalOnModelClick(index)}
                            />
                            <div
                              className="add-icon-div"
                              // onClick={(e) =>
                              //   handleCustomModels(e, "Custom Demo Models")
                              // }
                            >
                              <MdAddPhotoAlternate
                                style={{ width: "35px", height: "35px" }}
                              />
                              <p>Add/Edit Models</p>
                            </div>
                          </div>
                        </div>
                      </>
                    ))}
                    {dummyData?.map((item, index) => (
                      <div className="VTO-card">
                        <div className="VTO-image-container">
                          <img
                            className="VTO-model--image"
                            loading="lazy"
                            src={item?.modelImageUrl}
                            alt="models_images"
                            onClick={() => changeModalOnModelClick(index)}
                          />
                          {deleteButtonText === "Done" && (
                            <input
                              type="checkbox"
                              className="custom-model-checkbox"
                              onClick={(e) =>
                                handleSelectCustomModelCheckbox(e, item)
                              }
                            />
                          )}
                        </div>
                      </div>
                    ))}
                    {dummyData?.length < 3 &&
                      Array.from({
                        length: Math.max(
                          2,
                          Math.min(3, dummyData?.length || 0)
                        ),
                      }).map((item, index) => (
                        <>
                          <div className="VTO-card">
                            <div className="VTO-image-container">
                              <img
                                className="VTO-model--image"
                                loading="lazy"
                                src="https://sw-uploads-img.s3.eu-north-1.amazonaws.com/models/white_image.png"
                                alt="models_images"
                                style={{ visibility: "hidden" }}
                                // onClick={() => changeModalOnModelClick(index)}
                              />
                            </div>
                          </div>
                        </>
                      ))}
                  </>
                )}
              </div>
            </div>
            <div className="Mobile-models-div">
              <div className="mobile-model-image-div">
                {!personalizeModels ? (
                  <>
                    {dummyData?.map((item, index) => (
                      <div className="mobile-custom-models-container">
                        <img
                          src={item?.modelImageUrl}
                          loading="lazy"
                          alt="modelImgae"
                          className="mobile-model-images"
                          onClick={() => changeModalOnModelClick(index)}
                        />
                        {deleteButtonText === "Done" && (
                          <input
                            type="checkbox"
                            className="custom-model-checkbox-mobile"
                            onClick={(e) =>
                              handleSelectCustomModelCheckbox(e, item)
                            }
                          />
                        )}
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {customModels?.map((item, index) => (
                      <div className="mobile-custom-models-container">
                        <img
                          src={item?.modelImageUrl}
                          loading="lazy"
                          alt="custommodelImgae"
                          className="mobile-model-images"
                          onClick={() => changeModalOnModelClick(index)}
                        />
                        <input
                          type="checkbox"
                          className="custom-model-checkbox-mobile"
                          onClick={(e) =>
                            handleSelectCustomModelCheckbox(e, item)
                          }
                        />
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* {similarProductsData?.length > 0 && (
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
          )} */}
        </div>
      </Modal>
    </div>
  );
};

export default VirtualTryOn;
