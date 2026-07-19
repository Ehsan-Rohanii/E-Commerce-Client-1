// components/common/SideBar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Avatar,
  Chip,
  Stack,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Home,
  Category,
  ShoppingCart,
  Person,
  Logout,
  Dashboard,
  Receipt,
  Discount,
  Favorite,
  Storefront,
  Close,
  AdminPanelSettings,
  Settings,
  LocalShipping,
  Payment,
  Help as HelpIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 280,
    backgroundColor: '#0a0a0a',
    borderLeft: '1px solid rgba(255,255,255,0.05)',
    boxShadow: '-4px 0 30px rgba(0,0,0,0.5)',
    overflowX: 'hidden',
    right: 0,
    left: 'auto',
  },
}));

const LogoBox = styled(Box)(({ theme }) => ({
  padding: '20px 20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '12px',
  borderBottom: '1px solid rgba(255,255,255,0.05)',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
}));

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
  borderRadius: '12px',
  margin: '2px 8px',
  padding: '10px 16px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  color: active ? '#ffffff' : 'rgba(255,255,255,0.6)',
  backgroundColor: active ? 'rgba(102,126,234,0.15)' : 'transparent',
  '&:hover': {
    backgroundColor: active ? 'rgba(102,126,234,0.2)' : 'rgba(255,255,255,0.05)',
    transform: 'translateX(-4px)',
  },
  '& .MuiListItemIcon-root': {
    color: active ? '#667eea' : 'rgba(255,255,255,0.4)',
    minWidth: 40,
    marginRight: 8,
    marginLeft: 0,
  },
  '& .MuiListItemText-root': {
    textAlign: 'right',
  },
  '& .MuiListItemText-primary': {
    fontWeight: active ? 600 : 400,
    fontSize: '0.9rem',
    textAlign: 'right',
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  padding: '16px 20px 8px 20px',
  color: 'rgba(255,255,255,0.3)',
  fontSize: '0.7rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  textAlign: 'right',
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  backgroundColor: 'rgba(255,152,0,0.15)',
  color: '#ff9800',
  fontSize: '0.6rem',
  height: 20,
  fontWeight: 600,
}));

