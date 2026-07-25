// components/CategoryCard.jsx
import React from 'react'
import {
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Typography,
  Box,
  Chip,
  Stack,
  useTheme,
  Paper,
} from '@mui/material'
import {
  Category as CategoryIcon,
  ChevronLeft,
  Inventory,
} from '@mui/icons-material'
import { styled } from '@mui/material/styles'

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  overflow: 'hidden',
  backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  direction: 'rtl',
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 12px 40px rgba(0,0,0,0.5)'
      : '0 12px 40px rgba(255,140,0,0.15)',
    borderColor: '#FF8C00',
  },
}))

const ImageWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  paddingTop: '75%',
  backgroundColor: theme.palette.mode === 'dark' ? '#0a0a0a' : '#f5f5f5',
  overflow: 'hidden',
  flexShrink: 0,
}))

const StyledMedia = styled(CardMedia)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'scale(1.05)',
  },
})

const StyledCardContent = styled(CardContent)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '16px',
  paddingBottom: '16px !important',
  minHeight: 90,
})

const TitleTypography = styled(Typography)({
  fontWeight: 600,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  lineHeight: 1.3,
  height: '2.6em',
  marginBottom: 6,
  fontSize: '0.95rem',
  textAlign: 'right',
})

const ChipsContainer = styled(Stack)({
  flexWrap: 'wrap',
  gap: 4,
  marginTop: 'auto',
  minHeight: 24,
  justifyContent: 'flex-start',
})

const ListCard = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  padding: 12,
  borderRadius: 16,
  backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  height: '100%',
  minHeight: 90,
  direction: 'rtl',
  '&:hover': {
    transform: 'translateX(8px)',
    borderColor: '#FF8C00',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 8px 30px rgba(0,0,0,0.4)'
      : '0 8px 30px rgba(255,140,0,0.12)',
  },
}))

const ListImage = styled(Box)(({ theme }) => ({
  width: 70,
  height: 70,
  borderRadius: 12,
  overflow: 'hidden',
  flexShrink: 0,
  backgroundColor: theme.palette.mode === 'dark' ? '#0a0a0a' : '#f5f5f5',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
}))

const ListContent = styled(Box)({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: 4,
})

const ListTitle = styled(Typography)({
  fontWeight: 600,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: '0.95rem',
  textAlign: 'right',
})

const StyledChip = styled(Chip)({
  borderRadius: 1,
  height: 22,
  '& .MuiChip-label': {
    fontSize: '0.65rem',
    padding: '0 6px',
  },
})

export default function CategoryCard({ category, onClick, viewMode = 'grid' }) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const {
    title = 'بدون عنوان',
    image,
    subCategoryIds = [],
    isPublished = true,
    slug,
  } = category || {}

  const subCategoriesCount = Array.isArray(subCategoryIds) ? subCategoryIds.length : 0

  // حالت لیست
  if (viewMode === 'list') {
    return (
      <ListCard onClick={onClick} elevation={0}>
        <ChevronLeft sx={{ color: '#FF8C00', opacity: 0.6, flexShrink: 0 }} />
        
        <ListContent>
          <ListTitle variant="h6">
            {title}
          </ListTitle>
          
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={0.5}>
            <StyledChip
              label={`${subCategoriesCount} زیردسته`}
              icon={<Inventory sx={{ fontSize: 14 }} />}
              sx={{
                bgcolor: isDark ? 'rgba(255,140,0,0.1)' : 'rgba(255,140,0,0.08)',
                color: '#FF8C00',
              }}
            />
            {slug && (
              <StyledChip
                label={slug}
                variant="outlined"
                sx={{
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                }}
              />
            )}
          </Stack>
        </ListContent>

        <ListImage>
          {image ? (
            <img src={image} alt={title} loading="lazy" />
          ) : (
            <Box sx={{ 
              width: '100%', 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              bgcolor: isDark ? 'rgba(255,140,0,0.1)' : 'rgba(255,140,0,0.05)',
            }}>
              <CategoryIcon sx={{ fontSize: 28, color: '#FF8C00', opacity: 0.5 }} />
            </Box>
          )}
        </ListImage>
      </ListCard>
    )
  }

  // حالت گرید
  return (
    <StyledCard>
      <CardActionArea 
        onClick={onClick} 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'stretch',
        }}
      >
        <ImageWrapper>
          {image ? (
            <StyledMedia
              component="img"
              image={image}
              alt={title}
              loading="lazy"
            />
          ) : (
            <Box sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: isDark ? 'rgba(255,140,0,0.05)' : 'rgba(255,140,0,0.03)',
            }}>
              <CategoryIcon sx={{ fontSize: 48, color: '#FF8C00', opacity: 0.3 }} />
            </Box>
          )}
          {!isPublished && (
            <Chip
              label="غیرفعال"
              size="small"
              color="error"
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                borderRadius: 1,
                backdropFilter: 'blur(10px)',
                bgcolor: 'rgba(244, 67, 54, 0.9)',
                height: 22,
                '& .MuiChip-label': { fontSize: '0.65rem' },
              }}
            />
          )}
        </ImageWrapper>

        <StyledCardContent>
          <TitleTypography variant="h6">
            {title}
          </TitleTypography>
          
          <ChipsContainer direction="row" spacing={1}>
            <StyledChip
              label={`${subCategoriesCount} زیردسته`}
              icon={<Inventory sx={{ fontSize: 14 }} />}
              sx={{
                bgcolor: isDark ? 'rgba(255,140,0,0.1)' : 'rgba(255,140,0,0.08)',
                color: '#FF8C00',
              }}
            />
            {slug && (
              <StyledChip
                label={slug}
                variant="outlined"
                sx={{
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                }}
              />
            )}
          </ChipsContainer>
        </StyledCardContent>
      </CardActionArea>
    </StyledCard>
  )
}