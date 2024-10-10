import { Button, Menu, Select } from "antd";
import { DownOutlined } from "@ant-design/icons";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "../../Styles/Homeproductsection.css";
import "../../Styles/ProductPage.css";

const renderMenuItems = (items) => {
  return items.map((item) => {
    if (item.children && item.children.length > 0) {
      return {
        label: (
          <span
            className={!item?.key?.includes("submenu") && "Dropdown-Maintext"}
          >
            {item.label}{" "}
            {!item?.key?.includes("submenu") && (
              <DownOutlined style={{ marginLeft: "8px" }} />
            )}
          </span>
        ),
        key: item.key,
        children: renderMenuItems(item.children), // Recursively render children
      };
    }

    // Check if the item has a custom component to render
    return {
      label: item.component ? <item.component /> : item.label,
      key: item.key,
    };
  });
};

export const GenericDropdownMenu = ({ menuData }) => {
  const menuItems = renderMenuItems(menuData);
  return (
    <>
      {/* <div className="header-menus"> */}
      <Menu
        style={{
          backgroundColor: "black",
          borderBottom: "none",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "1rem",
          marginLeft: "8px",
        }}
        mode="horizontal"
        items={menuItems}
        className="custom-menu"
      />
      {/* </div> */}
    </>
  );
};

/** will uncomment this when data comes */
export const HomeProductSection = (props) => {
  debugger;
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  return (
    <div className="homeproductsection-main">
      <Carousel
        responsive={responsive}
        // autoPlay={true}
        autoPlaySpeed={1500}
      >
        {props?.data.map((item, index) => (
          <div className="card">
            <img
              className="product--image"
              src={item?.image}
              alt="product image"
            />
            <h4>{item?.name}</h4>
            <p className="description">{item?.description}</p>
            <p className="price">{item?.price}</p>
            <p className="button-container">
              <Button className="View-Product-Button" color="default">
                More Like this
              </Button>
            </p>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

const colorsArray = ["#ff0000", "#00ff00", "#0000ff", "#ffa500", "#800080", "#008080"];
export const ProductPageCards = (props) => {
  return (
    <div className="productpagecards">
      {props?.data.map((item, index) => (
        <div className="card" key={index}>
          <div className="image-container">
            <img className="product--image" src={item?.image} alt="product image" />
            
            {/* <div className="color-select">
              {colorsArray.map((color, idx) => (
                <button
                  key={idx}
                  className="color-option"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div> */}

            <Button className="TryOn-Button" color="default">
              Try On
            </Button>
          </div>
          <h4>{item?.name}</h4>
          <p className="description">{item?.description}</p>
          <p className="price">{item?.price}</p>
          <p className="button-container">
            <Button className="View-Product-Button" color="default">
              More Like this
            </Button>
          </p>
        </div>
      ))}
    </div>
  );
};



export const Productfilterdropdowns = (props) => {
  return (
    <Select
      mode="multiple"
      className="filterdropdowns"
      style={{ width: '100%' }} // Ensure the select component takes full width
      placeholder={props?.name}
      options={props?.options}
      popupMatchSelectWidth={true}
      dropdownRender={(menu) => (
        <div>
          {/* Header Section inside Dropdown */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 12px",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <span>
              <b>0 Selected</b>
              {/* <b>Selected:</b> {selectedItems.length > 0 ? selectedItems.join(', ') : 'None'} */}
            </span>
            <p size="small" type="primary" className="reset-btn">
              <u>Reset</u>
            </p>
          </div>
          {menu}
        </div>
      )}
    />
  );
};