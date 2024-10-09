import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from './Components/Homepage/Homepage';
import { Fragment } from 'react';
import ProductPage from './Components/ProductPage/ProductPage';

function App() {
  return (
    <div className="App">
    <Fragment>
      <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Headermenu />} /> */}
        <Route path="/"  element={<Homepage />} />
        <Route path="/products" element={<ProductPage />} />
        {/* <Route path="/ConversationalSearch" element={<ConversationalSearch />} /> */}
      </Routes>
    </BrowserRouter>
      </Fragment>
    </div>
  );
}

export default App;