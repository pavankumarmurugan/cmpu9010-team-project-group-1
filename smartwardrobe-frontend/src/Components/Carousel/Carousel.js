import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';

const data = [
  {
    src: 'https://images.unsplash.com/photo-1502657877623-f66bf489d236',
    title: 'Night view',
    // description: 'A beautiful night scenery.',
  },
  {
    src: 'https://images.unsplash.com/photo-1527549993586-dff825b37782',
    title: 'Lake view',
    // description: 'Serenity by the lake.',
  },
  {
    src: 'https://images.unsplash.com/photo-1532614338840-ab30cf10ed36',
    title: 'Mountain view',
    // description: 'Majestic mountain ranges.',
  },
  {
    src: 'https://images.unsplash.com/photo-1502657877623-f66bf489d236',
    title: 'Night view',
    // description: 'A beautiful night scenery.',
  },
  {
    src: 'https://images.unsplash.com/photo-1527549993586-dff825b37782',
    title: 'Lake view',
    // description: 'Serenity by the lake.',
  }
];

export default function Carousel() {
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
            borderRadius: '15px', // Adding border radius to the Box
            overflow: 'hidden', // Ensures the image fits within the rounded corners
          }}
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
