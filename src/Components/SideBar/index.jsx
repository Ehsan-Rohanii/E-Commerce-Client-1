// components/common/SideBar.jsx
import React, { useState, useEffect, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Avatar,
  Stack,
  Chip,
  Button,
  useTheme,
  useMediaQuery,
  Collapse,
  Badge,
  IconButton,
} from '@mui/material'
import {
  Home,
  Category,
  ShoppingCart,
  Person,
  Logout,
  Login,
  AppRegistration,
  DarkMode,
  LightMode,
  Settings,
  AdminPanelSettings,
  Favorite,
  Storefront,
  Dashboard,
  Receipt,
  Discount,
  ExpandLess,
  ExpandMore,
  Close,
  Inventory,
  LocalShipping,
  Payment,
  Help,
  ContactSupport,
  NewReleases,
  TrendingUp,
} from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import { ColorModeContext } from '../../App'

// ارتفاع Navbar در سایزهای مختلف
const NAVBAR_HEIGHT = {
  xs: 64,
  sm: 68,
  md: 72,
}

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: 280,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: 280,
    backgroundColor: theme.palette.mode === 'dark' ? '#0a0a0a' : '#ffffff',
    borderRight: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
    borderLeft: 'none',
    boxShadow: theme.palette.mode === 'dark' 
      ? '4px 0 30px rgba(0,0,0,0.5)'
      : '4px 0 30px rgba(255,140,0,0.08)',
    paddingTop: 0,
    direction: 'rtl',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
    [theme.breakpoints.up('md')]: {
      position: 'fixed',
      top: NAVBAR_HEIGHT.md,
      height: `calc(100vh - ${NAVBAR_HEIGHT.md}px)`,
      right: 0,
      left: 'auto',
    },
  },
}))

const ProfileHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #FF6F00 0%, #FF8C00 50%, #FFA726 100%)',
  padding: '24px 20px 32px 20px',
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.05)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    bottom: -80,
    left: -80,
    width: 200,
    height: 200,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.03)',
  },
}))

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 12,
  right: 12,
  padding: 8,
  color: 'rgba(255,255,255,0.7)',
  backgroundColor: 'rgba(255,255,255,0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: '50%',
  zIndex: 10,
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.2)',
    transform: 'rotate(90deg)',
    transition: 'transform 0.3s ease',
  },
}))

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 56,
  height: 56,
  border: '3px solid rgba(255,255,255,0.3)',
  backgroundColor: 'rgba(255,255,255,0.2)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    borderColor: 'rgba(255,255,255,0.6)',
  },
}))

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: '12px',
  margin: '4px 12px',
  padding: '10px 16px',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  color: theme.palette.mode === 'dark' 
    ? 'rgba(255,255,255,0.7)' 
    : 'rgba(0,0,0,0.6)',
  '&.Mui-selected': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(255,140,0,0.15)' 
      : 'rgba(255,140,0,0.08)',
    color: '#FF8C00',
    '& .MuiListItemIcon-root': {
      color: '#FF8C00',
    },
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(255,140,0,0.25)' 
        : 'rgba(255,140,0,0.12)',
    },
  },
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(255,255,255,0.05)' 
      : 'rgba(0,0,0,0.04)',
    transform: 'translateX(-4px)',
    color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
  },
  '& .MuiListItemIcon-root': {
    minWidth: 40,
    color: 'inherit',
    transition: 'all 0.2s ease',
  },
}))

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: 0,
}))

const FooterBox = styled(Box)(({ theme }) => ({
  padding: '16px 20px',
  borderTop: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
  marginTop: 'auto',
}))

const ThemeToggleButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '10px 16px',
  justifyContent: 'flex-start',
  color: theme.palette.mode === 'dark' 
    ? 'rgba(255,255,255,0.7)' 
    : 'rgba(0,0,0,0.6)',
  textTransform: 'none',
  width: '100%',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(255,255,255,0.05)' 
      : 'rgba(0,0,0,0.04)',
  },
  '& .MuiButton-startIcon': {
    marginLeft: 12,
    marginRight: 0,
  },
}))

