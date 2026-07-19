// components/common/Navbar.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Container,
  Tooltip,
  Badge,
  useMediaQuery,
  useTheme,
  Fade,
  Stack,
  Chip,
  alpha,
  TextField,
  InputAdornment,
  Divider,
  ListItemIcon,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  Category,
  ShoppingCart,
  Person,
  Logout,
  Login,
  AppRegistration,
  DarkMode,
  LightMode,
  Search,
  Notifications,
  Settings,
  AdminPanelSettings,
  Favorite,
  Storefront,
  Dashboard,
  Receipt,
  Discount,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { ColorModeContext } from '../../App';

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'scrolled',
})(({ theme, scrolled }) => ({
  position: 'sticky',
  elevation: scrolled ? 4 : 0,
  backgroundColor: '#0a0a0a',
  backdropFilter: 'blur(20px)',
  borderBottom: scrolled 
    ? 'none' 
    : '1px solid rgba(255,255,255,0.05)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: scrolled 
    ? '0 4px 30px rgba(0,0,0,0.5)' 
    : 'none',
  direction: 'rtl',
  color: '#ffffff',
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  fontSize: '1.5rem',
  letterSpacing: '-0.5px',
  color: '#ffffff',
  '&:hover': {
    transform: 'scale(1.02)',
    transition: 'transform 0.3s ease',
  },
}));

const NavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active',
})(({ theme, active }) => ({
  color: active ? '#667eea' : 'rgba(255,255,255,0.7)',
  fontWeight: active ? 600 : 500,
  position: 'relative',
  borderRadius: '12px',
  padding: '8px 20px',
  textTransform: 'none',
  fontSize: '0.95rem',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&::before': {
    content: '""',
    position: 'absolute',
    bottom: 4,
    left: '50%',
    transform: active ? 'translateX(-50%) scaleX(1)' : 'translateX(-50%) scaleX(0)',
    width: '30%',
    height: 3,
    background: 'linear-gradient(90deg, #667eea, #764ba2)',
    borderRadius: 4,
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  '&:hover': {
    color: '#ffffff',
    backgroundColor: 'rgba(255,255,255,0.08)',
    transform: 'translateY(-1px)',
    '&::before': {
      transform: 'translateX(-50%) scaleX(1)',
    },
  },
  '& .MuiButton-startIcon': {
    marginLeft: 8,
    marginRight: 0,
  },
}));

const AdminButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active',
})(({ theme, active }) => ({
  color: '#ff9800',
  fontWeight: active ? 600 : 500,
  backgroundColor: active ? 'rgba(255,152,0,0.15)' : 'transparent',
  borderRadius: '12px',
  padding: '8px 20px',
  textTransform: 'none',
  fontSize: '0.95rem',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: 'rgba(255,152,0,0.2)',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 15px rgba(255, 152, 0, 0.2)',
  },
  '& .MuiButton-startIcon': {
    marginLeft: 8,
    marginRight: 0,
  },
}));

const ActionIconButton = styled(IconButton)(({ theme }) => ({
  color: 'rgba(255,255,255,0.6)',
  padding: 8,
  borderRadius: '12px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    color: '#ffffff',
    backgroundColor: 'rgba(255,255,255,0.08)',
    transform: 'scale(1.05)',
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 38,
  height: 38,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: '2px solid transparent',
  '&:hover': {
    transform: 'scale(1.08)',
    borderColor: '#667eea',
    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  borderRadius: '12px',
  margin: '4px 8px',
  padding: '10px 16px',
  transition: 'all 0.2s ease',
  color: 'rgba(255,255,255,0.8)',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.08)',
    transform: 'translateX(-4px)',
  },
  '& .MuiListItemIcon-root': {
    minWidth: 40,
    marginLeft: 8,
    marginRight: 0,
    color: 'rgba(255,255,255,0.6)',
  },
}));

