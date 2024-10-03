import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "../../Styles/Content.css";
import Carousel from "../Carousel/Carousel";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const ContentMid = () => {
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState("");

    const handleSearch = () => {
      navigate("/ConversationalSearch", { state: { searchValue } });
    }

  return (
    <div className="layout-content-mid container">
      <div className="Mid-Heading">
        <h1>Members get up to 50% off everything, every day</h1>
      </div>

      <div className="Mid-Search-Section">
        <input
          placeholder="What do you need?"
          class="Mid-Search-Input"
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        ></input>
        <button class={searchValue === ""? "Mid-Search-Button" : "Mid-Search-Button-Focus"} style={{cursor:"pointer"}}>
        <FaSearch style={{width:"20px", height:"20px", color:"white"}} onClick={handleSearch}/>
        </button>
      </div>

      <div className="predefined-options">
        <Carousel />
      </div>
      <div className="All-Dresses-Section">
      <input type="button" value="View All Dresses" className="AllDresses-Btn" />
      </div>
    </div>
  );
};

export default ContentMid;
