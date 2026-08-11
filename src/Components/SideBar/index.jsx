// components/common/SideBar.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
} from "@mui/material";
import {
  Home,
  Category,
  ShoppingCart,
  Person,
  Logout,
  Login,
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
  BrandingWatermark,
  People,
  Slideshow,
  LocalFireDepartment,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { ColorModeContext } from "../../App";

// ارتفاع Navbar در سایزهای مختلف
const NAVBAR_HEIGHT = {
  xs: 64,
  sm: 68,
  md: 72,
};

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: 240,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: 240,
    backgroundColor: theme.palette.mode === "dark" ? "#0a0a0a" : "#ffffff",
    borderRight: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
    borderLeft: "none",
    boxShadow:
      theme.palette.mode === "dark"
        ? "4px 0 30px rgba(0,0,0,0.5)"
        : "4px 0 30px rgba(255,140,0,0.08)",
    paddingTop: 0,
    direction: "rtl",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "hidden",
    [theme.breakpoints.up("md")]: {
      position: "fixed",
      top: NAVBAR_HEIGHT.md,
      height: `calc(100vh - ${NAVBAR_HEIGHT.md}px)`,
      right: 0,
      left: "auto",
    },
  },
}));

const ProfileHeader = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #FF6F00 0%, #FF8C00 50%, #FFA726 100%)",
  padding: "14px 12px 16px 12px",
  color: "white",
  position: "relative",
  overflow: "hidden",
  "&::after": {
    content: '""',
    position: "absolute",
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.05)",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    bottom: -80,
    left: -80,
    width: 200,
    height: 200,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.03)",
  },
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: 8,
  right: 8,
  padding: 4,
  color: "rgba(255,255,255,0.7)",
  backgroundColor: "rgba(255,255,255,0.1)",
  backdropFilter: "blur(10px)",
  borderRadius: "50%",
  zIndex: 10,
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.2)",
    transform: "rotate(90deg)",
    transition: "transform 0.3s ease",
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  border: "2.5px solid rgba(255,255,255,0.3)",
  backgroundColor: "rgba(255,255,255,0.2)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
    borderColor: "rgba(255,255,255,0.6)",
  },
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: "8px",
  margin: "1px 8px",
  padding: "5px 10px",
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  color:
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
  "&.Mui-selected": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,140,0,0.15)"
        : "rgba(255,140,0,0.08)",
    color: "#FF8C00",
    "& .MuiListItemIcon-root": {
      color: "#FF8C00",
    },
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255,140,0,0.25)"
          : "rgba(255,140,0,0.12)",
    },
  },
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.05)"
        : "rgba(0,0,0,0.04)",
    transform: "translateX(-4px)",
    color: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
  },
  "& .MuiListItemIcon-root": {
    minWidth: 30,
    color: "inherit",
    transition: "all 0.2s ease",
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: 0,
}));

const FooterBox = styled(Box)(({ theme }) => ({
  padding: "8px 12px",
  borderTop: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
  marginTop: "auto",
}));

const ThemeToggleButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  padding: "5px 10px",
  justifyContent: "flex-start",
  color:
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
  textTransform: "none",
  width: "100%",
  fontSize: "0.75rem",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.05)"
        : "rgba(0,0,0,0.04)",
  },
  "& .MuiButton-startIcon": {
    marginLeft: 8,
    marginRight: 0,
  },
}));

