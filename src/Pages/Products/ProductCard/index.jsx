// src/Pages/Products/ProductCard/index.jsx
import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Box,
  Rating,
  Chip,
  Button,
  useTheme,
} from '@mui/material';
import { ShoppingCart, Favorite, FavoriteBorder } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 320,
  height: 460,
  borderRadius: 20,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
  border: theme.palette.mode === 'dark' 
    ? '1px solid rgba(255, 140, 0, 0.2)' 
    : '1px solid rgba(255, 140, 0, 0.15)',
  position: 'relative',
  overflow: 'hidden',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 20px 40px rgba(255, 140, 0, 0.15)'
      : '0 20px 40px rgba(255, 140, 0, 0.25)',
    borderColor: '#FF8C00',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: 'linear-gradient(90deg, #FF6F00, #FF8C00, #FFA726)',
  },
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 240,
  objectFit: 'contain',
  padding: '16px',
  backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#FFF8F0',
  flexShrink: 0,
}));

const StyledCardContent = styled(CardContent)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: '14px 16px 10px 16px',
  overflow: 'hidden',
});

const StyledCardActions = styled(CardActions)({
  padding: '10px 16px 16px 16px',
  flexShrink: 0,
});

const TitleTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '0.95rem',
  color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#1a1a1a',
  lineHeight: 1.4,
  textAlign: 'right',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  height: '2.6rem',
}));

const PriceBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginTop: 'auto',
  flexWrap: 'wrap',
  height: '2.4rem',
});

const OrangeButton = styled(Button)(() => ({
  borderRadius: 30,
  padding: '8px 16px',
  fontWeight: 700,
  textTransform: 'none',
  fontSize: '0.85rem',
  background: 'linear-gradient(135deg, #FF6F00, #FF8C00)',
  color: '#fff',
  boxShadow: '0 4px 12px rgba(255, 140, 0, 0.35)',
  transition: 'all 0.3s ease',
  width: '100%',
  height: 44,
  '&:hover': {
    background: 'linear-gradient(135deg, #E65100, #F57C00)',
    boxShadow: '0 6px 20px rgba(255, 140, 0, 0.45)',
    transform: 'scale(1.02)',
  },
  '&:active': {
    transform: 'scale(0.98)',
  },
  '&.Mui-disabled': {
    background: '#555',
    color: '#999',
    boxShadow: 'none',
  },
}));

const InfoBox = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexShrink: 0,
  height: '2rem',
});

const OutOfStockOverlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10,
  borderRadius: '12px 12px 0 0',
});

const OutOfStockText = styled(Typography)({
  color: '#fff',
  fontWeight: 800,
  fontSize: '1.5rem',
  backgroundColor: 'rgba(0,0,0,0.8)',
  padding: '12px 24px',
  borderRadius: 8,
  transform: 'rotate(-15deg)',
  border: '2px solid #fff',
});

