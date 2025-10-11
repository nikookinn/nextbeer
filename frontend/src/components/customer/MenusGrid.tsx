import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import { useInView } from 'react-intersection-observer'; // Removed - infinite scroll disabled
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ChevronRight } from 'lucide-react';
import { useGetMenusQuery } from '../../api/customerApi';
import { getFullImageUrl } from '../../utils/imageUtils';

const MenusGrid: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [allMenus, setAllMenus] = useState<any[]>([]);
  const [autoLoadComplete, setAutoLoadComplete] = useState(false);
  const { data: menusData, isLoading, error, isFetching } = useGetMenusQuery({ page, size: 12 });
  
  // Infinite scroll removed - all content loads automatically

  // Update menus when new data arrives
  useEffect(() => {
    
    if (menusData?.content) {
      if (page === 0) {
        setAllMenus(menusData.content);
      } else {
        setAllMenus(prev => [...prev, ...menusData.content]);
      }
      
      // Auto-load all pages on initial load
      if (!autoLoadComplete && !menusData.last && !isFetching) {
        const timer = setTimeout(() => {
          setPage(prev => prev + 1);
        }, 200); // Small delay between requests
        
        return () => clearTimeout(timer);
      } else if (menusData.last) {
        setAutoLoadComplete(true);
      }
    }
  }, [menusData, page, isLoading, error, autoLoadComplete, isFetching]);

  // Infinite scroll is disabled - all content loads automatically on page load

  // Handle menu card click
  const handleMenuClick = (menuId: number) => {
    navigate(`/menu/${menuId}`);
  };

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  // Item animation variants
  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        damping: 20,
        stiffness: 100,
      },
    },
  };

  // Loading skeleton
  if (isLoading && page === 0) {
    return (
      <div className="menus-grid-container">
        <motion.div 
          className="menus-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[...Array(6)].map((_, index) => (
            <motion.div
              key={`skeleton-${index}`}
              className="menu-skeleton"
              variants={itemVariants}
            >
              <div className="skeleton-image shimmer" />
              <div className="skeleton-content">
                <div className="skeleton-title shimmer" />
                <div className="skeleton-text shimmer" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div 
        className="menus-error"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <AlertCircle size={48} />
        <h3>Menyular yüklənə bilmədi</h3>
        <p>Zəhmət olmasa daha sonra yenidən cəhd edin</p>
      </motion.div>
    );
  }

  // Empty state - show mock data if no backend data
  if (!allMenus.length && !isLoading) {
    // Mock data for testing
    const mockMenus = [
      {
        menuId: 1,
        name: "Səhər Yemləyi Menyusu 🌅",
        imageUrl: null,
        description: "Gününüzü ləzzətli səhər yemləyi seçimlərimizlə başlayın"
      },
      {
        menuId: 2,
        name: "Nahаr Xüsusiyyətləri 🍽️",
        imageUrl: null,
        description: "Nahаr fasisləsi üçün mükəmməl doyurucu yemləklər"
      },
      {
        menuId: 3,
        name: "Axşam Yemləyi Ləzzətləri 🌙",
        imageUrl: null,
        description: "Mükəmməl axşam üçün nəfis axşam yemləkləri"
      },
      {
        menuId: 4,
        name: "İçkilər 🍹",
        imageUrl: null,
        description: "Serinləşdirici içkilər və kokteyllər"
      }
    ];


    return (
      <div className="menus-grid-container">
        <motion.div 
          className="menus-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {mockMenus.map((menu) => (
              <motion.div
                key={menu.menuId}
                className="menu-card"
                variants={itemVariants}
                layout
                whileHover={{ 
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleMenuClick(menu.menuId)}
                style={{ cursor: 'pointer' }}
              >
                <div className="menu-image-container">
                  <img
                    src={getFullImageUrl(menu.imageUrl) || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNzY0YmEyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5NZW51IEltYWdlPC90ZXh0Pjwvc3ZnPg=='}
                    alt={menu.name}
                    className="menu-image"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.src.includes('data:image/svg+xml')) {
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNzY0YmEyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5NZW51IEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                      }
                    }}
                  />
                  <div className="menu-overlay">
                    <motion.div 
                      className="menu-hover-content"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span>Menyuya Bax</span>
                      <ChevronRight size={20} />
                    </motion.div>
                  </div>
                </div>
                
                <div className="menu-content">
                  <h3 className="menu-title">
                    {menu.name}
                  </h3>
                  {menu.description && (
                    <p className="menu-description">
                      {menu.description}
                    </p>
                  )}
                  
                  <div className="menu-action">
                    <span>Kəşf Et</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="menus-grid-container">
      <motion.div 
        className="menus-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {allMenus.map((menu) => (
            <motion.div
              key={menu.menuId}
              className="menu-card"
              variants={itemVariants}
              layout
              whileHover={{ 
                y: -8,
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleMenuClick(menu.menuId)}
              style={{ cursor: 'pointer' }}
            >
              <div className="menu-image-container">
                <img
                  src={getFullImageUrl(menu.imageUrl) || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk1lbnUgSW1hZ2U8L3RleHQ+PC9zdmc+'}
                  alt={menu.name}
                  className="menu-image"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes('data:image/svg+xml')) {
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk1lbnUgSW1hZ2U8L3RleHQ+PC9zdmc+';
                    }
                  }}
                />
                <div className="menu-overlay">
                  <motion.div 
                    className="menu-hover-content"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span>Menyuya Bax</span>
                    <ChevronRight size={20} />
                  </motion.div>
                </div>
              </div>
              
              <div className="menu-content">
                <h3 className="menu-title">
                  {menu.name}
                </h3>
                {menu.description && (
                  <p className="menu-description">
                    {menu.description}
                  </p>
                )}
                
                <div className="menu-action">
                  <span>Kəşf Et</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* All content loads automatically - no manual load more needed */}
    </div>
  );
};

export default MenusGrid;
