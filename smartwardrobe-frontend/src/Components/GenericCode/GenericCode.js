import { Button, Menu, Select } from "antd";
import { DownOutlined } from "@ant-design/icons";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "../../Styles/Homeproductsection.css";
import "../../Styles/ProductPage.css";
import { useEffect, useRef, useState } from "react";
import { FaArrowUp } from "react-icons/fa6";
import imageCompression from 'browser-image-compression';
import { IoMdChatboxes } from "react-icons/io";
import ChatComponent from "../ChatComponent/ChatComponent";
import { useNavigate } from "react-router-dom";
import "../../Styles/ChatComponent.css";
import { useSelector } from "react-redux";
import apiCall from "../GenericApiCallFunctions/GenericApiCallFunctions";
import { Backdrop, CircularProgress } from "@mui/material";


const renderMenuItems = (items) => {
  return items.map((item) => {
    if (item.children && item.children.length > 0) {
      return {
        label: (
          <span
            className={!item?.key?.includes("submenu") && "Dropdown-Maintext"}
          >
            {item.label}
            {!item?.key?.includes("submenu") && (
              <DownOutlined style={{ marginLeft: "3px" }} />
            )}
          </span>
        ),
        key: item.key,
        children: renderMenuItems(item.children),
      };
    }

    
    return {
      label: item.component ? <item.component /> : item.label,
      key: item.key,
    };
  });
};

export const GenericDropdownMenu = ({ menuData, handleChange }) => {
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
          marginTop: "5px",
          marginLeft: "50px",
        }}
        mode="horizontal"
        items={menuItems}
        className="custom-menu"
        onClick={(e) => handleChange(e.key)}
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
              loading="lazy"
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

// export const LazyImage = ({ src, alt, className }) => {
//   debugger
//   const [isVisible, setIsVisible] = useState(false);
//   const imgRef = useRef(null);

//   useEffect(() => {
//     const imgObserver = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             setIsVisible(true);
//             imgObserver.unobserve(entry.target);
//           }
//         });
//       },
//       {
//         root: null,
//         rootMargin: '0px',
//         threshold: 0.1,
//       }
//     );

//     if (imgRef.current) {
//       imgObserver.observe(imgRef.current);
//     }

//     return () => {
//       if (imgRef.current) {
//         imgObserver.unobserve(imgRef.current);
//       }
//     };
//   }, []);

//   return (
//     <img 
//       ref={imgRef}
//       className={className}
//       src={isVisible ? src : ''} // Set src only if the image is visible
//       alt={alt}
//       style={{ display: isVisible ? 'block' : 'none' }} // Show only if visible
//     />
//   );
// };

export const ProductPageCards = ({data,handleTryon}) => {
  const navigate = useNavigate();
  // const [visibleProducts, setVisibleProducts] = useState(100);
  // const [isLoading, setIsLoading] = useState(false);

  // Function to load more products
  // const loadMoreProducts = () => {
  //   if (!isLoading) {
  //     setIsLoading(true);
  //     setTimeout(() => {
  //       setVisibleProducts((prev) => prev + 24);
  //       setIsLoading(false);
  //     }, 500);
  //   }
  // };

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const scrollPosition = window.innerHeight + window.scrollY;
  //     const threshold = document.body.offsetHeight * 0.95;

  //     if (scrollPosition >= threshold) {
  //       loadMoreProducts();
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);
  const clickOnTryOn = (e) => {
    debugger
    handleTryon(e);
  };

  const handleProductDetails = (item) => {
    debugger;
    SaveVisitedProduct(item);
    navigate(`/productdetails/${item?.id}`, { state: { item } });
  }

  return (
    <div className="productpagecards">
      {data?.map((item, index) => (
        <div className="card" key={index}>
          <div className="image-container">
            <button className="try-on-button" onClick={() => clickOnTryOn(item)}>Try On</button>
            <img
              className="productspage-product--image"
              loading="lazy"
              src={item?.imageUrl}
              alt="product image"
              onClick={() => handleProductDetails(item)}
            />
          </div>
          <h3>{item?.name}</h3>
          <p className="description">{item?.type}</p>
          <p className="price">&euro;{Number(item?.price)}</p>
          <p className="button-container">
            <Button className="View-Product-Button" color="default" onClick={() => handleProductDetails(item)}>
              View
            </Button>
          </p>
        </div>
      ))}
    </div>
  );
};




export const Productfilterdropdowns = (props) => {
  const handleChange = (selectedValues) => {
    props.onChange(props.fieldName, selectedValues);
  };
  const handleReset = () => {
    props?.resetHandler(props?.fieldName);
  }
  return (
    <Select
      mode="multiple"
      className="filterdropdowns"
      style={{ width: '100%', letterSpacing: "0.1rem", textTransform: "capitalize", borderRadius:"5px" }}
      placeholder={props?.placeholder}
      name={props?.name}
      options={props?.options}
      value={props?.value}
      popupMatchSelectWidth={true}
      onChange={handleChange}
      dropdownRender={(menu) => (
        <div>
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
            <p size="small" type="primary" className="reset-btn" onClick={handleReset}>
              <u>Reset</u>
            </p>
          </div>
          {menu}
        </div>
      )}
    />
  );
};


export const ScrollButton = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScroll = () => {
    if (window.pageYOffset > 200) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  };

  window.addEventListener("scroll", handleScroll);
  return (
    <div>
      {showScrollButton && (
      <Button className="scroll-to-top" aria-label="Scroll to top" onClick={scrollToTop}>
        <FaArrowUp className="scroll-to-top-icons"/>
      </Button>
    )}
    </div>  
  );
};

