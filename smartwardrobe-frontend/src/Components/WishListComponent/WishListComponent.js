import React, { useEffect, useState } from "react";
import Headermenu from "../Headermenu/Headermenu";
import Footer from "../Footer/Footer";
import "../../Styles/WishListComponent.css";
import { Button } from "@mui/joy";
import image from "../../Assets/Homeproductimage_3.jpg";
import { MdOutlineShoppingBag } from "react-icons/md";
import { Backdrop, CircularProgress } from "@mui/material";
import apiCall from "../GenericApiCallFunctions/GenericApiCallFunctions";
import { wishListValueSuccess } from "../../redux/slices/HomeDataSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Clear } from "@mui/icons-material";

function WishListComponent() {
  let token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [likeProducts, setLikeProducts] = useState([]);
  const [openLoader, setOpenLoader] = useState(false);

  useEffect(() => {
    getLikeProducts();
  }, []);

  const getLikeProducts = async () => {
    debugger;
    setOpenLoader(true);
    const getLikeProducts = await apiCall(
      "GET",
      "https://smartwardrobe-backend.azurewebsites.net/likes/get-all",
      null,
      token?.token
    );
    setOpenLoader(false);
    if (getLikeProducts) {
      setLikeProducts(getLikeProducts?.data);
    }
  };

  const removeLikeProduct = async (id) => {
    debugger;
    if (id) {
      setOpenLoader(true);
      let addWishlist = await apiCall(
        "DELETE",
        `https://smartwardrobe-backend.azurewebsites.net/likes/delete/${id?.id}`,
        null,
        token?.token
      );
      setOpenLoader(false);
      if (addWishlist?.statusCode?.text === "Success") {
        let filterRemainingProducts = likeProducts?.filter(
          (item) => item?.product?.id !== id?.id
        );
        dispatch(
          wishListValueSuccess({ wishListValue: likeProducts?.length - 1 })
        );
        if (filterRemainingProducts?.length === 0) {
          navigate("/");
        } else {
          setLikeProducts(filterRemainingProducts);
        }
      }
    }
  };

  const ClearWishlist = async () => {
    debugger;
    let clearwishlist = await apiCall("DELETE", "https://smartwardrobe-backend.azurewebsites.net/likes/delete-all-likes", null, token?.token);
    if (clearwishlist?.statusCode?.text === "Success") {
        dispatch(wishListValueSuccess({ wishListValue: 0 }));
        navigate("/");
        }
    }

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
      <div className="Wishlist-Main">
        <Headermenu />
        <div className="wishlist-div">
          <div className="wishlist-heading-Button">
            <div className="wishlist-heading">
              <h1>My Wishlist</h1>
            </div>
            <div>
              <Button
                className="wishlist-heading-buttons"
                color="default"
                  onClick={ClearWishlist}
              >
                Clear Wishlist
              </Button>
            </div>
          </div>

          <div className="wihslist-cards-div">
            <div className="Similar-Products-div">
              <div className="wishlist-cards">
                {likeProducts?.map((items, index) => (
                  <div className="card">
                    <img
                      className="product--image"
                      loading="lazy"
                      src={items?.product?.imageUrl}
                      alt="product image"
                      // onClick={() => handleSimilarProductsClick(items)}
                    />
                    {/* <h3 style={{ fontSize: "18px" }}>{items?.product?.imageUrl}</h3> */}
                    <p className="description">{items?.product?.type}</p>
                    <p className="price" style={{ fontSize: "15px" }}>
                      ${items?.product?.price}
                    </p>
                    <div className="wishlist-Card-Buttons">
                      <Button
                        className="wishlist-heading-buttons"
                        color="default"
                        onClick={() => removeLikeProduct(items?.product)}
                      >
                        Remove
                      </Button>
                      <Button
                        className="wishlist-heading-buttons"
                        color="default"
                        //   onClick={handleLoadMoreProducts}
                      >
                        <MdOutlineShoppingBag
                          className="icons"
                          style={{ paddingRight: "10px", color: "white" }}
                        />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default WishListComponent;
