// Layout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import SideBar from '../Components/SideBar';
import { Box } from '@mui/material';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar onMenuClick={toggleSidebar} />
      
      <Box sx={{ display: 'flex', flex: 1, position: 'relative' }}>
        <SideBar 
          open={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        <Box 
          component="main" 
          sx={{ 
            flex: 1, 
            p: 3,
            transition: 'margin-right 0.3s ease',
            marginRight: sidebarOpen ? '280px' : '0px',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}