// export const ChatButton = () => {
//   const [showChat, setShowChat] = useState(false);
//   const chatHandler = () => {
//     setShowChat(!showChat);
//   }
//     return (
//       <>
//     <div>
//       <Button className="Chat-button" aria-label="Scroll to top" onClick={chatHandler}>
//         <IoMdChatboxes className="scroll-to-top-icons"/>
//       </Button>
//     </div>  
//       </>
//   );
// };

// export const handleImageUpload = async (e) => {
//   debugger
//   return new Promise(async (resolve, reject) => {
//     const file = e.target.files[0];
//     if(file){
//       return file;
//     }
//     // if (file) {
//     //   const compressedFile = await imageCompression(file, {
//     //     maxSizeMB: 1,
//     //     maxWidthOrHeight: 1280,
//     //     useWebWorker: true 
//     //   });

//     //   const reader = new FileReader();
//     //   reader.readAsDataURL(compressedFile);
//     //   reader.onload = () => {
//     //     try {
//     //       const base64Data = reader.result;
//     //       const data = {
//     //         image: {
//     //           mime: file.type,
//     //           data: base64Data

//     //         }
//     //       };
//     //       resolve(data);
//     //     } catch (error) {
//     //       reject(error);
//     //     }
//     //   };

//     //   reader.onerror = (error) => {
//     //     reject(error);
//     //   };
//     // } else {
//     //   reject(new Error('No file selected'));
//     // }
//   });
// };

export const SaveVisitedProduct = (productId) => {
  debugger
  let visitedProducts = JSON.parse(localStorage.getItem('visitedProducts')) || [];
  let alreadyAddedProduct = visitedProducts?.filter(x => x?.id === productId?.id)
  if (alreadyAddedProduct?.length === 0) {
      visitedProducts.push(productId);
  }

  if (visitedProducts?.length > 10) {
      visitedProducts.shift();
  }

  localStorage.setItem('visitedProducts', JSON.stringify(visitedProducts));
}

export const setTokenToLocalStorage = (data) => {
  debugger;
  let token = localStorage.setItem('user', JSON.stringify(data));
}

export const filterDataAccordingToUser = (data, pricevalue, colourvalue) => {
  
  let filteredData = data;
  let fromValue = 0;
  let toValue = Infinity;

  if (pricevalue !== "Price") {
    const splitFromToValue = pricevalue.split("-");
    fromValue = parseFloat(splitFromToValue[0]) || 0;
    toValue = parseFloat(splitFromToValue[1]) || Infinity;
  }

  filteredData = filteredData.filter(item => {
    const itemPrice = parseFloat(item.price);
    const isColorMatch = colourvalue.length === 0 || colourvalue.includes(item.color);
    const isPriceInRange = itemPrice >= fromValue && itemPrice <= toValue;

    return isColorMatch && isPriceInRange;
  });

  return filteredData;
};



const WhatsAppStylePreview = ({ message }) => {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [openLoader, setOpenLoader] = useState(false);
  const homeData = useSelector((state) => state.homeData.homeData);

  // Function to fetch metadata from a URL
  const fetchImageMetadata = async (url) => {
    try {
      const id = url.split('/').pop();
      setOpenLoader(true);
      const response = await apiCall(
        "GET",
        `https://smartwardrobe-backend.azurewebsites.net/product/get-one/${Number(id)}`, null
      );
      console.log(response?.data);
      const data = await response?.data
      
      // const product = homeData?.find(x => x.id === +id);
      return {
        title: data?.type,
        description: data.description,
        image: data?.imageUrl,
        siteName: url,
      };
    } catch (err) {
      console.error("Error fetching metadata:", err);
      return null;
    }
    finally {
      setOpenLoader(false); // Hide loader
    }
  };

  useEffect(() => {
    const processMessage = async () => {
      // Check if the message contains a URL (http or https)
      if (message.includes("http://3.251.4.90:3000/productdetails/") || message.includes("http://3.251.4.90:3000/productdetails/")) {

        try {
          const metadata = await fetchImageMetadata(message); // Fetch metadata for the URL
          if (metadata) {
            setPreview(metadata); // Update state with metadata if successfully fetched
          } else {
            setError("Failed to fetch metadata");
          }
        } catch (err) {
          setError("Error fetching metadata");
        } finally {
        }
      } else {
        // If it's not a URL, set the preview to null and stop loading
        setPreview(null);
      }
    };

    processMessage();
  }, [message]); // Runs whenever the message changes

  if (error) {
    return (
      <a
        href={message}
        target="_blank"
        rel="noopener noreferrer"
        className=""
        style={{display: "contents"}}
      >
        <p>{message}</p>
      </a>
    );
  }
  return (
    <>
    <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "rgba(0, 0, 0, 0.2)" // Adjust opacity for a lighter effect
        }}
        open={openLoader}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {preview ? (
        <a href={preview?.siteName} target="_blank" rel="noopener noreferrer" class="preview-container">
        {preview?.image && (
          <div class="preview-image">
            <img
              src={preview.image}
              alt="{preview.title || 'Website preview'}"
              class="preview-image-class"
            />
          </div>
        )}
      
        <div class="preview-content">
          {/* {preview?.siteName && (
            <p class="preview-site-name">
              {preview.siteName}
            </p>
          )} */}
          
          {preview?.title && (
            <h3 class="preview-title">
              {preview.title}
            </h3>
          )}
          
          {preview?.description && (
            <span class="preview-description">
              {preview.description}
            </span>
          )}
        </div>
      </a>
      
      ) : (
        message.includes("http") ?
        <a
        href={message}
        target="_blank"
        rel="noopener noreferrer"
        className=""
        style={{display: "contents", fontSize: "10px"}}
      >
        <p>{message}</p>
      </a> :
        <p>{message}</p> // If not a URL, return the exact same message
      )}
    </>
  );
};

export default WhatsAppStylePreview;
