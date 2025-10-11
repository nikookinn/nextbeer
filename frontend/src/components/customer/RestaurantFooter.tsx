import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Instagram, 
  Facebook, 
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';
import L from 'leaflet';
import { useGetRestaurantQuery } from '../../api/customerApi';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const RestaurantFooter: React.FC = () => {
  const { data: restaurant, isLoading, error } = useGetRestaurantQuery();

  // Create custom marker icon
  const customIcon = useMemo(() => {
    return new L.Icon({
      iconUrl: '/images/logo.png',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
      className: 'custom-marker-icon',
    });
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  if (isLoading) {
    return (
      <div className="restaurant-footer loading">
        <div className="footer-skeleton">
          <div className="skeleton-map shimmer" />
          <div className="skeleton-info">
            <div className="skeleton-title shimmer" />
            <div className="skeleton-text shimmer" />
            <div className="skeleton-text shimmer" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <motion.div 
        className="restaurant-footer error"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <AlertCircle size={48} />
        <h3>Restoran məlumatları yüklənə bilmədi</h3>
      </motion.div>
    );
  }

  const socialLinks = [
    { 
      url: restaurant.instagramUrl, 
      icon: Instagram, 
      label: 'Instagram',
      color: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)'
    },
    { 
      url: restaurant.facebookUrl, 
      icon: Facebook, 
      label: 'Facebook',
      color: 'linear-gradient(45deg, #1877F2 0%, #42a5f5 100%)'
    },
    { 
      url: restaurant.twitterUrl, 
      icon: FaTiktok, 
      label: 'TikTok',
      color: 'linear-gradient(45deg, #FF0050 0%, #000000 100%)'
    },
  ].filter(link => link.url && link.url.trim() !== '');

  return (
    <motion.footer 
      className="restaurant-footer"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="footer-container">
        {/* Map Section */}
        <motion.div 
          className="footer-map-section"
          variants={itemVariants}
        >
          <h3 className="section-title">Bizi Tapın</h3>
          <div className="map-container">
            <MapContainer
              center={[restaurant.latitude || 41.0082, restaurant.longitude || 28.9784]}
              zoom={15}
              className="restaurant-map"
              scrollWheelZoom={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker 
                position={[restaurant.latitude || 41.0082, restaurant.longitude || 28.9784]}
                icon={customIcon}
              >
                <Popup>
                  <div className="map-popup">
                    <h4>{restaurant.name}</h4>
                    <p>{restaurant.address}</p>
                    <a 
                      href={`https://maps.google.com/?q=${restaurant.latitude},${restaurant.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="directions-link"
                    >
                      Yönümüzü Alın <ExternalLink size={14} />
                    </a>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </motion.div>

        {/* Restaurant Info Section */}
        <motion.div 
          className="footer-info-section"
          variants={itemVariants}
        >
          <div className="restaurant-info">
            <motion.h2 
              className="restaurant-name"
              whileHover={{ scale: 1.02 }}
            >
              {restaurant.name}
            </motion.h2>
            
            <motion.p 
              className="restaurant-about"
              variants={itemVariants}
            >
              {restaurant.about}
            </motion.p>

            {/* Contact Information */}
            <div className="contact-info">
              <motion.div 
                className="contact-item"
                variants={itemVariants}
                whileHover={{ x: 5 }}
              >
                <MapPin size={20} />
                <span>{restaurant.address}</span>
              </motion.div>

              <motion.a 
                href={`tel:${restaurant.phoneNumber}`}
                className="contact-item clickable"
                variants={itemVariants}
                whileHover={{ x: 5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Phone size={20} />
                <span>{restaurant.phoneNumber}</span>
              </motion.a>

              <motion.a 
                href={`mailto:${restaurant.email}`}
                className="contact-item clickable"
                variants={itemVariants}
                whileHover={{ x: 5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Mail size={20} />
                <span>{restaurant.email}</span>
              </motion.a>

              <motion.div 
                className="contact-item"
                variants={itemVariants}
                whileHover={{ x: 5 }}
              >
                <Clock size={20} />
                <span>{restaurant.workingHours}</span>
              </motion.div>
            </div>

            {/* Social Media Links */}
            {socialLinks.length > 0 && (
              <motion.div 
                className="social-links"
                variants={itemVariants}
              >
                <h4>Bizi İzləyin</h4>
                <div className="social-icons">
                  {socialLinks.map((social, index) => {
                    const IconComponent = social.icon;
                    return (
                      <motion.a
                        key={social.label}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                        style={{ '--social-color': social.color } as React.CSSProperties}
                        whileHover={{ 
                          scale: 1.2, 
                          rotate: 5,
                          y: -3
                        }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <IconComponent size={24} />
                        <span className="social-tooltip">{social.label}</span>
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Footer Bottom */}
      <motion.div 
        className="footer-bottom"
        variants={itemVariants}
      >
        <div className="footer-bottom-content">
          <p>&copy; 2025 NextBeer resto & pub. All rights reserved.</p>
        </div>
      </motion.div>
    </motion.footer>
  );
};

export default RestaurantFooter;
