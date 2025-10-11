import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Container,
  useTheme,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { ChefHat } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { useLoginMutation } from '../../api/authApi';
import { setCredentials, setError } from './authSlice';
import { LoginRequest } from '../../types/auth.types';

const LoginPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated, error: authError } = useAppSelector((state) => state.auth);
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || '/admin/dashboard';

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const onSubmit = async (data: LoginRequest) => {
    try {
      dispatch(setError(null));
      const response = await login(data).unwrap();
      dispatch(setCredentials(response));
      navigate(from, { replace: true });
    } catch (error: any) {
      dispatch(setError(error?.data?.message || 'Yanlış istifadəçi adı və ya şifrə'));
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.palette.mode === 'light'
          ? 'linear-gradient(135deg, #F5F5F7 0%, #E5E5E7 100%)'
          : 'linear-gradient(135deg, #000000 0%, #1C1C1E 100%)',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Card
            sx={{
              position: 'relative',
              overflow: 'hidden',
              background: theme.palette.mode === 'light' 
                ? 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F7 100%)'
                : 'linear-gradient(135deg, #1C1C1E 0%, #000000 100%)',
              border: theme.palette.mode === 'light'
                ? '1px solid #E5E5E7'
                : '1px solid #2C2C2E',
              borderRadius: 3,
              boxShadow: theme.palette.mode === 'light'
                ? '0 8px 32px rgba(0, 0, 0, 0.12)'
                : '0 8px 32px rgba(0, 0, 0, 0.4)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: theme.palette.mode === 'light'
                  ? 'linear-gradient(90deg, #007AFF, #34C759, #FF9500)'
                  : 'linear-gradient(90deg, #0A84FF, #30D158, #FF9F0A)',
              },
            }}
          >
            <CardContent sx={{ p: 4, position: 'relative' }}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: theme.palette.mode === 'light'
                        ? 'linear-gradient(135deg, #007AFF 0%, #34C759 100%)'
                        : 'linear-gradient(135deg, #0A84FF 0%, #30D158 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      mb: 3,
                      boxShadow: theme.palette.mode === 'light'
                        ? '0 4px 16px rgba(0, 122, 255, 0.3)'
                        : '0 4px 16px rgba(10, 132, 255, 0.4)',
                    }}
                  >
                    <ChefHat size={40} color="white" />
                  </Box>
                  <Typography 
                    variant="h4" 
                    fontWeight="bold" 
                    gutterBottom
                    sx={{
                      background: theme.palette.mode === 'light'
                        ? 'linear-gradient(135deg, #1A1A1A, #007AFF)'
                        : 'linear-gradient(135deg, #FFFFFF, #0A84FF)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Xoş Gəlmisiniz
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                    İdarəçi panelinizə daxil olmaq üçün giriş edin
                  </Typography>
                </Box>
              </motion.div>

              {authError && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mb: 3,
                      borderRadius: 2,
                      '& .MuiAlert-icon': {
                        color: theme.palette.mode === 'light' ? '#FF3B30' : '#FF453A',
                      }
                    }}
                  >
                    {authError}
                  </Alert>
                </motion.div>
              )}

              <motion.form 
                onSubmit={handleSubmit(onSubmit)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <Controller
                  name="username"
                  control={control}
                  rules={{
                    required: 'İstifadəçi adı tələb olunur',
                    minLength: {
                      value: 3,
                      message: 'İstifadəçi adı ən azı 3 simvol olmalıdır',
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="İstifadəçi Adı"
                      variant="outlined"
                      margin="normal"
                      error={!!errors.username}
                      helperText={errors.username?.message}
                      autoComplete="username"
                      autoFocus
                      sx={{ 
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.mode === 'light' ? '#007AFF' : '#0A84FF',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.mode === 'light' ? '#007AFF' : '#0A84FF',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: theme.palette.mode === 'light' ? '#007AFF' : '#0A84FF',
                        },
                      }}
                    />
                  )}
                />

                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: 'Şifrə tələb olunur',
                    minLength: {
                      value: 6,
                      message: 'Şifrə ən azı 6 simvol olmalıdır',
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Şifrə"
                      type={showPassword ? 'text' : 'password'}
                      variant="outlined"
                      margin="normal"
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      autoComplete="current-password"
                      sx={{ 
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.mode === 'light' ? '#007AFF' : '#0A84FF',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.mode === 'light' ? '#007AFF' : '#0A84FF',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: theme.palette.mode === 'light' ? '#007AFF' : '#0A84FF',
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="şifrə görünürlüyünü dəyiş"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              sx={{
                                color: theme.palette.mode === 'light' ? '#007AFF' : '#0A84FF',
                              }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      background: theme.palette.mode === 'light'
                        ? 'linear-gradient(135deg, #007AFF 0%, #34C759 100%)'
                        : 'linear-gradient(135deg, #0A84FF 0%, #30D158 100%)',
                      '&:hover': {
                        background: theme.palette.mode === 'light'
                          ? 'linear-gradient(135deg, #0056CC 0%, #28A745 100%)'
                          : 'linear-gradient(135deg, #0066CC 0%, #248A3D 100%)',
                        transform: 'translateY(-1px)',
                        boxShadow: theme.palette.mode === 'light'
                          ? '0 4px 16px rgba(0, 122, 255, 0.3)'
                          : '0 4px 16px rgba(10, 132, 255, 0.4)',
                      },
                      '&:disabled': {
                        background: theme.palette.action.disabledBackground,
                      },
                      fontWeight: 600,
                      fontSize: '1rem',
                      textTransform: 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Daxil Ol'
                    )}
                  </Button>
                </motion.div>
              </motion.form>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default LoginPage;
