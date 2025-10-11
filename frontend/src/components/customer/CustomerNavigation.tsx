import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Camera, Coffee, MapPin, Info } from 'lucide-react';

const CustomerNavigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    
    // Close mobile menu immediately
    setIsMobileMenuOpen(false);
    
    // Special handling for About section on mobile - skip map, show content below map
    if (sectionId === 'restaurant-footer' && window.innerWidth <= 768) {
      setTimeout(() => {
        // Find the map section first
        const mapSection = document.querySelector('.footer-map-section');
        
        if (mapSection) {
          // Scroll to just below the map
          const mapRect = mapSection.getBoundingClientRect();
          const mapBottom = mapRect.bottom + window.pageYOffset;
          const navbarHeight = 60;
          const extraOffset = 20;
          
          
          window.scrollTo({
            top: Math.max(0, mapBottom - navbarHeight + extraOffset),
            behavior: 'smooth'
          });
          return;
        }
        
        // Fallback: if no map found, scroll to restaurant info section
        const infoSection = document.querySelector('.footer-info-section') ||
                           document.querySelector('.restaurant-info') ||
                           document.querySelector('.restaurant-footer');
        
        if (infoSection) {
          const rect = infoSection.getBoundingClientRect();
          const elementPosition = rect.top + window.pageYOffset - 80;
          
          window.scrollTo({
            top: Math.max(0, elementPosition),
            behavior: 'smooth'
          });
        }
      }, 100);
      return;
    }
    
    // Regular scroll behavior for other sections
    // Try multiple selectors for better compatibility
    const selectors = [
      `.${sectionId}`,
      `[class*="${sectionId}"]`,
      `#${sectionId}`,
      `section.${sectionId}`,
      `div.${sectionId}`
    ];
    
    let element = null;
    for (const selector of selectors) {
      element = document.querySelector(selector);
      if (element) {
        break;
      }
    }
    
    if (!element) {
      return;
    }
    
    // Wait for mobile menu to close
    setTimeout(() => {
      const isMobile = window.innerWidth <= 768;
      const navbarHeight = 60;
      const extraOffset = isMobile ? 20 : 0;
      const totalOffset = navbarHeight + extraOffset;
      
      const rect = element.getBoundingClientRect();
      const elementPosition = rect.top + window.pageYOffset - totalOffset;
      
      
      window.scrollTo({
        top: Math.max(0, elementPosition),
        behavior: 'smooth'
      });
    }, isMobileMenuOpen ? 400 : 0); // Wait longer if menu is open
  };

  // Desktop navigation items (without Find Us)
  const desktopNavItems = [
    { id: 'hero-section', label: 'Ana Səhifə', icon: Home },
    { id: 'campaigns-section', label: 'Kampanyalar', icon: Camera },
    { id: 'menus-section', label: 'Menyu', icon: Coffee },
    { id: 'restaurant-footer', label: 'Haqqımızda', icon: Info },
  ];

  // Mobile navigation items (with Find Us)
  const mobileNavItems = [
    { id: 'hero-section', label: 'Ana Səhifə', icon: Home },
    { id: 'campaigns-section', label: 'Kampanyalar', icon: Camera },
    { id: 'menus-section', label: 'Menyu', icon: Coffee },
    { id: 'footer-map-section', label: 'Bizi Tapın', icon: MapPin },
    { id: 'restaurant-footer', label: 'Haqqımızda', icon: Info },
  ];

  return (
    <>
      <motion.nav
        className={`customer-navbar ${isScrolled ? 'scrolled' : ''}`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="navbar-container">
          {/* Logo Section */}
          <motion.div 
            className="navbar-logo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img 
              src="/images/logo.png" 
              alt="NextBeer Logo" 
              className="logo-image"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling!.textContent = '🍺';
              }}
            />
            <span className="logo-fallback">🍺</span>
            <span className="logo-text">NextBeer</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="navbar-links desktop-only">
            {desktopNavItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.button
                  key={item.id}
                  className="nav-link"
                  onClick={() => scrollToSection(item.id)}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <IconComponent size={18} />
                  <span>{item.label}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="mobile-menu-button mobile-only"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="mobile-menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              className="mobile-menu"
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="mobile-menu-content">
                {mobileNavItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.id}
                      className="mobile-nav-link"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        scrollToSection(item.id);
                      }}
                      style={{
                        opacity: 1,
                        transform: 'translateX(0px)',
                      }}
                    >
                      <IconComponent size={20} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CustomerNavigation;