function ProductCard({
  id,
  image,
  title,
  price,
  originalPrice,
  rating = 0,
  discount,
  inStock = true,
  isFavorite = false,
  variantCount = 0,
  onFavoriteToggle,
  onAddToCart,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  let discountedPrice = 0;
  let hasValidPrice = false;

  if (inStock && price && price > 0) {
    if (discount && discount > 0) {
      discountedPrice = price - (price * discount) / 100;
    } else {
      discountedPrice = price;
    }
    hasValidPrice = true;
  }

  let imageUrl = 'https://via.placeholder.com/300x300?text=No+Image';
  if (image) {
    imageUrl = image;
  }

  return (
    <StyledCard>
      <Box sx={{ position: 'relative', flexShrink: 0, height: 240 }}>
        <StyledCardMedia component="img" image={imageUrl} alt={title || 'Product'} loading="lazy" />

        {!inStock && (
          <OutOfStockOverlay>
            <OutOfStockText variant="h6">ناموجود</OutOfStockText>
          </OutOfStockOverlay>
        )}

        {discount && discount > 0 && inStock && (
          <Chip
            label={discount + '%'}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              backgroundColor: '#FF6F00',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.65rem',
              borderRadius: 2,
              height: 22,
            }}
          />
        )}

        {variantCount > 1 && inStock && (
          <Chip
            label={variantCount + ' تنوع'}
            size="small"
            sx={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              backgroundColor: isDark ? 'rgba(50,50,50,0.9)' : 'rgba(255,255,255,0.9)',
              color: '#FF8C00',
              fontWeight: 600,
              fontSize: '0.6rem',
              borderRadius: 2,
              height: 22,
            }}
          />
        )}

        <Button
          size="small"
          onClick={onFavoriteToggle}
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            minWidth: 36,
            width: 36,
            height: 36,
            borderRadius: '50%',
            backgroundColor: isDark ? 'rgba(50,50,50,0.9)' : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(4px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            '&:hover': {
              backgroundColor: isDark ? 'rgba(80,80,80,0.9)' : '#fff',
              transform: 'scale(1.1)',
            },
          }}
        >
          {isFavorite ? (
            <Favorite sx={{ color: '#FF6F00', fontSize: 20 }} />
          ) : (
            <FavoriteBorder sx={{ color: '#FF8C00', fontSize: 20 }} />
          )}
        </Button>
      </Box>

      <StyledCardContent>
        <TitleTypography variant="body1" component="h3">
          {title || 'بدون عنوان'}
        </TitleTypography>

        <InfoBox>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Rating
              value={rating}
              precision={0.1}
              size="small"
              readOnly
              sx={{
                '& .MuiRating-iconFilled': { color: '#FF8C00' },
                '& .MuiRating-iconEmpty': { 
                  color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' 
                },
                direction: 'ltr',
                fontSize: '1rem',
              }}
            />
            <Typography variant="caption" sx={{ color: isDark ? '#777' : '#999', fontSize: '0.7rem' }}>
              {'(' + Number(rating).toFixed(1) + ')'}
            </Typography>
          </Box>
          <Chip
            label={inStock ? 'موجود' : 'ناموجود'}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.55rem',
              fontWeight: 600,
              backgroundColor: inStock 
                ? (isDark ? '#1e3a1e' : '#E8F5E9')
                : (isDark ? '#3a1e1e' : '#FFEBEE'),
              color: inStock ? '#4CAF50' : '#f44336',
              borderRadius: 1,
            }}
          />
        </InfoBox>

        <PriceBox>
          {inStock && hasValidPrice ? (
            <>
              <Typography
                sx={{
                  fontWeight: 800,
                  color: '#E65100',
                  fontSize: '1.1rem',
                }}
              >
                {Number(discountedPrice).toLocaleString('fa-IR')}
                <Typography component="span" sx={{ fontSize: '0.65rem', color: isDark ? '#aaa' : '#666' }}>
                  تومان
                </Typography>
              </Typography>
              {originalPrice && originalPrice > 0 && originalPrice !== discountedPrice && (
                <Typography
                  sx={{
                    color: isDark ? '#666' : '#999',
                    textDecoration: 'line-through',
                    fontSize: '0.7rem',
                  }}
                >
                  {Number(originalPrice).toLocaleString('fa-IR')}
                </Typography>
              )}
            </>
          ) : (
            <Typography sx={{ color: isDark ? '#555' : '#999', fontStyle: 'italic', fontSize: '0.85rem' }}>
              —
            </Typography>
          )}
        </PriceBox>
      </StyledCardContent>

      <StyledCardActions>
        <OrangeButton
          variant="contained"
          onClick={onAddToCart}
          disabled={!inStock}
          endIcon={<ShoppingCart sx={{ fontSize: 16 }} />}
        >
          {inStock ? 'افزودن به سبد خرید' : 'ناموجود'}
        </OrangeButton>
      </StyledCardActions>
    </StyledCard>
  );
}

export default ProductCard;