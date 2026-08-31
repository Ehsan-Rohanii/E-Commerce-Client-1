// src/Pages/Products/ProductDetail/index.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  Button,
  Rating,
  Chip,
  Divider,
  Skeleton,
  Alert,
  Snackbar,
  useTheme,
  IconButton,
  Breadcrumbs,
  Link,
  Paper,
  Stack,
  Tabs,
  Tab,
} from '@mui/material';
import {
  ArrowBack,
  Favorite,
  FavoriteBorder,
  ShoppingCart,
  LocalShipping,
  Security,
  CheckCircle,
  Share,
  TrendingUp,
  Inventory,
  Description,
  Widgets,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const GlassCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  overflow: 'hidden',
  background: theme.palette.mode === 'dark'
    ? 'rgba(255,255,255,0.05)'
    : '#ffffff',
  border: `1px solid ${
    theme.palette.mode === 'dark'
      ? 'rgba(255,255,255,0.08)'
      : 'rgba(255,140,0,0.08)'
  }`,
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 350,
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #1a1a1a, #2a2a2a)'
    : 'linear-gradient(135deg, #faf5f0, #fff8f0)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 30,
}));

const StyledImage = styled('img')({
  maxWidth: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
});

const PriceBox = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '10px 20px',
  background: theme.palette.mode === 'dark'
    ? 'rgba(255,140,0,0.12)'
    : 'rgba(255,140,0,0.06)',
  borderRadius: 12,
  border: `1px solid ${
    theme.palette.mode === 'dark'
      ? 'rgba(255,140,0,0.2)'
      : 'rgba(255,140,0,0.1)'
  }`,
}));

const ActionButton = styled(Button)({
  borderRadius: 30,
  padding: '10px 24px',
  fontWeight: 700,
  textTransform: 'none',
  fontSize: '0.9rem',
  background: 'linear-gradient(135deg, #FF6F00, #FF8C00)',
  color: '#fff',
  boxShadow: '0 4px 20px rgba(255,140,0,0.3)',
  '&:hover': {
    background: 'linear-gradient(135deg, #E65100, #F57C00)',
  },
  '&:disabled': {
    background: '#555',
  },
});

const InfoChip = styled(Chip)(({ theme }) => ({
  borderRadius: 8,
  fontWeight: 600,
  fontSize: '0.7rem',
  background: theme.palette.mode === 'dark'
    ? 'rgba(255,255,255,0.05)'
    : '#f5f5f5',
}));

const FeatureBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '8px 12px',
  borderRadius: 10,
  background: theme.palette.mode === 'dark'
    ? 'rgba(255,255,255,0.03)'
    : '#fafafa',
  border: `1px solid ${
    theme.palette.mode === 'dark'
      ? 'rgba(255,255,255,0.05)'
      : 'rgba(0,0,0,0.04)'
  }`,
}));

const Badge = styled(Box)({
  position: 'absolute',
  top: 16,
  right: 16,
  padding: '4px 12px',
  borderRadius: 30,
  background: 'linear-gradient(135deg, #FF6F00, #FF8C00)',
  color: '#fff',
  fontWeight: 700,
  fontSize: '0.75rem',
  boxShadow: '0 4px 16px rgba(255,140,0,0.3)',
});

const SpecItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '8px 12px',
  borderRadius: 8,
  background: theme.palette.mode === 'dark'
    ? 'rgba(255,255,255,0.02)'
    : '#fafafa',
  border: `1px solid ${
    theme.palette.mode === 'dark'
      ? 'rgba(255,255,255,0.04)'
      : 'rgba(0,0,0,0.04)'
  }`,
}));

