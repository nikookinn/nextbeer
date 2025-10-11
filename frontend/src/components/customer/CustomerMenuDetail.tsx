import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion} from 'framer-motion';
import { ArrowLeft, Search, Filter, Tag } from 'lucide-react';
import { useGetCategoriesQuery, useGetItemsQuery, useGetMenusQuery } from '../../api/customerApi';
import { getFullImageUrl } from '../../utils/imageUtils';
import RestaurantFooter from './RestaurantFooter';
import './customer-style/menu-detail.css';

// Category Section Component - NO ANIMATIONS
const CategorySection: React.FC<{
  category: any;
  searchTerm: string;
  expandedVariants: Set<number>;
  toggleVariantExpansion: (itemId: number) => void;
  navigate: (path: string) => void;
}> = ({ category, searchTerm, expandedVariants, toggleVariantExpansion, navigate }) => {
  const { data: itemsData, isLoading: itemsLoading } = useGetItemsQuery({
    categoryId: category.categoryId,
    page: 0,
    size: 50
  });

  const items = Array.isArray(itemsData) ? itemsData : (itemsData?.content || []);
  
  // Filter items based on search term
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.itemTagResponses && item.itemTagResponses.some((tagResponse: any) => 
      tagResponse.name.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  if (itemsLoading) {
    return (
      <div id={`category-${category.categoryId}`} className="category-section-container">
        <h2 className="category-section-title">{category.name}</h2>
        <div className="items-grid">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="item-skeleton">
              <div className="skeleton-image shimmer" />
              <div className="skeleton-content">
                <div className="skeleton-title shimmer" />
                <div className="skeleton-price shimmer" />
                <div className="skeleton-description shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return null;
  }

  return (
    <div 
      id={`category-${category.categoryId}`} 
      className="category-section-container"
    >
      <h2 className="category-section-title">{category.name}</h2>
      <div className="items-grid">
        {filteredItems.map((item) => (
          <div
            key={item.itemId}
            className={`item-card ${expandedVariants.has(item.itemId) ? 'variants-expanded' : ''}`}
            onClick={() => navigate(`/item/${item.itemId}`)}
            style={{ cursor: 'pointer' }}
          >
            <div className="item-image-container">
              {item.imageUrl && getFullImageUrl(item.imageUrl) ? (
                <img
                  src={getFullImageUrl(item.imageUrl) || ''}
                  alt={item.name}
                  className="item-image"
                />
              ) : (
                <div className="image-placeholder">
                  <div className="placeholder-icon">🍴</div>
                </div>
              )}
              
              {item.price > 0 && (
                <div className="item-price-badge">
                  <span>{item.price.toFixed(2)} ₼</span>
                </div>
              )}

              {item.itemTagResponses && item.itemTagResponses.length > 0 && (
                <div className="item-tags-overlay">
                  {item.itemTagResponses.slice(0, 4).map((tagResponse: any, index: number) => (
                    <span key={index} className="item-tag-overlay">
                      <Tag size={12} />
                      {tagResponse.name}
                    </span>
                  ))}
                  {item.itemTagResponses.length > 4 && (
                    <span className="item-tag-overlay">
                      <Tag size={12} />
                      +{item.itemTagResponses.length - 4}
                    </span>
                  )}
                </div>
              )}

              {item.price === 0 && item.itemVariantResponses && item.itemVariantResponses.length > 0 && (
                <div className="item-variants-overlay-top compact">
                  {expandedVariants.has(item.itemId) && (
                    <div className="variants-list-container">
                      {item.itemVariantResponses.map((variant: any, index: number) => (
                        <div key={index} className="variant-item-overlay compact">
                          <span className="variant-name">{variant.name}</span>
                          <span className="variant-price">{variant.price.toFixed(2)} ₼</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div 
                    className={`variant-toggle-btn ${expandedVariants.has(item.itemId) ? 'collapse-state' : ''}`} 
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      toggleVariantExpansion(item.itemId);
                    }}
                  >
                    {expandedVariants.has(item.itemId) 
                      ? '✕ Gizlət' 
                      : `${item.itemVariantResponses.length} Seçim`
                    }
                  </div>
                </div>
              )}
            </div>
            
            <div className="item-content">
              <div className="item-header">
                <h3 className="item-title-only">{item.name}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CustomerMenuDetail: React.FC = () => {
  const { menuId } = useParams<{ menuId: string }>();
  const navigate = useNavigate();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [expandedVariants, setExpandedVariants] = React.useState<Set<number>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  const toggleVariantExpansion = (itemId: number) => {
    setExpandedVariants(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const { data: menuData } = useGetMenusQuery({ page: 0, size: 100 });
  const currentMenu = menuData?.content?.find(menu => menu.menuId === parseInt(menuId || '0'));

  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useGetCategoriesQuery({
    menuId: parseInt(menuId || '0'),
    page: 0,
    size: 50
  });

  const scrollToCategory = (categoryId: number) => {
    // Set user scrolling flag to prevent intersection observer conflicts
    setIsUserScrolling(true);
    setSelectedCategoryId(categoryId);
    
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      const screenWidth = window.innerWidth;
      let offset;
      
      if (screenWidth <= 480) {
        offset = 180;
      } else if (screenWidth <= 768) {
        offset = 200;
      } else {
        offset = 220;
      }
      
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Reset user scrolling flag after scroll animation completes
      setTimeout(() => {
        setIsUserScrolling(false);
      }, 1000); // Allow time for smooth scroll to complete
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    // Mark initial load as complete after a short delay
    const timer = setTimeout(() => setIsInitialLoad(false), 100);
    return () => clearTimeout(timer);
  }, []);

  const categories = Array.isArray(categoriesData) ? categoriesData : (categoriesData?.content || []);

  useEffect(() => {
    if (categories && categories.length > 0 && !selectedCategoryId) {
      const firstCategoryId = categories[0].categoryId;
      setSelectedCategoryId(firstCategoryId);
    }
  }, [categories, selectedCategoryId]);

  // Intersection Observer for automatic category selection during scroll
  useEffect(() => {
    if (!categories || categories.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '-250px 0px -40% 0px', // Adjust for sticky header and better detection
      threshold: [0.1, 0.3, 0.5],
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Only update if user is not manually scrolling to avoid conflicts
      if (isUserScrolling) return;

      // Find the entry with highest intersection ratio (most visible)
      let bestEntry: IntersectionObserverEntry | undefined;
      let highestRatio = 0;

      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio > highestRatio) {
          highestRatio = entry.intersectionRatio;
          bestEntry = entry;
        }
      }

      if (bestEntry && bestEntry.target instanceof HTMLElement) {
        const target = bestEntry.target;
        if (target.id) {
          const categoryId = target.id.replace('category-', '');
          const numericCategoryId = parseInt(categoryId);
          
          if (!isNaN(numericCategoryId)) {
            setSelectedCategoryId(numericCategoryId);
            
            // Scroll the active category button into view
            setTimeout(() => {
              const categoryButton = document.querySelector(`[data-category-id="${numericCategoryId}"]`);
              if (categoryButton) {
                categoryButton.scrollIntoView({
                  behavior: 'smooth',
                  block: 'nearest',
                  inline: 'center'
                });
              }
            }, 100);
          }
        }
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all category sections
    categories.forEach((category) => {
      const element = document.getElementById(`category-${category.categoryId}`);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [categories, isUserScrolling]);

  return (
    <div className="customer-menu-detail">
      <div className="menu-detail-main">
        {/* Header Section - SIMPLE FADE IN ONLY */}
        <motion.section 
          className="menu-detail-header"
          initial={isInitialLoad ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="header-content">
            <motion.button
              className="back-button desktop-only"
              onClick={() => navigate('/?section=menus-section')}
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={20} />
              <span>Menyuya Qayıt</span>
            </motion.button>

            <motion.button
              className="back-button mobile-only"
              onClick={() => navigate('/?section=menus-section')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={18} />
            </motion.button>

            <div className="menu-title-section">
              <h1 className="menu-detail-title">
                {currentMenu ? currentMenu.name : 'Menu'}
              </h1>
              <p className="menu-detail-subtitle">
                {currentMenu ? currentMenu.description || 'Dadlı yeməklərimizi kəşf edin' : 'Seçimlərimizdən sevdiklərinizi seçin'}
              </p>
            </div>
          </div>
        </motion.section>

        {/* Search & Categories - NO INITIAL ANIMATION */}
        <section className="search-categories-sticky-section">
          <div className="search-section">
            <div className="search-bar">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Məhsulları axtar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <motion.button
                className="filter-button"
                onClick={() => setShowFilters(!showFilters)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Filter size={18} />
              </motion.button>
            </div>
          </div>

          <div className="categories-section">
            {categoriesLoading ? (
              <div className="categories-skeleton">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="category-skeleton shimmer" />
                ))}
              </div>
            ) : categoriesError ? (
              <div className="error-state">
                <p>❌ Kateqoriyalar yüklənə bilmədi</p>
                <p>Zəhmət olmasa daha sonra yenidən cəhd edin</p>
              </div>
            ) : (
              <div className="categories-slider">
                <div className="categories-container">
                  {categories.map((category) => (
                    <motion.div
                      key={category.categoryId}
                      className={`category-chip ${selectedCategoryId === category.categoryId ? 'active' : ''}`}
                      data-category-id={category.categoryId}
                      whileHover={{ 
                        scale: 1.05,
                        y: -3,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => scrollToCategory(category.categoryId)}
                    >
                      <span className="category-name">{category.name}</span>
                      {selectedCategoryId === category.categoryId && (
                        <motion.div
                          className="category-indicator"
                          layoutId="categoryIndicator"
                          initial={false}
                          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* All Categories - NO ANIMATIONS */}
        <div className="all-categories-container">
          {categoriesLoading ? (
            <div className="categories-loading">
              <p>Kateqoriyalar yüklənir...</p>
            </div>
          ) : categoriesError ? (
            <div className="error-state">
              <p>❌ Kateqoriyalar yüklənə bilmədi</p>
              <p>Zəhmət olmasa daha sonra yenidən cəhd edin</p>
            </div>
          ) : (
            categories.map((category) => (
              <CategorySection
                key={category.categoryId}
                category={category}
                searchTerm={searchTerm}
                expandedVariants={expandedVariants}
                toggleVariantExpansion={toggleVariantExpansion}
                navigate={navigate}
              />
            ))
          )}

          {!categoriesLoading && categories.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🍽️</div>
              <h3>Heç bir kateqoriya tapılmadı</h3>
              <p>Bu menyuda hələ heç bir kateqoriya yoxdur.</p>
            </div>
          )}
        </div>
      </div>

      <footer>
        <RestaurantFooter />
      </footer>
    </div>
  );
};

export default CustomerMenuDetail;