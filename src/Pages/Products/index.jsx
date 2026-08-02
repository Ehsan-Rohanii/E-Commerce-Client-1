// src/Pages/Products/index.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Alert,
  Skeleton,
  Pagination,
  Container,
  useTheme,
  Snackbar,
} from '@mui/material';
import ProductCard from './ProductCard';

const processProductToCard = (product) => {
  if (!product) return null;
  
  console.log('🔄 Processing product:', product._id);
  console.log('📦 Product variants:', product.productVariantIds);
  
  let defaultVariant = null;
  let defaultVariantId = null;
  let inStock = false;
  
  if (product.productVariantIds && Array.isArray(product.productVariantIds) && product.productVariantIds.length > 0) {
    console.log('✅ Product has variants, count:', product.productVariantIds.length);
    
    if (product.defaultProductVariantId) {
      console.log('🎯 Using defaultProductVariantId:', product.defaultProductVariantId);
      defaultVariant = product.defaultProductVariantId;
      defaultVariantId = defaultVariant._id || defaultVariant.id;
      console.log('🎯 defaultVariantId from defaultProductVariantId:', defaultVariantId);
    } else {
      console.log('🔄 No defaultProductVariantId, using first variant');
      defaultVariant = product.productVariantIds[0];
      defaultVariantId = defaultVariant._id || defaultVariant.id;
      console.log('🔄 defaultVariantId from first variant:', defaultVariantId);
    }
    
    console.log('📋 Selected variant full object:', defaultVariant);
    
    if (defaultVariant) {
      inStock = (defaultVariant.quantity && defaultVariant.quantity > 0) || false;
      console.log('📊 Variant quantity:', defaultVariant.quantity, 'inStock:', inStock);
    }
  } else {
    console.log('❌ No variants found for product');
    inStock = product.inStock || false;
  }

  const image = product.images && product.images.length > 0 
    ? 'http://localhost:5000/' + product.images[0]
    : null;
  const variantsCount = product.productVariantIds?.length || 0;

  const result = {
    id: product._id,
    title: product.title || 'بدون عنوان',
    image: image,
    price: defaultVariant?.finalPrice || defaultVariant?.price || 0,
    originalPrice: defaultVariant?.price || 0,
    discount: defaultVariant?.discountPercent || 0,
    rating: product.ratingAvg || 0,
    inStock: inStock,
    isFavorite: product.isFavorite || false,
    variantCount: variantsCount,
    variants: product.productVariantIds || [],
    slug: product.slug,
    description: product.description,
    tags: product.tags || [],
    brandId: product.brandId,
    categoryIds: product.categoryIds || [],
    defaultVariantId: defaultVariantId,
    defaultVariant: defaultVariant,
    productId: product._id,
  };
  
  console.log('✅ Processed product result:', {
    id: result.id,
    title: result.title,
    defaultVariantId: result.defaultVariantId,
    variantCount: result.variantCount,
  });
  
  return result;
};

