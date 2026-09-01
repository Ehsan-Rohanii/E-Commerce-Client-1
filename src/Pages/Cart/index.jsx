// src/Pages/Cart/index.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  Button,
  IconButton,
  Divider,
  Skeleton,
  Alert,
  Snackbar,
  useTheme,
  Paper,
  Stack,
  Chip,
  Fade,
  Slide,
} from "@mui/material";
import {
  Delete,
  Add,
  Remove,
  ShoppingCart,
  ArrowBack,
  LocalShipping,
  Security,
  CheckCircle,
  Clear,
  Payment,
  Storefront,
  TrendingUp,
  Inventory,
} from "@mui/icons-material";
import { styled, keyframes } from "@mui/material/styles";

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled Components
const CartCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  overflow: "hidden",
  background:
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "#ffffff",
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.06)"
      : "rgba(255,140,0,0.06)"
  }`,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  animation: `${fadeInUp} 0.4s ease`,
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 8px 30px rgba(0,0,0,0.3)"
        : "0 8px 30px rgba(255,140,0,0.07)",
  },
}));

const CartItemImage = styled(CardMedia)({
  width: 80,
  height: 80,
  objectFit: "contain",
  padding: 6,
  borderRadius: 10,
  backgroundColor: "#faf5f0",
});

const QuantityButton = styled(IconButton)(({ theme }) => ({
  border: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
  borderRadius: 8,
  padding: 4,
  width: 28,
  height: 28,
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.08)"
        : "rgba(0,0,0,0.04)",
    transform: "scale(1.05)",
  },
  "&:disabled": {
    opacity: 0.3,
  },
}));

const CheckoutButton = styled(Button)({
  borderRadius: 12,
  padding: "12px 20px",
  fontWeight: 700,
  textTransform: "none",
  fontSize: "0.9rem",
  background: "linear-gradient(135deg, #FF6F00, #FF8C00)",
  color: "#fff",
  boxShadow: "0 6px 24px rgba(255,140,0,0.3)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    background: "linear-gradient(135deg, #E65100, #F57C00)",
    boxShadow: "0 8px 32px rgba(255,140,0,0.4)",
    transform: "translateY(-2px)",
  },
  "&:disabled": {
    background: "#555",
    boxShadow: "none",
    transform: "none",
  },
});

const SummaryItem = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: "6px 0",
  borderBottom: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.05)"
      : "rgba(0,0,0,0.05)"
  }`,
}));

const EmptyCartBox = styled(Box)(({ theme }) => ({
  textAlign: "center",
  padding: "50px 20px",
  background:
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "#fafaf8",
  borderRadius: 20,
  border: `2px dashed ${
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.06)"
      : "rgba(255,140,0,0.12)"
  }`,
  animation: `${fadeInUp} 0.4s ease`,
}));

const PriceTag = styled(Typography)(({ theme }) => ({
  color: "#E65100",
  fontWeight: 700,
  fontSize: "0.9rem",
  background:
    theme.palette.mode === "dark"
      ? "rgba(255,140,0,0.12)"
      : "rgba(255,140,0,0.06)",
  padding: "2px 8px",
  borderRadius: 6,
}));

