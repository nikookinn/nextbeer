import React, { useState, useCallback } from 'react';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';
import { MapPin, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { LocationCoordinates } from '../../types/restaurant.types';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Only OpenStreetMap orijinal map
const MAP_STYLES = {
  openstreetmap: {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
};

interface LocationPickerProps {
  value?: LocationCoordinates | null;
  onChange: (location: LocationCoordinates | null) => void;
  disabled?: boolean;
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  
  React.useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
}

// Simple click handler component
function LocationMarker({ position, onChange, disabled }: {
  position: LocationCoordinates | null;
  onChange: (location: LocationCoordinates) => void;
  disabled: boolean;
}) {
  useMapEvents({
    click(e) {
      if (!disabled) {
        onChange({ latitude: e.latlng.lat, longitude: e.latlng.lng });
      }
    },
  });

  return position === null ? null : (
    <Marker 
      position={[position.latitude, position.longitude]}
      draggable={!disabled}
      eventHandlers={{
        dragend(e) {
          if (!disabled) {
            const marker = e.target;
            const position = marker.getLatLng();
            onChange({ latitude: position.lat, longitude: position.lng });
          }
        },
      }}
    />
  );
}

const LocationPicker: React.FC<LocationPickerProps> = ({ 
  value, 
  onChange, 
  disabled = false 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const defaultLocation = value || { latitude: 40.409264, longitude: 49.867092 };
  const currentStyle = MAP_STYLES.openstreetmap;
  const mapCenter: [number, number] = value 
    ? [value.latitude, value.longitude] 
    : [defaultLocation.latitude, defaultLocation.longitude];

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Bu brauzer geolokasiyanı dəstəkləmir.');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        onChange(location);
        setIsLoading(false);
      },
      () => {
        setError('Məkanınız alınmadı. Zəhmət olmasa xəritədə əl ilə seçin.');
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  }, [onChange]);

  const clearLocation = useCallback(() => {
    onChange(null);
  }, [onChange]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <MapPin size={20} />
        Restoran Lokasiyası
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {disabled 
          ? 'Cari restoran lokasiyası xəritədə göstərilir.'
          : 'Restoranınızın yerini təyin etmək üçün xəritəyə klikləyin və ya markeri sürükləyin. Həmçinin cari lokasiyanızı istifadə edə bilərsiniz.'
        }
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!disabled && (
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={isLoading ? <CircularProgress size={16} /> : <Navigation size={16} />}
            onClick={getCurrentLocation}
            disabled={isLoading || disabled}
            size="small"
          >
            {isLoading ? 'Məkan Alınır...' : 'Cari Məkanı İstifadə Et'}
          </Button>
          
          {value && (
            <Button
              variant="outlined"
              color="error"
              onClick={clearLocation}
              disabled={disabled}
              size="small"
            >
              Məkanı Təmizlə
            </Button>
          )}
        </Box>
      )}


      <Box
        sx={{
          width: '100%',
          height: 400,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
          '& .leaflet-container': {
            borderRadius: 2,
          },
        }}
      >
        <MapContainer
          center={mapCenter}
          zoom={value ? 16 : 13}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
          scrollWheelZoom={true}
          key={`openstreetmap-${value?.latitude}-${value?.longitude}`}
        >
          <TileLayer
            attribution={currentStyle.attribution}
            url={currentStyle.url}
          />
          <MapUpdater center={mapCenter} />
          <LocationMarker
            position={value || null}
            onChange={onChange}
            disabled={disabled}
          />
        </MapContainer>
      </Box>

      {value && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary">
            Seçilmiş Koordinatlar:
          </Typography>
          <Typography variant="body2" fontFamily="monospace">
            Enlik: {value.latitude.toFixed(6)}
          </Typography>
          <Typography variant="body2" fontFamily="monospace">
            Uzunluq: {value.longitude.toFixed(6)}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default LocationPicker;
