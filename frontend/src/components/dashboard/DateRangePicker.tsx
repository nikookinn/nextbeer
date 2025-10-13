import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  useTheme,
  alpha,
  Popover,
  IconButton,
  Divider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { tr } from 'date-fns/locale';
import { format } from 'date-fns';
import { Calendar, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateRangeChange: (startDate: Date | null, endDate: Date | null) => void;
  onClear?: () => void; // Clear callback added
  disabled?: boolean;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onDateRangeChange,
  onClear,
  disabled = false,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [tempStartDate, setTempStartDate] = useState<Date | null>(startDate);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(endDate);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      setAnchorEl(event.currentTarget);
      setTempStartDate(startDate);
      setTempEndDate(endDate);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    // Reset temp values
    setTempStartDate(startDate);
    setTempEndDate(endDate);
  };

  const handleApply = () => {
    onDateRangeChange(tempStartDate, tempEndDate);
    setAnchorEl(null);
  };

  const handleClear = () => {
    setTempStartDate(null);
    setTempEndDate(null);
    onDateRangeChange(null, null);
    // Call clear callback for hours tab
    if (onClear) {
      onClear();
    }
    setAnchorEl(null);
  };

  const formatDateRange = () => {
    if (!startDate && !endDate) {
      return 'Tarix Aralığı Seçin';
    }
    
    if (startDate && !endDate) {
      return `${format(startDate, 'dd MMM yyyy', { locale: tr })} - ...`;
    }
    
    if (!startDate && endDate) {
      return `... - ${format(endDate, 'dd MMM yyyy', { locale: tr })}`;
    }
    
    if (startDate && endDate) {
      return `${format(startDate, 'dd MMM yyyy', { locale: tr })} - ${format(endDate, 'dd MMM yyyy', { locale: tr })}`;
    }
    
    return 'Tarix Aralığı Seçin';
  };

  const isDateRangeSelected = startDate && endDate;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
      <Box>
        <Button
          onClick={handleClick}
          disabled={disabled}
          startIcon={<Calendar size={18} />}
          sx={{
            borderRadius: 3,
            px: 3,
            py: 1.5,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.875rem',
            background: theme.palette.mode === 'light'
              ? 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F7 100%)'
              : 'linear-gradient(135deg, #1C1C1E 0%, #000000 100%)',
            border: theme.palette.mode === 'light'
              ? '1px solid #E5E5E7'
              : '1px solid #2C2C2E',
            color: theme.palette.text.primary,
            boxShadow: theme.palette.mode === 'light'
              ? '0 2px 8px rgba(0, 0, 0, 0.1)'
              : '0 2px 8px rgba(0, 0, 0, 0.3)',
            '&:hover': {
              background: theme.palette.mode === 'light'
                ? 'linear-gradient(135deg, #F5F5F7 0%, #E5E5E7 100%)'
                : 'linear-gradient(135deg, #2C2C2E 0%, #1C1C1E 100%)',
              transform: 'translateY(-1px)',
              boxShadow: theme.palette.mode === 'light'
                ? '0 4px 12px rgba(0, 0, 0, 0.15)'
                : '0 4px 12px rgba(0, 0, 0, 0.4)',
            },
            '&:disabled': {
              opacity: 0.6,
            },
            transition: 'all 0.2s ease',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography 
              variant="body2" 
              fontWeight={600}
              sx={{
                color: isDateRangeSelected 
                  ? theme.palette.primary.main 
                  : theme.palette.text.primary
              }}
            >
              {formatDateRange()}
            </Typography>
            {isDateRangeSelected && (
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.primary.main,
                  ml: 1,
                }}
              />
            )}
          </Box>
        </Button>

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          sx={{
            '& .MuiPopover-paper': {
              mt: 1,
              borderRadius: 3,
              overflow: 'hidden',
              background: theme.palette.mode === 'light'
                ? 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F7 100%)'
                : 'linear-gradient(135deg, #1C1C1E 0%, #000000 100%)',
              border: theme.palette.mode === 'light'
                ? '1px solid #E5E5E7'
                : '1px solid #2C2C2E',
              boxShadow: theme.palette.mode === 'light'
                ? '0 8px 32px rgba(0, 0, 0, 0.12)'
                : '0 8px 32px rgba(0, 0, 0, 0.4)',
            },
          }}
        >
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Paper
                  sx={{
                    p: 3,
                    width: { xs: 320, sm: 400 },
                    background: 'transparent',
                    boxShadow: 'none',
                  }}
                >
                  {/* Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6" fontWeight={700} color="text.primary">
                      📅 Tarix Aralığı Seçin
                    </Typography>
                    <IconButton
                      onClick={handleClose}
                      size="small"
                      sx={{
                        color: theme.palette.text.secondary,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.text.secondary, 0.1),
                        },
                      }}
                    >
                      <X size={18} />
                    </IconButton>
                  </Box>

                  {/* Date Pickers */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <DatePicker
                      label="Başlama Tarixi"
                      value={tempStartDate}
                      onChange={(newValue) => setTempStartDate(newValue)}
                      maxDate={tempEndDate || undefined}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: 'outlined',
                          sx: {
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: alpha(theme.palette.background.paper, 0.5),
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: theme.palette.primary.main,
                              },
                            },
                          },
                        },
                      }}
                    />

                    <DatePicker
                      label="Bitmə Tarixi"
                      value={tempEndDate}
                      onChange={(newValue) => setTempEndDate(newValue)}
                      minDate={tempStartDate || undefined}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: 'outlined',
                          sx: {
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: alpha(theme.palette.background.paper, 0.5),
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: theme.palette.primary.main,
                              },
                            },
                          },
                        },
                      }}
                    />
                  </Box>

                  <Divider sx={{ my: 3, borderColor: alpha(theme.palette.text.secondary, 0.1) }} />

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                      onClick={handleClear}
                      variant="outlined"
                      size="small"
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        borderColor: alpha(theme.palette.text.secondary, 0.3),
                        color: theme.palette.text.secondary,
                        '&:hover': {
                          borderColor: theme.palette.text.secondary,
                          backgroundColor: alpha(theme.palette.text.secondary, 0.05),
                        },
                      }}
                    >
                      Təmizlə
                    </Button>
                    <Button
                      onClick={handleApply}
                      variant="contained"
                      size="small"
                      startIcon={<Check size={16} />}
                      disabled={!tempStartDate || !tempEndDate}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                        '&:hover': {
                          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                          boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
                        },
                        '&:disabled': {
                          background: alpha(theme.palette.text.secondary, 0.2),
                          color: alpha(theme.palette.text.secondary, 0.5),
                          boxShadow: 'none',
                        },
                      }}
                    >
                      Aralığı Tətbiq Et
                    </Button>
                  </Box>
                </Paper>
              </motion.div>
            )}
          </AnimatePresence>
        </Popover>
      </Box>
    </LocalizationProvider>
  );
};

export default DateRangePicker;
