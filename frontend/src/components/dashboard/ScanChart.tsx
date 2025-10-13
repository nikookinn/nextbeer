import { Box, CircularProgress, Typography, useTheme, Paper, alpha } from '@mui/material';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { HourlyChartData, DailyChartData } from '../../types/dashboard.types';

interface ScanChartProps {
  data: (HourlyChartData | DailyChartData)[];
  loading?: boolean;
  type: 'hourly' | 'daily';
  height?: number;
}

// Modern Premium Chart Component with Recharts
const ModernChart: React.FC<{ data: any[]; type: string }> = ({ data, type }) => {
  const theme = useTheme();
  
  // Gradient definitions
  const gradientId = `gradient-${type}`;
  
  // Modern Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const formatLabel = () => {
        if (type === 'hourly') {
          const hour = parseInt(label);
          if (hour === 0) return '12:00 AM';
          if (hour === 12) return '12:00 PM';
          if (hour < 12) return `${hour}:00 AM`;
          return `${hour - 12}:00 PM`;
        }
        // Tarih formatı için
        const date = new Date(label);
        return date.toLocaleDateString('tr-TR', { 
          weekday: 'short',
          month: 'short', 
          day: 'numeric' 
        });
      };

      return (
        <Paper
          sx={{
            p: 2.5,
            background: alpha(theme.palette.background.paper, 0.98),
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
            borderRadius: 3,
            boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.25)}`,
            minWidth: 120,
          }}
        >
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            {formatLabel()}
          </Typography>
          <Typography 
            variant="h5" 
            color="primary" 
            fontWeight={700}
            sx={{ 
              mt: 0.5,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {payload[0].value.toLocaleString()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {type === 'hourly' ? 'bu saatdakı skanlar' : 'bu gündəki skanlar'}
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  // Professional Apple/Figma Chart colors
  const chartColors = {
    primary: theme.palette.mode === 'light' ? '#007AFF' : '#0A84FF', // Apple Blue
    secondary: theme.palette.mode === 'light' ? '#34C759' : '#30D158', // Apple Green
    gradient1: theme.palette.mode === 'light' ? '#5AC8FA' : '#64D2FF', // Apple Light Blue
    gradient2: theme.palette.mode === 'light' ? 'rgba(0, 122, 255, 0.1)' : 'rgba(10, 132, 255, 0.1)', // Apple Blue with opacity
  };

  if (data.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: 400,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        borderRadius: 3
      }}>
        <Typography variant="h4" sx={{ mb: 2, opacity: 0.7 }}>📊</Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Məlumat Mövcud Deyil
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Məlumat mövcud olduqda qrafik görünəcək
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      p: { xs: 1.5, sm: 2, md: 3 },
      background: theme.palette.mode === 'light'
        ? 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F7 100%)'
        : 'linear-gradient(135deg, #1C1C1E 0%, #000000 100%)',
      borderRadius: 3,
      border: theme.palette.mode === 'light'
        ? '1px solid #E5E5E7'
        : '1px solid #2C2C2E',
      boxShadow: theme.palette.mode === 'light'
        ? '0 2px 8px rgba(0, 0, 0, 0.1)'
        : '0 2px 8px rgba(0, 0, 0, 0.3)',
      width: '100%',
      overflow: 'hidden', 
      position: 'relative'
    }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{
          width: 3,
          height: 20,
          backgroundColor: chartColors.primary,
          borderRadius: 1.5
        }} />
        <Typography variant="h6" fontWeight={600} color="text.primary">
          {type === 'hourly' ? '🌊 Saatlıq Axın Analitikası' : '📈 Günlük Performans'}
        </Typography>
      </Box>
      
      <ResponsiveContainer 
        width="100%" 
        height={280}
      >
        {type === 'hourly' ? (
          <AreaChart 
            data={data} 
            margin={{ 
              top: 15, 
              right: 15,
              left: 10, 
              bottom: 35
            }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColors.primary} stopOpacity={0.8} />
                <stop offset="30%" stopColor={chartColors.secondary} stopOpacity={0.6} />
                <stop offset="100%" stopColor={chartColors.gradient2} stopOpacity={0.1} />
              </linearGradient>
              {/* Glow effect için ikinci gradient */}
              <linearGradient id={`${gradientId}-glow`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColors.primary} stopOpacity={0.3} />
                <stop offset="100%" stopColor={chartColors.secondary} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={alpha(theme.palette.text.secondary, 0.1)}
              vertical={false}
            />
            <XAxis 
              dataKey="hour" 
              axisLine={false}
              tickLine={false}
              tick={{ 
                fill: theme.palette.text.secondary, 
                fontSize: 10,
                fontWeight: 500
              }}
              tickFormatter={(value: number) => {
                // Mobile için daha kısa format
                if (value === 0) return '12A';
                if (value === 12) return '12P';
                if (value < 12) return `${value}A`;
                return `${value - 12}P`;
              }}
              interval={3}
              angle={-30}
              textAnchor="end"
              height={40}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ 
                fill: theme.palette.text.secondary, 
                fontSize: 10
              }}
              width={35}
              tickFormatter={(value: number) => {
                if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                return value.toString();
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            {/* Main area chart */}
            <Area
              type="monotone"
              dataKey="scans"
              stroke={chartColors.primary}
              strokeWidth={3}
              fill={`url(#${gradientId})`}
              dot={{ 
                fill: chartColors.primary, 
                strokeWidth: 3, 
                stroke: theme.palette.background.paper,
                r: 5,
                filter: `drop-shadow(0 0 6px ${alpha(chartColors.primary, 0.6)})`
              }}
              activeDot={{ 
                r: 8, 
                fill: chartColors.secondary,
                stroke: theme.palette.background.paper,
                strokeWidth: 3,
                filter: `drop-shadow(0 0 10px ${alpha(chartColors.secondary, 0.8)})`
              }}
            />
            {/* Second layer - glow effect */}
            <Area
              type="monotone"
              dataKey="scans"
              stroke="none"
              fill={`url(#${gradientId}-glow)`}
              strokeWidth={0}
            />
          </AreaChart>
        ) : (
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColors.primary} stopOpacity={0.6} />
                <stop offset="100%" stopColor={chartColors.gradient2} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={alpha(theme.palette.text.secondary, 0.1)}
              vertical={false}
            />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ 
                fill: theme.palette.text.secondary, 
                fontSize: 11,
                fontWeight: 500
              }}
              tickFormatter={(value: string) => {
                const date = new Date(value);
                return date.toLocaleDateString('tr-TR', { 
                  month: 'short', 
                  day: 'numeric' 
                });
              }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ 
                fill: theme.palette.text.secondary, 
                fontSize: 10
              }}
              width={35}
              tickFormatter={(value: number) => {
                if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                return value.toString();
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="scans"
              stroke={chartColors.primary}
              strokeWidth={3}
              fill={`url(#${gradientId})`}
              dot={{ 
                fill: chartColors.primary, 
                strokeWidth: 2, 
                stroke: theme.palette.background.paper,
                r: 6
              }}
              activeDot={{ 
                r: 8, 
                fill: chartColors.secondary,
                stroke: theme.palette.background.paper,
                strokeWidth: 2
              }}
            />
          </AreaChart>
        )}
      </ResponsiveContainer>
      
      {/* Chart Legend */}
      <Box sx={{ 
        mt: 2, 
        display: 'flex', 
        justifyContent: 'center',
        gap: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: chartColors.primary
          }} />
          <Typography variant="caption" color="text.secondary">
            {type === 'hourly' ? 'Saatlıq Skanlar' : 'Günlük Skanlar'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: `linear-gradient(45deg, ${chartColors.primary}, ${chartColors.secondary})`
          }} />
          <Typography variant="caption" color="text.secondary">
            Trend Analizi
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const ScanChart: React.FC<ScanChartProps> = ({ 
  data, 
  loading = false, 
  type,
  height = 400 
}) => {

  const chartData = data.map((item) => {
    if (type === 'hourly') {
      const hourlyItem = item as HourlyChartData;
      return {
        hour: hourlyItem.hour,
        scans: hourlyItem.scans,
      };
    } else {
      const dailyItem = item as DailyChartData;
      return {
        date: dailyItem.date,
        scans: dailyItem.scans,
      };
    }
  });

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: { xs: 250, sm: height },
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: { xs: 250, sm: height },
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Məlumat mövcud deyil
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Skan məlumatları mövcud olduqda burada görünəcək
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100%',
      height: 'auto',
      minHeight: { xs: 350, sm: 400 },
      overflow: 'visible',
    }}>
      <ModernChart data={chartData} type={type} />
    </Box>
  );
};

export default ScanChart;
