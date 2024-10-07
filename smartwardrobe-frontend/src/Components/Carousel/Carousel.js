import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Carousel } from 'antd';

// const data = [
//   {
//     src: 'https://images.unsplash.com/photo-1502657877623-f66bf489d236',
//     title: 'Night view',
//     // description: 'A beautiful night scenery.',
//   },
//   {
//     src: 'https://images.unsplash.com/photo-1527549993586-dff825b37782',
//     title: 'Lake view',
//     // description: 'Serenity by the lake.',
//   },
//   {
//     src: 'https://images.unsplash.com/photo-1532614338840-ab30cf10ed36',
//     title: 'Mountain view',
//     // description: 'Majestic mountain ranges.',
//   },
//   {
//     src: 'https://images.unsplash.com/photo-1502657877623-f66bf489d236',
//     title: 'Night view',
//     // description: 'A beautiful night scenery.',
//   },
//   {
//     src: 'https://images.unsplash.com/photo-1527549993586-dff825b37782',
//     title: 'Lake view',
//     // description: 'Serenity by the lake.',
//   }
// ];

export default function CarouselComponent() {
  // var settings = {
  //   dots: true,
  //   infinite: true,
  //   speed: 500,
  //   slidesToShow: 1,
  //   slidesToScroll: 1
  // };
  const contentStyle = {
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    width: '500px',
    textAlign: 'center',
    background: '#364d79',
    width: '100%', // Adjust this to control how many slides are visible
    display: 'inline-block', // Ensure slides are displayed inline
    border: '2px solid #fff', // Add border to each slide
    boxSizing: 'border-box', 
  };
  return (
    // <Box
    //   sx={{
    //     display: 'flex',
    //     gap: 1,
    //     py: 1,
    //     overflow: 'auto',
    //     width: "1000px",
    //     scrollSnapType: 'x mandatory',
    //     '& > *': {
    //       scrollSnapAlign: 'center',
    //     },
    //     '::-webkit-scrollbar': { display: 'none' },
    //   }}
    // >
    //   {data.map((item) => (
    //     <Box
    //       key={item.title}
    //       sx={{
    //         position: 'relative',
    //         width: '100%',
    //         minWidth: 210,
    //         height: 150,
    //         borderRadius: '15px', // Adding border radius to the Box
    //         overflow: 'hidden', // Ensures the image fits within the rounded corners
    //       }}
    //     >
    //       <AspectRatio ratio="1">
    //         <img
    //           srcSet={`${item.src}?h=120&fit=crop&auto=format&dpr=2 2x`}
    //           src={`${item.src}?h=120&fit=crop&auto=format`}
    //           alt={item.title}
    //           style={{
    //             width: '100%',
    //             height: '100%',
    //             objectFit: 'cover',
    //             borderRadius: '15px', // Optional: add border radius to the image itself
    //           }}
    //         />
    //       </AspectRatio>
    //       <Box
    //         sx={{
    //           position: 'absolute',
    //           bottom: 0, // Position at the bottom
    //           left: 0,
    //           right: 0,
    //           display: 'flex',
    //           flexDirection: 'column', // Stack title and description vertically
    //           alignItems: 'center',
    //           justifyContent: 'flex-end', // Align items to the bottom
    //           // background: 'rgba(0, 0, 0, 0.5)', // Optional: semi-transparent background
    //           p: 2,
    //         }}
    //       >
    //         <Typography level="title-md" sx={{ color: 'white' }}>
    //           {item.title}
    //         </Typography>
    //         <Typography level="body-sm" sx={{ color: 'white', mt: 1 }}>
    //           {item.description}
    //         </Typography>
    //       </Box>
    //     </Box>
    //   ))}
    // </Box>
    // <Slider {...settings}>
    //   <div>
    //    <img src="https://images.unsplash.com/photo-1502657877623-f66bf489d236" alt='' />
    //   </div>
    //   <div>
    //   <img src="https://images.unsplash.com/photo-1527549993586-dff825b37782" alt='' />
    //   </div>
    //   <div>
    //   <img src="https://images.unsplash.com/photo-1532614338840-ab30cf10ed36" alt='' />
    //   </div>
    //   <div>
    //   <img src="https://images.unsplash.com/photo-1502657877623-f66bf489d236" alt='' />
    //   </div>
    //   <div>
    //   <img src="https://images.unsplash.com/photo-1502657877623-f66bf489d236" alt='' />
    //   </div>
    //   <div>
    //   <img src="https://images.unsplash.com/photo-1502657877623-f66bf489d236" alt='' />
    //   </div>
    // </Slider>
    <div className="carousel-container">
    <Carousel
      autoplay
      dots={false} // Optional: Disable dots if you prefer
      slidesToShow={3} // Important: Control the number of visible slides
      slidesToScroll={1} // Adjust for smooth scrolling experience
      arrows={true} // Enable arrows
      // prevArrow={"asd"} // Custom Previous Arrow
      // nextArrow={"fas"}
    >
      <div>
        <h3 style={contentStyle}>1</h3>
      </div>
      <div>
        <h3 style={contentStyle}>2</h3>
      </div>
      <div>
        <h3 style={contentStyle}>3</h3>
      </div>
      <div>
        <h3 style={contentStyle}>4</h3>
      </div>
    </Carousel>
  </div>
  );
}