export default function SideBar({ open, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const colorMode = useContext(ColorModeContext)
  
  const [user, setUser] = useState(null)
  const [loggedIn, setLoggedIn] = useState(false)
  const [admin, setAdmin] = useState(false)
  const [openShopSubmenu, setOpenShopSubmenu] = useState(false)

  // تابع کمکی برای دریافت نام کاربر
  const getUserDisplayName = (userData) => {
    if (!userData) return 'مهمان'
    return userData.fullName || userData.fullname || userData.phoneNumber || 'کاربر'
  }

  // تابع کمکی برای دریافت حرف اول نام کاربر
  const getUserInitial = (userData) => {
    if (!userData) return 'U'
    const name = userData.fullName || userData.fullname || userData.phoneNumber || ''
    return name.charAt(0)?.toUpperCase() || 'U'
  }

  useEffect(() => {
    const userData = localStorage.getItem('user')
    console.log('Raw user data from storage:', userData)
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        console.log('Parsed user:', parsedUser)
        
        setUser(parsedUser)
        setLoggedIn(true)
        setAdmin(parsedUser.role === 'admin')
      } catch (error) {
        console.error('Error parsing user:', error)
        setLoggedIn(false)
        setUser(null)
      }
    } else {
      setLoggedIn(false)
      setUser(null)
    }
  }, [])

  const handleNavigate = (path) => {
    navigate(path)
    if (isMobile) {
      onClose()
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('isLoggedIn')
    setLoggedIn(false)
    setUser(null)
    setAdmin(false)
    if (isMobile) {
      onClose()
    }
    navigate('/login')
  }

  const toggleDarkMode = () => {
    colorMode.toggleColorMode()
  }

  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const toggleShopSubmenu = () => {
    setOpenShopSubmenu(!openShopSubmenu)
  }

  const isDark = theme.palette.mode === 'dark'

  const mainMenuItems = [
    { text: 'خانه', icon: <Home />, path: '/' },
    { 
      text: 'محصولات', 
      icon: <Category />, 
      path: '/products',
      submenu: true,
      subItems: [
        { text: 'همه محصولات', path: '/products' },
        { text: 'جدیدترین', path: '/products/new', icon: <NewReleases /> },
        { text: 'پرفروش‌ترین', path: '/products/popular', icon: <TrendingUp /> },
        { text: 'حراج‌ها', path: '/sales', icon: <Discount /> },
      ]
    },
    { text: 'دسته‌بندی‌ها', icon: <Category />, path: '/categories' },
    { 
      text: 'فروش ویژه', 
      icon: <Discount />, 
      path: '/sales',
      badge: '🔥',
    },
    { 
      text: 'سبد خرید', 
      icon: <ShoppingCart />, 
      path: '/order',
      badge: '3',
    },
    { 
      text: 'علاقه‌مندی‌ها', 
      icon: <Favorite />, 
      path: '/wishlist',
      badge: '5',
    },
  ]

  const userMenuItems = [
    { text: 'پروفایل', icon: <Person />, path: '/profile' },
    { text: 'سفارشات من', icon: <Receipt />, path: '/orders' },
    { text: 'علاقه‌مندی‌ها', icon: <Favorite />, path: '/wishlist' },
    { text: 'تنظیمات', icon: <Settings />, path: '/settings' },
  ]

  const adminMenuItems = [
    { text: 'داشبورد', icon: <Dashboard />, path: '/admin' },
    { text: 'مدیریت محصولات', icon: <Inventory />, path: '/admin/products' },
    { text: 'مدیریت سفارشات', icon: <LocalShipping />, path: '/admin/orders' },
    { text: 'مدیریت کاربران', icon: <Person />, path: '/admin/users' },
    { text: 'مدیریت تخفیف‌ها', icon: <Discount />, path: '/admin/discounts' },
    { text: 'گزارشات', icon: <Payment />, path: '/admin/reports' },
  ]

  const drawerContent = (
    <>
      <ProfileHeader>
        {isMobile && (
          <CloseButton onClick={onClose} aria-label="close drawer">
            <Close sx={{ fontSize: 20 }} />
          </CloseButton>
        )}
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: isMobile ? 2 : 0 }}>
          <StyledAvatar>
            {loggedIn ? getUserInitial(user) : 'U'}
          </StyledAvatar>
          <Box sx={{ flex: 1 }}>
            {loggedIn ? (
              <>
                <Typography variant="h6" fontWeight={700} sx={{ textAlign: 'right' }}>
                  {getUserDisplayName(user)}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.85, display: 'block', textAlign: 'right' }}>
                  {user?.phoneNumber || user?.email || 'شماره موبایل ثبت نشده'}
                </Typography>
                {admin && (
                  <Chip 
                    label="مدیر فروشگاه" 
                    size="small"
                    sx={{ 
                      mt: 0.5,
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontWeight: 600,
                      borderRadius: 1,
                      fontSize: '0.65rem',
                      height: 20,
                    }}
                  />
                )}
              </>
            ) : (
              <>
                <Typography variant="h6" fontWeight={700} sx={{ textAlign: 'right' }}>
                  مهمان
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.85, textAlign: 'right' }}>
                  وارد حساب خود شوید
                </Typography>
              </>
            )}
          </Box>
        </Box>

        {!loggedIn && (
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button 
              onClick={() => handleNavigate('/login')}
              variant="contained"
              size="small"
              sx={{
                flex: 1,
                bgcolor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.3)',
                },
              }}
              startIcon={<Login />}
            >
              ورود
            </Button>
            <Button 
              onClick={() => navigate('/register')}
              variant="contained"
              size="small"
              sx={{
                flex: 1,
                bgcolor: 'rgba(255,255,255,0.9)',
                color: '#FF8C00',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: 'white',
                },
              }}
              startIcon={<AppRegistration />}
            >
              ثبت‌نام
            </Button>
          </Stack>
        )}
      </ProfileHeader>

      <Box sx={{ flex: 1, overflow: 'auto', py: 1 }}>
        <List sx={{ width: '100%' }}>
          {mainMenuItems.map((item) => (
            <React.Fragment key={item.text}>
              {item.submenu ? (
                <>
                  <StyledListItem disablePadding>
                    <StyledListItemButton
                      selected={isActivePath(item.path)}
                      onClick={toggleShopSubmenu}
                      sx={{
                        borderRadius: '12px',
                        margin: '2px 12px',
                      }}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText 
                        primary={item.text}
                        sx={{
                          '& .MuiTypography-root': {
                            textAlign: 'right',
                            fontSize: '0.95rem',
                            fontWeight: isActivePath(item.path) ? 600 : 500,
                          }
                        }}
                      />
                      {openShopSubmenu ? <ExpandLess /> : <ExpandMore />}
                    </StyledListItemButton>
                  </StyledListItem>
                  <Collapse in={openShopSubmenu} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.subItems.map((subItem) => (
                        <StyledListItem key={subItem.text} disablePadding>
                          <StyledListItemButton
                            selected={isActivePath(subItem.path)}
                            onClick={() => handleNavigate(subItem.path)}
                            sx={{
                              paddingLeft: 4,
                              margin: '2px 12px',
                              borderRadius: '12px',
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              {subItem.icon || <Category />}
                            </ListItemIcon>
                            <ListItemText 
                              primary={subItem.text}
                              sx={{
                                '& .MuiTypography-root': {
                                  textAlign: 'right',
                                  fontSize: '0.85rem',
                                  fontWeight: isActivePath(subItem.path) ? 600 : 400,
                                }
                              }}
                            />
                          </StyledListItemButton>
                        </StyledListItem>
                      ))}
                    </List>
                  </Collapse>
                </>
              ) : (
                <StyledListItem disablePadding>
                  <StyledListItemButton
                    selected={isActivePath(item.path)}
                    onClick={() => handleNavigate(item.path)}
                  >
                    <ListItemIcon>
                      {item.badge && !item.badge.includes('🔥') ? (
                        <Badge 
                          badgeContent={item.badge} 
                          color="error"
                          sx={{
                            '& .MuiBadge-badge': {
                              fontSize: '0.7rem',
                              minWidth: 20,
                              height: 20,
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #FF6F00, #FF8C00)',
                            }
                          }}
                        >
                          {item.icon}
                        </Badge>
                      ) : (
                        item.icon
                      )}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text}
                      sx={{
                        '& .MuiTypography-root': {
                          textAlign: 'right',
                          fontSize: '0.95rem',
                          fontWeight: isActivePath(item.path) ? 600 : 500,
                        }
                      }}
                    />
                    {item.badge === '🔥' && (
                      <Typography sx={{ fontSize: '1rem' }}>🔥</Typography>
                    )}
                  </StyledListItemButton>
                </StyledListItem>
              )}
            </React.Fragment>
          ))}
        </List>

        <Divider sx={{ 
          mx: 2, 
          my: 1,
          borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
        }} />

        {loggedIn && (
          <List sx={{ width: '100%' }}>
            <Typography variant="caption" sx={{ px: 3, py: 1, display: 'block', opacity: 0.6, fontWeight: 600, textAlign: 'right' }}>
              حساب کاربری
            </Typography>
            {userMenuItems.map((item) => (
              <StyledListItem key={item.text} disablePadding>
                <StyledListItemButton
                  selected={isActivePath(item.path)}
                  onClick={() => handleNavigate(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    sx={{
                      '& .MuiTypography-root': {
                        textAlign: 'right',
                        fontSize: '0.9rem',
                        fontWeight: isActivePath(item.path) ? 600 : 400,
                      }
                    }}
                  />
                </StyledListItemButton>
              </StyledListItem>
            ))}
          </List>
        )}

        {admin && (
          <>
            <Divider sx={{ 
              mx: 2, 
              my: 1,
              borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            }} />
            <List sx={{ width: '100%' }}>
              <Typography variant="caption" sx={{ px: 3, py: 1, display: 'block', opacity: 0.6, fontWeight: 600, textAlign: 'right' }}>
                <AdminPanelSettings sx={{ fontSize: 14, mr: 1, verticalAlign: 'middle' }} />
                مدیریت
              </Typography>
              {adminMenuItems.map((item) => (
                <StyledListItem key={item.text} disablePadding>
                  <StyledListItemButton
                    selected={isActivePath(item.path)}
                    onClick={() => handleNavigate(item.path)}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText 
                      primary={item.text}
                      sx={{
                        '& .MuiTypography-root': {
                          textAlign: 'right',
                          fontSize: '0.9rem',
                          fontWeight: isActivePath(item.path) ? 600 : 400,
                        }
                      }}
                    />
                  </StyledListItemButton>
                </StyledListItem>
              ))}
            </List>
          </>
        )}

        <Box sx={{ px: 2, py: 1 }}>
          <Divider sx={{ 
            mb: 1,
            borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
          }} />
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5, justifyContent: 'flex-start' }}>
            <Button
              size="small"
              startIcon={<Help />}
              onClick={() => handleNavigate('/help')}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '0.75rem',
                color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
                '&:hover': {
                  bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                },
              }}
            >
              راهنما
            </Button>
            <Button
              size="small"
              startIcon={<ContactSupport />}
              onClick={() => handleNavigate('/contact')}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '0.75rem',
                color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
                '&:hover': {
                  bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                },
              }}
            >
              تماس با ما
            </Button>
          </Stack>
        </Box>
      </Box>

      <FooterBox>
        <ThemeToggleButton
          onClick={toggleDarkMode}
          startIcon={isDark ? <LightMode /> : <DarkMode />}
        >
          {isDark ? 'حالت روشن' : 'حالت تاریک'}
        </ThemeToggleButton>
        
        {loggedIn && (
          <Button
            onClick={handleLogout}
            startIcon={<Logout />}
            sx={{
              borderRadius: '12px',
              padding: '10px 16px',
              justifyContent: 'flex-start',
              color: '#f44336',
              textTransform: 'none',
              width: '100%',
              mt: 1,
              gap: 1,
              '&:hover': {
                backgroundColor: 'rgba(244, 67, 54, 0.08)',
              },
            }}
          >
            خروج از حساب
          </Button>
        )}

        <Box sx={{ 
          mt: 2, 
          textAlign: 'center',
          typography: 'caption',
          color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
        }}>
          <Storefront sx={{ fontSize: 16, verticalAlign: 'middle', color: '#FF8C00' }} />
          فروشگاه من v1.0
        </Box>
      </FooterBox>
    </>
  )

  // حالت موبایل - سایدبار از راست باز می‌شود
  if (isMobile) {
    return (
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        variant="temporary"
        ModalProps={{
          keepMounted: true,
        }}
        transitionDuration={300}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 300,
            backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
            direction: 'rtl',
            boxShadow: isDark 
              ? '-4px 0 30px rgba(0,0,0,0.5)'
              : '-4px 0 30px rgba(255,140,0,0.12)',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    )
  }

  // حالت دسکتاپ - سایدبار در سمت راست ثابت است
  return (
    <StyledDrawer
      variant="permanent"
      open={true}
      sx={{
        display: { xs: 'none', md: 'block' },
        width: 280,
        flexShrink: 0,
      }}
    >
      {drawerContent}
    </StyledDrawer>
  )
}