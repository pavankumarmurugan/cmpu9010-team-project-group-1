import React, { useEffect, useState } from "react";
import { Backdrop, Box, CircularProgress, Drawer, List } from "@mui/material";
import "../../Styles/CartComponent.css";
import { Input } from "antd";
import { RiSubtractFill } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";
import { Button } from "@mui/joy";
import apiCall, { baseUrl } from "../GenericApiCallFunctions/GenericApiCallFunctions";
import { RiDeleteBinLine } from "react-icons/ri";
import { addToCartValueSuccess } from "../../redux/slices/HomeDataSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";

const CartComponent = (props) => {
  let token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
    const navigate = useNavigate();
    const dispatch = useDispatch();
  const [cartData, setCartData] = useState([]);
  const [openLoader, setOpenLoader] = useState(false);
  const cartValue = useSelector((state) => state.homeData.cartValue);

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
                    <p className="product-text">Size: {item?.size || "N/A"}</p>
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
                      <MdDelete style={{ width: "25px", height:"25px", cursor:"pointer"}} onClick={() => handleDeleteItem(item)}/>
                    </div>
                      {/* <RiDeleteBinLine /> */}
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
    const matchingItems = cartData?.filter(item => item?.id === id);
    const apiCalls = matchingItems?.flatMap(item => 
      Array(item?.quantity)
          .fill(null)
          .map(() => apiCall("DELETE", `${baseUrl}/cart-item/delete/${item?.id}`, null, token?.token))
  );
    setOpenLoader(true);
    const deleteCartItem =  await Promise.all(apiCalls);
    setOpenLoader(false);
    if (deleteCartItem[0]?.message === 'DELETED ITEMS FROM CART') {
      // getAllCartValues();
      setCartData(cartData?.filter(item => item?.id !== id));
      let quantity = cartValue - matchingItems[0]?.quantity;
      dispatch(
        addToCartValueSuccess({ cartValue: quantity > 0 ? quantity : 0 })
      );
    }

  }

  const mergeProducts = (cartItems) => {
    debugger
    const productMap = new Map();

    cartItems.forEach(item => {
        const { productId, quantity } = item;

        if (productMap.has(productId)) {
            const existingItem = productMap.get(productId);
            existingItem.quantity += quantity;
        } else {
            productMap.set(productId, { ...item });
        }
    });

    return Array.from(productMap.values());
};

  const getAllCartValues = async () => {
    debugger
    setOpenLoader(true);
    const getAllCartValues = await apiCall(
      "GET",
      `${baseUrl}/cart/get-my-cart` ,
      null,
      token?.token
    );
    setOpenLoader(false);
    if (getAllCartValues?.message === "SUCCESSFULLY FETCHED CART") {
      let data =  mergeProducts(getAllCartValues?.data);
      setCartData(data);
      if(getAllCartValues?.data?.length === 0){
        props?.close();
      }
    }
  };

  const handleQuantityChange = async (type, index) => {
    debugger
    const updatedCartData = [...cartData];
    let quantity = {};
    let localStorageQuantityArray = [];
    if (type === "add") {
      updatedCartData[index].quantity += 1;
      const data = {
        id: updatedCartData[index]?.id,
        quantity: updatedCartData[index].quantity,
        size: updatedCartData[index]?.size
      };
      setOpenLoader(true);
      const addToCart = await apiCall(
        "PATCH",
        `${baseUrl}/cart-item/update`,
        data,
        token?.token
      );
        if (addToCart.message === "SUCCESSFULLY UPDATED ITEMS TO CART") {
          dispatch(addToCartValueSuccess({ cartValue: cartValue + 1 }));
          setOpenLoader(false);
          return;
        }
    } else if (type === "sub" && updatedCartData[index].quantity > 1) {
      updatedCartData[index].quantity -= 1;
      const data = {
        id: updatedCartData[index]?.id,
        quantity: updatedCartData[index].quantity,
        size: updatedCartData[index]?.size
      };
      setOpenLoader(true);
      const addToCart = await apiCall(
        "PATCH",
        `${baseUrl}/cart-item/update`,
        data,
        token?.token
      );
        if (addToCart.message === "SUCCESSFULLY UPDATED ITEMS TO CART") {
          dispatch(addToCartValueSuccess({ cartValue: cartValue - 1 }));
          setOpenLoader(false);
          return;
        }
    }
    // setCartData(updatedCartData);
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
