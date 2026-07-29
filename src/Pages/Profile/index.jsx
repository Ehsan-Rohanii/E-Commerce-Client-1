// Pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Tab,
  Tabs,
  Chip,
  Stack,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import {
  Person,
  Edit,
  Save,
  Cancel,
  Phone,
  Cake,
  Lock,
  Visibility,
  VisibilityOff,
  AdminPanelSettings,
  VerifiedUser,
  Refresh,
  Badge,
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
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,140,0,0.05), transparent 70%)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -100,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,140,0,0.05), transparent 70%)',
  },
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 130,
  height: 130,
  border: `4px solid ${theme.palette.mode === 'dark' ? 'rgba(255,140,0,0.3)' : 'rgba(255,140,0,0.2)'}`,
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, rgba(255,140,0,0.3), rgba(255,100,0,0.1))'
    : 'linear-gradient(135deg, rgba(255,140,0,0.15), rgba(255,100,0,0.05))',
  fontSize: '3.5rem',
  fontWeight: 700,
  color: '#FF8C00',
  margin: '0 auto',
  boxShadow: '0 12px 40px rgba(255,140,0,0.25)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'scale(1.08) rotate(-5deg)',
    boxShadow: '0 16px 50px rgba(255,140,0,0.35)',
    borderColor: '#FF8C00',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 14,
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(255,255,255,0.05)'
      : 'rgba(0,0,0,0.02)',
    transition: 'all 0.3s ease',
    '& fieldset': {
      borderColor: theme.palette.mode === 'dark'
        ? 'rgba(255,255,255,0.1)'
        : 'rgba(0,0,0,0.08)',
      borderWidth: 2,
    },
    '&:hover fieldset': {
      borderColor: '#FF8C00',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FF8C00',
      borderWidth: 2,
      boxShadow: '0 0 0 4px rgba(255,140,0,0.1)',
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.mode === 'dark'
      ? 'rgba(255,255,255,0.6)'
      : 'rgba(0,0,0,0.6)',
    fontWeight: 500,
    '&.Mui-focused': {
      color: '#FF8C00',
    },
  },
  '& .MuiInputBase-input': {
    color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
    fontSize: '1rem',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 14,
  padding: '12px 36px',
  fontWeight: 700,
  textTransform: 'none',
  fontSize: '1rem',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(255,255,255,0.1), transparent)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 12px 30px rgba(255,140,0,0.3)',
    '&::before': {
      opacity: 1,
    },
  },
  '&:active': {
    transform: 'translateY(0px)',
  },
}));

const InfoCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  background: theme.palette.mode === 'dark'
    ? 'rgba(255,255,255,0.03)'
    : 'rgba(0,0,0,0.02)',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.05)',
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  borderRadius: 8,
  fontWeight: 600,
  fontSize: '0.75rem',
  height: 28,
  ...(status === 'active' && {
    background: 'linear-gradient(135deg, #4CAF50, #45a049)',
    color: 'white',
  }),
  ...(status === 'inactive' && {
    background: 'linear-gradient(135deg, #f44336, #d32f2f)',
    color: 'white',
  }),
  ...(status === 'admin' && {
    background: 'linear-gradient(135deg, #FF8C00, #E65100)',
    color: 'white',
  }),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.1rem',
  color: '#FF8C00',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginBottom: 24,
}));

// ✅ کامپوننت جدید برای آیتم‌های اطلاعات با بوردر
const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: { xs: 'flex-start', sm: 'center' },
  gap: { xs: 1, sm: 0 },
  padding: '16px 20px',
  borderRadius: 12,
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(255,255,255,0.02)'
    : 'rgba(0,0,0,0.01)',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: '#FF8C00',
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(255,140,0,0.05)'
      : 'rgba(255,140,0,0.03)',
    transform: 'translateX(-4px)',
  },
}));

const InfoLabel = styled(Box)({
  minWidth: 140,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
});

const InfoValue = styled(Typography)({
  fontWeight: 500,
  fontSize: '1rem',
});