export default function Products() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          'http://localhost:5000/api/products?page=' + page + '&limit=12'
        );

        if (!res.ok) {
          throw new Error('خطا در دریافت محصولات: ' + res.status);
        }

        const data = await res.json();

        console.log('📦 Full API response:', data);

        if (data && data.data) {
          console.log('📦 First product from API:', data.data[0]);
          console.log('📦 First product variants:', data.data[0]?.productVariantIds);
          
          const processedProducts = data.data
            .map(function(product) { 
              return processProductToCard(product);
            })
            .filter(function(item) { return item !== null; });

          console.log('✅ Processed products:', processedProducts);
          setProducts(processedProducts);
          setTotalCount(data.count || 0);
          setTotalPages(Math.ceil((data.count || 0) / 8));
        } else {
          setProducts([]);
          setTotalCount(0);
          setTotalPages(1);
        }
      } catch (err) {
        setError(err.message || 'مشکلی در دریافت محصولات پیش آمده');
        console.error('❌ Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page]);

  const handleFavoriteToggle = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const res = await fetch('http://localhost:5000/api/products/toggle-favorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({ productId: productId }),
      });

      if (!res.ok) throw new Error('خطا در تغییر وضعیت علاقه‌مندی');

      const data = await res.json();
      console.log('✅', data.message);
      
      setProducts(function(prev) {
        return prev.map(function(p) {
          if (p.id === productId) {
            return { ...p, isFavorite: !p.isFavorite };
          }
          return p;
        });
      });
    } catch (err) {
      console.error('❌ Error toggling favorite:', err);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      console.log('🛒 Starting add to cart for productId:', productId);

      const token = localStorage.getItem('token');
      if (!token) {
        setSnackbar({
          open: true,
          message: 'لطفاً ابتدا وارد حساب خود شوید',
          severity: 'warning',
        });
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }

      const product = products.find(p => p.id === productId);
      console.log('📦 Found product in state:', product);

      if (!product) {
        setSnackbar({
          open: true,
          message: 'محصول یافت نشد',
          severity: 'error',
        });
        return;
      }

      console.log('📋 Product details:', {
        id: product.id,
        title: product.title,
        defaultVariantId: product.defaultVariantId,
        variants: product.variants,
        inStock: product.inStock
      });

      if (!product.inStock) {
        setSnackbar({
          open: true,
          message: 'متأسفیم، این محصول موجود نیست',
          severity: 'error',
        });
        return;
      }

      let productVariantId = product.defaultVariantId;
      
      // اگر defaultVariantId نداشت، از اولین واریانت استفاده کن
      if (!productVariantId && product.variants && product.variants.length > 0) {
        const firstVariant = product.variants[0];
        productVariantId = firstVariant._id || firstVariant.id;
        console.log('🔄 Using first variant _id:', productVariantId);
        console.log('🔄 First variant full object:', firstVariant);
      }
      
      console.log('🎯 Final productVariantId to send:', productVariantId);

      if (!productVariantId) {
        setSnackbar({
          open: true,
          message: 'تنوع محصول یافت نشد',
          severity: 'error',
        });
        console.error('❌ No productVariantId found for product:', product);
        return;
      }

      const cartData = {
        productVariantId: productVariantId,
      };

      console.log('📤 Sending to cart - full data:', JSON.stringify(cartData, null, 2));

      const response = await fetch('http://localhost:5000/api/carts/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify(cartData),
      });

      console.log('📥 Response status:', response.status);
      
      const responseText = await response.text();
      console.log('📥 Raw response:', responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error('❌ Invalid JSON:', responseText);
        throw new Error('پاسخ سرور معتبر نیست');
      }

      if (!response.ok) {
        throw new Error(result.message || result.error || 'خطا در افزودن به سبد خرید');
      }

      setSnackbar({
        open: true,
        message: result.message || 'محصول با موفقیت به سبد خرید اضافه شد ✅',
        severity: 'success',
      });

    } catch (err) {
      console.error('❌ Error adding to cart:', err);
      setSnackbar({
        open: true,
        message: err.message || 'خطا در افزودن به سبد خرید',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: 2,
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map(function(i) {
            return <Skeleton key={i} variant="rounded" height={460} sx={{ borderRadius: 3 }} />;
          })}
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert severity="error" variant="filled" sx={{ borderRadius: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container 
      key={isDark ? 'dark' : 'light'} 
      maxWidth="xl" 
      sx={{ py: 4, direction: 'rtl' }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            background: 'linear-gradient(135deg, #FF6F00, #FF8C00)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          محصولات
        </Typography>
        <Typography variant="body2" sx={{ color: isDark ? '#777' : '#999', fontWeight: 500 }}>
          {totalCount + ' محصول'}
        </Typography>
      </Box>

      {products.length === 0 ? (
        <Box
          sx={{
            py: 12,
            textAlign: 'center',
            borderRadius: 4,
            border: '1px dashed rgba(255, 140, 0, 0.3)',
            backgroundColor: isDark ? 'rgba(255,140,0,0.05)' : '#FFF8F0',
          }}
        >
          <Typography variant="h6" sx={{ color: isDark ? '#888' : '#666', mb: 1 }}>
            😕 محصولی یافت نشد
          </Typography>
          <Typography variant="body2" color="text.secondary">
            لطفاً عبارت جستجو را تغییر دهید
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: 2,
            justifyContent: 'center',
          }}
        >
          {products.map(function(product) {
            return (
              <Box
                key={product.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <ProductCard
                  key={isDark ? 'dark-' + product.id : 'light-' + product.id}
                  {...product}
                  onFavoriteToggle={function() { handleFavoriteToggle(product.id); }}
                  onAddToCart={function() { handleAddToCart(product.id); }}
                />
              </Box>
            );
          })}
        </Box>
      )}

      {totalPages > 1 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 4,
            pt: 3,
            borderTop: '1px solid ' + (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'),
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={function(e, v) { setPage(v); }}
            color="primary"
            size="large"
            sx={{
              direction: 'ltr',
              '& .MuiPaginationItem-root': {
                borderRadius: 2,
                color: isDark ? '#aaa' : 'inherit',
                '&.Mui-selected': {
                  backgroundColor: '#FF8C00',
                  color: '#fff',
                  '&:hover': { backgroundColor: '#E65100' },
                },
              },
            }}
          />
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            borderRadius: 3,
            width: '100%',
            boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}