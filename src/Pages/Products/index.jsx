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
} from '@mui/material';
import ProductCard from './ProductCard';

const processProductToCard = (product) => {
  if (!product) return null;
  const defaultVariant = product.defaultProductVariantId || {};
  const image = product.images && product.images.length > 0 
    ? 'http://localhost:5000/' + product.images[0]
    : null;
  const variantsCount = product.productVariantIds && product.productVariantIds.length || 0;

  return {
    id: product._id,
    title: product.title || 'بدون عنوان',
    image: image,
    price: defaultVariant.finalPrice || defaultVariant.price || 0,
    originalPrice: defaultVariant.price || 0,
    discount: defaultVariant.discountPercent || 0,
    rating: product.ratingAvg || 0,
    inStock: product.inStock || (defaultVariant.quantity && defaultVariant.quantity > 0) || false,
    isFavorite: product.isFavorite || false,
    variantCount: variantsCount,
    variants: product.productVariantIds || [],
    slug: product.slug,
    description: product.description,
    tags: product.tags || [],
    brandId: product.brandId,
    categoryIds: product.categoryIds || [],
  };
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

        if (data && data.data) {
          const processedProducts = data.data
            .map(function(product) { return processProductToCard(product); })
            .filter(function(item) { return item !== null; });

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

  const handleAddToCart = function(productId) {
    console.log('🛒 Add to cart:', productId);
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
    </Container>
  );
}