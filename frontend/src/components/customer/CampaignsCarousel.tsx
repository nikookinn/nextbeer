import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import { AlertCircle, Play, Pause } from 'lucide-react';
import { useGetCampaignsQuery } from '../../api/customerApi';
import { getFullImageUrl } from '../../utils/imageUtils';

// Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Carousel styles
import './customer-style/carusel-styles.css';

// Enhanced Image Component with Loading State
interface CampaignImageProps {
  src: string;
  alt: string;
  className: string;
}

const CampaignImage: React.FC<CampaignImageProps> = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  // Check if image is already preloaded
  useEffect(() => {
    if (src) {
      const img = new Image();
      img.onload = handleLoad;
      img.onerror = handleError;
      img.src = src;
    } else {
      setIsLoaded(true);
    }
  }, [src]);

  const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM2NjdlZWE7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNzY0YmEyO3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhZCkiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNhbXBhaWduIEltYWdlPC90ZXh0Pjwvc3ZnPg==';

  return (
    <div className="campaign-image-wrapper">
      {/* Loading Skeleton */}
      {!isLoaded && (
        <div className="campaign-image-skeleton">
          <div className="skeleton-shimmer" />
          <div className="skeleton-pulse">
            <div className="skeleton-icon">📸</div>
            <div className="skeleton-text">Yüklənir...</div>
          </div>
        </div>
      )}
      
      {/* Actual Image */}
      <img
        src={hasError ? fallbackImage : src || fallbackImage}
        alt={alt}
        className={`${className} ${isLoaded ? 'loaded' : 'loading'}`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        decoding="async"
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out'
        }}
      />
    </div>
  );
};

const CampaignsCarousel: React.FC = () => {
  const { data: campaignsData, isLoading, error } = useGetCampaignsQuery({ page: 0, size: 10 });
  const [isPlaying, setIsPlaying] = useState(true);
  const swiperRef = useRef<any>(null);
  const campaigns = campaignsData?.content || [];

  // Use mock data if no backend data
  const finalCampaigns = campaigns.length > 0 ? campaigns : [
    {
      campaignId: 1,
      name: "Yay Xüsusiyyəti 🌞",
      imageUrl: null,
      description: "Serinləşdirici yay içkilərimizdən zövq alın!"
    },
    {
      campaignId: 2,
      name: "Xəbərdar Saat 🍻",
      imageUrl: null,
      description: "Axşam 17:00-19:00 arası bütün içkilərdə 50% endirim"
    },
    {
      campaignId: 3,
      name: "Həftəsonu Zənəti 🍽️",
      imageUrl: null,
      description: "Eksklüziv yemləklər ilə xüsusi həftəsonu menyusu"
    }
  ];

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (swiperRef.current) {
      if (isPlaying) {
        swiperRef.current.autoplay.stop();
      } else {
        swiperRef.current.autoplay.start();
      }
    }
  };


  // Loading skeleton
  if (isLoading) {
    return (
      <div className="campaigns-carousel-container">
        <div className="campaigns-loading">
          {[...Array(3)].map((_, index) => (
            <motion.div
              key={index}
              className="campaign-skeleton"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="skeleton-image shimmer" />
              <div className="skeleton-content">
                <div className="skeleton-title shimmer" />
                <div className="skeleton-text shimmer" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div 
        className="campaigns-error"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <AlertCircle size={48} />
        <h3>Kampanyalar yüklənə bilmədi</h3>
        <p>Zəhmət olmasa daha sonra yenidən cəhd edin</p>
      </motion.div>
    );
  }

  if (finalCampaigns.length === 0) {
    return (
      <motion.div 
        className="campaigns-empty"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <AlertCircle size={64} />
        <h3>Heç bir kampanya mövcud deyil</h3>
        <p>Həyəcanlı təkliflər üçün tezliklə yenidən baxın!</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="campaigns-carousel-container"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Premium Swiper 3D Coverflow Carousel */}
      <div className="swiper-3d-carousel">
        <Swiper
          ref={swiperRef}
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          spaceBetween={0}
          initialSlide={0}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={false}
          autoplay={{
            delay: 5000, // Increased delay for better image loading
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
            waitForTransition: true, // Wait for transition to complete
          }}
          loop={finalCampaigns.length > 1}
          speed={800} // Slower transition for smoother experience
          touchRatio={1}
          touchAngle={45}
          simulateTouch={true}
          allowTouchMove={true}
          freeMode={false}
          watchSlidesProgress={true}
          modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
          className="campaigns-swiper-3d"
        >
          {finalCampaigns.map((campaign, index) => (
            <SwiperSlide key={campaign.campaignId} className="campaign-slide-swiper">
              <motion.div 
                className="campaign-card-swiper"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
              >
                <div className="campaign-image-container-swiper">
                  <CampaignImage
                    src={getFullImageUrl(campaign.imageUrl) || ''}
                    alt={campaign.name}
                    className="campaign-image-swiper"
                  />
                  <div className="campaign-overlay-swiper" />
                </div>
                
                <div className="campaign-content-swiper">
                  <h3 className="campaign-title-swiper">
                    {campaign.name}
                  </h3>
                  {campaign.description && (
                    <p className="campaign-description-swiper">
                      {campaign.description}
                    </p>
                  )}
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Premium Play/Pause Button */}
        <motion.button
          className="swiper-play-btn"
          onClick={togglePlayPause}
          whileHover={{ 
            scale: 1.15, 
            rotate: 5,
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)"
          }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: isPlaying ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </motion.div>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CampaignsCarousel;