export default function SideBar({ open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [admin, setAdmin] = useState(false);

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
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setLoggedIn(false);
    setUser(null);
    setAdmin(false);
    navigate('/');
    if (isMobile) onClose();
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const mainMenuItems = [
    { text: 'خانه', icon: <Home />, path: '/' },
    { text: 'محصولات', icon: <Storefront />, path: '/products' },
    { text: 'دسته‌بندی‌ها', icon: <Category />, path: '/categories' },
    { text: 'فروش ویژه', icon: <Discount />, path: '/sales' },
    { text: 'علاقه‌مندی‌ها', icon: <Favorite />, path: '/wishlist' },
  ];

  const shopMenuItems = [
    { text: 'سبد خرید', icon: <ShoppingCart />, path: '/cart' },
    { text: 'سفارشات من', icon: <Receipt />, path: '/orders' },
    { text: 'پرداخت‌ها', icon: <Payment />, path: '/payments' },
    { text: 'مرجوعی‌ها', icon: <LocalShipping />, path: '/returns' },
  ];

  const adminMenuItems = [
    { text: 'داشبورد', icon: <Dashboard />, path: '/admin' },
    { text: 'مدیریت محصولات', icon: <Storefront />, path: '/admin/products' },
    { text: 'مدیریت سفارشات', icon: <Receipt />, path: '/admin/orders' },
    { text: 'مدیریت کاربران', icon: <Person />, path: '/admin/users' },
    { text: 'مدیریت تخفیف‌ها', icon: <Discount />, path: '/admin/discounts' },
  ];

  const accountMenuItems = [
    { text: 'پروفایل', icon: <Person />, path: '/profile' },
    { text: 'تنظیمات', icon: <Settings />, path: '/settings' },
    { text: 'راهنما', icon: <HelpIcon />, path: '/help' },
  ];

  return (
    <StyledDrawer
      anchor="right"
      open={open}
      onClose={onClose}
      variant={isMobile ? "temporary" : "persistent"}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        '& .MuiDrawer-paper': {
          top: isMobile ? 0 : '72px',
          height: isMobile ? '100vh' : 'calc(100vh - 72px)',
          direction: 'rtl',
          textAlign: 'right',
        }
      }}
    >
      {/* لوگو */}
      <LogoBox onClick={() => handleNavigate('/')}>
        <Typography variant="h6" fontWeight={800} color="white">
          فروشگاه من
        </Typography>
        <Storefront sx={{ color: '#667eea', fontSize: 32 }} />
      </LogoBox>

      {/* اطلاعات کاربر */}
      {loggedIn && user ? (
        <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle1" fontWeight={600} color="white">
                {user.username}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                  {user.role === 'admin' ? 'مدیر فروشگاه' : 'کاربر'}
                </Typography>
                {user.role === 'admin' && (
                  <StyledChip label="ادمین" size="small" />
                )}
              </Stack>
            </Box>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              {user.username?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
          </Box>
        </Box>
      ) : (
        <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleNavigate('/login')}
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
              },
            }}
          >
            ورود به حساب
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => handleNavigate('/register')}
            sx={{
              color: 'rgba(255,255,255,0.5)',
              textTransform: 'none',
              mt: 1,
              '&:hover': {
                color: 'white',
              },
            }}
          >
            ثبت‌نام
          </Button>
        </Box>
      )}

      {/* منوها */}
      <Box sx={{ overflowY: 'auto', flex: 1, pb: 2 }}>
        <SectionTitle>منوی اصلی</SectionTitle>
        <List sx={{ px: 1 }}>
          {mainMenuItems.map((item) => (
            <StyledListItem
              key={item.text}
              active={isActivePath(item.path) ? 1 : 0}
              onClick={() => handleNavigate(item.path)}
            >
              <ListItemIcon sx={{ justifyContent: 'flex-end' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </StyledListItem>
          ))}
        </List>

        <SectionTitle>فروشگاه</SectionTitle>
        <List sx={{ px: 1 }}>
          {shopMenuItems.map((item) => (
            <StyledListItem
              key={item.text}
              active={isActivePath(item.path) ? 1 : 0}
              onClick={() => handleNavigate(item.path)}
            >
              <ListItemIcon sx={{ justifyContent: 'flex-end' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </StyledListItem>
          ))}
        </List>

        {admin && (
          <>
            <SectionTitle>مدیریت</SectionTitle>
            <List sx={{ px: 1 }}>
              {adminMenuItems.map((item) => (
                <StyledListItem
                  key={item.text}
                  active={isActivePath(item.path) ? 1 : 0}
                  onClick={() => handleNavigate(item.path)}
                >
                  <ListItemIcon sx={{ justifyContent: 'flex-end' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </StyledListItem>
              ))}
            </List>
          </>
        )}

        {loggedIn && (
          <>
            <SectionTitle>حساب کاربری</SectionTitle>
            <List sx={{ px: 1 }}>
              {accountMenuItems.map((item) => (
                <StyledListItem
                  key={item.text}
                  active={isActivePath(item.path) ? 1 : 0}
                  onClick={() => handleNavigate(item.path)}
                >
                  <ListItemIcon sx={{ justifyContent: 'flex-end' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </StyledListItem>
              ))}
            </List>
          </>
        )}

        {loggedIn && (
          <>
            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.05)' }} />
            <List sx={{ px: 1 }}>
              <StyledListItem onClick={handleLogout} sx={{ color: '#f44336' }}>
                <ListItemIcon sx={{ color: '#f44336', justifyContent: 'flex-end' }}>
                  <Logout />
                </ListItemIcon>
                <ListItemText primary="خروج" sx={{ color: '#f44336' }} />
              </StyledListItem>
            </List>
          </>
        )}

        <Box sx={{ px: 3, py: 2, mt: 2, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.2)', display: 'block', textAlign: 'center' }}>
            © {new Date().getFullYear()} فروشگاه من
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.15)', display: 'block', textAlign: 'center', mt: 0.5 }}>
            تمامی حقوق محفوظ است
          </Typography>
        </Box>
      </Box>
    </StyledDrawer>
  );
}