const ProductDetail = () => {
  const { id } = useParams();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!id) throw new Error('شناسه محصول وجود ندارد');

        const res = await fetch(`http://localhost:5000/product-variant/${id}`);

        if (!res.ok) {
          if (res.status === 404) {
            const allRes = await fetch('http://localhost:5000/api/products');
            if (allRes.ok) {
              const allData = await allRes.json();
              const found = allData.data?.find(p => p._id === id);
              if (found) {
                setProduct(found);
                setIsFavorite(found.isFavorite || false);
                setLoading(false);
                return;
              }
            }
          }
          throw new Error('محصول یافت نشد');
        }

        const data = await res.json();
        const productData = data.data || data;
        if (productData && productData._id) {
          setProduct(productData);
          setIsFavorite(productData.isFavorite || false);
        } else {
          throw new Error('محصول یافت نشد');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFavoriteToggle = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const res = await fetch('http://localhost:5000/api/products/toggle-favorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({ productId: id }),
      });

      if (!res.ok) throw new Error('خطا در تغییر وضعیت علاقه‌مندی');

      setIsFavorite(!isFavorite);
      setSnackbar({
        open: true,
        message: isFavorite ? 'از علاقه‌مندی‌ها حذف شد' : 'به علاقه‌مندی‌ها اضافه شد',
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'خطا در تغییر وضعیت علاقه‌مندی',
        severity: 'error',
      });
    }
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setSnackbar({
          open: true,
          message: 'لطفاً ابتدا وارد حساب خود شوید',
          severity: 'warning',
        });
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      if (!product) {
        setSnackbar({
          open: true,
          message: 'محصول یافت نشد',
          severity: 'error',
        });
        return;
      }

      const productVariantId = product.defaultProductVariantId?._id || product._id || product.id;

      if (!productVariantId) {
        setSnackbar({
          open: true,
          message: 'شناسه محصول یافت نشد',
          severity: 'error',
        });
        return;
      }

      const response = await fetch('http://localhost:5000/api/carts/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          productVariantId: productVariantId,
          quantity: 1,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'خطا در افزودن به سبد خرید');
      }

      setSnackbar({
        open: true,
        message: '✅ محصول با موفقیت به سبد خرید اضافه شد',
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'خطا در افزودن به سبد خرید',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Loading
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Skeleton variant="text" width={200} height={30} sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rounded" height={350} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" height={40} width="80%" />
            <Skeleton variant="text" height={25} width="50%" sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2, mb: 2 }} />
            <Skeleton variant="rectangular" height={45} sx={{ borderRadius: 2, mb: 2 }} />
            <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Alert severity="error" sx={{ borderRadius: 2, mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/products')} sx={{ bgcolor: '#FF8C00' }}>
          بازگشت به محصولات
        </Button>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Alert severity="warning" sx={{ borderRadius: 2, mb: 2 }}>
          محصولی با این شناسه یافت نشد
        </Alert>
        <Button variant="contained" onClick={() => navigate('/products')} sx={{ bgcolor: '#FF8C00' }}>
          بازگشت به محصولات
        </Button>
      </Container>
    );
  }

  const defaultVariant = product.defaultProductVariantId || {};
  const productPrice = defaultVariant.finalPrice || defaultVariant.price || 0;
  const productOriginalPrice = defaultVariant.price || 0;
  const productDiscount = defaultVariant.discountPercent || 0;
  const productInStock = (defaultVariant.quantity || 0) > 0;
  const productRating = product.ratingAvg || 0;
  const imageUrl = product.images?.[0]
    ? `http://localhost:5000/${product.images[0]}`
    : 'https://via.placeholder.com/400x400?text=No+Image';

  return (
    <Container maxWidth="md" sx={{ py: 4, direction: 'rtl' }}>

      {/* Navigation */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton size="small" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
          <Share fontSize="small" />
        </IconButton>
          <Breadcrumbs size="small">
            <Link color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer', fontSize: '0.85rem' }}>
              خانه
            </Link>
            <Link color="inherit" onClick={() => navigate('/products')} sx={{ cursor: 'pointer', fontSize: '0.85rem' }}>
              محصولات
            </Link>
            <Typography color="text.primary" sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
              {product.title.length > 20 ? product.title.slice(0, 20) + '...' : product.title}
            </Typography>
          </Breadcrumbs>
        </Box>
        <IconButton onClick={() => navigate('/')} size="small">
            <ArrowBack fontSize="small" />
          </IconButton>
        
      </Box>

      <Grid container spacing={3}>
        {/* Image */}
        <Grid item xs={12} md={6}>
          <GlassCard>
            <ImageContainer>
              {productDiscount > 0 && <Badge>🔥 {productDiscount}%</Badge>}
              <StyledImage src={imageUrl} alt={product.title} />
            </ImageContainer>
          </GlassCard>
        </Grid>

        {/* Details */}
        <Grid item xs={12} md={6}>
          <Box>
            {/* Status */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
              <InfoChip
                icon={<CheckCircle sx={{ fontSize: 14 }} />}
                label={product.brandId?.title || 'برند'}
                size="small"
              />
              <InfoChip
                icon={productInStock ? <CheckCircle sx={{ fontSize: 14 }} /> : <Inventory sx={{ fontSize: 14 }} />}
                label={productInStock ? 'موجود' : 'ناموجود'}
                size="small"
                sx={{
                  bgcolor: productInStock ? 'rgba(76,175,80,0.1)' : 'rgba(244,67,54,0.1)',
                  color: productInStock ? '#4CAF50' : '#f44336',
                }}
              />
              {product.boughtCount > 0 && (
                <InfoChip
                  icon={<TrendingUp sx={{ fontSize: 14 }} />}
                  label={`${product.boughtCount} خرید`}
                  size="small"
                />
              )}
            </Box>

            {/* Title */}
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              {product.title}
            </Typography>

            {/* Rating */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Rating value={productRating} precision={0.1} readOnly size="small" sx={{ direction: 'ltr' }} />
              <Typography variant="body2" sx={{ color: '#FF8C00', fontWeight: 600 }}>
                {productRating.toFixed(1)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ({product.ratingCount || 0})
              </Typography>
            </Box>

            {/* Price */}
            <Box sx={{ mb: 2 }}>
              <PriceBox>
                {productInStock && productPrice > 0 ? (
                  <>
                    <Typography variant="h4" sx={{ color: '#E65100', fontWeight: 800 }}>
                      {productPrice.toLocaleString('fa-IR')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      تومان
                    </Typography>
                    {productOriginalPrice > 0 && productOriginalPrice !== productPrice && (
                      <Typography
                        sx={{
                          textDecoration: 'line-through',
                          color: '#999',
                          fontSize: '0.85rem',
                        }}
                      >
                        {productOriginalPrice.toLocaleString('fa-IR')}
                      </Typography>
                    )}
                    {productDiscount > 0 && (
                      <Chip
                        label={`${productDiscount}%`}
                        size="small"
                        sx={{ bgcolor: '#FF6F00', color: '#fff', fontWeight: 700, height: 24 }}
                      />
                    )}
                  </>
                ) : (
                  <Typography sx={{ color: '#999', fontStyle: 'italic', fontSize: '0.9rem' }}>
                    قیمت موجود نیست
                  </Typography>
                )}
              </PriceBox>
            </Box>

            {/* Actions */}
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <ActionButton
                variant="contained"
                onClick={handleAddToCart}
                disabled={!productInStock}
                startIcon={<ShoppingCart />}
                fullWidth
              >
                {productInStock ? 'افزودن به سبد خرید' : 'ناموجود'}
              </ActionButton>
              <Button
                variant="outlined"
                onClick={handleFavoriteToggle}
                sx={{
                  borderRadius: 30,
                  minWidth: 44,
                  borderColor: '#FF8C00',
                  color: '#FF8C00',
                  '&:hover': { borderColor: '#E65100', bgcolor: 'rgba(255,140,0,0.08)' },
                }}
              >
                {isFavorite ? <Favorite sx={{ fontSize: 20 }} /> : <FavoriteBorder sx={{ fontSize: 20 }} />}
              </Button>
            </Stack>

            {/* Features */}
            <Grid container spacing={1} sx={{ mb: 2 }}>
              <Grid item xs={4}>
                <FeatureBox>
                  <LocalShipping sx={{ color: '#FF8C00', fontSize: 18 }} />
                  <Box>
                    <Typography variant="caption" display="block" color="text.secondary" sx={{ fontSize: '0.6rem' }}>
                      ارسال
                    </Typography>
                    <Typography variant="caption" fontWeight={600} sx={{ fontSize: '0.7rem' }}>
                      {productInStock ? '۲۴ ساعته' : 'ناموجود'}
                    </Typography>
                  </Box>
                </FeatureBox>
              </Grid>
              <Grid item xs={4}>
                <FeatureBox>
                  <Security sx={{ color: '#FF8C00', fontSize: 18 }} />
                  <Box>
                    <Typography variant="caption" display="block" color="text.secondary" sx={{ fontSize: '0.6rem' }}>
                      گارانتی
                    </Typography>

                    {/* <Typography variant="caption" fontWeight={600} sx={{ fontSize: '0.7rem' }}>
                      اصالت
                    </Typography> */}
                  </Box>
                </FeatureBox>
              </Grid>
              <Grid item xs={4}>
                <FeatureBox>
                  <CheckCircle sx={{ color: '#FF8C00', fontSize: 18 }} />
                  <Box>
                    <Typography variant="caption" display="block" color="text.secondary" sx={{ fontSize: '0.6rem' }}>
                      کیفیت
                    </Typography>
                    <Typography variant="caption" fontWeight={600} sx={{ fontSize: '0.7rem' }}>
                      تضمین
                    </Typography>
                  </Box>
                </FeatureBox>
              </Grid>
            </Grid>

            <Divider sx={{ mb: 2 }} />

            {/* Tags */}
            {product.tags?.length > 0 && (
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                {product.tags.slice(0, 4).map((tag, index) => (
                  <Chip
                    key={index}
                    label={`#${tag}`}
                    size="small"
                    sx={{
                      borderRadius: 1,
                      height: 22,
                      fontSize: '0.65rem',
                      bgcolor: isDark ? 'rgba(255,140,0,0.12)' : 'rgba(255,140,0,0.06)',
                      color: '#FF8C00',
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ mt: 3 }}>
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': { fontSize: '0.8rem', py: 1.5, minHeight: 40 },
            }}
          >
            <Tab icon={<Description sx={{ fontSize: 18 }} />} label="توضیحات" iconPosition="start" />
            <Tab icon={<Widgets sx={{ fontSize: 18 }} />} label="مشخصات" iconPosition="start" />
          </Tabs>

          {tabValue === 0 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
                {product.description || 'توضیحاتی برای این محصول ثبت نشده است.'}
              </Typography>
            </Box>
          )}

          {tabValue === 1 && (
            <Box sx={{ p: 3 }}>
              {product.information?.length > 0 ? (
                <Grid container spacing={1}>
                  {product.information.map((item, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <SpecItem>
                        <Typography variant="caption" color="text.secondary">
                          {item.key}
                        </Typography>
                        <Typography variant="caption" fontWeight={600}>
                          {item.value}
                        </Typography>
                      </SpecItem>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  مشخصات فنی ثبت نشده است.
                </Typography>
              )}
            </Box>
          )}
        </Paper>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductDetail;   