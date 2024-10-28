import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./Components/Homepage/Homepage";
import { Fragment } from "react";
import ProductPage from "./Components/ProductPage/ProductPage";
import { ChatButton, ScrollButton } from "./Components/GenericCode/GenericCode";
import ProductDetails from "./Components/ProductDetails/ProductDetails";
import ScrollToTop from "./Components/ScrollToTop/ScrollToTop";
import ChatComponent from "./Components/ChatComponent/ChatComponent";


function App() {
  

  return (
    <div className="App">
      <ScrollButton />
      {/* <ChatButton /> */}
      <ChatComponent />
      <Fragment>
        <BrowserRouter>
      <ScrollToTop /> 
          <Routes>
            {/* <Route path="/" element={<Headermenu />} /> */}
            <Route path="/" element={<Homepage />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/productdetails" element={<ProductDetails />} />
            {/* <Route path="/ConversationalSearch" element={<ConversationalSearch />} /> */}
          </Routes>
        </BrowserRouter>
      </Fragment>
    </div>
  );
}

export default App;
