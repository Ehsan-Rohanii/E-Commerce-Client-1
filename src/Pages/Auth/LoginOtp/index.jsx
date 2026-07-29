import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Alert,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { token } from 'stylis';

export default function LoginOtp() {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  const phoneNumber = useSelector((state) => state.phone.phone);
  console.log(phoneNumber)

  useEffect(() => {
    setIsVisible(true);

    if (!phoneNumber) {
      navigate('/login');
    }
  }, [phoneNumber, navigate]);

  const handleVerifyCode = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  const codeRegex = /^[0-9]{4,6}$/;
  if (!codeRegex.test(verificationCode)) {
    setError('کد تأیید باید ۴ تا ۶ رقم باشد و فقط شامل اعداد باشد');
    setLoading(false);
    return;
  }

  if (!phoneNumber) {
    setError('شماره موبایل یافت نشد. لطفاً دوباره وارد شوید.');
    setLoading(false);
    navigate('/login');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/auth/login-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        phoneNumber, 
        code: verificationCode 
      }),
    });

    const result = await response.json();
    console.log('Response:', result); // برای دیباگ

    if (!response.ok) {
      throw new Error(result.message || 'کد تأیید نامعتبر است');
    }

    // ✅ ذخیره توکن در localStorage
    if (result.data.token) {
      localStorage.setItem('token', result.data.token);
    }

    // ✅ ذخیره دیتای کاربر در localStorage
    if (result.data.user) {
      localStorage.setItem('user', JSON.stringify(result.data.user));
    }    

    // ✅ هدایت به صفحه اصلی
    navigate('/');
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  // اگر شماره تلفن وجود نداشت، چیزی نشان نده (تا useEffect هدایت کند)
  if (!phoneNumber) {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a0a',
        padding: '16px',
        direction: 'rtl',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 5 },
            borderRadius: 4,
            backdropFilter: 'blur(20px)',
            backgroundColor: 'rgba(20, 20, 20, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)',
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            '&:hover': {
              boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 1)',
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          <Typography
            variant="h4"
            textAlign="center"
            fontWeight={700}
            gutterBottom
            sx={{
              background: 'linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px',
              mb: 1,
            }}
          >
            تأیید کد
          </Typography>

          <Typography
            textAlign="center"
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.5)',
              mb: 4,
              fontSize: '0.95rem',
            }}
          >
            کد تأیید به شماره {phoneNumber} ارسال شد
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                backgroundColor: 'rgba(211, 47, 47, 0.15)',
                color: '#ff6b6b',
                '& .MuiAlert-icon': {
                  color: '#ff6b6b',
                },
              }}
            >
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleVerifyCode}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            <Box>
              <Typography
                component="label"
                sx={{
                  display: 'block',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  mb: 1.5,
                  textAlign: 'right',
                  width: '100%',
                }}
              >
                کد تأیید
              </Typography>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="کد ۴ تا ۶ رقمی را وارد کنید"
                required
                maxLength={6}
                style={{
                  width: '100%',
                  padding: '16px 18px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '2px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '1.2rem',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  textAlign: 'center',
                  direction: 'ltr',
                  letterSpacing: '8px',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                  e.target.style.boxShadow = '0 0 0 4px rgba(255, 255, 255, 0.05)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth
              sx={{
                height: 56,
                borderRadius: 3,
                fontSize: '1.05rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #ffffff 0%, #d0d0d0 100%)',
                color: '#0a0a0a',
                transition: 'all 0.3s ease',
                textTransform: 'none',
                boxShadow: '0 4px 15px rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 30px rgba(255, 255, 255, 0.2)',
                  background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)',
                },
                '&:active': {
                  transform: 'translateY(0px)',
                },
                '&.Mui-disabled': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: '#0a0a0a' }} />
              ) : (
                'تأیید کد'
              )}
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255, 255, 255, 0.2)',
                  px: 2,
                }}
              >
                یا
              </Typography>
            </Divider>

            {/* دکمه ورود با رمز عبور */}
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/login')}
              sx={{
                height: 48,
                borderRadius: 3,
                fontSize: '0.95rem',
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.6)',
                borderColor: 'rgba(255, 255, 255, 0.15)',
                textTransform: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              ورود با رمز عبور
            </Button>

            {/* لینک ثبت‌نام */}
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.3)',
                  display: 'inline-block',
                  ml: 1,
                }}
              >
                حساب کاربری ندارید؟
              </Typography>
              <Button
                variant="text"
                onClick={() => navigate('/')}
                sx={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '0.95rem',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    color: '#ffffff',
                    backgroundColor: 'transparent',
                    transform: 'scale(1.02)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                ثبت‌نام کنید
              </Button>
            </Box>
          </Box>

          <Typography
            textAlign="center"
            variant="caption"
            sx={{
              display: 'block',
              mt: 2,
              color: 'rgba(255, 255, 255, 0.15)',
              fontSize: '0.7rem',
            }}
          >
            کد تأیید به شماره موبایل شما ارسال شد
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}