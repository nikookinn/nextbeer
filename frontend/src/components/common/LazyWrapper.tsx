import { Suspense, ReactNode } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LazyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const DefaultFallback = () => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    minHeight="200px"
    gap={2}
  >
    <CircularProgress size={40} />
    <Typography variant="body2" color="text.secondary">
      Yüklənir...
    </Typography>
  </Box>
);

const LazyWrapper = ({ children, fallback = <DefaultFallback /> }: LazyWrapperProps) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

export default LazyWrapper;
