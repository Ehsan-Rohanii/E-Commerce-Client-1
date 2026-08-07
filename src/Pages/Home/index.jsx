// pages/Home.jsx
import React, { useContext } from 'react';
import Slider from '../../Components/Slider';
import { Box } from '@mui/material';
import Products from '../Products';
import { ColorModeContext } from '../../App';

export default function Home() {
  const colorMode = useContext(ColorModeContext);
  const isDark = colorMode.mode === 'dark';

  return (
    <Box 
      key={isDark ? 'dark' : 'light'}
      sx={{ 
        width: '100%',
        maxWidth: '100%',
        
      }}
    >
      <Slider />
      {/* <Products /> */}
    </Box>
  );
}