// components/common/Slider.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  ArrowBackIos as ArrowBackIosIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';

const slideIn = keyframes`
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const StyledSliderContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: { xs: '300px', sm: '400px', md: '500px' },
  borderRadius: theme.spacing(3),
  overflow: 'hidden',
  backgroundColor: '#0a0a0a',
  boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
}));

const SlideWrapper = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
});

const SlideImage = styled(Box)(({ image }) => ({
  width: '100%',
  height: '100%',
  backgroundImage: `url(${image})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  transition: 'transform 0.5s ease',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 100%)',
  },
}));

const SlideContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: { xs: '20px', sm: '40px', md: '60px' },
  zIndex: 2,
  animation: `${slideIn} 0.6s ease-out`,
}));

const NavButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 3,
  backgroundColor: 'rgba(255,255,255,0.15)',
  backdropFilter: 'blur(10px)',
  color: 'white',
  width: 44,
  height: 44,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.3)',
    transform: 'translateY(-50%) scale(1.05)',
  },
  '&.Mui-disabled': {
    opacity: 0.3,
  },
}));

const DotsContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 20,
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: 8,
  zIndex: 3,
}));

const Dot = styled(Box)(({ active }) => ({
  width: active ? 32 : 10,
  height: 10,
  borderRadius: 5,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: active ? '#FF8C00' : 'rgba(255,255,255,0.4)',
  '&:hover': {
    backgroundColor: active ? '#FF8C00' : 'rgba(255,255,255,0.7)',
  },
}));

// داده‌های استاتیک برای مواقعی که سرور در دسترس نیست
const STATIC_SLIDES = [
  {
    _id: '1',
    title: 'به فروشگاه ما خوش آمدید',
    description: 'بهترین محصولات با بهترین قیمت‌ها',
    image: '/Slider1.jpg',
    path: '/products',
    isPublished: true,
  },
  {
    _id: '2',
    title: 'تخفیف‌های ویژه',
    description: 'تا ۵۰٪ تخفیف برای خرید اول',
    image: '/Slider1.jpg',
    path: '/products',
    isPublished: true,
  },
];

export default function Slider() {
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const timerRef = useRef(null);

  // تابع برای ساخت آدرس کامل عکس
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    
    // اگر آدرس با http یا https شروع شود، همان آدرس است
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // اگر آدرس با / شروع شود، از ریشه پروژه استفاده کن
    if (imagePath.startsWith('/')) {
      return imagePath;
    }
    
    // در غیر این صورت، یک / به اول آن اضافه کن
    return `/${imagePath}`;
  };

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/sliders');
        
        if (!response.ok) {
          throw new Error('خطا در دریافت اسلایدها');
        }
        
        const data = await response.json();
        console.log('Received data from server:', data); // برای دیباگ
        
        if (data.success && data.data && data.data.length > 0) {
          const publishedSlides = data.data.filter(slide => slide.isPublished === true);
          if (publishedSlides.length > 0) {
            setSlides(publishedSlides);
          } else {
            setSlides(STATIC_SLIDES);
          }
        } else {
          setSlides(STATIC_SLIDES);
        }
      } catch (err) {
        console.error('Error fetching slides , ارور داریم:', err);
        setError(err.message || 'خطا در دریافت اسلایدها');
        setSlides(STATIC_SLIDES);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length > 0 && isAutoPlay) {
      timerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isAutoPlay, slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 5000);
  };

  const nextSlide = () => {
    if (slides.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }
  };

  const prevSlide = () => {
    if (slides.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '100%',
        height: { xs: '300px', sm: '400px', md: '500px' },
        borderRadius: 3,
        bgcolor: '#0a0a0a',
      }}>
        <CircularProgress sx={{ color: '#FF8C00' }} />
      </Box>
    );
  }

  if (error && slides.length === 0) {
    return (
      <Box sx={{ 
        p: 4, 
        width: '100%',
        borderRadius: 3,
        bgcolor: '#0a0a0a',
        textAlign: 'center',
      }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (slides.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '100%',
        height: { xs: '150px', sm: '200px', md: '300px' },
        borderRadius: 3,
        bgcolor: '#0a0a0a',
        flexDirection: 'column',
        gap: 2,
      }}>
        <Typography variant="h6" color="rgba(255,255,255,0.5)">
          هیچ اسلایدی وجود ندارد
        </Typography>
      </Box>
    );
  }

  const currentSlideData = slides[currentSlide];
  const imageUrl = getImageUrl(currentSlideData.image);
  
  console.log('Current slide image URL:', imageUrl); // برای دیباگ

  return (
    <StyledSliderContainer>
      <SlideWrapper>
        <SlideImage image={imageUrl} />
        
        <SlideContent>
          {currentSlideData.title && (
            <Typography
              variant="h2"
              sx={{
                color: 'white',
                fontWeight: 800,
                fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3.5rem' },
                mb: 1,
                textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                maxWidth: { xs: '90%', sm: '80%', md: '70%' },
              }}
            >
              {currentSlideData.title}
            </Typography>
          )}
          
          {currentSlideData.description && (
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.3rem' },
                maxWidth: { xs: '90%', sm: '80%', md: '60%' },
                mb: 2,
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
              }}
            >
              {currentSlideData.description}
            </Typography>
          )}
          
          <Stack direction="row" spacing={2} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
            <Button
              variant="contained"
              onClick={() => {
                if (currentSlideData.href) {
                  window.open(currentSlideData.href, '_blank');
                } else if (currentSlideData.path) {
                  navigate(currentSlideData.path);
                } else {
                  navigate('/');
                }
              }}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.2,
                fontSize: '0.95rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #FF6F00, #FF8C00)',
                boxShadow: '0 4px 20px rgba(255,140,0,0.4)',
                textTransform: 'none',
                '&:hover': {
                  boxShadow: '0 6px 30px rgba(255,140,0,0.6)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              مشاهده بیشتر
            </Button>
            
            <Button
              variant="outlined"
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1.2,
                fontSize: '0.95rem',
                fontWeight: 600,
                color: 'white',
                borderColor: 'rgba(255,255,255,0.3)',
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              اطلاعات بیشتر
            </Button>
          </Stack>
        </SlideContent>
      </SlideWrapper>

      {slides.length > 1 && (
        <>
          <NavButton
            onClick={prevSlide}
            sx={{ left: 16 }}
          >
            <ArrowBackIosIcon fontSize="small" />
          </NavButton>
          
          <NavButton
            onClick={nextSlide}
            sx={{ right: 16 }}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </NavButton>
        </>
      )}

      {slides.length > 1 && (
        <DotsContainer>
          {slides.map((_, index) => (
            <Dot
              key={index}
              active={currentSlide === index ? 1 : 0}
              onClick={() => goToSlide(index)}
            />
          ))}
        </DotsContainer>
      )}
    </StyledSliderContainer>
  );
}