// components/common/Navbar.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  TextField,
  InputAdornment,
  Divider,
  ListItemIcon,
} from "@mui/material";
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
  BrandingWatermark,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { ColorModeContext } from "../../App";

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "scrolled",
})(({ theme, scrolled }) => ({
  position: "sticky",
  elevation: scrolled ? 4 : 0,
  backgroundColor: theme.palette.mode === "dark" ? "#0a0a0a" : "#ffffff",
  backdropFilter: "blur(20px)",
  borderBottom: scrolled
    ? "none"
    : `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  boxShadow: scrolled
    ? `0 4px 30px ${theme.palette.mode === "dark" ? "rgba(0,0,0,0.5)" : "rgba(255,140,0,0.15)"}`
    : "none",
  direction: "rtl",
  color: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  fontSize: "1.5rem",
  letterSpacing: "-0.5px",
  color: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
  "&:hover": {
    transform: "scale(1.02)",
    transition: "transform 0.3s ease",
  },
  flexShrink: 0,
}));

const NavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "active",
})(({ theme, active }) => ({
  color: active
    ? "#FF8C00"
    : theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.7)"
      : "rgba(0,0,0,0.6)",
  fontWeight: active ? 600 : 500,
  position: "relative",
  borderRadius: "12px",
  padding: "8px 16px",
  textTransform: "none",
  fontSize: "0.9rem",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  minWidth: "auto",
  "&::before": {
    content: '""',
    position: "absolute",
    bottom: 4,
    left: "50%",
    transform: active
      ? "translateX(-50%) scaleX(1)"
      : "translateX(-50%) scaleX(0)",
    width: "30%",
    height: 3,
    background: "linear-gradient(90deg, #FF6F00, #FF8C00, #FFA726)",
    borderRadius: 4,
    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  "&:hover": {
    color: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.08)"
        : "rgba(0,0,0,0.04)",
    transform: "translateY(-1px)",
    "&::before": {
      transform: "translateX(-50%) scaleX(1)",
    },
  },
  "& .MuiButton-startIcon": {
    marginLeft: 6,
    marginRight: 0,
  },
}));

const AdminButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "active",
})(({ theme, active }) => ({
  color: "#FF8C00",
  fontWeight: active ? 600 : 500,
  backgroundColor: active ? "rgba(255,140,0,0.15)" : "transparent",
  borderRadius: "12px",
  padding: "8px 16px",
  textTransform: "none",
  fontSize: "0.9rem",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  minWidth: "auto",
  "&:hover": {
    backgroundColor: "rgba(255,140,0,0.2)",
    transform: "translateY(-1px)",
    boxShadow: "0 4px 15px rgba(255,140,0,0.2)",
  },
  "& .MuiButton-startIcon": {
    marginLeft: 6,
    marginRight: 0,
  },
}));

const ActionIconButton = styled(IconButton)(({ theme }) => ({
  color:
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.4)",
  padding: 6,
  borderRadius: "12px",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    color: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.08)"
        : "rgba(0,0,0,0.04)",
    transform: "scale(1.05)",
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 34,
  height: 34,
  background: "linear-gradient(135deg, #FF6F00 0%, #FF8C00 50%, #FFA726 100%)",
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  border: "2px solid transparent",
  "&:hover": {
    transform: "scale(1.08)",
    borderColor: "#FF8C00",
    boxShadow: "0 4px 20px rgba(255,140,0,0.3)",
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  borderRadius: "12px",
  margin: "4px 8px",
  padding: "10px 16px",
  transition: "all 0.2s ease",
  color:
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.08)"
        : "rgba(0,0,0,0.04)",
    transform: "translateX(-4px)",
  },
  "& .MuiListItemIcon-root": {
    minWidth: 36,
    marginLeft: 8,
    marginRight: 0,
    color:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.6)"
        : "rgba(0,0,0,0.4)",
  },
}));

export default function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));
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
    const loadUserData = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setLoggedIn(true);
          setAdmin(parsedUser.role === "admin");
        } catch (error) {
          console.error("Error parsing user:", error);
        }
      }
    };

    loadUserData();

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    const handleStorageChange = (e) => {
      if (e.key === "user") {
        loadUserData();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", handleStorageChange);
    };
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
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLoggedIn(false);
    setUser(null);
    setAdmin(false);
    handleCloseUserMenu();
    navigate("/");
  };

  const toggleDarkMode = () => {
    colorMode.toggleColorMode();
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const isDark = theme.palette.mode === "dark";

  // 🔍 SEARCH: تابع جستجو
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const getUserInitial = () => {
    if (!user) return "U";
    const name = user.fullName || user.fullname || user.name || user.username || "";
    return name.charAt(0)?.toUpperCase() || "U";
  };

  const getFullName = () => {
    if (!user) return "کاربر";
    return user.fullName || user.fullname || user.name || user.username || "کاربر";
  };

  const menuItems = [
    { text: "خانه", icon: <Home />, path: "/" },
    { text: "محصولات", icon: <Category />, path: "/products" },
    { text: "دسته‌بندی‌ها", icon: <Category />, path: "/categories" },
    { text: "برند ها", icon: <BrandingWatermark />, path: "/brands" },
    { text: "فروش ویژه", icon: <Discount />, path: "/sales" },
  ];

  return (
    <StyledAppBar position="sticky" scrolled={scrolled}>
      <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
        <Toolbar
          disableGutters
          sx={{
            height: { xs: 64, sm: 68, md: 72 },
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.5, sm: 1 },
            direction: "rtl",
            justifyContent: "space-between",
          }}
        >
          {/* بخش چپ - دکمه همبرگری و لوگو */}
          <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            {isMobile && (
              <ActionIconButton
                onClick={onMenuClick}
                sx={{ ml: { xs: 0, sm: 0.5 } }}
              >
                <MenuIcon />
              </ActionIconButton>
            )}

            <LogoText
              onClick={() => handleNavigate("/")}
              sx={{
                fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
                "& .MuiSvgIcon-root": {
                  fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.8rem" },
                },
              }}
            >
              <Storefront
                sx={{
                  mr: 0.5,
                  color: "#FF8C00",
                }}
              />
              {!isSmallMobile && "فروشگاه من"}
              {isSmallMobile && "فروشگاه"}
            </LogoText>
          </Box>

          {/* بخش وسط - منوی دسکتاپ */}
          {!isMobile && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                flex: 1,
                justifyContent: "center",
                direction: "rtl",
                mx: 2,
              }}
            >
              {menuItems.map((item) => (
                <NavButton
                  key={item.text}
                  onClick={() => handleNavigate(item.path)}
                  startIcon={item.icon}
                  active={isActivePath(item.path) ? 1 : 0}
                  sx={{
                    px: { md: 1.5, lg: 2 },
                    fontSize: { md: "0.85rem", lg: "0.95rem" },
                  }}
                >
                  {item.text}
                </NavButton>
              ))}

              {/* 🔍 SEARCH: بخش جستجو - فقط دسکتاپ */}
              <Box
                component="form"
                onSubmit={handleSearch}
                sx={{
                  mx: 1,
                  minWidth: { md: 150, lg: 200 },
                  maxWidth: { md: 200, lg: 300 },
                  flex: 1,
                }}
              >
                <TextField
                  size="small"
                  placeholder="جستجو..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.03)",
                      "& fieldset": {
                        borderColor: isDark
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(0,0,0,0.1)",
                      },
                      "&:hover fieldset": {
                        borderColor: isDark
                          ? "rgba(255,255,255,0.2)"
                          : "rgba(0,0,0,0.2)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#FF8C00",
                      },
                      "& input": {
                        color: isDark ? "#ffffff" : "#000000",
                        fontSize: { md: "0.8rem", lg: "0.9rem" },
                        padding: "8px 12px",
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search
                          sx={{
                            color: isDark
                              ? "rgba(255,255,255,0.4)"
                              : "rgba(0,0,0,0.3)",
                            fontSize: 18,
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {admin && (
                <AdminButton
                  onClick={() => handleNavigate("/admin")}
                  startIcon={<AdminPanelSettings />}
                  active={isActivePath("/admin") ? 1 : 0}
                  sx={{
                    px: { md: 1.5, lg: 2 },
                    fontSize: { md: "0.85rem", lg: "0.95rem" },
                  }}
                >
                  مدیریت
                </AdminButton>
              )}
            </Box>
          )}

          {/* بخش راست - آیکون‌ها */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.5, sm: 0.5, md: 1 },
              flexShrink: 0,
            }}
          >
            {/* 🔍 SEARCH: آیکون جستجو برای موبایل */}
            {isMobile && (
              <ActionIconButton
                onClick={() => navigate("/search")}
                size="small"
              >
                <Search sx={{ fontSize: { xs: 20, sm: 22 } }} />
              </ActionIconButton>
            )}

            <ActionIconButton
              onClick={() => navigate("/wishlist")}
              size="small"
            >
              <Badge
                badgeContent={5}
                color="error"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: { xs: "0.5rem", sm: "0.6rem" },
                    minWidth: { xs: 16, sm: 18 },
                    height: { xs: 16, sm: 18 },
                    borderRadius: "50%",
                    backgroundColor: "#f44336",
                  },
                }}
              >
                <Favorite sx={{ fontSize: { xs: 20, sm: 22, md: 24 } }} />
              </Badge>
            </ActionIconButton>

            <ActionIconButton onClick={handleOpenNotifications} size="small">
              <Badge
                badgeContent={3}
                color="error"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: { xs: "0.5rem", sm: "0.6rem" },
                    minWidth: { xs: 16, sm: 18 },
                    height: { xs: 16, sm: 18 },
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #FF6F00, #FF8C00)",
                  },
                }}
              >
                <Notifications sx={{ fontSize: { xs: 20, sm: 22, md: 24 } }} />
              </Badge>
            </ActionIconButton>

            <ActionIconButton onClick={() => navigate("/cart")} size="small">
              <Badge
                badgeContent={cartCount}
                color="error"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: { xs: "0.5rem", sm: "0.6rem" },
                    minWidth: { xs: 16, sm: 18 },
                    height: { xs: 16, sm: 18 },
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #FF8C00, #FF6F00)",
                  },
                }}
              >
                <ShoppingCart sx={{ fontSize: { xs: 20, sm: 22, md: 24 } }} />
              </Badge>
            </ActionIconButton>

            <ActionIconButton
              onClick={toggleDarkMode}
              size="small"
              sx={{ display: { xs: "none", sm: "flex" } }}
            >
              {isDark ? (
                <LightMode sx={{ fontSize: { xs: 20, sm: 22, md: 24 } }} />
              ) : (
                <DarkMode sx={{ fontSize: { xs: 20, sm: 22, md: 24 } }} />
              )}
            </ActionIconButton>

            {loggedIn ? (
              <>
                <Tooltip title="حساب کاربری" arrow>
                  <StyledAvatar
                    onClick={handleOpenUserMenu}
                    sx={{
                      width: { xs: 30, sm: 34, md: 38 },
                      height: { xs: 30, sm: 34, md: 38 },
                    }}
                  >
                    {getUserInitial()}
                  </StyledAvatar>
                </Tooltip>
                <Menu
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                  transformOrigin={{ vertical: "top", horizontal: "left" }}
                  TransitionComponent={Fade}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      borderRadius: 3,
                      minWidth: { xs: 220, sm: 260 },
                      boxShadow: isDark
                        ? "0 8px 40px rgba(0,0,0,0.5)"
                        : "0 8px 40px rgba(255,140,0,0.12)",
                      overflow: "hidden",
                      direction: "rtl",
                      bgcolor: isDark ? "#0a0a0a" : "#ffffff",
                      border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(255,140,0,0.1)"}`,
                    },
                  }}
                >
                  <Box
                    sx={{
                      p: { xs: 2, sm: 2.5 },
                      background:
                        "linear-gradient(135deg, #FF6F00 0%, #FF8C00 50%, #FFA726 100%)",
                      color: "white",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                      fontSize={{ xs: "0.9rem", sm: "1rem" }}
                    >
                      {getFullName()}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.85 }}>
                      {user?.role === "admin" ? "مدیر فروشگاه" : "کاربر"}
                    </Typography>
                    {user?.role === "admin" && (
                      <Chip
                        label="ادمین"
                        size="small"
                        sx={{
                          mt: 1,
                          bgcolor: "rgba(255,255,255,0.2)",
                          color: "white",
                          fontWeight: 600,
                          borderRadius: 1,
                          height: { xs: 20, sm: 24 },
                          fontSize: { xs: "0.6rem", sm: "0.7rem" },
                        }}
                      />
                    )}
                  </Box>
                  <Divider
                    sx={{
                      borderColor: isDark
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.05)",
                    }}
                  />
                  <StyledMenuItem onClick={() => handleNavigate("/profile")}>
                    <ListItemIcon>
                      <Person fontSize="small" />
                    </ListItemIcon>
                    پروفایل
                  </StyledMenuItem>
                  <StyledMenuItem onClick={() => handleNavigate("/orders")}>
                    <ListItemIcon>
                      <Receipt fontSize="small" />
                    </ListItemIcon>
                    سفارشات من
                  </StyledMenuItem>
                  <StyledMenuItem onClick={() => handleNavigate("/wishlist")}>
                    <ListItemIcon>
                      <Favorite fontSize="small" />
                    </ListItemIcon>
                    علاقه‌مندی‌ها
                  </StyledMenuItem>
                  <StyledMenuItem onClick={() => handleNavigate("/settings")}>
                    <ListItemIcon>
                      <Settings fontSize="small" />
                    </ListItemIcon>
                    تنظیمات
                  </StyledMenuItem>
                  {admin && (
                    <StyledMenuItem onClick={() => handleNavigate("/admin")}>
                      <ListItemIcon>
                        <Dashboard fontSize="small" />
                      </ListItemIcon>
                      پنل مدیریت
                    </StyledMenuItem>
                  )}
                  <Divider
                    sx={{
                      borderColor: isDark
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.05)",
                    }}
                  />
                  <StyledMenuItem
                    onClick={handleLogout}
                    sx={{ color: "#f44336" }}
                  >
                    <ListItemIcon>
                      <Logout fontSize="small" sx={{ color: "#f44336" }} />
                    </ListItemIcon>
                    خروج
                  </StyledMenuItem>
                </Menu>
              </>
            ) : (
              <Stack direction="row" spacing={0.5} sx={{ mr: 0.5 }}>
                <Button
                  onClick={() => handleNavigate("/login")}
                  variant="outlined"
                  size="small"
                  sx={{
                    borderRadius: 3,
                    textTransform: "none",
                    borderColor: isDark ? "rgba(255,255,255,0.2)" : "#FF8C00",
                    color: isDark ? "rgba(255,255,255,0.8)" : "#FF8C00",
                    px: { xs: 1.5, sm: 2 },
                    py: 0.5,
                    fontWeight: 600,
                    fontSize: { xs: "0.7rem", sm: "0.8rem" },
                    "&:hover": {
                      borderColor: "#FF6F00",
                      bgcolor: isDark
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(255,140,0,0.08)",
                    },
                  }}
                >
                  {isSmallMobile ? "ورود" : "ورود"}
                </Button>
                <Button
                  onClick={() => handleNavigate("/register")}
                  variant="contained"
                  size="small"
                  sx={{
                    borderRadius: 3,
                    textTransform: "none",
                    background:
                      "linear-gradient(135deg, #FF6F00, #FF8C00, #FFA726)",
                    px: { xs: 1.5, sm: 2 },
                    py: 0.5,
                    fontWeight: 600,
                    fontSize: { xs: "0.7rem", sm: "0.8rem" },
                    boxShadow: "0 4px 15px rgba(255,140,0,0.3)",
                    "&:hover": {
                      boxShadow: "0 6px 25px rgba(255,140,0,0.4)",
                    },
                  }}
                >
                  {isSmallMobile ? "ثبت‌نام" : "ثبت‌نام"}
                </Button>
              </Stack>
            )}
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
}