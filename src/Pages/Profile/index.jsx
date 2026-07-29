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
} from '@mui/material';
import {
  Person,
  Edit,
  Save,
  Cancel,
  Phone,
  Cake,
  Badge,
  Lock,
  Visibility,
  VisibilityOff,
  AdminPanelSettings,
  VerifiedUser,
  Refresh,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(20, 20, 20, 0.85)' 
    : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 25px 50px -12px rgba(0, 0, 0, 0.9)'
    : '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: `4px solid ${theme.palette.mode === 'dark' ? 'rgba(255,140,0,0.3)' : 'rgba(255,140,0,0.2)'}`,
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,140,0,0.2)' : 'rgba(255,140,0,0.1)',
  fontSize: '3rem',
  fontWeight: 700,
  color: '#FF8C00',
  margin: '0 auto',
  boxShadow: '0 8px 32px rgba(255,140,0,0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 12px 40px rgba(255,140,0,0.3)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(255,255,255,0.05)' 
      : 'rgba(0,0,0,0.02)',
    '& fieldset': {
      borderColor: theme.palette.mode === 'dark' 
        ? 'rgba(255,255,255,0.1)' 
        : 'rgba(0,0,0,0.1)',
    },
    '&:hover fieldset': {
      borderColor: '#FF8C00',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FF8C00',
      borderWidth: 2,
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.mode === 'dark' 
      ? 'rgba(255,255,255,0.6)' 
      : 'rgba(0,0,0,0.6)',
    '&.Mui-focused': {
      color: '#FF8C00',
    },
  },
  '& .MuiInputBase-input': {
    color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: '12px 32px',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '1rem',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(255,140,0,0.3)',
  },
}));

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // State برای اطلاعات کاربر
  const [userData, setUserData] = useState({
    _id: '',
    fullName: '',
    phoneNumber: '',
    email: '',
    birthDate: '',
    role: 'user',
    isActive: true,
    addressIds: [],
    favoriteProductIds: [],
    boughtProductIds: [],
    ratedProductIds: [],
    createdAt: '',
    updatedAt: '',
  });

  // State برای ویرایش
  const [editData, setEditData] = useState({
    fullName: '',
    birthDate: '',
  });

  // State برای تغییر رمز عبور
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // دریافت اطلاعات کاربر از localStorage
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
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // دریافت اطلاعات از سرور
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = userData._id;

      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('خطا در دریافت اطلاعات کاربر');
      }

      const result = await response.json();
      const user = result.user || result.data || result;
      
      setUserData(user);
      setEditData({
        fullName: user.fullName || '',
        birthDate: user.birthDate || '',
      });
      
      // به‌روزرسانی localStorage
      localStorage.setItem('user', JSON.stringify(user));
      setSuccess('اطلاعات با موفقیت به‌روزرسانی شد');
    } catch (error) {
      setError(error.message);
    }
  };

  // ویرایش اطلاعات
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

  // تغییر رمز عبور
  const handlePasswordChange = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    // اعتبارسنجی
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError('لطفاً تمام فیلدها را پر کنید');
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

    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5000/api/users/change-password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'خطا در تغییر رمز عبور');
      }

      setSuccess('رمز عبور با موفقیت تغییر یافت');
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
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

  // ✅ فرمت تاریخ با Intl.DateTimeFormat (اصلاح شده)
  const formatDate = (dateString) => {
    if (!dateString) return 'ثبت نشده';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch (error) {
      return 'تاریخ نامعتبر';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#FF8C00' }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4, direction: 'rtl' }}>
      <StyledPaper elevation={0}>
        {/* هدر پروفایل */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <ProfileAvatar>
            {userData.fullName?.charAt(0)?.toUpperCase() || userData.phoneNumber?.charAt(0)?.toUpperCase() || 'U'}
          </ProfileAvatar>
          <Typography variant="h4" fontWeight={700} sx={{ mt: 2, color: '#FF8C00' }}>
            {userData.fullName || 'کاربر'}
          </Typography>
          <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}>
            <Chip
              icon={<Phone sx={{ fontSize: 16 }} />}
              label={userData.phoneNumber}
              size="small"
              sx={{ borderRadius: 2 }}
            />
            {userData.role === 'admin' && (
              <Chip
                icon={<AdminPanelSettings sx={{ fontSize: 16 }} />}
                label="مدیر"
                color="warning"
                size="small"
                sx={{ borderRadius: 2 }}
              />
            )}
            <Chip
              icon={<VerifiedUser sx={{ fontSize: 16 }} />}
              label={userData.isActive ? 'فعال' : 'غیرفعال'}
              color={userData.isActive ? 'success' : 'error'}
              size="small"
              sx={{ borderRadius: 2 }}
            />
          </Stack>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* تب‌ها */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{
            mb: 3,
            '& .MuiTab-root': {
              fontWeight: 600,
              fontSize: '1rem',
              textTransform: 'none',
              '&.Mui-selected': {
                color: '#FF8C00',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#FF8C00',
            },
          }}
        >
          <Tab label="اطلاعات شخصی" icon={<Person />} iconPosition="start" />
          <Tab label="تغییر رمز عبور" icon={<Lock />} iconPosition="start" />
        </Tabs>

        {/* نمایش خطا و موفقیت */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
            {success}
          </Alert>
        )}

        {/* تب اطلاعات شخصی */}
        {tabValue === 0 && (
          <Box>
            {!isEditing ? (
              // نمایش اطلاعات
              <Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                      نام کامل
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {userData.fullName || 'ثبت نشده'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                      شماره موبایل
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {userData.phoneNumber || 'ثبت نشده'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                      تاریخ تولد
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {formatDate(userData.birthDate)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                      نقش
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {userData.role === 'admin' ? 'مدیر' : 'کاربر'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                      تاریخ عضویت
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {formatDate(userData.createdAt)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                      آخرین به‌روزرسانی
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {formatDate(userData.updatedAt)}
                    </Typography>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
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
                        backgroundColor: 'rgba(255,140,0,0.05)',
                      },
                    }}
                  >
                    به‌روزرسانی
                  </ActionButton>
                </Box>
              </Box>
            ) : (
              // حالت ویرایش
              <Box>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: '#FF8C00' }}>
                  ویرایش اطلاعات
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <StyledTextField
                      fullWidth
                      label="نام کامل"
                      name="fullName"
                      value={editData.fullName}
                      onChange={handleEditChange}
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

                <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
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
                    }}
                  >
                    {saving ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'ذخیره تغییرات'}
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
                        backgroundColor: 'rgba(244,67,54,0.05)',
                      },
                    }}
                  >
                    انصراف
                  </ActionButton>
                </Box>
              </Box>
            )}
          </Box>
        )}

        {/* تب تغییر رمز عبور */}
        {tabValue === 1 && (
          <Box>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: '#FF8C00' }}>
              تغییر رمز عبور
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              برای تغییر رمز عبور، رمز فعلی و رمز جدید را وارد کنید
            </Typography>

            <Grid container spacing={3}>
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
                        <IconButton onClick={() => setShowOldPassword(!showOldPassword)} edge="end">
                          {showOldPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
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
                        <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
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

            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
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
                }}
              >
                {saving ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'تغییر رمز عبور'}
              </ActionButton>
              <ActionButton
                variant="outlined"
                onClick={() => {
                  setPasswordData({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                  });
                  setError('');
                  setSuccess('');
                }}
                sx={{
                  borderColor: '#f44336',
                  color: '#f44336',
                  '&:hover': {
                    borderColor: '#d32f2f',
                    backgroundColor: 'rgba(244,67,54,0.05)',
                  },
                }}
              >
                پاک کردن
              </ActionButton>
            </Box>
          </Box>
        )}

        {/* اطلاعات اضافی */}
        <Divider sx={{ my: 3 }} />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            شناسه کاربر: {userData._id}
          </Typography>
        </Box>
      </StyledPaper>
    </Container>
  );
}