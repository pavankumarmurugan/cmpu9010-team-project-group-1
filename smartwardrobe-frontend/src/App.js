import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./Components/Homepage/Homepage";
import { Fragment } from "react";
import ProductPage from "./Components/ProductPage/ProductPage";
import { ChatButton, ScrollButton } from "./Components/GenericCode/GenericCode";
import ProductDetails from "./Components/ProductDetails/ProductDetails";
import ScrollToTop from "./Components/ScrollToTop/ScrollToTop";
import { Provider } from 'react-redux';
import store from './redux/store';
import WishListComponent from "./Components/WishListComponent/WishListComponent";

function App() {
  

  return (
    <Provider store={store}>
    <div className="App">
      <ScrollButton />
      <Fragment>
        <BrowserRouter>
      <ScrollToTop /> 
          <Routes>
            {/* <Route path="/" element={<Headermenu />} /> */}
            <Route path="/" element={<Homepage />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/productdetails" element={<ProductDetails />} />
            <Route path="/wishlist" element={<WishListComponent />} />
          </Routes>
        </BrowserRouter>
      </Fragment>
    </div>
    </Provider>
  );
}

export default App;
