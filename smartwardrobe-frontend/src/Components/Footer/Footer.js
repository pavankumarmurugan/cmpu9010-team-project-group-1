import React from "react";
import "../../Styles/Footer.css";
import Homelogo2 from "../../Assets/Homelogo2.png";
import { useLocation, useNavigate } from "react-router-dom";
import { categoryValueSuccess } from "../../redux/slices/HomeDataSlice";
import { useDispatch } from "react-redux";
import newLogo1 from "../../Assets/newLogo1.png";
import newLogo3 from "../../Assets/newLogo3.png";

function Footer() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  let categoryPaths = localStorage.getItem("categoryPaths")
    ? JSON.parse(localStorage.getItem("categoryPaths"))
    : null;

  function createSlug(str) {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  const handleLinks = (links) => {
    debugger;

    let value = links;
    const slug = createSlug(value);
    let catpath = [];
    if (categoryPaths?.length > 0) {
      catpath = [...categoryPaths, value];
    } else {
      catpath = [value];
    }
    localStorage.setItem("categoryPaths", JSON.stringify(catpath));
    navigate(`/products/${slug}`);
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  return (
    <div className="footer">
      <div className="top">
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={newLogo3}
            alt="logo"
            style={{
              width: "70px",
              height: "60px",
              objectFit: "contain",
              marginRight:"10px"
            }}
          />
          <h1>SMARTWARDROBE</h1>
        </div>
      </div>
      <div className="bottom">
        <div style={{ maxWidth: "500px" }}>
          <h3>ABout Us</h3>
          <p style={{ textTransform: "capitalize" }}>
            At Smartwardrobe, we make shopping smarter and more fun. With
            features like image search, collaborative chat, and virtual try-ons,
            finding and trying your perfect look has never been easier. We're
            here to bring style and technology together, giving you a seamless
            and personalized fashion experience.
          </p>
        </div>

        <div className="footermenu-div">
          <h3>Store</h3>
          <a
            onClick={() => handleLinks("Menswear//Shirt")}
            className="footerMenu"
          >
            Men Clothing
          </a>
          <a
            onClick={() => handleLinks("Ladieswear//T-shirt")}
            className="footerMenu"
          >
            Women Clothing
          </a>
          <a
            onClick={() => handleLinks("Baby Children//T-shirt")}
            className="footerMenu"
          >
            Kids Clothing
          </a>
          <a
            onClick={() => handleLinks("Sport//T-shirt")}
            className="footerMenu"
          >
            Sportswear
          </a>
        </div>
        <div>
          <h3>Get in touch</h3>
          <a className="footerMenu">Whatsapp: +353894447599</a>
          <a className="footerMenu">Email: smartwardrobe.store@gmail.com</a>
        </div>
      </div>
    </div>
  );
}

export default Footer;
