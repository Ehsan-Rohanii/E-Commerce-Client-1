import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setPhone } from '../../../../Store/PhoneSlice';
import { Alert, Box, Button, CircularProgress, Container, Divider, Paper, Typography } from '@mui/material';

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // اعتبارسنجی شماره موبایل
    const phoneRegex = /^09[0-9]{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError('شماره موبایل معتبر نیست (مثال: 09123456789)');
      setLoading(false);
      return;
    }

    try {
      // ذخیره شماره در Redux
      dispatch(setPhone({ phone: phoneNumber }));

      // ارسال درخواست به سرور برای ارسال کد
      const response = await fetch('http://localhost:5000/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'خطا در ارسال کد');
      }

      // هدایت به صفحه تأیید کد
      navigate('/loginOtp');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
            ورود
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
            برای ورود، شماره موبایل خود را وارد کنید
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
            onSubmit={handleSubmit}
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
                شماره موبایل
              </Typography>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                required
                style={{
                  width: '100%',
                  padding: '16px 18px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '2px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  textAlign: 'right',
                  direction: 'rtl',
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
                'ارسال کد تأیید'
              )}
            </Button>

            {/* دکمه ورود با رمز عبور */}
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
            با ورود، شرایط و قوانین را می‌پذیرید
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}