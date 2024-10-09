import React from "react";
import "../../Styles/Footer.css";

function Footer() {
  return (
    <div className="footer">
      <div className="top">
        <div>
          <h1>𝑺𝒎𝒂𝒓𝒕𝑾𝒂𝒓𝒅𝒓𝒐𝒃𝒆</h1>
        </div>
        <div>
          <a href="/">
            <i className="fab fa-facebook-square"></i>
          </a>
          <a href="/">
            <i className="fab fa-instagram-square"></i>
          </a>
          <a href="/">
            <i className="fab fa-twitter-square"></i>
          </a>
        </div>
      </div>
      <div className="bottom">
        <div>
          <h3>Store</h3>
          <a href="/">New In</a>
          <a href="/">Men Clothing</a>
          <a href="/">Women Clothing</a>
          <a href="/">Footwear</a>
          <a href="/">Accessories</a>
        </div>
        <div>
          <h3>Information</h3>
          <a href="/">About us</a>
          <a href="/">Privacy policy</a>
          <a href="/">Terms and conditions</a>
          <a href="/">Careers</a>
        </div>
        <div>
          <h3>Get in touch</h3>
          <a href="/">
            Whatsapp: <u>+029123416</u>
          </a>
          <a href="/">
            Email: <u>smartwardrobe@gmail.com</u>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Footer;