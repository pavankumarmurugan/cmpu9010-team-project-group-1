import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const data = [
  {
    src: 'https://media.boohoo.com/i/boohoo/gzz41350_light%20wash_xl?w=450&qlt=default&fmt.jp2.qlt=70&fmt=auto&sm=fit',
    title: 'Summer Dresses',
  },
  {
    src: 'https://media.boohooman.com/i/boohooman/bmm90607_black_xl?$product_image_category_page$&fmt=webp',
    title: 'Printed Shirts for Men',
  },
  {
    src: 'https://cdn.shopify.com/s/files/1/0610/4567/0052/files/WB_HR_CL134725004__0-Jul17_1_19_43_x1200.jpg',
    title: 'Date Night Dresses',
  },
  {
    src: 'https://content.moss.co.uk/images/extraextralarge/966835209_02.jpg',
    title: 'Men Suits',
  },
];

export default function Carousel() {

  const navigate = useNavigate();
  
  const handleCarousel = (searchValue) => {
    debugger
    navigate("/ConversationalSearch", { state: { searchValue } });
  }
  

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        py: 1,
        overflow: 'auto',
        width: 700,
        scrollSnapType: 'x mandatory',
        '& > *': {
          scrollSnapAlign: 'center',
        },
        '::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {data.map((item) => (
        <Box
          key={item.title}
          sx={{
            position: 'relative',
            width: '100%',
            minWidth: 210,
            height: 150,
            cursor: 'pointer',
            borderRadius: '15px', // Adding border radius to the Box
            overflow: 'hidden', // Ensures the image fits within the rounded corners
          }}
          onClick={() => handleCarousel(item.title)}
        >
          <AspectRatio ratio="1">
            <img
              srcSet={`${item.src}?h=120&fit=crop&auto=format&dpr=2 2x`}
              src={`${item.src}?h=120&fit=crop&auto=format`}
              alt={item.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '15px', // Optional: add border radius to the image itself
              }}
              onClick={() => handleCarousel(item.title)}
            />
          </AspectRatio>
          <Box
            sx={{
              position: 'absolute',
              bottom: 0, // Position at the bottom
              left: 0,
              right: 0,
              display: 'flex',
              flexDirection: 'column', // Stack title and description vertically
              alignItems: 'center',
              justifyContent: 'flex-end', // Align items to the bottom
              // background: 'rgba(0, 0, 0, 0.5)', // Optional: semi-transparent background
              p: 2,
            }}
            onClick={() => handleCarousel(item.title)}
          >
            <Typography level="title-md" sx={{ color: 'white' }}>
              {item.title}
            </Typography>
            <Typography level="body-sm" sx={{ color: 'white', mt: 1 }}>
              {item.description}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
