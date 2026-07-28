// components/Brands.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Grid,
  Skeleton,
  Alert,
  Pagination,
  TextField,
  InputAdornment,
  IconButton,
  Breadcrumbs,
  Link,
  Stack,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  Search,
  FilterList,
  GridView,
  ViewList,
  BrandingWatermark as BrandIcon,
  Home,
} from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import BrandCard from './BrandsCard'


const SearchWrapper = styled(Paper)(({ theme }) => ({
  padding: '16px 24px',
  borderRadius: 16,
  backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
  marginBottom: 32,
  direction: 'rtl',
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: theme.palette.mode === 'dark' ? '#0a0a0a' : '#f8f8f8',
    '&:hover fieldset': {
      borderColor: '#FF8C00',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FF8C00',
      borderWidth: 2,
    },
  },
  '& .MuiInputBase-input': {
    textAlign: 'right',
  },
}))

export default function Brands() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  
  const isXs = useMediaQuery(theme.breakpoints.down('sm'))
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'))
  const isLg = useMediaQuery(theme.breakpoints.between('lg', 'xl'))
  const isXl = useMediaQuery(theme.breakpoints.up('xl'))

  let cols = 5
  if (isXs) cols = 1
  else if (isSm) cols = 2
  else if (isMd) cols = 3
  else if (isLg) cols = 4
  else if (isXl) cols = 5

  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalBrands, setTotalBrands] = useState(0)
  const [viewMode, setViewMode] = useState('grid')
  const itemsPerPage = 15

  useEffect(() => {
    fetchBrands()
  }, [page])

  const fetchBrands = async () => {
    try {
      setLoading(true)
      setError(null)

      const url = new URL('http://localhost:5000/api/brands')
      url.searchParams.append('page', page)
      url.searchParams.append('limit', itemsPerPage)
      url.searchParams.append('isPublished', true)
      
      if (searchTerm.trim()) {
        url.searchParams.append('search', searchTerm.trim())
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success === false) {
        throw new Error(data.message || 'خطا در دریافت برندها')
      }

      const brandsData = data.brands || data.data || data || []
      setBrands(Array.isArray(brandsData) ? brandsData : [])
      
      setTotalPages(data.totalPages || data.pagination?.totalPages || 1)
      setTotalBrands(data.total || data.pagination?.total || brandsData.length || 0)

    } catch (err) {
      console.error('Error fetching brands:', err)
      setError(err.message || 'خطا در دریافت برندها. لطفاً دوباره تلاش کنید.')
      setBrands([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchBrands()
  }

  const handlePageChange = (event, value) => {
    setPage(value)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBrandClick = (brandId, slug) => {
    navigate(`/brands/${slug || brandId}`)
  }

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, direction: 'rtl' }}>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="text" width={300} height={24} />
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 3 }}>
          {[...Array(10)].map((_, index) => (
            <Skeleton key={index} variant="rounded" height={280} sx={{ borderRadius: 4 }} />
          ))}
        </Box>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, direction: 'rtl' }}>
        <Alert 
          severity="error" 
          action={
            <IconButton color="inherit" onClick={fetchBrands}>
              <Search />
            </IconButton>
          }
          sx={{ borderRadius: 2 }}
        >
          {error}
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4, direction: 'rtl' }}>
      {/* Breadcrumbs */}
      <Breadcrumbs 
        sx={{ 
          mb: 3, 
          '& .MuiBreadcrumbs-separator': { mx: 1 },
          '& .MuiBreadcrumbs-ol': {
            justifyContent: 'flex-start',
          }
        }}
      >
        <Link
          color="inherit"
          onClick={() => navigate('/')}
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
          <Home sx={{ ml: 0.5, fontSize: 18 }} />
          خانه
        </Link>
        <Typography color="#FF8C00" sx={{ display: 'flex', alignItems: 'center' }}>
          <BrandIcon sx={{ ml: 0.5, fontSize: 18 }} />
          برندها
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'right' }}>
        <Typography variant="h4" fontWeight={700} color="#FF8C00" gutterBottom>
          برندها
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {totalBrands > 0 
            ? `${totalBrands} برند پیدا شد` 
            : 'هیچ برندی یافت نشد'}
        </Typography>
      </Box>

      {/* Search & Filters */}
      <SearchWrapper elevation={0}>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2}
          alignItems="center"
        >
          <Box component="form" onSubmit={handleSearch} sx={{ flex: 1, width: '100%' }}>
            <StyledTextField
              fullWidth
              placeholder="جستجوی برند..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(e)
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton type="submit" sx={{ color: '#FF8C00' }}>
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={() => {
                        setSearchTerm('')
                        setPage(1)
                        fetchBrands()
                      }}
                    >
                      <FilterList />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          
          <Stack direction="row" spacing={1}>
            <IconButton
              onClick={() => setViewMode('grid')}
              sx={{ 
                bgcolor: viewMode === 'grid' ? '#FF8C00' : 'transparent',
                color: viewMode === 'grid' ? '#fff' : 'inherit',
                '&:hover': { bgcolor: viewMode === 'grid' ? '#e67e00' : 'rgba(255,140,0,0.1)' },
                borderRadius: 2,
              }}
            >
              <GridView />
            </IconButton>
            <IconButton
              onClick={() => setViewMode('list')}
              sx={{ 
                bgcolor: viewMode === 'list' ? '#FF8C00' : 'transparent',
                color: viewMode === 'list' ? '#fff' : 'inherit',
                '&:hover': { bgcolor: viewMode === 'list' ? '#e67e00' : 'rgba(255,140,0,0.1)' },
                borderRadius: 2,
              }}
            >
              <ViewList />
            </IconButton>
          </Stack>
        </Stack>
      </SearchWrapper>

      {/* Brands Grid */}
      {brands.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <BrandIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h5" color="text.secondary">
            برندی یافت نشد
          </Typography>
          <Typography variant="body2" color="text.secondary">
            سعی کنید با عبارت دیگری جستجو کنید
          </Typography>
        </Box>
      ) : (
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: 3,
            '& > *': {
              height: '100%',
            }
          }}
        >
          {brands.map((brand) => (
            <Box key={brand._id} sx={{ height: '100%' }}>
              <BrandCard 
                brand={brand} 
                onClick={() => handleBrandClick(brand._id, brand.slug)}
                viewMode={viewMode}
              />
            </Box>
          ))}
        </Box>
      )}

      {/* Pagination */}
      {brands.length > 0 && totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            sx={{
              '& .MuiPaginationItem-root': {
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: '#FF8C00',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#e67e00',
                  },
                },
              },
            }}
          />
        </Box>
      )}
    </Container>
  )
}