export default function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const colorMode = useContext(ColorModeContext);
  
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const cartCount = 3;

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setLoggedIn(true);
        setAdmin(parsedUser.role === 'admin');
      } catch (error) {
        console.error('Error parsing user:', error);
      }
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
    handleCloseUserMenu();
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenNotifications = (event) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setAnchorElNotifications(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setLoggedIn(false);
    setUser(null);
    setAdmin(false);
    handleCloseUserMenu();
    navigate('/');
  };

  const toggleDarkMode = () => {
    colorMode.toggleColorMode();
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
      setSearchQuery("");
    }
  };

  const menuItems = [
    { text: 'خانه', icon: <Home />, path: '/' },
    { text: 'محصولات', icon: <Category />, path: '/products' },
    { text: 'دسته‌بندی‌ها', icon: <Category />, path: '/categories' },
    { text: 'فروش ویژه', icon: <Discount />, path: '/sales' },
  ];

  const userMenuItems = [
    { text: 'پروفایل', icon: <Person />, path: '/profile' },
    { text: 'سفارشات من', icon: <Receipt />, path: '/orders' },
    { text: 'علاقه‌مندی‌ها', icon: <Favorite />, path: '/wishlist' },
    { text: 'تنظیمات', icon: <Settings />, path: '/settings' },
  ];

  const isDark = theme.palette.mode === 'dark';

  return (
    <StyledAppBar position="sticky" scrolled={scrolled}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: 72, display: 'flex', alignItems: 'center', gap: 1, direction: 'rtl' }}>
          
          {/* دکمه همبرگری */}
          <ActionIconButton onClick={onMenuClick}>
            <MenuIcon />
          </ActionIconButton>
          
          <LogoText onClick={() => handleNavigate('/')}>
            <Storefront sx={{ 
              mr: 1, 
              color: '#667eea',
              fontSize: isMobile ? '1.3rem' : '1.8rem',
            }} />
            فروشگاه من
          </LogoText>

          {!isMobile && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5, 
              flex: 1, 
              justifyContent: 'center',
              direction: 'rtl',
            }}>
              {menuItems.map((item) => (
                <NavButton
                  key={item.text}
                  onClick={() => handleNavigate(item.path)}
                  startIcon={item.icon}
                  active={isActivePath(item.path) ? 1 : 0}
                >
                  {item.text}
                </NavButton>
              ))}
              
              <Box 
                component="form" 
                onSubmit={handleSearch}
                sx={{ 
                  mx: 2,
                  minWidth: 200,
                  maxWidth: 300,
                  flex: 1,
                }}
              >
                <TextField
                  size="small"
                  placeholder="جستجوی محصول..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.1)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.2)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                      '& input': {
                        color: '#ffffff',
                      },
                    },
                    '& input': {
                      padding: '10px 14px',
                      fontSize: '0.9rem',
                      textAlign: 'right',
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {admin && (
                <AdminButton
                  onClick={() => handleNavigate('/admin')}
                  startIcon={<AdminPanelSettings />}
                  active={isActivePath('/admin') ? 1 : 0}
                >
                  مدیریت
                </AdminButton>
              )}
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {isMobile && (
              <ActionIconButton onClick={() => navigate('/search')}>
                <Search />
              </ActionIconButton>
            )}
            
            <ActionIconButton onClick={() => navigate('/wishlist')}>
              <Badge 
                badgeContent={5} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.6rem',
                    minWidth: 18,
                    height: 18,
                    borderRadius: '50%',
                    backgroundColor: '#f44336',
                  }
                }}
              >
                <Favorite />
              </Badge>
            </ActionIconButton>

            <ActionIconButton onClick={handleOpenNotifications}>
              <Badge 
                badgeContent={3} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.6rem',
                    minWidth: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f44336, #e91e63)',
                  }
                }}
              >
                <Notifications />
              </Badge>
            </ActionIconButton>

            <ActionIconButton onClick={() => navigate('/cart')}>
              <Badge 
                badgeContent={cartCount} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.6rem',
                    minWidth: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ff9800, #f44336)',
                  }
                }}
              >
                <ShoppingCart />
              </Badge>
            </ActionIconButton>

            <ActionIconButton onClick={toggleDarkMode}>
              {isDark ? <LightMode /> : <DarkMode />}
            </ActionIconButton>

            {loggedIn ? (
              <>
                <Tooltip title="حساب کاربری" arrow>
                  <StyledAvatar onClick={handleOpenUserMenu}>
                    {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                  </StyledAvatar>
                </Tooltip>
                <Menu
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                  TransitionComponent={Fade}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      borderRadius: 3,
                      minWidth: 260,
                      boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
                      overflow: 'hidden',
                      direction: 'rtl',
                      bgcolor: '#0a0a0a',
                      border: '1px solid rgba(255,255,255,0.05)',
                    }
                  }}
                >
                  <Box sx={{ 
                    p: 2.5, 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                  }}>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {user?.username}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.85 }}>
                      {user?.role === 'admin' ? 'مدیر فروشگاه' : 'کاربر'}
                    </Typography>
                    {user?.role === 'admin' && (
                      <Chip 
                        label="ادمین" 
                        size="small"
                        sx={{ 
                          mt: 1,
                          bgcolor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          fontWeight: 600,
                          borderRadius: 1,
                        }}
                      />
                    )}
                  </Box>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
                  <StyledMenuItem onClick={() => handleNavigate('/profile')}>
                    <ListItemIcon><Person fontSize="small" /></ListItemIcon>
                    پروفایل
                  </StyledMenuItem>
                  <StyledMenuItem onClick={() => handleNavigate('/orders')}>
                    <ListItemIcon><Receipt fontSize="small" /></ListItemIcon>
                    سفارشات من
                  </StyledMenuItem>
                  <StyledMenuItem onClick={() => handleNavigate('/wishlist')}>
                    <ListItemIcon><Favorite fontSize="small" /></ListItemIcon>
                    علاقه‌مندی‌ها
                  </StyledMenuItem>
                  <StyledMenuItem onClick={() => handleNavigate('/settings')}>
                    <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
                    تنظیمات
                  </StyledMenuItem>
                  {admin && (
                    <StyledMenuItem onClick={() => handleNavigate('/admin')}>
                      <ListItemIcon><Dashboard fontSize="small" /></ListItemIcon>
                      پنل مدیریت
                    </StyledMenuItem>
                  )}
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
                  <StyledMenuItem onClick={handleLogout} sx={{ color: '#f44336' }}>
                    <ListItemIcon><Logout fontSize="small" sx={{ color: '#f44336' }} /></ListItemIcon>
                    خروج
                  </StyledMenuItem>
                </Menu>
              </>
            ) : (
              <Stack direction="row" spacing={1} sx={{ mr: 1 }}>
                <Button 
                  onClick={() => handleNavigate('/login')} 
                  variant="outlined" 
                  size="small"
                  sx={{
                    borderRadius: 3,
                    textTransform: 'none',
                    borderColor: 'rgba(255,255,255,0.2)',
                    color: 'rgba(255,255,255,0.8)',
                    px: 2.5,
                    py: 0.8,
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: '#667eea',
                      bgcolor: 'rgba(255,255,255,0.05)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.2)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  ورود
                </Button>
                <Button 
                  onClick={() => handleNavigate('/register')} 
                  variant="contained" 
                  size="small"
                  sx={{
                    borderRadius: 3,
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    px: 2.5,
                    py: 0.8,
                    fontWeight: 600,
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                    '&:hover': {
                      boxShadow: '0 6px 25px rgba(102, 126, 234, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  ثبت‌نام
                </Button>
              </Stack>
            )}
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
}