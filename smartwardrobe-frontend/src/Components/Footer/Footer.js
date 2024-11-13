import React from "react";
import "../../Styles/Footer.css";

function Footer() {
  return (
    <div className="footer">
      <div className="top">
        <div>
          <h2>𝑺𝒎𝒂𝒓𝒕𝑾𝒂𝒓𝒅𝒓𝒐𝒃𝒆</h2>
        </div>
        {/* <div>
          <a href="/" aria-label="Visit our Facebook page">
            <i className="fab fa-facebook-square"></i>
            <span class="visually-hidden" style={{color: "#ffffff"}}>Facebook</span>
          </a>
          <a href="/" aria-label="Visit our Instagram page">
            <i className="fab fa-instagram-square"></i>
            <span class="visually-hidden" style={{color: "#ffffff"}}>Instagram</span>
          </a>
          <a href="/" aria-label="Visit our Twitter page">
            <i className="fab fa-twitter-square"></i>
            <span class="visually-hidden" style={{color: "#ffffff"}}>Twitter</span>
          </a>
        </div> */}
      </div>
      <div className="bottom">
        <div>
          <h3>Store</h3>
          <a>New In</a>
          <a>Men Clothing</a>
          <a>Women Clothing</a>
          <a>Footwear</a>
          <a>Accessories</a>
        </div>
        <div>
          <h3>Information</h3>
          <a >About us</a>
          <a >Privacy policy</a>
          <a >Terms and conditions</a>
          <a >Careers</a>
        </div>
        <div>
          <h3>Get in touch</h3>
          <a >
            Whatsapp: +353894447599
          </a>
          <a >
            Email: smartwardrobe.store@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}

export default Footer;
