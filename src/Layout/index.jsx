// Layout.jsx
import React, { useState, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import SideBar from '../Components/SideBar';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { ColorModeContext } from '../App';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const colorMode = useContext(ColorModeContext);
  const isDark = colorMode.mode === 'dark';

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' , background:"/assets/blackbackground.jpg"}}>
      <Navbar onMenuClick={toggleSidebar} />
      
      <Box sx={{ display: 'flex', flex: 1 }}>
        {/* محتوای اصلی */}
        <Box 
          component="main" 
          sx={{ 
            flex: 1,
            p: { xs: 2, md: 3 },
            width: '100%',
            ...(isMobile ? {} : {
              // marginRight: '280px',
            }),
            minHeight: 'calc(100vh - 72px)',
            backgroundColor: isDark ? '#121212' : '#fafafa',
            transition: 'background-color 0.3s ease',
          }}
        >
          <Outlet />
        </Box>
        
        {/* سایدبار */}
        <SideBar 
          open={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
      </Box>
    </Box>
  );
}