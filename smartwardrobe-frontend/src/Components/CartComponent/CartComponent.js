import React, { useEffect, useState } from "react";
import { Backdrop, Box, CircularProgress, Drawer, List } from "@mui/material";
import "../../Styles/CartComponent.css";
import { Input } from "antd";
import { RiSubtractFill } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";
import { Button } from "@mui/joy";
import apiCall from "../GenericApiCallFunctions/GenericApiCallFunctions";
import { RiDeleteBinLine } from "react-icons/ri";
import { addToCartValueSuccess } from "../../redux/slices/HomeDataSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const CartComponent = (props) => {
  let token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
    const navigate = useNavigate();
    const dispatch = useDispatch();
  const [cartData, setCartData] = useState([]);
  const [openLoader, setOpenLoader] = useState(false);

  const handleContinueShopping = () => {
    navigate("/products");
  }

  const DrawerList = (
    <Box
      sx={{ width: 400 }}
      className="mobile-menu-main-cart"
      role="presentation"
    >
      <List sx={{ height: "calc(100vh - 50px)" }}>
        <div className="cart-main">
          <div className="cart-header">
            <h4>YOUR CART</h4>
            <h4>TOTAL</h4>
          </div>
          <div className="cart-item-main-div">
          {cartData?.map((item, index) => (
            <div className="cart-item-div" key={index}>
              <div className="seaparate-eachproduct">
                <img src={item?.product?.imageUrl} alt="" className="cart-product-image" />
                <div className="cart-product-description">
                  <div className="product-text-div">
                    <p className="product-text">{item?.product?.name}</p>
                    <p className="product-text">€{Number(item?.product?.price)}</p>
                    <p className="product-text">Colour: {item?.product?.color}</p>
                    <p className="product-text">Size: {item?.product?.size || "N/A"}</p>
                    <div className="product-quantity-input-div">
                      <Input
                        className="cart-quantity-button"
                        prefix={
                          <RiSubtractFill onClick={() => handleQuantityChange("sub", index)} />
                        }
                        suffix={
                          <IoMdAdd onClick={() => handleQuantityChange("add", index)} />
                        }
                        value={item?.quantity}
                      />
                      <RiDeleteBinLine style={{paddingLeft:"20px"}} onClick={() => handleDeleteItem(item)}/>
                    </div>
                  </div>
                  <div className="product-price">
                    <h5>€{Number(item?.product?.price * item?.quantity)}</h5>
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
          <div className="cart-footer">
            <div className="footer-heading">
              <h3>SUBTOTAL</h3>
              <h3>€{cartData?.reduce((total, item) => total + item?.product?.price * item?.quantity, 0)}</h3>
            </div>
            <div className="cartPage-buttons-div">
              <Button className="checkout-button">CHECKOUT</Button>
              <Button className="continue-shopping-button" onClick={handleContinueShopping}>CONTINUE SHOPPING</Button>
            </div>
          </div>
        </div>
      </List>
    </Box>
  );

  useEffect(() => {
    getAllCartValues();
  }, []);

  const handleDeleteItem = async (data) => {
debugger
    const id = data?.id;
    setOpenLoader(true);
    const deleteCartItem = await apiCall("DELETE", `https://smartwardrobe-backend.azurewebsites.net/cart-item/delete/${id}`, null, token?.token);
    setOpenLoader(false);
    if (deleteCartItem.statusCode.text === "Success") {
      getAllCartValues();
      dispatch(
        addToCartValueSuccess({ cartValue: cartData.length - 1 })
      );
    }

  }

  const getAllCartValues = async () => {
    setOpenLoader(true);
    const getAllCartValues = await apiCall(
      "GET",
      "https://smartwardrobe-backend.azurewebsites.net/cart/get-my-cart",
      null,
      token?.token
    );
    setOpenLoader(false);
    if (getAllCartValues?.data?.length) {
      setCartData(getAllCartValues?.data);
    }
  };

  const handleQuantityChange = (type, index) => {
    const updatedCartData = [...cartData];
    if (type === "add") {
      updatedCartData[index].quantity += 1;
    } else if (type === "sub" && updatedCartData[index].quantity > 1) {
      updatedCartData[index].quantity -= 1;
    }
    setCartData(updatedCartData);
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

    <Drawer anchor="right" open={props?.openCart} onClose={props?.close}>
      {DrawerList}
    </Drawer>
    </>
  );
};

export default CartComponent;