export default function SideBar({ open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const colorMode = useContext(ColorModeContext);

  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [openShopSubmenu, setOpenShopSubmenu] = useState(false);

  const getUserDisplayName = (userData) => {
    if (!userData) return "مهمان";
    return (
      userData.fullName || userData.fullname || userData.phoneNumber || "کاربر"
    );
  };

  const getUserInitial = (userData) => {
    if (!userData) return "U";
    const name =
      userData.fullName || userData.fullname || userData.phoneNumber || "";
    return name.charAt(0)?.toUpperCase() || "U";
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    console.log("Raw user data from storage:", userData);

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log("Parsed user:", parsedUser);

        setUser(parsedUser);
        setLoggedIn(true);
        setAdmin(parsedUser.role === "admin");
      } catch (error) {
        console.error("Error parsing user:", error);
        setLoggedIn(false);
        setUser(null);
      }
    } else {
      setLoggedIn(false);
      setUser(null);
    }
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    setLoggedIn(false);
    setUser(null);
    setAdmin(false);
    if (isMobile) {
      onClose();
    }
    navigate("/login");
  };

  const toggleDarkMode = () => {
    colorMode.toggleColorMode();
  };

  const isActivePath = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const toggleShopSubmenu = () => {
    setOpenShopSubmenu(!openShopSubmenu);
  };

  const isDark = theme.palette.mode === "dark";

  const mainMenuItems = [
    { text: "خانه", icon: <Home />, path: "/" },
    {
      text: "محصولات",
      icon: <Category />,
      path: "/products",
      submenu: true,
      subItems: [
        { text: "همه محصولات", path: "/products" },
        { text: "جدیدترین", path: "/products/new", icon: <NewReleases /> },
        {
          text: "پرفروش‌ترین",
          path: "/products/popular",
          icon: <TrendingUp />,
        },
        { text: "حراج‌ها", path: "/sales", icon: <Discount /> },
      ],
    },
    { text: "دسته‌بندی‌ها", icon: <Category />, path: "/categories" },
    {
      text: "برند ها",
      icon: <BrandingWatermark />,
      path: "/brands",
      badge: "3",
    },
    {
      text: "کاربران",
      icon: <People />,
      path: "/Users",
      badge: "3",
    },
    {
      text: "اسلاید ها",
      icon: <Slideshow />,
      path: "/slides",
      badge: "3",
    },
    {
      text: "کد تخفیف ها",
      icon: <Discount />,
      path: "/discount",
      badge: "3",
    },
    {
      text: "فروش ویژه",
      icon: <LocalFireDepartment />,
      path: "/sales",
      badge: "🔥",
    },
  ];

  const userMenuItems = [
    { text: "پروفایل", icon: <Person />, path: "/profile" },
    { text: "سفارشات من", icon: <Receipt />, path: "/orders" },
    { text: "علاقه‌مندی‌ها", icon: <Favorite />, path: "/wishlist" },
    { text: "تنظیمات", icon: <Settings />, path: "/settings" },
  ];

  const adminMenuItems = [
    { text: "داشبورد", icon: <Dashboard />, path: "/admin" },
    { text: "مدیریت محصولات", icon: <Inventory />, path: "/admin/products" },
    { text: "مدیریت سفارشات", icon: <LocalShipping />, path: "/admin/orders" },
    { text: "مدیریت کاربران", icon: <Person />, path: "/admin/users" },
    { text: "مدیریت تخفیف‌ها", icon: <Discount />, path: "/admin/discounts" },
    { text: "گزارشات", icon: <Payment />, path: "/admin/reports" },
  ];

  const drawerContent = (
    <>
      <ProfileHeader
        sx={{
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2d2d2d 100%)",
          borderBottom: "1px solid rgba(255,140,0,0.1)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "-50%",
            right: "-50%",
            width: "100%",
            height: "100%",
            background:
              "radial-gradient(circle at 70% 30%, rgba(255,140,0,0.08), transparent 70%)",
            animation: "moveBg 10s ease-in-out infinite",
            "@keyframes moveBg": {
              "0%": { transform: "translate(0, 0)" },
              "50%": { transform: "translate(-20%, -10%)" },
              "100%": { transform: "translate(0, 0)" },
            },
          },
        }}
      >
        {isMobile && (
          <CloseButton onClick={onClose} aria-label="close drawer">
            <Close sx={{ fontSize: 16 }} />
          </CloseButton>
        )}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mt: isMobile ? 1 : 0,
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* آواتار با انیمیشن */}
          <Box sx={{ position: "relative", flexShrink: 0 }}>
            <Box
              sx={{
                position: "absolute",
                inset: -4,
                borderRadius: "50%",
                background:
                  "conic-gradient(from 0deg, #FF6F00, #FF8C00, #FFA726, #FF6F00)",
                animation: "spin 4s linear infinite",
                "@keyframes spin": {
                  "0%": { transform: "rotate(0deg) scale(1)" },
                  "100%": { transform: "rotate(360deg) scale(1)" },
                },
                opacity: 0.4,
                filter: "blur(2px)",
              }}
            />

            <Box
              sx={{
                position: "absolute",
                inset: -8,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(255,140,0,0.15), transparent 70%)",
                animation: "pulse 2.5s ease-in-out infinite",
                "@keyframes pulse": {
                  "0%": { transform: "scale(0.8)", opacity: 0.3 },
                  "50%": { transform: "scale(1.2)", opacity: 0.6 },
                  "100%": { transform: "scale(0.8)", opacity: 0.3 },
                },
              }}
            />

            <StyledAvatar
              sx={{
                width: 50,
                height: 50,
                fontSize: "1.3rem",
                fontWeight: 800,
                background:
                  "linear-gradient(135deg, #FF6F00, #FF8C00, #FFA726)",
                color: "#fff",
                boxShadow:
                  "0 4px 25px rgba(255,140,0,0.3), inset 0 2px 0 rgba(255,255,255,0.2)",
                position: "relative",
                zIndex: 1,
                border: "3px solid rgba(255,255,255,0.1)",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  transform: "scale(1.08) rotate(-5deg)",
                  boxShadow: "0 8px 40px rgba(255,140,0,0.5)",
                  borderColor: "rgba(255,140,0,0.5)",
                },
              }}
            >
              {loggedIn ? getUserInitial(user) : "U"}
            </StyledAvatar>

            {loggedIn && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: "#4CAF50",
                  border: "3px solid #1a1a1a",
                  zIndex: 2,
                  boxShadow: "0 0 10px rgba(76,175,80,0.5)",
                  animation: "blink 1.5s ease-in-out infinite",
                  "@keyframes blink": {
                    "0%": { opacity: 1 },
                    "50%": { opacity: 0.4 },
                    "100%": { opacity: 1 },
                  },
                }}
              />
            )}
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            {loggedIn ? (
              <>
                <Typography
                  variant="body1"
                  fontWeight={700}
                  sx={{
                    textAlign: "right",
                    color: "#ffffff",
                    textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                    letterSpacing: "0.5px",
                    mb: 0.2,
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                  }}
                >
                  {getUserDisplayName(user)}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: 0.5,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "rgba(255,255,255,0.6)",
                      textAlign: "right",
                      fontSize: "0.6rem",
                      width: "100%",
                    }}
                  >
                    {user?.phoneNumber ||
                      user?.email ||
                      "شماره موبایل ثبت نشده"}
                  </Typography>
                </Box>

                <Stack
                  direction="row"
                  spacing={0.3}
                  justifyContent="flex-end"
                  sx={{ mt: 0.3 }}
                >
                  {admin && (
                    <Chip
                      label="👑 مدیر"
                      size="small"
                      sx={{
                        bgcolor: "rgba(255,140,0,0.25)",
                        color: "#FF8C00",
                        fontWeight: 700,
                        borderRadius: 1,
                        fontSize: "0.5rem",
                        height: 16,
                        border: "1px solid rgba(255,140,0,0.2)",
                        backdropFilter: "blur(10px)",
                      }}
                    />
                  )}
                  <Chip
                    label={user?.isActive ? "🟢 فعال" : "🔴 غیرفعال"}
                    size="small"
                    sx={{
                      textAlign: "end",
                      bgcolor: user?.isActive
                        ? "rgba(76,175,80,0.15)"
                        : "rgba(244,67,54,0.15)",
                      color: user?.isActive ? "#4CAF50" : "#f44336",
                      fontWeight: 600,
                      borderRadius: 1,
                      fontSize: "0.5rem",
                      height: 16,
                    }}
                  />
                </Stack>
              </>
            ) : (
              <>
                <Typography
                  variant="body1"
                  fontWeight={700}
                  sx={{
                    textAlign: "right",
                    color: "#ffffff",
                    textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                  }}
                >
                  👋 مهمان عزیز
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(255,255,255,0.5)",
                    textAlign: "right",
                    mt: 0.2,
                    fontSize: "0.6rem",
                  }}
                >
                  برای استفاده از امکانات وارد شوید
                </Typography>
              </>
            )}
          </Box>
        </Box>

        {!loggedIn && (
          <Stack
            direction="row"
            spacing={0.8}
            sx={{
              mt: 1.5,
              position: "relative",
              zIndex: 1,
            }}
          >
            <Button
              onClick={() => handleNavigate("/login")}
              variant="outlined"
              fullWidth
              sx={{
                gap: 0.3,
                py: 0.8,
                borderColor: "rgba(255,255,255,0.2)",
                color: "#fff",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 1.5,
                fontSize: "0.7rem",
                "&:hover": {
                  borderColor: "#FF8C00",
                  backgroundColor: "rgba(255,140,0,0.1)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
              endIcon={<Login />}
            >
              ورود
            </Button>
            <Button
              onClick={() => navigate("/register")}
              variant="contained"
              fullWidth
              sx={{
                py: 0.8,
                background: "linear-gradient(135deg, #FF6F00, #FF8C00)",
                color: "#fff",
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 1.5,
                fontSize: "0.7rem",
                boxShadow: "0 4px 20px rgba(255,140,0,0.3)",
                "&:hover": {
                  background: "linear-gradient(135deg, #e65100, #e67e00)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 30px rgba(255,140,0,0.4)",
                },
                transition: "all 0.3s ease",
              }}
            >
              ثبت‌نام
            </Button>
          </Stack>
        )}
      </ProfileHeader>

      {/* بخش اسکرول‌دار با اسکرولبار سفارشی */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          py: 0.5,
          // استایل اسکرولبار
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: isDark
              ? "rgba(255,140,0,0.3)"
              : "rgba(255,140,0,0.2)",
            borderRadius: "10px",
            transition: "all 0.3s ease",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: isDark
              ? "rgba(255,140,0,0.5)"
              : "rgba(255,140,0,0.4)",
          },
          scrollbarWidth: "thin",
          scrollbarColor: isDark
            ? "rgba(255,140,0,0.3) transparent"
            : "rgba(255,140,0,0.2) transparent",
        }}
      >
        <List sx={{ width: "100%", px: 0.5 }}>
          {mainMenuItems.map((item) => (
            <React.Fragment key={item.text}>
              {item.submenu ? (
                <>
                  <StyledListItem disablePadding>
                    <StyledListItemButton
                      selected={isActivePath(item.path)}
                      onClick={toggleShopSubmenu}
                      sx={{
                        borderRadius: "6px",
                        margin: "1px 6px",
                      }}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        sx={{
                          "& .MuiTypography-root": {
                            textAlign: "right",
                            fontSize: "0.8rem",
                            fontWeight: isActivePath(item.path) ? 600 : 500,
                          },
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
                              paddingLeft: 3.5,
                              margin: "1px 6px",
                              borderRadius: "6px",
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 26 }}>
                              {subItem.icon || <Category />}
                            </ListItemIcon>
                            <ListItemText
                              primary={subItem.text}
                              sx={{
                                "& .MuiTypography-root": {
                                  textAlign: "right",
                                  fontSize: "0.75rem",
                                  fontWeight: isActivePath(subItem.path)
                                    ? 600
                                    : 400,
                                },
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
                      {item.badge && !item.badge.includes("🔥") ? (
                        <Badge
                          badgeContent={item.badge}
                          color="error"
                          sx={{
                            "& .MuiBadge-badge": {
                              fontSize: "0.5rem",
                              minWidth: 16,
                              height: 16,
                              borderRadius: "50%",
                              background:
                                "linear-gradient(135deg, #FF6F00, #FF8C00)",
                            },
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
                        "& .MuiTypography-root": {
                          textAlign: "right",
                          fontSize: "0.8rem",
                          fontWeight: isActivePath(item.path) ? 600 : 500,
                        },
                      }}
                    />
                    {item.badge === "🔥" && (
                      <Typography sx={{ fontSize: "0.8rem" }}>🔥</Typography>
                    )}
                  </StyledListItemButton>
                </StyledListItem>
              )}
            </React.Fragment>
          ))}
        </List>

        <Divider
          sx={{
            mx: 1.5,
            my: 0.3,
            borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
          }}
        />

        {loggedIn && (
          <List sx={{ width: "100%", px: 0.5 }}>
            <Typography
              variant="caption"
              sx={{
                px: 2,
                py: 0.3,
                display: "block",
                opacity: 0.6,
                fontWeight: 600,
                textAlign: "right",
                fontSize: "0.6rem",
              }}
            >
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
                      "& .MuiTypography-root": {
                        textAlign: "right",
                        fontSize: "0.75rem",
                        fontWeight: isActivePath(item.path) ? 600 : 400,
                      },
                    }}
                  />
                </StyledListItemButton>
              </StyledListItem>
            ))}
          </List>
        )}

        {admin && (
          <>
            <Divider
              sx={{
                mx: 1.5,
                my: 0.3,
                borderColor: isDark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.05)",
              }}
            />
            <List sx={{ width: "100%", px: 0.5 }}>
              <Typography
                variant="caption"
                sx={{
                  px: 2,
                  py: 0.3,
                  display: "block",
                  opacity: 0.6,
                  fontWeight: 600,
                  textAlign: "right",
                  fontSize: "0.6rem",
                }}
              >
                <AdminPanelSettings
                  sx={{ fontSize: 11, mr: 0.5, verticalAlign: "middle" }}
                />
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
                        "& .MuiTypography-root": {
                          textAlign: "right",
                          fontSize: "0.75rem",
                          fontWeight: isActivePath(item.path) ? 600 : 400,
                        },
                      }}
                    />
                  </StyledListItemButton>
                </StyledListItem>
              ))}
            </List>
          </>
        )}

        <Box sx={{ px: 1.5, py: 0.3 }}>
          <Divider
            sx={{
              mb: 0.3,
              borderColor: isDark
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.05)",
            }}
          />
          <Stack
            direction="row"
            spacing={0.3}
            sx={{ flexWrap: "wrap", gap: 0.2, justifyContent: "flex-start" }}
          >
            <Button
              size="small"
              startIcon={<Help />}
              onClick={() => handleNavigate("/help")}
              sx={{
                borderRadius: 1.5,
                textTransform: "none",
                fontSize: "0.65rem",
                color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)",
                "&:hover": {
                  bgcolor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.04)",
                },
              }}
            >
              راهنما
            </Button>
            <Button
              size="small"
              startIcon={<ContactSupport />}
              onClick={() => handleNavigate("/contact")}
              sx={{
                borderRadius: 1.5,
                textTransform: "none",
                fontSize: "0.65rem",
                color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)",
                "&:hover": {
                  bgcolor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.04)",
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
          {isDark ? "حالت روشن" : "حالت تاریک"}
        </ThemeToggleButton>

        {loggedIn && (
          <Button
            onClick={handleLogout}
            startIcon={<Logout />}
            sx={{
              borderRadius: "6px",
              padding: "5px 10px",
              justifyContent: "flex-start",
              color: "#f44336",
              textTransform: "none",
              width: "100%",
              mt: 0.3,
              gap: 0.3,
              fontSize: "0.75rem",
              "&:hover": {
                backgroundColor: "rgba(244, 67, 54, 0.08)",
              },
            }}
          >
            خروج از حساب
          </Button>
        )}

        <Box
          sx={{
            mt: 1,
            textAlign: "center",
            typography: "caption",
            fontSize: "0.6rem",
            color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
          }}
        >
          <Storefront
            sx={{ fontSize: 12, verticalAlign: "middle", color: "#FF8C00" }}
          />
          فروشگاه من v1.0
        </Box>
      </FooterBox>
    </>
  );

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
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: 280,
            backgroundColor: isDark ? "#0a0a0a" : "#ffffff",
            direction: "rtl",
            boxShadow: isDark
              ? "-4px 0 30px rgba(0,0,0,0.5)"
              : "-4px 0 30px rgba(255,140,0,0.12)",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  // حالت دسکتاپ - سایدبار در سمت راست ثابت است
  return (
    <StyledDrawer
      variant="permanent"
      open={true}
      sx={{
        display: { xs: "none", md: "block" },
        width: 240,
        flexShrink: 0,
      }}
    >
      {drawerContent}
    </StyledDrawer>
  );
}