import React from 'react';
import { motion } from 'framer-motion';
import { Box, Container, Typography, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { ArrowLeft as ArrowBackIcon } from 'lucide-react';

interface MenuHeaderProps {
  currentMenu?: {
    menuId: number;
    name: string;
    description?: string;
  };
  onBackClick: () => void;
}

const MenuHeader: React.FC<MenuHeaderProps> = ({ currentMenu, onBackClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Box
        sx={{
          bgcolor: 'rgba(0, 0, 0, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          py: isMobile ? 2.5 : 3.5,
          position: 'relative',
          boxShadow: '0 1px 0 rgba(255, 255, 255, 0.05), 0 4px 20px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: isMobile ? 1.5 : 2, mb: isMobile ? 1.5 : 2 }}>
            <IconButton
              onClick={onBackClick}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                width: 40,
                height: 40,
                borderRadius: 2,
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'scale(1.02)',
                },
                '&:active': {
                  transform: 'scale(0.98)',
                },
              }}
            >
              <ArrowBackIcon size={20} />
            </IconButton>
            <Box>
              <Typography
                variant={isMobile ? 'h5' : 'h4'}
                sx={{
                  color: '#FFFFFF',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  fontSize: isMobile ? '1.5rem' : '2rem',
                  lineHeight: 1.2,
                }}
              >
                {currentMenu ? currentMenu.name : 'Premium Menyu'}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  mt: 0.5,
                  fontWeight: 400,
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  lineHeight: 1.4,
                }}
              >
                {currentMenu ? currentMenu.description || 'Dadlı yeməklərimizi kəşf edin' : 'Seçimlərimizdən sevdiklərinizi seçin'}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </motion.div>
  );
};

export default MenuHeader;