import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from './Components/Homepage/Homepage';
import { Fragment } from 'react';

function App() {
  return (
    <div className="App">
    <Fragment>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
      </Routes>
    </BrowserRouter>
      </Fragment>
    </div>
  );
}

export default App;