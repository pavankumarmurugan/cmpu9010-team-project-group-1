import React from "react";
import { useLocation } from "react-router-dom";
import Headermenu from "../Headermenu/Headermenu";
import "../../Styles/ProductPage.css";
import SearchIcon from "@mui/icons-material/Search";
import {
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
  handleImageUplaod,
  Productfilterdropdowns,
  ProductPageCards,
  ScrollButton,
} from "../GenericCode/GenericCode";
import Footer from "../Footer/Footer";
import { Divider, Input, Select, Space } from "antd";
import ChatSection from "../ChatSection/ChatSection";
import { styled } from '@mui/joy';
import Button from '@mui/joy/Button';

const ProductPage = () => {
  const location = useLocation();
  let { state } = location;

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
    { label: 1, value: 1 },
    { label: 2, value: 2 },
  ];
  const pricefilter = [
    { label: 1, value: 100 },
    { label: 2, value: 200 },
  ];
  const colourfilter = [
    { label: 1, value: "red" },
    { label: 2, value: "blue" },
    { label: 2, value: "black" },
  ];

  const VisuallyHiddenInput = styled('input')`
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

  return (
    <div className="productpage-container">
      <ScrollButton />
      <Headermenu />
      {/* <div className='ProductClick-div'>
            <h3 className='searchedData'>{state?.searchValue}</h3>
            </div> */}
      <div className="SearchedContent-div">
        <div className="products">
          <div className="searched-result-bar-div">
            <h3>Search Results</h3>
          </div>
          {/* <div className="productsearch-input-div"> */}
          {/* </div> */}
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              marginTop: "30px",
            }}
          >
            <div className="filters-section">
              <div>
                <Productfilterdropdowns
                  name="Category"
                  options={categoryfilter}
                />
              </div>
              <div>
                <Productfilterdropdowns name="Size" options={sizefilter} />
              </div>
              <div>
                <Select
                  style={{
                    width: "100%",
                    letterSpacing: "0.1rem",
                    textTransform: "capitalize",
                  }}
                  placeholder="Price"
                  className="filterdropdowns"
                  dropdownRender={(menu) => (
                    <>
                      <p
                        size="small"
                        type="primary"
                        className="reset-btn"
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          paddingRight: "10px",
                        }}
                      >
                        <u>Reset</u>
                      </p>
                      <Divider style={{ margin: "8px 0" }} />
                      <Space
                        style={{
                          padding: "0 8px 4px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                        }}
                      >
                        <Input placeholder="From" />
                        <Input placeholder="To" />
                      </Space>
                    </>
                  )}
                />
              </div>
              <div>
                <Productfilterdropdowns name="Colour" options={colourfilter} />
              </div>
            </div>
          </div>
          <div className="products-cards">
            <ProductPageCards data={dummyData} />
          </div>
        </div>
        <div className="chat">
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
                      style={{border:"none", width:"10px", borderRadius:"50%"}}
                      startDecorator={
                        <SvgIcon >
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
                      <VisuallyHiddenInput type="file" onChange={handleImageUplaod}/>
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
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductPage;
