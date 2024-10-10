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
} from "@mui/material";

import Homeproductimage_1 from "../../Assets/Homeproductimage_1.jpg";
import Homeproductimage_2 from "../../Assets/Homeproductimage_2.jpg";
import Homeproductimage_3 from "../../Assets/Homeproductimage_3.jpg";
import Homeproductimage_4 from "../../Assets/Homeproductimage_4.jpg";
import Homeproductimage_5 from "../../Assets/Homeproductimage_5.jpg";
import Homeproductimage_6 from "../../Assets/Homeproductimage_6.jpg";
import {
  Productfilterdropdowns,
  ProductPageCards,
} from "../GenericCode/GenericCode";
import Footer from "../Footer/Footer";

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

  return (
    <div className="productpage-container">
      <Headermenu />
      {/* <div className='ProductClick-div'>
            <h3 className='searchedData'>{state?.searchValue}</h3>
            </div> */}
      <div className="SearchedContent-div">
        <div className="products">
          <div className="searched-result-bar-div">
            <h3>Search Results</h3>
          </div>
          <div className="productsearch-input-div">
            <FormControl
              sx={{ m: 1, width: "100%", maxWidth: "800px" }}
              variant="outlined"
            >
              <InputLabel
                sx={{
                  color: "black",
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
                // placeholder="What do you want?"
                // value={searchValue}
                // onChange={onChangeSearchValue}
                className="productsearch-input"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      // onClick={handleSearch}
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
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
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
                <Productfilterdropdowns name="Price" options={pricefilter} />
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
          <h3>Chat</h3>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductPage;
