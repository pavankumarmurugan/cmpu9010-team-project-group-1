import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Headermenu from "../Headermenu/Headermenu";
import "../../Styles/ProductPage.css";
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

import Homeproductimage_1 from "../../Assets/Homeproductimage_1.jpg";
import Homeproductimage_2 from "../../Assets/Homeproductimage_2.jpg";
import Homeproductimage_3 from "../../Assets/Homeproductimage_3.jpg";
import Homeproductimage_4 from "../../Assets/Homeproductimage_4.jpg";
import Homeproductimage_5 from "../../Assets/Homeproductimage_5.jpg";
import Homeproductimage_6 from "../../Assets/Homeproductimage_6.jpg";
import {
  filterDataAccordingToUser,
  handleImageUpload,
  Productfilterdropdowns,
  ProductPageCards,
  ScrollButton,
} from "../GenericCode/GenericCode";
import Footer from "../Footer/Footer";
import { Divider, Input, Select, Space } from "antd";
import ChatSection from "../ChatSection/ChatSection";
import { styled } from "@mui/joy";
import Button from "@mui/joy/Button";
import apiCall from "../GenericApiCallFunctions/GenericApiCallFunctions";
import ProductPageSkeletonLoader from "../SkeletonLoaders/ProductPageSkeletonLoader";
import VirtualTryOn from "../VirtualTryOn/VirtualTryOn";
import { useDispatch, useSelector } from "react-redux";
import { headerSearchValueSuccess, homeDataSuccess } from "../../redux/slices/HomeDataSlice";
import { IoCloseCircleOutline } from "react-icons/io5";
import { showToastError } from "../GenericToasters/GenericToasters";

