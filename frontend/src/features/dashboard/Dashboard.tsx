import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Alert,
} from '@mui/material';
import {
  useGetDashboardStatsMutation,
  useGetHourlyChartDataQuery,
  useGetChartDataMutation,
} from '../../api/dashboardApi';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { setSelectedRange, setCustomDates } from '../../store/slices/dashboardSlice';
import { DateRangeType } from '../../types/dashboard.types';
import StatsCard from '../../components/dashboard/StatsCard';
import ScanChart from '../../components/dashboard/ScanChart';
import DateRangePicker from '../../components/dashboard/DateRangePicker';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabValue, setTabValue] = useState(0);

  const { customDates } = useAppSelector((state) => state.dashboard);
  const { isAuthenticated, accessToken } = useAppSelector((state) => state.auth);

  // Don't make API calls if not logged in
  const skipApiCalls = !isAuthenticated || !accessToken;

  // Mock data removed - show skeleton if no real data

  // Mutation hooks for stats (Spring Backend @RequestBody için)
  const [getTodayStats, { data: todayStats, isLoading: loadingToday }] = useGetDashboardStatsMutation();
  const [getCurrentWeekStats, { data: currentWeekStats, isLoading: loadingCurrentWeek }] = useGetDashboardStatsMutation();
  const [getLastWeekStats, { data: lastWeekStats, isLoading: loadingLastWeek }] = useGetDashboardStatsMutation();
  const [getCurrentMonthStats, { data: currentMonthStats, isLoading: loadingCurrentMonth }] = useGetDashboardStatsMutation();
  const [getLastMonthStats, { data: lastMonthStats, isLoading: loadingLastMonth }] = useGetDashboardStatsMutation();
  const [getCustomStats, { data: customStats, isLoading: loadingCustom }] = useGetDashboardStatsMutation();
  
  // Make API calls on component mount
  useEffect(() => {
    if (!skipApiCalls) {
      // Get today's date
      const today = new Date().toISOString().split('T')[0]; // In YYYY-MM-DD format
      
      getTodayStats({ 
        rangeType: 'CUSTOM',
        startDate: today,
        endDate: today
      });
      getCurrentWeekStats({ rangeType: 'CURRENT_WEEK' });
      getLastWeekStats({ rangeType: 'LAST_WEEK' });
      getCurrentMonthStats({ rangeType: 'CURRENT_MONTH' });
      getLastMonthStats({ rangeType: 'LAST_MONTH' });
    }
  }, [skipApiCalls, getTodayStats, getCurrentWeekStats, getLastWeekStats, getCurrentMonthStats, getLastMonthStats]);

  // Make API call when custom date range is selected
  useEffect(() => {
    if (!skipApiCalls && customDates.startDate && customDates.endDate) {
      const startDateStr = customDates.startDate; // Already string
      const endDateStr = customDates.endDate;     // Zaten string
      
      getCustomStats({ 
        rangeType: 'CUSTOM',
        startDate: startDateStr,
        endDate: endDateStr
      });
      
      // Switch tab to Custom Range
      setTabValue(5);
      
      // Also get custom chart data
      getCustomChartData({
        rangeType: 'CUSTOM',
        startDate: startDateStr,
        endDate: endDateStr
      });
    }
  }, [customDates.startDate, customDates.endDate, skipApiCalls]);

  // Fetch chart data based on selected tab
  const { data: hourlyData, isLoading: loadingHourly } = useGetHourlyChartDataQuery(undefined, {
    skip: skipApiCalls || tabValue !== 0,
  });

  const chartRangeMap: Record<number, DateRangeType> = {
    1: 'CURRENT_WEEK',
    2: 'LAST_WEEK',
    3: 'CURRENT_MONTH',
    4: 'LAST_MONTH',
  };

  const [getChartData, { data: chartData, isLoading: loadingChart }] = useGetChartDataMutation();
  const [getCustomChartData, { data: customChartData, isLoading: loadingCustomChart }] = useGetChartDataMutation();
  
  // Chart data için useEffect
  useEffect(() => {
    if (!skipApiCalls && tabValue !== 0 && tabValue !== 5) {
      getChartData({
        rangeType: chartRangeMap[tabValue] || 'CURRENT_WEEK',
      });
    } else if (!skipApiCalls && tabValue === 5 && customDates.startDate && customDates.endDate) {
      getChartData({
        rangeType: 'CUSTOM',
        startDate: customDates.startDate,
        endDate: customDates.endDate,
      });
    }
  }, [skipApiCalls, tabValue, customDates.startDate, customDates.endDate]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    if (newValue === 0) {
      dispatch(setSelectedRange('HOURLY'));
    } else if (newValue === 5) {
      dispatch(setSelectedRange('CUSTOM'));
    } else {
      dispatch(setSelectedRange(chartRangeMap[newValue]));
    }
  };


  // Gerçek data kullan - yoksa skeleton göster
  const currentWeekData = currentWeekStats;
  const lastWeekData = lastWeekStats;
  const currentMonthData = currentMonthStats;
  const lastMonthData = lastMonthStats;

  // Custom range aktif mi kontrol et
  const isCustomRangeActive = customDates.startDate && customDates.endDate;
  
  // Today's Scans = custom range varsa custom data, yoksa bugünün verisi
  const totalScans = isCustomRangeActive 
    ? (customStats?.totalScans || 0)
    : (todayStats?.totalScans || 0);
  
  // Trend hesaplamaları - 0'a bölme kontrolü
  const weekTrend = (() => {
    const current = currentWeekData?.totalScans || 0;
    const last = lastWeekData?.totalScans || 0;
    
    if (last === 0 && current > 0) return 100; // 0'dan artışsa %100
    if (last === 0) return 0; // Her ikisi de 0'sa trend yok
    return ((current - last) / last) * 100;
  })();
    
  const monthTrend = (() => {
    const current = currentMonthData?.totalScans || 0;
    const last = lastMonthData?.totalScans || 0;
    
    if (last === 0 && current > 0) return 100; // 0'dan artışsa %100
    if (last === 0) return 0; // Her ikisi de 0'sa trend yok
    return ((current - last) / last) * 100;
  })();


  // isLoading kaldırıldı - her card kendi loading state'ini yönetiyor

  return (
    <Box sx={{ 
      width: '100%',
      minHeight: '100vh', // Minimum full height
      px: { xs: 2, sm: 3, md: 4 }, // Normal padding
      py: { xs: 2, md: 3 }, // Normal vertical padding
      pb: { xs: 8, sm: 6 }, // Mobile için extra bottom padding
      background: theme.palette.mode === 'light' 
        ? 'linear-gradient(135deg, #FAFBFC 0%, #F8FAFC 100%)'
        : 'transparent'
    }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 },
          mb: 2
        }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              İdarə Paneli Ümumi Görünüş
            </Typography>
            <Typography variant="body2" color="text.secondary">
              QR menyu skan fəaliyyətinizi və performans göstəricilərini izləyin
            </Typography>
          </Box>
          
          {/* Date Range Picker */}
          <DateRangePicker
            startDate={customDates.startDate ? new Date(customDates.startDate) : null}
            endDate={customDates.endDate ? new Date(customDates.endDate) : null}
            onDateRangeChange={(startDate, endDate) => {
              dispatch(setCustomDates({ 
                startDate: startDate ? startDate.toISOString().split('T')[0] : null,
                endDate: endDate ? endDate.toISOString().split('T')[0] : null
              }));
            }}
            onClear={() => {
              // Clear edildiğinde tab'ı Hourly (Today)'e geçir
              setTabValue(0);
            }}
            disabled={!isAuthenticated}
          />
        </Box>
        
        {!isAuthenticated && (
          <Alert severity="info" sx={{ mt: 2 }}>
            🔐 Həqiqi məlumatları görmək üçün zəhmət olmasa daxil olun
          </Alert>
        )}
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Total Scans - Her zaman göster */}
        <Grid item xs={12} sm={6} md={4} lg={isCustomRangeActive ? 12 : 2.4}>
          <StatsCard
            title={isCustomRangeActive ? "Xüsusi Aralıq Skanları" : "Bugünkü Skanlar"}
            value={totalScans}
            loading={isCustomRangeActive ? loadingCustom : loadingToday}
            color="primary"
          />
        </Grid>
        
        {/* Diğer kartlar - Sadece custom range aktif değilken göster */}
        {!isCustomRangeActive && (
          <>
            <Grid item xs={12} sm={6} md={4} lg={2.4}>
              <StatsCard
                title="Cari Həftə"
                value={currentWeekData?.totalScans || 0}
                loading={loadingCurrentWeek}
                color="success"
                trend={weekTrend > 0 ? 'up' : weekTrend < 0 ? 'down' : 'flat'}
                trendValue={Math.abs(weekTrend)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2.4}>
              <StatsCard
                title="Keçən Həftə"
                value={lastWeekData?.totalScans || 0}
                loading={loadingLastWeek}
                color="info"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2.4}>
              <StatsCard
                title="Cari Ay"
                value={currentMonthData?.totalScans || 0}
                loading={loadingCurrentMonth}
                color="warning"
                trend={monthTrend > 0 ? 'up' : monthTrend < 0 ? 'down' : 'flat'}
                trendValue={Math.abs(monthTrend)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2.4}>
              <StatsCard
                title="Keçən Ay"
                value={lastMonthData?.totalScans || 0}
                loading={loadingLastMonth}
                color="secondary"
              />
            </Grid>
          </>
        )}
      </Grid>

      {/* Date Range Picker and Chart */}
      <Paper
        sx={{
          p: { xs: 1.5, sm: 2, md: 3 }, // Mobile için daha az padding
          borderRadius: 4,
          background: theme.palette.mode === 'light' 
            ? 'linear-gradient(135deg, #FFFFFF 0%, #FEFEFE 100%)'
            : 'linear-gradient(135deg, #1C1C1E 0%, #000000 100%)',
          border: theme.palette.mode === 'light' 
            ? '1px solid rgba(229, 231, 235, 0.6)'
            : '1px solid #2C2C2E',
          boxShadow: theme.palette.mode === 'light'
            ? '0 4px 20px rgba(37, 99, 235, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)'
            : '0 2px 8px rgba(0, 0, 0, 0.3)',
          width: '100%',
          overflow: 'hidden',
          mb: { xs: 10, sm: 8 }, // Mobile için çok fazla bottom margin
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Skan Fəaliyyəti
          </Typography>
          
        </Box>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant={isMobile ? 'scrollable' : 'standard'}
          scrollButtons={isMobile ? 'auto' : false}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            mb: { xs: 2, sm: 3 }, // Mobile için daha az margin
            '& .MuiTab-root': {
              fontSize: { xs: '0.75rem', sm: '0.875rem' }, // Mobile için küçük font
              minWidth: { xs: 80, sm: 120 }, // Mobile için küçük tab genişliği
              padding: { xs: '8px 12px', sm: '12px 16px' }, // Mobile için küçük padding
            }
          }}
        >
          <Tab label={isMobile ? "Bugün" : "Saatlıq (Bugün)"} />
          <Tab label={isMobile ? "Bu Həftə" : "Bu Həftə"} />
          <Tab label={isMobile ? "Keçən Həftə" : "Keçən Həftə"} />
          <Tab label={isMobile ? "Bu Ay" : "Bu Ay"} />
          <Tab label={isMobile ? "Keçən Ay" : "Keçən Ay"} />
          <Tab label={isMobile ? "Xüsusi" : "Xüsusi Aralıq"} />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <ScanChart
            data={hourlyData || []}
            loading={loadingHourly}
            type="hourly"
          />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <ScanChart
            data={chartData || []}
            loading={loadingChart}
            type="daily"
          />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <ScanChart
            data={chartData || []}
            loading={loadingChart}
            type="daily"
          />
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <ScanChart
            data={chartData || []}
            loading={loadingChart}
            type="daily"
          />
        </TabPanel>
        <TabPanel value={tabValue} index={4}>
          <ScanChart
            data={chartData || []}
            loading={loadingChart}
            type="daily"
          />
        </TabPanel>
        <TabPanel value={tabValue} index={5}>
          {customDates.startDate && customDates.endDate ? (
            <ScanChart
              data={customChartData || []}
              loading={loadingCustomChart}
              type="daily"
            />
          ) : (
            <Alert severity="info">
              📅 Xüsusi dövr məlumatlarını görmək üçün yuxarıdan tarix aralığı seçin
            </Alert>
          )}
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default Dashboard;