const Cart = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await fetch("http://localhost:5000/api/carts", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (!res.ok) {
        throw new Error("خطا در دریافت سبد خرید");
      }

      const data = await res.json();
      console.log("🛒 Cart data:", data);
      setCart(data.data || data);
    } catch (err) {
      setError(err.message);
      setSnackbar({
        open: true,
        message: err.message || "مشکلی در دریافت سبد خرید پیش آمده",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      if (newQuantity < 1) {
        await handleRemoveItem(itemId);
        return;
      }

      setUpdating(true);

      const res = await fetch("http://localhost:5000/api/carts/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          productVariantId: itemId,
          quantity: 1,
        }),
      });

      if (!res.ok) {
        throw new Error("خطا در بروزرسانی تعداد");
      }

      await fetchCart();

      setSnackbar({
        open: true,
        message: "تعداد بروزرسانی شد",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "خطا در بروزرسانی تعداد",
        severity: "error",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      setUpdating(true);

      const res = await fetch("http://localhost:5000/api/carts/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          productVariantId: itemId,
        }),
      });

      if (!res.ok) {
        throw new Error("خطا در حذف محصول");
      }

      await fetchCart();

      setSnackbar({
        open: true,
        message: "محصول حذف شد",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "خطا در حذف محصول",
        severity: "error",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleClearCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      setUpdating(true);

      const res = await fetch("http://localhost:5000/api/carts/clear", {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (!res.ok) {
        throw new Error("خطا در خالی کردن سبد خرید");
      }

      setCart({ items: [], totalPrice: 0, totalItems: 0 });

      setSnackbar({
        open: true,
        message: "سبد خرید خالی شد",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "خطا در خالی کردن سبد خرید",
        severity: "error",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Loading
  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 3, direction: "rtl" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Skeleton variant="text" width={140} height={32} />
          <Skeleton variant="circular" width={32} height={32} />
        </Box>
        <Stack spacing={2}>
          {[1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              variant="rounded"
              height={100}
              sx={{ borderRadius: 3 }}
            />
          ))}
        </Stack>
        <Skeleton
          variant="rounded"
          height={220}
          sx={{ mt: 2, borderRadius: 3 }}
        />
      </Container>
    );
  }

  if (error && !cart) {
    return (
      <Container maxWidth="sm" sx={{ py: 6, textAlign: "center" }}>
        <Alert
          severity="error"
          sx={{ borderRadius: 3, mb: 2, fontSize: "0.9rem" }}
        >
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          sx={{ bgcolor: "#FF8C00", borderRadius: 3, fontSize: "0.9rem" }}
        >
          بازگشت به فروشگاه
        </Button>
      </Container>
    );
  }

  const cartItems = cart?.items || [];
  const totalPrice = cart?.totalPrice || 0;
  const totalItems = cart?.totalItems || 0;
  const isEmpty = cartItems.length === 0;

  return (
    <Container maxWidth="sm" sx={{ py: 3, direction: "rtl" }}>
      {/* Header - ArrowBack سمت راست */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
            سبد خرید
          </Typography>
          {!isEmpty && (
            <Chip
              label={`${cartItems.length} محصول`}
              size="small"
              sx={{
                bgcolor: "#FF8C00",
                color: "#fff",
                fontWeight: 600,
                borderRadius: 2,
                fontSize: "0.6rem",
                height: 22,
              }}
            />
          )}
        </Box>
        <IconButton
          onClick={() => navigate("/")}
          sx={{
            bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
            borderRadius: 2,
            p: 0.8,
            "&:hover": {
              bgcolor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
            },
          }}
        >
          <ArrowBack sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      {isEmpty ? (
        <EmptyCartBox>
          <Box sx={{ fontSize: 60, mb: 2 }}>🛒</Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, mb: 0.5, fontSize: "1.1rem" }}
          >
            سبد خرید شما خالی است
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3, fontSize: "0.8rem" }}
          >
            محصولات مورد نظر خود را به سبد خرید اضافه کنید
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{
              bgcolor: "#FF8C00",
              borderRadius: 3,
              px: 4,
              py: 1,
              fontSize: "0.85rem",
              fontWeight: 700,
              "&:hover": { bgcolor: "#E65100" },
            }}
          >
            شروع خرید
          </Button>
        </EmptyCartBox>
      ) : (
        <>
          {/* دکمه خالی کردن سبد */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1.5 }}>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={handleClearCart}
              startIcon={<Clear sx={{ fontSize: 16 }} />}
              disabled={updating}
              sx={{
                borderRadius: 2,
                px: 2,
                py: 0.5,
                fontSize: "0.7rem",
                fontWeight: 600,
              }}
            >
              خالی کردن سبد
            </Button>
          </Box>

          <Stack spacing={1.5}>
            {cartItems.map((item, index) => {
              const product = item.productId || {};
              const variant = item.variantId || {};
              const imageUrl = product.images?.[0]
                ? `http://localhost:5000/${product.images[0]}`
                : "https://via.placeholder.com/80x80?text=No+Image";

              return (
                <Slide
                  direction="up"
                  in={true}
                  mountOnEnter
                  unmountOnExit
                  key={item._id || index}
                >
                  <CartCard>
                    <Box
                      sx={{
                        display: "flex",
                        p: 1.5,
                        gap: 1.5,
                        alignItems: "center",
                        flexWrap: { xs: "wrap", sm: "nowrap" },
                      }}
                    >
                      <CartItemImage image={imageUrl} title={product.title} />

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.8rem",
                            mb: 0.2,
                          }}
                        >
                          {product.title?.length > 25
                            ? product.title.slice(0, 25) + "..."
                            : product.title || "بدون عنوان"}
                        </Typography>
                        {variant.title && (
                          <Chip
                            label={variant.title}
                            size="small"
                            sx={{
                              borderRadius: 1,
                              bgcolor: isDark
                                ? "rgba(255,255,255,0.05)"
                                : "#f5f5f5",
                              height: 18,
                              fontSize: "0.55rem",
                            }}
                          />
                        )}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mt: 0.5,
                            flexWrap: "wrap",
                          }}
                        >
                          <PriceTag
                            variant="caption"
                            sx={{ fontSize: "0.8rem" }}
                          >
                            {item.price?.toLocaleString("fa-IR")} تومان
                          </PriceTag>
                          {item.originalPrice > item.price && (
                            <Typography
                              variant="caption"
                              sx={{
                                textDecoration: "line-through",
                                color: "#999",
                                fontSize: "0.6rem",
                              }}
                            >
                              {item.originalPrice?.toLocaleString("fa-IR")}
                            </Typography>
                          )}
                          {item.discountPercent > 0 && (
                            <Chip
                              label={`${item.discountPercent}%`}
                              size="small"
                              sx={{
                                bgcolor: "#FF6F00",
                                color: "#fff",
                                fontWeight: 700,
                                height: 16,
                                fontSize: "0.5rem",
                              }}
                            />
                          )}
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          flexShrink: 0,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            bgcolor: isDark
                              ? "rgba(255,255,255,0.03)"
                              : "#f5f5f5",
                            borderRadius: 2,
                            p: 0.5,
                          }}
                        >
                          <QuantityButton
                            size="small"
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1 || updating}
                          >
                            <Remove sx={{ fontSize: 14 }} />
                          </QuantityButton>
                          <Typography
                            variant="body2"
                            sx={{
                              minWidth: 24,
                              textAlign: "center",
                              fontWeight: 700,
                              fontSize: "0.8rem",
                            }}
                          >
                            {item.quantity}
                          </Typography>
                          <QuantityButton
                            size="small"
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity + 1)
                            }
                            disabled={updating}
                          >
                            <Add sx={{ fontSize: 14 }} />
                          </QuantityButton>
                        </Box>
                        <IconButton
                          onClick={() => handleRemoveItem(item._id)}
                          disabled={updating}
                          sx={{
                            color: "#f44336",
                            p: 0.5,
                            "&:hover": { bgcolor: "rgba(244,67,54,0.08)" },
                          }}
                        >
                          <Delete sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    </Box>
                  </CartCard>
                </Slide>
              );
            })}
          </Stack>

          {/* Summary */}
          <Paper
            sx={{
              p: 2,
              mt: 2,
              borderRadius: 3,
              bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#ffffff",
              border: `1px solid ${
                isDark ? "rgba(255,255,255,0.06)" : "rgba(255,140,0,0.08)"
              }`,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 1.5, fontSize: "0.9rem" }}
            >
              خلاصه سبد خرید
            </Typography>

            <SummaryItem>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "0.8rem" }}
              >
                تعداد محصولات
              </Typography>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ fontSize: "0.8rem" }}
              >
                {totalItems} عدد
              </Typography>
            </SummaryItem>

            <SummaryItem>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "0.8rem" }}
              >
                قیمت کل
              </Typography>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ fontSize: "0.8rem" }}
              >
                {totalPrice.toLocaleString("fa-IR")} تومان
              </Typography>
            </SummaryItem>

            <SummaryItem sx={{ borderBottom: "none" }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "0.8rem" }}
              >
                هزینه ارسال
              </Typography>
              <Typography
                variant="body2"
                color="#4CAF50"
                fontWeight={700}
                sx={{ fontSize: "0.8rem" }}
              >
                رایگان
              </Typography>
            </SummaryItem>

            <Divider sx={{ my: 1 }} />

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, fontSize: "0.85rem" }}
              >
                مبلغ قابل پرداخت
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ color: "#E65100", fontWeight: 900, fontSize: "0.85rem" }}
              >
                {totalPrice.toLocaleString("fa-IR")}
                <Typography
                  component="span"
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: "0.6rem" }}
                >
                  تومان
                </Typography>
              </Typography>
            </Box>

            <CheckoutButton
              variant="contained"
              fullWidth
              onClick={handleCheckout}
              disabled={isEmpty || updating}
              endIcon={<Payment sx={{ fontSize: 18 }} />}
              sx={{ gap: 1 }}
            >
              ادامه فرآیند خرید
            </CheckoutButton>

            {/* ضمانت بازگشت وجه */}
            <Box sx={{ mt: 1.5, display: "flex", justifyContent: "flex-end" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  bgcolor: isDark
                    ? "rgba(76,175,80,0.08)"
                    : "rgba(76,175,80,0.06)",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  border: `1px solid ${isDark ? "rgba(76,175,80,0.15)" : "rgba(76,175,80,0.1)"}`,
                }}
              >
                <CheckCircle sx={{ color: "#4CAF50", fontSize: 14 }} />
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="#4CAF50"
                  sx={{ fontSize: "0.6rem" }}
                >
                  ضمانت بازگشت وجه
                </Typography>
              </Box>
            </Box>
          </Paper>
        </>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={Fade}
        sx={{ mt: 8 }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            borderRadius: 3,
            fontWeight: 600,
            fontSize: "0.8rem",
            boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Cart;
