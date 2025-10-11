import React, { useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
// import AOS from 'aos'; // Removed - animations disabled
// import 'aos/dist/aos.css'; // Removed - animations disabled
// Import customer components
import CustomerNavigation from './CustomerNavigation';
import CampaignsCarousel from './CampaignsCarousel';
import MenusGrid from './MenusGrid';
import RestaurantFooter from './RestaurantFooter';
import './customer-styles.css';

const SimpleCustomerHomepage: React.FC = () => {
  const location = useLocation();

  // Handle URL parameters for navigation from menu detail page
  useLayoutEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const section = urlParams.get('section');
    
    if (section === 'menus-section') {
      // Scroll to menus section immediately (no animation for instant positioning)
      const menusSection = document.querySelector('.menus-section');
      if (menusSection) {
        // Calculate offset for proper positioning
        const screenWidth = window.innerWidth;
        let offset;
        
        if (screenWidth <= 480) {
          offset = 60; // Small mobile
        } else if (screenWidth <= 768) {
          offset = 70; // Mobile
        } else {
          offset = 80; // Desktop
        }
        
        const elementPosition = menusSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'auto' // Instant positioning, no animation
        });
        
        // Clean up URL parameter
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, [location.search]);

  // AOS animations disabled - all content shows immediately

  return (
    <div className="customer-homepage">
      <CustomerNavigation />
      
      <div className="customer-main">
        {/* Hero Section */}
        <motion.section 
          className="hero-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="hero-content">
            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              NextBeer-ə Xoş Gəlmisiniz
            </motion.h1>
            <motion.p 
              className="hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Möhtəşəm menyumuz və xüsusi kampanyalarımızı kəşf edin
            </motion.p>
            
            {/* Hero CTA Button */}
            <motion.div
              className="hero-cta"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <button 
                className="hero-menu-button"
                onClick={() => {
                  // Scroll to menus section
                  const menusSection = document.querySelector('.menus-section');
                  if (menusSection) {
                    menusSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <Menu className="button-icon" size={20} />
                <span>Menyuya Bax</span>
                <ChevronRight className="button-arrow" size={20} />
              </button>
            </motion.div>
          </div>
        </motion.section>

        <main>
          {/* Campaigns Carousel Section */}
          <section 
            className="campaigns-section"
          >
            <div className="section-header">
              <h2 className="section-title">Xüsusi Kampanyalar</h2>
              <p className="section-subtitle">Eksklüziv təkliflərimizi qaçırmayın</p>
            </div>
            <CampaignsCarousel />
          </section>

          {/* Menus Grid Section */}
          <section 
            className="menus-section"
          >
            <div className="section-header">
              <h2 className="section-title">Menyularımız</h2>
              <p className="section-subtitle">Dadlı yeməklərimizi kəşf edin</p>
            </div>
            <MenusGrid />
          </section>
        </main>

        {/* Restaurant Footer */}
        <footer>
          <RestaurantFooter />
        </footer>
      </div>
    </div>
  );
};

export default SimpleCustomerHomepage;