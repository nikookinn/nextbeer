import React, { useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  IconButton,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  Clock as ScheduleIcon,
  ExternalLink as LaunchIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Mail as EmailIcon,
  MapPin as LocationIcon,
  Phone as PhoneIcon,
} from 'lucide-react';

// Custom TikTok Icon Component
const TikTokIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
      fill={color}
    />
  </svg>
);
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useGetRestaurantQuery } from '../../../api/customerApi';
import 'leaflet/dist/leaflet.css';
// Custom marker - no default icon needed

const Footer: React.FC = () => {
  const { data: restaurant, isLoading, error } = useGetRestaurantQuery();

  // Create custom marker icon
  const customIcon = useMemo(() => {
    const logoUrl = restaurant?.logoUrl || '/images/logo_nomre_beer.png';
    return new L.DivIcon({
      className: 'custom-div-icon',
      html: `<img src="${logoUrl}" alt="Logo" style="
        width: 35px;
        height: 35px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid white;
        box-shadow: 0 3px 8px rgba(0,0,0,0.3);
        background: white;
      " onerror="this.outerHTML='<div style=\\"width:35px;height:35px;border-radius:50%;background:#0A84FF;border:2px solid white;box-shadow:0 3px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:18px;\\">📍</div>';" />`,
      iconSize: [35, 35],
      iconAnchor: [17, 17],
      popupAnchor: [0, -17],
    });
  }, [restaurant?.logoUrl]);

  if (isLoading) {
    return (
      <Box
        sx={{
          bgcolor: '#000000',
          py: { xs: 4, md: 6 },
          mt: 4,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3, bgcolor: '#1C1C1E' }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Skeleton variant="text" height={60} sx={{ bgcolor: '#1C1C1E', mb: 2 }} />
              <Skeleton variant="text" height={40} sx={{ bgcolor: '#1C1C1E', mb: 1 }} />
              <Skeleton variant="text" height={40} sx={{ bgcolor: '#1C1C1E', mb: 1 }} />
              <Skeleton variant="text" height={40} sx={{ bgcolor: '#1C1C1E' }} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  if (error || !restaurant) {
    return (
      <Box
        sx={{
          bgcolor: '#000000',
          py: { xs: 4, md: 6 },
          mt: 4,
        }}
      >
        <Container maxWidth="lg">
          <Alert severity="error" sx={{ bgcolor: '#1C1C1E', color: '#FF453A' }}>
            Restoran məlumatları yüklənə bilmədi
          </Alert>
        </Container>
      </Box>
    );
  }

  const contactInfo = [
    {
      icon: LocationIcon,
      title: 'Ünvan',
      content: restaurant.address,
      color: '#FF9F0A',
    },
    {
      icon: PhoneIcon,
      title: 'Telefon',
      content: restaurant.phoneNumber,
      color: '#30D158',
      href: `tel:${restaurant.phoneNumber}`,
    },
    {
      icon: EmailIcon,
      title: 'Email',
      content: restaurant.email,
      color: '#0A84FF',
      href: `mailto:${restaurant.email}`,
    },
    {
      icon: ScheduleIcon,
      title: 'İş Saatları',
      content: restaurant.workingHours,
      color: '#FF453A',
    },
  ];

  const socialLinks = [
    {
      icon: InstagramIcon,
      url: restaurant.instagramUrl,
      label: 'Instagram',
      color: '#E4405F',
    },
    {
      icon: FacebookIcon,
      url: restaurant.facebookUrl,
      label: 'Facebook',
      color: '#1877F2',
    },
    {
      icon: TikTokIcon,
      url: restaurant.twitterUrl, // Using twitterUrl field for TikTok link
      label: 'TikTok',
      color: '#FF0050',
    },
  ].filter(link => link.url && link.url.trim() !== '');

  return (
    <Box
      id="about"
      sx={{
        bgcolor: '#000000',
        py: { xs: 4, md: 6 },
        mt: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Map Section */}
          <Grid item xs={12} md={6}>
            {/* Map Title */}
            <Typography
              id="map-title"
              variant="h5"
              sx={{
                color: '#FFFFFF',
                fontWeight: 600,
                mb: 3,
                fontSize: { xs: '1.5rem', md: '1.75rem' },
                textAlign: { xs: 'center', md: 'left' },
              }}
            >
              Bizi Tapın
            </Typography>
            <Box
              id="location"
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                height: { xs: 280, md: 350 },
                bgcolor: '#1C1C1E',
                border: '1px solid #2C2C2E',
                position: 'relative',
              }}
            >
              <MapContainer
                center={[restaurant.latitude || 40.4093, restaurant.longitude || 49.8671]}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker 
                  position={[restaurant.latitude || 40.4093, restaurant.longitude || 49.8671]}
                  icon={customIcon}
                >
                  <Popup>
                    <Box sx={{ p: 1, minWidth: 200 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        {restaurant.name}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
                        {restaurant.address}
                      </Typography>
                      <Box
                        component="a"
                        href={`https://maps.google.com/?q=${restaurant.latitude},${restaurant.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 0.5,
                          color: '#0A84FF',
                          textDecoration: 'none',
                          fontSize: '0.875rem',
                          '&:hover': { textDecoration: 'underline' },
                        }}
                      >
                        Yönümüzü Alın <LaunchIcon size={14} />
                      </Box>
                    </Box>
                  </Popup>
                </Marker>
              </MapContainer>
            </Box>
          </Grid>

          {/* Restaurant Info Section */}
          <Grid item xs={12} md={6}>
            <Box id="about-info" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Restaurant Name & Description */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h3"
                  sx={{
                    color: '#FFFFFF',
                    fontWeight: 700,
                    mb: 2,
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    background: 'linear-gradient(135deg, #FFFFFF, #0A84FF)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {restaurant.name}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#8E8E93',
                    lineHeight: 1.6,
                    fontSize: '1.1rem',
                  }}
                >
                  {restaurant.about}
                </Typography>
              </Box>

              {/* Contact Information */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon;
                  const ContactComponent = info.href ? 'a' : 'div';
                  return (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box
                        component={ContactComponent}
                        href={info.href}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          p: 2,
                          borderRadius: 2,
                          bgcolor: '#1C1C1E',
                          border: '1px solid #2C2C2E',
                          transition: 'all 0.3s ease',
                          textDecoration: 'none',
                          color: 'inherit',
                          cursor: info.href ? 'pointer' : 'default',
                          '&:hover': {
                            borderColor: info.color,
                            transform: info.href ? 'translateY(-2px)' : 'none',
                            boxShadow: info.href ? `0 4px 15px rgba(${info.color === '#FF9F0A' ? '255, 159, 10' : 
                              info.color === '#30D158' ? '48, 209, 88' :
                              info.color === '#0A84FF' ? '10, 132, 255' : '255, 69, 58'}, 0.2)` : 'none',
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            bgcolor: `${info.color}20`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <IconComponent size={20} color={info.color} />
                        </Box>
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#8E8E93',
                              fontSize: '0.75rem',
                              display: 'block',
                            }}
                          >
                            {info.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#FFFFFF',
                              fontWeight: 500,
                            }}
                          >
                            {info.content}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>

              {/* Social Media Links */}
              {socialLinks.length > 0 && (
                <Box sx={{ mt: 'auto', textAlign: { xs: 'center', md: 'left' } }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#8E8E93',
                      mb: 2,
                      fontSize: '0.875rem',
                    }}
                  >
                    Bizi İzləyin
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                    {socialLinks.map((social) => {
                      const IconComponent = social.icon;
                      return (
                        <IconButton
                          key={social.label}
                          component="a"
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            width: 44,
                            height: 44,
                            bgcolor: '#1C1C1E',
                            border: '1px solid #2C2C2E',
                            color: social.color,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              bgcolor: `${social.color}15`,
                              borderColor: social.color,
                              transform: 'translateY(-2px)',
                              boxShadow: `0 4px 15px ${social.color}30`,
                            },
                          }}
                        >
                          <IconComponent size={20} />
                        </IconButton>
                      );
                    })}
                  </Box>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Footer Bottom */}
        <Box
          sx={{
            textAlign: 'center',
            pt: 4,
            mt: 4,
            borderTop: '1px solid #2C2C2E',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#48484A',
              fontSize: '0.875rem',
            }}
          >
            © 2025 {restaurant.name}. ALL RIGHTS RESERVED.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
