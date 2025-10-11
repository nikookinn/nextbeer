import {
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import * as colors from '@radix-ui/colors';

interface StatsCardProps {
  title: string;
  value: number;
  loading?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  trend?: 'up' | 'down' | 'flat';
  trendValue?: number;
  prefix?: string;
  suffix?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  loading = false,
  trend,
  trendValue,
  prefix = '',
  suffix = '',
}) => {
  const theme = useTheme();

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp fontSize="small" />;
      case 'down':
        return <TrendingDown fontSize="small" />;
      case 'flat':
      default:
        return null;
    }
  };

  const formatValue = (val: number) => {
    if (val >= 1000000) {
      return `${(val / 1000000).toFixed(1)}M`;
    }
    if (val >= 1000) {
      return `${(val / 1000).toFixed(1)}K`;
    }
    return val.toLocaleString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2, ease: 'easeOut' }
      }}
      style={{ height: '100%' }}
    >
      <Card
        sx={{
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          background: theme.palette.mode === 'light' 
            ? 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F7 100%)'
            : 'linear-gradient(135deg, #1C1C1E 0%, #000000 100%)',
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
        <CardContent sx={{ p: 3, position: 'relative' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                fontSize: '0.75rem',
              }}
            >
              {title}
            </Typography>
            {trend && (
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: trend === 'up' 
                    ? theme.palette.mode === 'light' ? '#E8F5E8' : '#1A2E1A'
                    : theme.palette.mode === 'light' ? '#FFE8E8' : '#2E1A1A',
                  color: trend === 'up' 
                    ? theme.palette.mode === 'light' ? '#34C759' : '#30D158'
                    : theme.palette.mode === 'light' ? '#FF3B30' : '#FF453A',
                }}
              >
                {getTrendIcon()}
              </Box>
            )}
          </Box>

        {loading ? (
          <>
            <Skeleton variant="text" width="60%" height={40} />
            {trend && <Skeleton variant="text" width="40%" height={24} />}
          </>
        ) : (
          <>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <Typography
              variant="h3"
              fontWeight="bold"
              color="text.primary"
              sx={{ 
                mb: 1,
                background: theme.palette.mode === 'light'
                  ? 'linear-gradient(135deg, #1A1A1A, #007AFF)'
                  : 'linear-gradient(135deg, #FFFFFF, #0A84FF)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {prefix}
              {formatValue(value)}
              {suffix}
            </Typography>
          </motion.div>

          {trend && trendValue !== undefined && (
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{
                  color: trend === 'up' 
                    ? theme.palette.mode === 'light' ? colors.green.green11 : colors.greenDark.green11
                    : theme.palette.mode === 'light' ? colors.red.red11 : colors.redDark.red11,
                }}
              >
                {trend === 'up' ? '↗' : '↘'} {trendValue.toFixed(1)}%
              </Typography>
            </motion.div>
          )}
          </>
        )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard;
