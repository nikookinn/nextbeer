import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Tag } from 'lucide-react';
import { useGetItemByIdQuery } from '../../api/customerApi';
import { getFullImageUrl } from '../../utils/imageUtils';
import RestaurantFooter from './RestaurantFooter';
import './customer-style/item-detail.css';

const CustomerItemDetail: React.FC = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const itemIdNumber = parseInt(itemId || '0');

  // Fetch item data
  const { data: item, isLoading, error } = useGetItemByIdQuery(itemIdNumber, {
    skip: !itemId || isNaN(itemIdNumber)
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="customer-item-detail">
        <div className="item-detail-main">
          {/* Loading Skeleton */}
          <motion.div 
            className="item-detail-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="loading-skeleton">
              <div className="skeleton-back-button shimmer" />
              <div className="skeleton-title shimmer" />
              <div className="skeleton-content">
                <div className="skeleton-image shimmer" />
                <div className="skeleton-info">
                  <div className="skeleton-text shimmer" />
                  <div className="skeleton-text shimmer" />
                  <div className="skeleton-text shimmer" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Restaurant Footer */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <RestaurantFooter />
          </motion.section>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="customer-item-detail">
        <div className="item-detail-main">
          <motion.div 
            className="item-detail-error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.button
              className="back-button"
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={20} />
              <span>Geri</span>
            </motion.button>
            
            <div className="error-content">
              <div className="error-icon">❌</div>
              <h2>Məhsul Tapılmadı</h2>
              <p>Axtarığınız məhsul mövcud deyil və ya yüklənə bilmədi.</p>
            </div>
          </motion.div>

          {/* Restaurant Footer */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <RestaurantFooter />
          </motion.section>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-item-detail">
      <div className="item-detail-main">
        {/* Header Section */}
        <motion.section 
          className="item-detail-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="header-content">
            <motion.button
              className="back-button"
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={20} />
              <span>Geri</span>
            </motion.button>

            <motion.div 
              className="item-title-section"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="item-detail-title">
                {item.name}
              </h1>
            </motion.div>
          </div>
        </motion.section>

        {/* Content Section */}
        <motion.section 
          className="item-content-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="item-detail-container">
            {/* Desktop Layout */}
            <div className="item-detail-desktop">
              {/* Left Side - Image */}
              <div className="item-image-section">
                <div className="item-image-container">
                  {item.imageUrl && getFullImageUrl(item.imageUrl) ? (
                    <img
                      src={getFullImageUrl(item.imageUrl) || ''}
                      alt={item.name}
                      className="item-detail-image"
                    />
                  ) : (
                    <div className="image-placeholder">
                      <div className="placeholder-icon">🍴</div>
                      <div className="placeholder-text">Resim Yoxdur</div>
                    </div>
                  )}
                  
                  {/* Tags Overlay - Top Left */}
                  {item.itemTagResponses && item.itemTagResponses.length > 0 && (
                    <div className="item-tags-overlay">
                      {item.itemTagResponses.map((tagResponse: any, index: number) => (
                        <span key={index} className="item-tag-overlay">
                          <Tag size={12} />
                          {tagResponse.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side - Information */}
              <div className="item-info-section">
                <div className="item-info-content">
                  {/* Price or Variants */}
                  {item.price > 0 ? (
                    <div className="item-price-section">
                      <div className="price-label">Qiymət</div>
                      <div className="price-value">{item.price.toFixed(2)} ₼</div>
                    </div>
                  ) : item.itemVariantResponses && item.itemVariantResponses.length > 0 ? (
                    <div className="item-variants-section">
                      <div className="variants-label">Mövcud Seçimlər</div>
                      <div className="variants-list">
                        {item.itemVariantResponses.map((variant: any, index: number) => (
                          <div key={index} className="variant-item">
                            <span className="variant-name">{variant.name}</span>
                            <span className="variant-price">{variant.price.toFixed(2)} ₼</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {/* Description */}
                  {item.description && (
                    <div className="item-description-section">
                      <div className="description-label">Təsvir</div>
                      <div className="description-content">
                        {item.description}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="item-detail-mobile">
              {/* Item Image */}
              <div className="mobile-image-section">
                <div className="mobile-image-container">
                  {item.imageUrl && getFullImageUrl(item.imageUrl) ? (
                    <img
                      src={getFullImageUrl(item.imageUrl) || ''}
                      alt={item.name}
                      className="mobile-item-image"
                    />
                  ) : (
                    <div className="mobile-image-placeholder">
                      <div className="placeholder-icon">🍴</div>
                      <div className="placeholder-text">Resim Yoxdur</div>
                    </div>
                  )}
                  
                  {/* Tags Overlay - Top Left */}
                  {item.itemTagResponses && item.itemTagResponses.length > 0 && (
                    <div className="mobile-tags-overlay">
                      {item.itemTagResponses.map((tagResponse: any, index: number) => (
                        <span key={index} className="mobile-tag-overlay">
                          <Tag size={10} />
                          {tagResponse.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Info */}
              <div className="mobile-info-section">
                {/* Price or Variants */}
                {item.price > 0 ? (
                  <div className="mobile-price-section">
                    <div className="mobile-price-label">Qiymət</div>
                    <div className="mobile-price-value">{item.price.toFixed(2)} ₼</div>
                  </div>
                ) : item.itemVariantResponses && item.itemVariantResponses.length > 0 ? (
                  <div className="mobile-variants-section">
                    <div className="mobile-variants-label">Mövcud Seçimlər</div>
                    <div className="mobile-variants-list">
                      {item.itemVariantResponses.map((variant: any, index: number) => (
                        <div key={index} className="mobile-variant-item">
                          <span className="mobile-variant-name">{variant.name}</span>
                          <span className="mobile-variant-price">{variant.price.toFixed(2)} ₼</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Description */}
                {item.description && (
                  <div className="mobile-description-section">
                    <div className="mobile-description-label">Təsvir</div>
                    <div className="mobile-description-content">
                      {item.description}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Restaurant Footer */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <RestaurantFooter />
        </motion.section>
      </div>
    </div>
  );
};

export default CustomerItemDetail;
