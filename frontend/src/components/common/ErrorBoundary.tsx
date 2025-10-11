import { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // Replace with your error monitoring service (e.g., Sentry)
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container maxWidth="md">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="50vh"
            textAlign="center"
            gap={3}
          >
            <AlertTriangle size={64} color="#f44336" />
            
            <Typography variant="h4" component="h1" gutterBottom>
              Bir şeyler yanlış gitti
            </Typography>
            
            <Typography variant="body1" color="text.secondary" maxWidth="600px">
              Beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
            </Typography>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box
                component="details"
                sx={{
                  mt: 2,
                  p: 2,
                  backgroundColor: '#f5f5f5',
                  borderRadius: 1,
                  maxWidth: '100%',
                  overflow: 'auto',
                }}
              >
                <summary style={{ cursor: 'pointer', marginBottom: '1rem' }}>
                  <Typography variant="subtitle2">Hata Detayları (Geliştirici Modu)</Typography>
                </summary>
                <Typography
                  component="pre"
                  variant="caption"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontSize: '0.75rem',
                  }}
                >
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </Typography>
              </Box>
            )}

            <Button
              variant="contained"
              startIcon={<RefreshCw size={20} />}
              onClick={this.handleReload}
              size="large"
            >
              Sayfayı Yenile
            </Button>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
