import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import Content from "../Content/Content";
import "../../App.css";

function Homepage() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="layout--content">
        <Content />
      </div>
    </div>
  );
}

export default Homepage;
