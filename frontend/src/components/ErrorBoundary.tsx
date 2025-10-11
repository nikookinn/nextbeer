import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Home, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onReset={() => this.setState({ hasError: false })} />;
    }

    return this.props.children;
  }
}

const ErrorFallback: React.FC<{ onReset: () => void }> = ({ onReset }) => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          gap: 3,
        }}
      >
        <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 'bold' }}>
          😵
        </Typography>
        
        <Typography variant="h4" gutterBottom>
          Oops! Something went wrong
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          We're sorry, but something unexpected happened. Please try again.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={<Home size={20} />}
            onClick={() => navigate('/')}
          >
            Go Home
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<RefreshCw size={20} />}
            onClick={() => {
              onReset();
              window.location.reload();
            }}
          >
            Try Again
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ErrorBoundary;