const ProductPage = () => {
  let token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const dispatch = useDispatch();
  const location = useLocation();
  let { state } = location;
  // let pagination = 1;
  // let imagePagination = 1;
  const pagination = useRef(1);
  const imagePagination = useRef(1);
  const homeData = useSelector((state) => state.homeData.homeData);
  const headerSearchValue = useSelector((state) => state.homeData.headerSearchValue);
  console.log(homeData, "homeDataproducts");
  // let virtualTryOnClickedData = {};
  // const [virtualTryOnClickedData, setVirtualTryOnClickedData] = useState({});
  const [openTryOnModal, setOpenTryOnModal] = useState(false);
  const [openLoader, setOpenLoader] = useState(false);
  const [hideLoadMoreButton, sethideLoadMoreButton] = useState(false);
  const [productsDataForFilter, setProductsDataForFilter] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    searchValue: "",
    image: null,
    imagePreview: null,
    Category: [],
    Size: [],
    Price: "Price",
    fromPrice: "",
    toPrice: "",
    Colour: [],
  });
  const [file, setFile] = useState(null);

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

  const categoryfilter = [
    { label: 1, value: 1 },
    { label: 2, value: 2 },
  ];
  const sizefilter = [
    { label: "XS", value: "XS" },
    { label: "S", value: "S" },
    { label: "M", value: "M" },
    { label: "L", value: "L" },
    { label: "XL", value: "XL" },
    { label: "2XL", value: "2XL" },
  ];
  const pricefilter = [
    { label: 1, value: 100 },
    { label: 2, value: 200 },
  ];
  const colourfilter = [
    { label: "Black", value: "Black" },
    { label: "Blue", value: "Blue" },
    { label: "Brown", value: "Brown" },
    { label: "Green", value: "Green" },
    { label: "Navy", value: "Navy" },
    { label: "Red", value: "Red" },
    { label: "Orange", value: "Orange" },
    { label: "Pink", value: "Pink" },
  ];

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

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    return () => {
      // state.searchValue = null;
      pagination.current = 1;
      imagePagination.current = 1;
      setFormData({
        searchValue: "",
        image: null,
        imagePreview: null,
        Category: [],
        Size: [],
        Price: "Price",
        fromPrice: "",
        toPrice: "",
        Colour: [],
      });
    };
  }, []);

  const getProductsData = async () => {
    debugger;
    if (headerSearchValue) {
      setFormData((prevState) => ({
        ...prevState,
        searchValue: headerSearchValue,
      }));
      handleSearch(headerSearchValue);
      dispatch(headerSearchValueSuccess({ headerSearchValue: "" }));
      // state.searchValue = null;
    } else {
      // setOpenLoader(true);
      const response = await apiCall(
        "GET",
        `https://smartwardrobe-backend.azurewebsites.net/product/get-all/${pagination?.current}/100`,
        null,
        token?.token
      );
      // setOpenLoader(false)
      setLoading(false);
      if (response) {
        setProducts((prevProducts) => [...prevProducts, ...response?.data]);
        setProductsDataForFilter((prevProducts) => [
          ...prevProducts,
          ...response?.data,
        ]);
        dispatch(homeDataSuccess({ homeData: response?.data }));
      }
    }
  };

  const imageUpload = async (e) => {
    debugger;
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setFormData((prevData) => ({
        ...prevData,
        imagePreview: URL.createObjectURL(file),
      }));
    }
    // console.log(formData.image);
  };

  const handleSearch = async (event) => {
    debugger;
    let searchValue = event === null ? formData?.searchValue : event;
    if (searchValue !== "" || file) {
      // event.preventDefault();
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      }
      formData.append("query", searchValue);
      try {
        setOpenLoader(true);
        const response = await fetch(
          `https://smartwardrobe-backend.azurewebsites.net/search/get-all-similar-products-to-image/${imagePagination?.current}/50`,
          {
            method: "POST",
            headers: {
              accept: "*/*",
            },
            body: formData,
          }
        );
        setLoading(false);
        setOpenLoader(false);
        if (!response.ok) {
          const errorData = await response.json();
          showToastError(errorData?.message || response.statusText);
        }
        const result = await response.json();
        removeImage();
        if (imagePagination?.current === 1) {
          setProducts(result?.data);
          setProductsDataForFilter(result?.data);
        } else {
          setProducts((prevProducts) => [...prevProducts, ...result?.data]);
          setProductsDataForFilter((prevProducts) => [...prevProducts, ...result?.data]);
        }
        if (result?.data?.length === 0) {
          sethideLoadMoreButton(true);
        }
      } catch (error) {
        console.error("There was an error uploading the image:", error);
      }
    }
  };
  // const handleSearch = async (event) => {
  //   if (formData?.searchValue !== "" || file) {
  //     event.preventDefault();
  //     const formData = new FormData();
  //     if (file) {
  //       formData.append("file", file);
  //     }
  //     formData.append("text", formData?.searchValue);
  //     try {
  //       setOpenLoader(true);
  //       const response = await fetch(
  //         `https://smartwardrobe-backend.azurewebsites.net/search/get-all-similar-products-to-image/${imagePagination}/100`,
  //         {
  //           method: "POST",
  //           headers: {
  //             accept: "*/*",
  //           },
  //           body: formData,
  //         }
  //       );
  //       setOpenLoader(false);
  //       if (!response.ok) {
  //         const errorData = await response.json();
  //         showToastError(errorData?.message || response.statusText);
  //       }
  //       const result = await response.json();
  //       removeImage();
  //       setProducts(result?.data);
  //     } catch (error) {
  //       console.error("There was an error uploading the image:", error);
  //     }
  //   }
  // };

  const handleLoadMoreProducts = () => {
    debugger;
    if (file || formData?.searchValue || headerSearchValue) {
      imagePagination.current = imagePagination.current + 1;
      handleSearch(null);
    } else {
      pagination.current = pagination.current + 1;
      getProductsData();
    }
  };

  const handleSearchInput = (e) => {
    let { value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      searchValue: value,
    }));
    dispatch(headerSearchValueSuccess({ headerSearchValue: "" }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(null);
    }
  };

  const handleFilters = async (name, selectedValues) => {
    debugger;
    let filterData;
    if (name === "Colour") {
      filterData = await filterDataAccordingToUser(
        productsDataForFilter,
        formData?.Price,
        selectedValues
      );
    }
    setFormData((prevState) => ({
      ...prevState,
      [name]: selectedValues,
    }));
    setProducts(filterData);
  };

  const handlePriceFilter = async (e) => {
    debugger;
    let { value, name } = e.target;
    if (/^\d+$/.test(value)) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: "",
      }));
    }

    let fromPrice = name === "fromPrice" ? +value : +formData?.fromPrice;
    let toPrice = name === "toPrice" ? +value : +formData?.toPrice;
    let pricevalue = fromPrice + "-" + toPrice;
    let filterData;
    filterData = await filterDataAccordingToUser(
      productsDataForFilter,
      pricevalue,
      formData?.Colour
    );

    if (pricevalue !== "0-0") {
      setFormData((prevState) => ({
        ...prevState,
        ["Price"]: `€${pricevalue}`,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        ["Price"]: "Price",
      }));
    }
    setProducts(filterData);
  };

  const resetPriceFilter = async () => {
    setFormData((prevState) => ({
      ...prevState,
      ["fromPrice"]: "",
      ["toPrice"]: "",
      ["Price"]: "Price",
    }));
    let filterData = await filterDataAccordingToUser(
      productsDataForFilter,
      "Price",
      formData?.Colour
    );
    setProducts(filterData);
  };

  const resetHandler = (name) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: [],
    }));
  };

  /** this is to handle tryon modal */
  const handleTryon = (data) => {
    debugger;
    localStorage.setItem("VTOData", JSON.stringify(data));
    setOpenTryOnModal(true);
  };

  const closeTryOnModal = () => {
    setOpenTryOnModal(false);
  };
  /** this is to handle tryon modal */

  const removeImage = () => {
    setFormData((prevData) => ({ ...prevData, imagePreview: null }));
  };

  return (
    <>
      {/** loader code */}
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={openLoader}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/** loader code */}

      {/** Try On modal */}

      {openTryOnModal && (
        <VirtualTryOn
          isShowModel={openTryOnModal}
          closeModal={closeTryOnModal}
          // data={virtualTryOnClickedData}
        />
      )}

      {/** Try On modal */}

      <div className="productpage-container">
        <ScrollButton />
        <Headermenu />
        {/* <div className='ProductClick-div'>
            <h3 className='searchedData'>{state?.searchValue}</h3>
            </div> */}
        <div className="SearchedContent-div">
          <div className="search-filter-div">
            {/* <div className="searched-result-bar-div">
              <h3>Search Results</h3>
            </div> */}
            <div className="productsearch-input-div">
              {/* <div className="search-input-container"> */}
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
                  htmlFor="outlined-adornment-search"
                >
                  Search
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-search"
                  type="text"
                  style={{ width: "100%", backgroundColor: "#e9ecef" }}
                  className="productsearch-input"
                  autoComplete="off"
                  value={formData.searchValue}
                  onChange={(e) => handleSearchInput(e)}
                  onKeyPress={handleKeyDown}
                  startAdornment={
                    formData?.imagePreview && (
                      <InputAdornment
                        position="start"
                        sx={{ mr: 1, display: "flex", alignItems: "center" }}
                      >
                        <div
                          style={{
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <img
                            src={formData?.imagePreview}
                            alt="Uploaded preview"
                            style={{
                              width: "30px",
                              height: "30px",
                              borderRadius: "5px",
                              marginRight: "8px",
                            }}
                          />
                          <IconButton
                            onClick={removeImage}
                            size="small"
                            sx={{
                              position: "absolute",
                              top: "-8px",
                              right: "-8px",
                              backgroundColor: "white",
                              boxShadow: 1,
                              "&:hover": { backgroundColor: "#f0f0f0" },
                            }}
                          >
                            <IoCloseCircleOutline fontSize="small" />
                          </IconButton>
                        </div>
                      </InputAdornment>
                    )
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <Button
                        component="label"
                        variant="outlined"
                        color="neutral"
                        style={{ border: "none", borderRadius: "50%" }}
                      >
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
                        <input
                          type="file"
                          accept="image/*"
                          onChange={imageUpload}
                          style={{ display: "none" }}
                        />
                      </Button>
                      <IconButton aria-label="search" edge="end">
                        <SearchIcon
                          style={{ color: "black" }}
                          onClick={() => handleSearch(null)}
                        />
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Search"
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
              {/* </div> */}
            </div>
            <div className="Input-Suggestion-main">
            <div className="Input-Suggestion-div">
                  <div className="Input-Suggestion">
                    <p className="input-suggestion-text">Red shirt under the price of $50</p>
                  </div>
                  <div className="Input-Suggestion">
                    <p className="input-suggestion-text">Red shirt under the price of $50</p>
                  </div>
                  <div className="Input-Suggestion">
                    <p className="input-suggestion-text">Red shirt under the price of $50</p>
                  </div>
                  </div>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <div className="filters-section">
                {/* <div>
                  <Productfilterdropdowns
                    name="Category"
                    placeholder="Category"
                    options={categoryfilter}
                    onChange={(name, value) => handleFilters(name, value)}
                    fieldName="Category"
                  />
                </div> */}
                {/* <div>
                  <Productfilterdropdowns
                    placeholder="Size"
                    name={formData.size}
                    options={sizefilter}
                    fieldName="Colour"
                    onChange={(name, value) => handleFilters(name, value)}
                  />
                </div> */}
                <div>
                  <Select
                    style={{
                      width: "100%",
                      letterSpacing: "0.1rem",
                      textTransform: "capitalize",
                      borderRadius:"5px",
                      height: "30px"
                    }}
                    placeholder="Price"
                    name={formData?.Price}
                    value={formData?.Price}
                    className="filterdropdowns"
                    dropdownRender={(menu) => (
                      <>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "10px",
                            paddingLeft: "5px",
                            width: "100%",
                          }}
                        >
                          <p
                            size="small"
                            type="primary"
                            className="reset-btn"
                            style={{
                              justifyContent: "flex-start",
                              fontSize: "14px",
                            }}
                          >
                            &euro; {formData.fromPrice} - {formData.toPrice}
                          </p>
                          <p
                            size="small"
                            type="primary"
                            className="reset-btn"
                            style={{
                              justifyContent: "flex-end",
                              paddingRight: "10px",
                            }}
                            onClick={resetPriceFilter}
                          >
                            <u>Reset</u>
                          </p>
                        </div>
                        <Divider style={{ margin: "8px 0" }} />
                        <Space
                          style={{
                            padding: "0 8px 4px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                          }}
                        >
                          <Input
                            placeholder="From"
                            name="fromPrice"
                            value={formData.fromPrice}
                            maxLength={4}
                            onChange={handlePriceFilter}
                          />
                          <Input
                            placeholder="To"
                            name="toPrice"
                            value={formData.toPrice}
                            maxLength={4}
                            onChange={handlePriceFilter}
                          />
                        </Space>
                      </>
                    )}
                  />
                </div>
                <div>
                  <Productfilterdropdowns
                    placeholder="Colour"
                    name={formData.Colour}
                    options={colourfilter}
                    value={formData.Colour}
                    onChange={(name, value) => handleFilters(name, value)}
                    resetHandler={resetHandler}
                    fieldName="Colour"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`${loading ? "cards-div skeleton-products" : "cards-div"}`}
        >
          {loading ? (
            <div className="skeleton-product-cards">
              <ProductPageSkeletonLoader />
            </div>
          ) : (
            <div className="products-cards">
              <ProductPageCards data={products} handleTryon={handleTryon} />
            </div>
          )}
        </div>
        {(!hideLoadMoreButton || products?.length === 0) && (
          <div className="LoadMore-Div">
            <Button
              className="LoadMore-Button"
              color="default"
              onClick={handleLoadMoreProducts}
            >
              Load More Products
            </Button>
          </div>
        )}
        <Footer />
      </div>
    </>
  );
};

export default ProductPage;
