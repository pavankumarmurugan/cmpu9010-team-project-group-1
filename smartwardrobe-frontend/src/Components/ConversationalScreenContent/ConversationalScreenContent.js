import React, { useState } from "react";
import ContentHeader from "../ContentHeader/ContentHeader";
import { Button } from "antd";
import "../../Styles/ConversationalScreen.css";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";

function ConversationalScreenContent(props) {
  debugger
  console.log(props)
  const [filterValue, setFilterValue] = useState({
    size: [],
    price: [],
  });

  const [dropdownOpen, setDropdownOpen] = useState({
    size: false,
    price: false,
  });

  const handleChange = (event, newValue) => {
    setFilterValue((prevState) => ({
      ...prevState,
      ["size"]: newValue,
    }));

    setDropdownOpen((prevState) => ({
      ...prevState,
      ["size"]: newValue,
    }));
  };

  const resetButton = () => {
    setFilterValue((prevState) => ({
      ...prevState,
      ["size"]: [],
    }));

    setDropdownOpen((prevState) => ({
      ...prevState,
      size: false, // Ensure the dropdown closes
    }));
  };

  const doneButton = () => {
    setDropdownOpen({ ...dropdownOpen, size: false });
  };

  return (
    <div className="layout-content ">
      <ContentHeader />
      <div className="Searched-Input">
        <b>Show me</b>
        <i style={{ marginLeft: "5px", fontWeight: "bold", color: "#8B2E2E" }}>
          {props?.input?.searchValue}
        </i>

        {/* Filter buttons */}
        <div className="Filter-div">
          <Select
            multiple
            placeholder="Size"
            value={filterValue?.size}
            onChange={handleChange}
            open={dropdownOpen.size}
            sx={{
              width: "fit-content",
              minWidth: "auto", // Remove fixed minimum width
            }}
            slotProps={{
              listbox: {
                sx: {
                  width: "fit-content",
                  padding: "8px",
                },
                placement: "bottom-start",
                transformOrigin: "top left",
              },
            }}
          >
            <Option value="dog">Small</Option>
            <Option value="cat">Medium</Option>
            <Option value="fish">Large</Option>
            <Option value="bird">X-Large</Option>
            <div className="filter-menu-buttons-div">
              <Button
                color="default"
                style={{ backgroundColor: "#DCEEF2", marginRight: "10px" }}
                className="filter-menu-buttons"
                value={filterValue.price}
                onClick={resetButton}
              >
                Reset
              </Button>
              <Button
                color="default"
                variant="solid"
                className="filter-menu-buttons"
                onClick={doneButton}
              >
                Done
              </Button>
            </div>
          </Select>
          
          <Select
            multiple
            placeholder="Set Price Range"
            value={filterValue?.size}
            onChange={handleChange}
            open={dropdownOpen.size}
            sx={{
              width: "fit-content",
              minWidth: "auto", // Remove fixed minimum width
            }}
            slotProps={{
              listbox: {
                sx: {
                  width: "fit-content",
                  padding: "8px",
                },
                placement: "bottom-start",
                transformOrigin: "top left",
              },
            }}
          >
            <Option value="dog">Small</Option>
            <Option value="cat">Medium</Option>
            <Option value="fish">Large</Option>
            <Option value="bird">X-Large</Option>
            <div className="filter-menu-buttons-div">
              <Button
                color="default"
                style={{ backgroundColor: "#DCEEF2", marginRight: "10px" }}
                className="filter-menu-buttons"
                value={filterValue.price}
                onClick={resetButton}
              >
                Reset
              </Button>
              <Button
                color="default"
                variant="solid"
                className="filter-menu-buttons"
                onClick={doneButton}
              >
                Done
              </Button>
            </div>
          </Select>
        </div>
        {/* Filter buttons */}
      </div>
      <div className="ConversationalScreen-Result"></div>
    </div>
  );
}

export default ConversationalScreenContent;
