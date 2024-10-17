import React, { useEffect, useRef } from "react";
import Homeproductimage_1 from "../../Assets/Homeproductimage_1.jpg";
import Homeproductimage_2 from "../../Assets/Homeproductimage_2.jpg";
import Homeproductimage_3 from "../../Assets/Homeproductimage_3.jpg";
import Homeproductimage_4 from "../../Assets/Homeproductimage_4.jpg";
import Homeproductimage_5 from "../../Assets/Homeproductimage_5.jpg";
import Homeproductimage_6 from "../../Assets/Homeproductimage_6.jpg";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import "../../Styles/Homeproductsection.css"
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const HomeProductSection = (props) => { /** will remove this component when data comes */
  const navigate = useNavigate();
    const responsive = {
        superLargeDesktop: {
          // the naming can be any, depends on you.
          breakpoint: { max: 4000, min: 3000 },
          items: 5
        },
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 3
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 2
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1
        }
      };

      const handleImgaeClick = () => {
        navigate("/productdetails");
      }

      const handleAllProducts = () => {
        navigate("/products");
      }

  return (
    <div className="homeproductsection-main">
    <Carousel responsive={responsive}
        // autoPlay={true}
        autoPlaySpeed={1500}
    >
      {props?.data?.map((items, index) => (
        <div className="card">
        <img className="product--image" src={items?.image} alt="product image" onClick={handleImgaeClick}/>
        <h4>{items?.name}</h4>
        <p className="description">{items?.description}</p>
        <p className="price">&eur;{items?.description}</p>
        <p>
          <Button
              className="View-Product-Button"
              color="default"
              // variant="filled"
              onClick={handleAllProducts}
            >
              More Like this
            </Button>
        </p>
      </div>
      ))}
    {/* <div className="card">
      <img className="product--image" src={Homeproductimage_1} alt="product image" />
      <h4>Zapara</h4>
      <p className="description">Wedding Suit</p>
      <p className="price">$1200</p>
      <p>
        <Button
            className="View-Product-Button"
            color="default"
            // variant="filled"
          >
            More Like this
          </Button>
      </p>
    </div>
    <div className="card">
      <img className="product--image" src={Homeproductimage_2} alt="product image" />
      <h4>Harper</h4>
      <p className="description">Long Sleeves T-Shirt</p>
      <p className="price">$130</p>
      <p>
        <Button
            className="View-Product-Button"
            color="default"
            // variant="filled"
          >
            More Like this
          </Button>
      </p>
    </div>
    <div className="card">
      <img className="product--image" src={Homeproductimage_3} alt="product image" />
      <h4>Zara</h4>
      <p className="description">Urban Style Hoodeis</p>
      <p className="price">$250</p>
      <p>
        <Button
            className="View-Product-Button"
            color="default"
            // variant="filled"
          >
            More Like this
          </Button>
      </p>
    </div>
    <div className="card">
      <img className="product--image" src={Homeproductimage_4} alt="product image" />
      <h4>H&M</h4>
      <p className="description">Printed Dress for Summer</p>
      <p className="price">$120</p>
      <p>
        <Button
            className="View-Product-Button"
            color="default"
            // variant="filled"
          >
            More Like this
          </Button>
      </p>
    </div>
    <div className="card">
      <img className="product--image" src={Homeproductimage_5} alt="product image" />
      <h4>Leopard Printed Shoes For Women</h4>
      <p className="price">$200</p>
      <p>sdf</p>
      <p>
        <Button
            className="View-Product-Button"
            color="default"
            // variant="filled"
          >
            More Like this
          </Button>
      </p>
    </div>
    <div className="card">
      <img className="product--image" src={Homeproductimage_6} alt="product image" />
      <h4>Converse</h4>
      <p className="price">Black Converse Shoes</p>
      <p>$150</p>
      <p>
      <Button
            className="View-Product-Button"
            color="default"
            // variant="filled"
          >
            More Like this
          </Button>
      </p>
    </div> */}
</Carousel>;
</div>
     /* <div className="homeproductsection-main">
      <Carousel
    //     ref={carouselRef}
    //     // autoplay
    //     autoplaySpeed={1500}
    //     dots={false}
    //     arrows={false}
    //     slidesToShow={4}
    //     slidesToScroll={1}
    //     style={{ height: "800px" }}
    //   >
    //     <div style={contentStyle}>
    //       <img
    //         src={carousel_image1}
    //         alt="carousel 1"
    //         style={{
    //           height: "500px",
    //           width: "100%",
    //           objectFit: "cover",
    //           borderRadius: "4px",
    //           border: "15px solid #fff",
    //         }}
    //       />
    //       <h3>Product 1</h3>
    //       <p>Product Description</p>
    //       <p>Product Description</p>
    //       <p>Product Description</p>
    //       <p>Product Description</p>
    //       <p>Product Description</p>
    //     </div>
    //     <div style={contentStyle}>
    //       <img
    //         src={carousel_image2}
    //         alt="carousel 2"
    //         style={{
    //           height: "500px",
    //           width: "100%",
    //           objectFit: "cover",
    //           borderRadius: "4px",
    //           border: "15px solid #fff",
    //         }}
    //       />
    //     </div>
    //     <div style={contentStyle}>
    //       <img
    //         src={carousel_image3}
    //         alt="carousel 3"
    //         style={{
    //           height: "500px",
    //           width: "100%",
    //           objectFit: "cover",
    //           borderRadius: "4px",
    //           border: "15px solid #fff",
    //         }}
    //       />
    //     </div>
    //     <div style={contentStyle}>
    //       <img
    //         src={carousel_image4}
    //         alt="carousel 4"
    //         style={{
    //           height: "500px",
    //           width: "100%",
    //           objectFit: "cover",
    //           borderRadius: "4px",
    //           border: "15px solid #fff",
    //         }}
    //       />
    //     </div>
    //     <div style={contentStyle}>
    //       <img
    //         src={carousel_image5}
    //         alt="carousel 5"
    //         style={{
    //           height: "500px",
    //           width: "100%",
    //           objectFit: "cover",
    //           borderRadius: "4px",
    //           border: "15px solid #fff",
    //         }}
    //       />
    //     </div>
    //   </Carousel>
    // </div> */
  );
};

export default HomeProductSection;