export default function Profile() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [userData, setUserData] = useState({
    _id: '',
    fullName: '',
    phoneNumber: '',
    email: '',
    birthDate: '',
    role: 'user',
    isActive: true,
  });

  const [editData, setEditData] = useState({
    fullName: '',
    birthDate: '',
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    hasOldPassword: false,
  });

  const checkIfUserHasPassword = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/users/has-password', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setPasswordData(prev => ({
          ...prev,
          hasOldPassword: result.hasPassword || false,
        }));
      } else {
        const user = localStorage.getItem('user');
        if (user) {
          try {
            const parsedUser = JSON.parse(user);
            setPasswordData(prev => ({
              ...prev,
              hasOldPassword: parsedUser.hasPassword || false,
            }));
          } catch (e) {
            console.error('Error parsing user:', e);
          }
        }
      }
    } catch (error) {
      console.error('Error checking password:', error);
      setPasswordData(prev => ({
        ...prev,
        hasOldPassword: false,
      }));
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(user);
      setUserData(parsedUser);
      setEditData({
        fullName: parsedUser.fullName || '',
        birthDate: parsedUser.birthDate || '',
      });
      checkIfUserHasPassword();
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = userData._id;

      if (!token || !userId) {
        throw new Error('اطلاعات کاربر یافت نشد');
      }

      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
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
        throw new Error('خطا در دریافت اطلاعات کاربر');
      }

      const result = await response.json();
      const user = result.user || result.data || result;
      
      setUserData(user);
      setEditData({
        fullName: user.fullName || '',
        birthDate: user.birthDate || '',
      });
      
      localStorage.setItem('user', JSON.stringify(user));
      setSuccess('اطلاعات با موفقیت به‌روزرسانی شد');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError('');
    setSuccess('');
    if (!isEditing) {
      setEditData({
        fullName: userData.fullName || '',
        birthDate: userData.birthDate || '',
      });
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const userId = userData._id;

      if (!token || !userId) {
        throw new Error('اطلاعات کاربر یافت نشد');
      }

      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: editData.fullName,
          birthDate: editData.birthDate,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
          throw new Error('نشست شما منقضی شده است');
        }
        throw new Error(result.message || 'خطا در ویرایش اطلاعات');
      }

      const updatedUser = result.user || result.data || result;
      setUserData(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setSuccess('اطلاعات با موفقیت به‌روزرسانی شد');
      setIsEditing(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      setError('لطفاً رمز عبور جدید و تکرار آن را وارد کنید');
      setSaving(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('رمز عبور جدید باید حداقل ۶ کاراکتر باشد');
      setSaving(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('رمز عبور جدید و تکرار آن مطابقت ندارند');
      setSaving(false);
      return;
    }

    if (passwordData.hasOldPassword && !passwordData.oldPassword) {
      setError('لطفاً رمز عبور فعلی را وارد کنید');
      setSaving(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const userId = userData._id;
      
      if (!token) {
        navigate('/login');
        throw new Error('لطفاً وارد حساب خود شوید');
      }

      if (!userId) {
        throw new Error('شناسه کاربر یافت نشد');
      }

      const payload = {
        newPassword: passwordData.newPassword,
      };
      
      if (passwordData.hasOldPassword) {
        payload.oldPassword = passwordData.oldPassword;
      }

      const response = await fetch(`http://localhost:5000/api/users/change-password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        throw new Error('نشست شما منقضی شده است. لطفاً دوباره وارد شوید');
      }

      if (!response.ok) {
        throw new Error(result.message || 'خطا در تغییر رمز عبور');
      }

      setSuccess(passwordData.hasOldPassword 
        ? 'رمز عبور با موفقیت تغییر یافت' 
        : 'رمز عبور با موفقیت تنظیم شد'
      );
      
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        hasOldPassword: true,
      });
      
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.hasPassword = true;
        localStorage.setItem('user', JSON.stringify(user));
      } catch (e) {
        console.error('Error updating localStorage:', e);
      }
      
      setTabValue(0);
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChangeInput = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
    setSuccess('');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'ثبت نشده';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);
    } catch {
      return 'تاریخ نامعتبر';
    }
  };

  const getInitials = () => {
    const name = userData.fullName || userData.phoneNumber || 'کاربر';
    return name.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <CircularProgress sx={{ color: '#FF8C00' }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4, direction: 'rtl' }}>
      <StyledPaper elevation={0}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4, position: 'relative', zIndex: 1 }}>
          <ProfileAvatar>
            {getInitials()}
          </ProfileAvatar>
          
          <Typography 
            variant="h4" 
            fontWeight={800} 
            sx={{ 
              mt: 2,
              background: 'linear-gradient(135deg, #FF6F00, #FF8C00)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {userData.fullName || 'کاربر'}
          </Typography>
          
          <Stack 
            direction="row" 
            spacing={1} 
            justifyContent="center" 
            sx={{ mt: 1.5, flexWrap: 'wrap', gap: 1 }}
          >
            <Chip
              icon={<Phone sx={{ fontSize: 16 }} />}
              label={userData.phoneNumber}
              variant="outlined"
              size="medium"
              sx={{ 
                borderRadius: 2,
                borderColor: 'rgba(255,140,0,0.3)',
                color: theme.palette.mode === 'dark' ? '#fff' : '#000',
              }}
            />
            
            {userData.role === 'admin' && (
              <StatusChip
                icon={<AdminPanelSettings sx={{ fontSize: 16 }} />}
                label="مدیر فروشگاه"
                status="admin"
              />
            )}
            
            <StatusChip
              icon={<VerifiedUser sx={{ fontSize: 16 }} />}
              label={userData.isActive ? 'فعال' : 'غیرفعال'}
              status={userData.isActive ? 'active' : 'inactive'}
            />
          </Stack>
        </Box>

        <Divider sx={{ my: 3 }}>
          <Chip 
            label="پروفایل کاربری" 
            size="small"
            sx={{ 
              borderRadius: 2,
              fontWeight: 600,
              color: '#FF8C00',
              backgroundColor: 'rgba(255,140,0,0.1)',
            }}
          />
        </Divider>

        {/* Tabs */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{
            mb: 4,
            '& .MuiTab-root': {
              fontWeight: 600,
              fontSize: '0.95rem',
              textTransform: 'none',
              minWidth: 120,
              borderRadius: 2,
              transition: 'all 0.3s ease',
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
          <Tab label="اطلاعات شخصی" icon={<Person />} iconPosition="start" />
          <Tab 
            label={passwordData.hasOldPassword ? 'تغییر رمز عبور' : 'تنظیم رمز عبور'} 
            icon={<Lock />} 
            iconPosition="start" 
          />
        </Tabs>

        {/* Alerts */}
        {(error || success) && (
          <Alert 
            severity={error ? 'error' : 'success'} 
            sx={{ 
              mb: 3, 
              borderRadius: 3,
              backgroundColor: error 
                ? 'rgba(244,67,54,0.08)' 
                : 'rgba(76,175,80,0.08)',
              border: `1px solid ${error ? 'rgba(244,67,54,0.2)' : 'rgba(76,175,80,0.2)'}`,
            }}
          >
            {error || success}
          </Alert>
        )}

        {/* Tab 1: Personal Info */}
        {tabValue === 0 && (
          <Box>
            {!isEditing ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <InfoItem>
                  <InfoLabel>
                    <Badge sx={{ color: '#FF8C00', fontSize: 20 }} />
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                      نام کامل:
                    </Typography>
                  </InfoLabel>
                  <InfoValue>
                    {userData.fullName || 'ثبت نشده'}
                  </InfoValue>
                </InfoItem>

                <InfoItem>
                  <InfoLabel>
                    <Phone sx={{ color: '#FF8C00', fontSize: 20 }} />
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                      شماره موبایل:
                    </Typography>
                  </InfoLabel>
                  <InfoValue>
                    {userData.phoneNumber || 'ثبت نشده'}
                  </InfoValue>
                </InfoItem>

                <InfoItem>
                  <InfoLabel>
                    <Cake sx={{ color: '#FF8C00', fontSize: 20 }} />
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                      تاریخ تولد:
                    </Typography>
                  </InfoLabel>
                  <InfoValue>
                    {formatDate(userData.birthDate)}
                  </InfoValue>
                </InfoItem>

                <InfoItem>
                  <InfoLabel>
                    <Badge sx={{ color: '#FF8C00', fontSize: 20 }} />
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                      نقش کاربری:
                    </Typography>
                  </InfoLabel>
                  <InfoValue>
                    {userData.role === 'admin' ? 'مدیر' : 'کاربر عادی'}
                  </InfoValue>
                </InfoItem>

                <Box sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  mt: 2,
                }}>
                  <ActionButton
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={handleEditToggle}
                    sx={{
                      background: 'linear-gradient(135deg, #FF6F00, #FF8C00)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #E65100, #FF6F00)',
                      },
                      minWidth: 160,
                    }}
                  >
                    ویرایش اطلاعات
                  </ActionButton>
                  
                  <ActionButton
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={fetchUserData}
                    sx={{
                      borderColor: '#FF8C00',
                      color: '#FF8C00',
                      '&:hover': {
                        borderColor: '#E65100',
                        backgroundColor: 'rgba(255,140,0,0.08)',
                      },
                      minWidth: 160,
                    }}
                  >
                    به‌روزرسانی
                  </ActionButton>
                </Box>
              </Box>
            ) : (
              <Box>
                <SectionTitle variant="h6">
                  <Edit sx={{ fontSize: 24 }} />
                  ویرایش اطلاعات
                </SectionTitle>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <StyledTextField
                      fullWidth
                      label="نام کامل"
                      name="fullName"
                      value={editData.fullName}
                      onChange={handleEditChange}
                      placeholder="نام و نام خانوادگی خود را وارد کنید"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Badge sx={{ color: '#FF8C00' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <StyledTextField
                      fullWidth
                      label="تاریخ تولد"
                      name="birthDate"
                      type="date"
                      value={editData.birthDate}
                      onChange={handleEditChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Cake sx={{ color: '#FF8C00' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ 
                  mt: 4, 
                  display: 'flex', 
                  gap: 2, 
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}>
                  <ActionButton
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSaveProfile}
                    disabled={saving}
                    sx={{
                      background: 'linear-gradient(135deg, #FF6F00, #FF8C00)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #E65100, #FF6F00)',
                      },
                      '&.Mui-disabled': {
                        backgroundColor: 'rgba(255,140,0,0.3)',
                      },
                      minWidth: 160,
                    }}
                  >
                    {saving ? (
                      <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : (
                      'ذخیره تغییرات'
                    )}
                  </ActionButton>
                  
                  <ActionButton
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleEditToggle}
                    sx={{
                      borderColor: '#f44336',
                      color: '#f44336',
                      '&:hover': {
                        borderColor: '#d32f2f',
                        backgroundColor: 'rgba(244,67,54,0.08)',
                      },
                      minWidth: 160,
                    }}
                  >
                    انصراف
                  </ActionButton>
                </Box>
              </Box>
            )}
          </Box>
        )}

        {/* Tab 2: Change Password */}
        {tabValue === 1 && (
          <Box>
            <SectionTitle variant="h6">
              <Lock sx={{ fontSize: 24 }} />
              {passwordData.hasOldPassword ? 'تغییر رمز عبور' : 'تنظیم رمز عبور'}
            </SectionTitle>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {passwordData.hasOldPassword 
                ? 'برای تغییر رمز عبور، رمز فعلی و رمز جدید را وارد کنید'
                : 'برای تنظیم رمز عبور جدید، رمز مورد نظر را وارد کنید'
              }
            </Typography>

            <Grid container spacing={3}>
              {passwordData.hasOldPassword && (
                <Grid item xs={12}>
                  <StyledTextField
                    fullWidth
                    label="رمز عبور فعلی"
                    name="oldPassword"
                    type={showOldPassword ? 'text' : 'password'}
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChangeInput}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: '#FF8C00' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton 
                            onClick={() => setShowOldPassword(!showOldPassword)} 
                            edge="end"
                            sx={{ color: 'text.secondary' }}
                          >
                            {showOldPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              )}
              
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="رمز عبور جدید"
                  name="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={handlePasswordChangeInput}
                  helperText="رمز عبور باید حداقل ۶ کاراکتر باشد"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: '#FF8C00' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton 
                          onClick={() => setShowNewPassword(!showNewPassword)} 
                          edge="end"
                          sx={{ color: 'text.secondary' }}
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="تکرار رمز عبور جدید"
                  name="confirmPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChangeInput}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: '#FF8C00' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Box sx={{ 
              mt: 4, 
              display: 'flex', 
              gap: 2, 
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}>
              <ActionButton
                variant="contained"
                startIcon={<Save />}
                onClick={handlePasswordChange}
                disabled={saving}
                sx={{
                  background: 'linear-gradient(135deg, #FF6F00, #FF8C00)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #E65100, #FF6F00)',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: 'rgba(255,140,0,0.3)',
                  },
                  minWidth: 160,
                }}
              >
                {saving ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  passwordData.hasOldPassword ? 'تغییر رمز عبور' : 'تنظیم رمز عبور'
                )}
              </ActionButton>
              
              <ActionButton
                variant="outlined"
                onClick={() => {
                  setPasswordData(prev => ({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                    hasOldPassword: prev.hasOldPassword,
                  }));
                  setError('');
                  setSuccess('');
                }}
                sx={{
                  borderColor: '#f44336',
                  color: '#f44336',
                  '&:hover': {
                    borderColor: '#d32f2f',
                    backgroundColor: 'rgba(244,67,54,0.08)',
                  },
                  minWidth: 160,
                }}
              >
                پاک کردن
              </ActionButton>
            </Box>
          </Box>
        )}
      </StyledPaper>
    </Container>
  );
}