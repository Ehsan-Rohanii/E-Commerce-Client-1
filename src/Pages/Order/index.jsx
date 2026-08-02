// Pages/Order.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  Stack,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  useTheme,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ShoppingBag,
  LocalShipping,
  CheckCircle,
  Cancel,
  Pending,
  Error,
  Receipt,
  Phone,
  LocationOn,
  Person,
  CalendarToday,
  AttachMoney,
  Discount,
  Refresh,
  Visibility,
  Print,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

// استایل‌های سفارشی
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 24,
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(145deg, rgba(20,20,20,0.95), rgba(30,30,30,0.9))'
    : 'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(255,255,255,0.9))',
  backdropFilter: 'blur(20px)',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 30px 60px -20px rgba(0,0,0,0.9)'
    : '0 30px 60px -20px rgba(0,0,0,0.15)',
}));

const OrderCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  transition: 'all 0.3s ease',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
    borderColor: '#FF8C00',
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
  const statusConfig = {
    pending: { color: '#FF9800', bg: 'rgba(255,152,0,0.1)' },
    success: { color: '#4CAF50', bg: 'rgba(76,175,80,0.1)' },
    failed: { color: '#f44336', bg: 'rgba(244,67,54,0.1)' },
    stockIssue: { color: '#FF5722', bg: 'rgba(255,87,34,0.1)' },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return {
    borderRadius: 8,
    fontWeight: 600,
    fontSize: '0.75rem',
    height: 28,
    color: config.color,
    backgroundColor: config.bg,
    borderColor: config.color,
    '& .MuiChip-icon': {
      color: config.color,
    },
  };
});

const DeliveryChip = styled(Chip)(({ theme, status }) => {
  const statusConfig = {
    processing: { color: '#2196F3', bg: 'rgba(33,150,243,0.1)' },
    pending: { color: '#FF9800', bg: 'rgba(255,152,0,0.1)' },
    shipped: { color: '#9C27B0', bg: 'rgba(156,39,176,0.1)' },
    delivered: { color: '#4CAF50', bg: 'rgba(76,175,80,0.1)' },
    cancel: { color: '#f44336', bg: 'rgba(244,67,54,0.1)' },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return {
    borderRadius: 8,
    fontWeight: 600,
    fontSize: '0.75rem',
    height: 28,
    color: config.color,
    backgroundColor: config.bg,
    borderColor: config.color,
    '& .MuiChip-icon': {
      color: config.color,
    },
  };
});

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '12px 16px',
  borderRadius: 12,
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(255,255,255,0.02)'
    : 'rgba(0,0,0,0.02)',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
}));

const ProductItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  padding: '12px 0',
  borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
  '&:last-child': {
    borderBottom: 'none',
  },
}));

