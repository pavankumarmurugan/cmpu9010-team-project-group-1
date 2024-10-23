import React from "react";
import "../../Styles/ProductPageSkeletonLoader.css";

const ProductPageSkeletonLoader = () => {
  return (
    <div className="skeleton-main-div">
  {Array.from({ length: 8 }).map((_, index) => (
    <div className="skeleton-product-card" key={index}>
      <div className="skeleton skeleton-image"></div>
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-description"></div>
      <div className="skeleton skeleton-price"></div>
      <div className="skeleton skeleton-button"></div>
    </div>
  ))}
</div>
  );
};

export default ProductPageSkeletonLoader;