export default function Order() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  // دریافت لیست سفارشات
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/orders/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
          throw new Error('نشست شما منقضی شده است');
        }
        throw new Error('خطا در دریافت سفارشات');
      }

      const result = await response.json();
      const ordersData = result.orders || result.data || result;
      setOrders(ordersData);
      
      if (ordersData.length > 0) {
        setSelectedOrder(ordersData[0]);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Pending />;
      case 'success': return <CheckCircle />;
      case 'failed': return <Error />;
      case 'stockIssue': return <Error />;
      default: return <Pending />;
    }
  };

  const getDeliveryIcon = (status) => {
    switch (status) {
      case 'processing': return <Pending />;
      case 'pending': return <Pending />;
      case 'shipped': return <LocalShipping />;
      case 'delivered': return <CheckCircle />;
      case 'cancel': return <Cancel />;
      default: return <Pending />;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'در انتظار پرداخت',
      success: 'پرداخت موفق',
      failed: 'پرداخت ناموفق',
      stockIssue: 'مشکل موجودی',
    };
    return labels[status] || status;
  };

  const getDeliveryLabel = (status) => {
    const labels = {
      processing: 'در حال پردازش',
      pending: 'در انتظار ارسال',
      shipped: 'ارسال شده',
      delivered: 'تحویل داده شده',
      cancel: 'لغو شده',
    };
    return labels[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'ثبت نشده';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return 'تاریخ نامعتبر';
    }
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return '۰';
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getFilteredOrders = () => {
    if (tabValue === 0) return orders;
    const statusMap = {
      1: 'pending',
      2: 'success',
      3: 'failed',
      4: 'stockIssue',
    };
    return orders.filter(order => order.status === statusMap[tabValue]);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#FF8C00' }} />
      </Box>
    );
  }

  const filteredOrders = getFilteredOrders();

  return (
    <Container maxWidth="xl" sx={{ py: 4, direction: 'rtl' }}>
      <StyledPaper elevation={0}>
        {/* هدر */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h4" fontWeight={800} sx={{ color: '#FF8C00' }}>
            سفارشات من
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchOrders}
            sx={{
              borderRadius: 12,
              borderColor: '#FF8C00',
              color: '#FF8C00',
              '&:hover': {
                borderColor: '#E65100',
                backgroundColor: 'rgba(255,140,0,0.08)',
              },
            }}
          >
            به‌روزرسانی
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
            {error}
          </Alert>
        )}

        {orders.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <ShoppingBag sx={{ fontSize: 80, color: 'rgba(255,140,0,0.2)', mb: 2 }} />
            <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
              شما سفارشی ندارید
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              هنوز هیچ سفارشی ثبت نکرده‌اید. برای خرید به فروشگاه بروید.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              sx={{
                borderRadius: 12,
                background: 'linear-gradient(135deg, #FF6F00, #FF8C00)',
                color: 'white',
                px: 4,
                '&:hover': {
                  background: 'linear-gradient(135deg, #E65100, #FF6F00)',
                },
              }}
            >
              رفتن به فروشگاه
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* لیست سفارشات */}
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 2 }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    mb: 2,
                    '& .MuiTab-root': {
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      textTransform: 'none',
                      minWidth: 'auto',
                      px: 2,
                      borderRadius: 2,
                      '&.Mui-selected': {
                        color: '#FF8C00',
                        backgroundColor: 'rgba(255,140,0,0.08)',
                      },
                    },
                    '& .MuiTabs-indicator': {
                      backgroundColor: '#FF8C00',
                      height: 3,
                      borderRadius: 3,
                    },
                  }}
                >
                  <Tab label="همه" />
                  <Tab label="در انتظار" />
                  <Tab label="موفق" />
                  <Tab label="ناموفق" />
                  <Tab label="مشکل موجودی" />
                </Tabs>
              </Box>

              <Box sx={{ maxHeight: '70vh', overflowY: 'auto', pr: 1 }}>
                {filteredOrders.map((order) => (
                  <OrderCard
                    key={order._id}
                    sx={{
                      mb: 2,
                      cursor: 'pointer',
                      borderColor: selectedOrder?._id === order._id ? '#FF8C00' : 'inherit',
                      borderWidth: selectedOrder?._id === order._id ? 2 : 1,
                    }}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            شماره سفارش
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            #{order._id?.slice(-8) || 'N/A'}
                          </Typography>
                        </Box>
                        <Stack spacing={0.5} alignItems="flex-end">
                          <Chip
                            size="small"
                            icon={getStatusIcon(order.status)}
                            label={getStatusLabel(order.status)}
                            sx={StatusChip({ theme, status: order.status })}
                          />
                          <Chip
                            size="small"
                            icon={getDeliveryIcon(order.orderDeliveryStatus)}
                            label={getDeliveryLabel(order.orderDeliveryStatus)}
                            sx={DeliveryChip({ theme, status: order.orderDeliveryStatus })}
                          />
                        </Stack>
                      </Box>

                      <Divider sx={{ my: 1 }} />

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          تعداد آیتم‌ها: {order.items?.length || 0}
                        </Typography>
                        <Typography variant="h6" fontWeight={700} sx={{ color: '#FF8C00' }}>
                          {formatPrice(order.finalPriceAfterDiscount || order.finalPrice)} تومان
                        </Typography>
                      </Box>

                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        {formatDate(order.createdAt)}
                      </Typography>
                    </CardContent>
                  </OrderCard>
                ))}

                {filteredOrders.length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      سفارشی با این وضعیت وجود ندارد
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>

            {/* جزئیات سفارش */}
            <Grid item xs={12} md={8}>
              {selectedOrder ? (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 16,
                    backgroundColor: theme.palette.mode === 'dark'
                      ? 'rgba(255,255,255,0.02)'
                      : 'rgba(0,0,0,0.01)',
                    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                  }}
                >
                  {/* هدر جزئیات */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                      <Typography variant="h6" fontWeight={700}>
                        جزئیات سفارش
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        شناسه: #{selectedOrder._id}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="چاپ">
                        <IconButton sx={{ color: '#FF8C00' }}>
                          <Print />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="مشاهده">
                        <IconButton sx={{ color: '#FF8C00' }}>
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  {/* وضعیت سفارش */}
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6} sm={3}>
                      <InfoItem>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            وضعیت پرداخت
                          </Typography>
                          <Chip
                            size="small"
                            icon={getStatusIcon(selectedOrder.status)}
                            label={getStatusLabel(selectedOrder.status)}
                            sx={StatusChip({ theme, status: selectedOrder.status })}
                          />
                        </Box>
                      </InfoItem>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <InfoItem>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            وضعیت ارسال
                          </Typography>
                          <Chip
                            size="small"
                            icon={getDeliveryIcon(selectedOrder.orderDeliveryStatus)}
                            label={getDeliveryLabel(selectedOrder.orderDeliveryStatus)}
                            sx={DeliveryChip({ theme, status: selectedOrder.orderDeliveryStatus })}
                          />
                        </Box>
                      </InfoItem>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <InfoItem>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            تاریخ ثبت
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {formatDate(selectedOrder.createdAt)}
                          </Typography>
                        </Box>
                      </InfoItem>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <InfoItem>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            تعداد آیتم‌ها
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {selectedOrder.items?.length || 0} عدد
                          </Typography>
                        </Box>
                      </InfoItem>
                    </Grid>
                  </Grid>

                  {/* محصولات */}
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: '#FF8C00' }}>
                    <ShoppingBag sx={{ fontSize: 20, verticalAlign: 'middle', mr: 1 }} />
                    محصولات سفارش
                  </Typography>

                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: 12,
                      backgroundColor: theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.02)'
                        : 'rgba(0,0,0,0.02)',
                      mb: 3,
                    }}
                  >
                    {selectedOrder.items?.map((item, index) => (
                      <ProductItem key={index}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" fontWeight={600}>
                            {item.productVariantId?.name || 'محصول'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            تعداد: {item.cartQuantity}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'left' }}>
                          <Typography variant="body2" fontWeight={600} sx={{ color: '#FF8C00' }}>
                            {formatPrice(item.productVariantId?.finalPrice || 0)} تومان
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatPrice(item.productVariantId?.price || 0)} تومان
                          </Typography>
                        </Box>
                      </ProductItem>
                    ))}
                  </Paper>

                  {/* قیمت‌ها */}
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <InfoItem>
                        <AttachMoney sx={{ color: '#FF8C00' }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            قیمت کل
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {formatPrice(selectedOrder.totalPrice)} تومان
                          </Typography>
                        </Box>
                      </InfoItem>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InfoItem>
                        <AttachMoney sx={{ color: '#FF8C00' }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            قیمت نهایی
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {formatPrice(selectedOrder.finalPrice)} تومان
                          </Typography>
                        </Box>
                      </InfoItem>
                    </Grid>
                    {selectedOrder.discountCodeId && (
                      <Grid item xs={12} sm={6}>
                        <InfoItem>
                          <Discount sx={{ color: '#FF8C00' }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              تخفیف
                            </Typography>
                            <Typography variant="body2" fontWeight={500} sx={{ color: '#4CAF50' }}>
                              -{formatPrice((selectedOrder.finalPrice || 0) - (selectedOrder.finalPriceAfterDiscount || 0))} تومان
                            </Typography>
                          </Box>
                        </InfoItem>
                      </Grid>
                    )}
                    <Grid item xs={12} sm={6}>
                      <InfoItem sx={{ backgroundColor: 'rgba(255,140,0,0.05)', borderColor: '#FF8C00' }}>
                        <AttachMoney sx={{ color: '#FF8C00' }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            مبلغ قابل پرداخت
                          </Typography>
                          <Typography variant="h6" fontWeight={700} sx={{ color: '#FF8C00' }}>
                            {formatPrice(selectedOrder.finalPriceAfterDiscount || selectedOrder.finalPrice)} تومان
                          </Typography>
                        </Box>
                      </InfoItem>
                    </Grid>
                  </Grid>

                  {/* آدرس */}
                  {selectedOrder.address && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: '#FF8C00' }}>
                        <LocationOn sx={{ fontSize: 20, verticalAlign: 'middle', mr: 1 }} />
                        آدرس ارسال
                      </Typography>
                      <InfoItem>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {selectedOrder.address.fullName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {selectedOrder.address.phoneNumber}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {selectedOrder.address.province}، {selectedOrder.address.city}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {selectedOrder.address.address}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            کد پستی: {selectedOrder.address.postalCode}
                          </Typography>
                        </Box>
                      </InfoItem>
                    </Box>
                  )}

                  {/* ارجاع پرداخت */}
                  {selectedOrder.refId && (
                    <Box sx={{ mt: 2 }}>
                      <InfoItem>
                        <Receipt sx={{ color: '#FF8C00' }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            کد رهگیری پرداخت
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {selectedOrder.refId}
                          </Typography>
                        </Box>
                      </InfoItem>
                    </Box>
                  )}
                </Paper>
              ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" color="text.secondary">
                    سفارشی را انتخاب کنید
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        )}
      </StyledPaper>
    </Container>
  );
}