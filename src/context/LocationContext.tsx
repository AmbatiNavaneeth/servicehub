import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { locations } from '../data/dummyData';

interface LocationContextType {
  selectedLocation: string;
  selectedCity: string;
  setLocation: (locationId: string) => void;
  detectLocation: () => Promise<void>;
  isDetecting: boolean;
  detectError: string | null;
}

const LocationContext = createContext<LocationContextType | null>(null);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [selectedLocation, setSelectedLocation] = useState('loc14');
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectError, setDetectError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('servicehub_location');
    if (stored) setSelectedLocation(stored);
  }, []);

  const setLocation = (id: string) => {
    localStorage.setItem('servicehub_location', id);
    setSelectedLocation(id);
  };

  const detectLocation = async () => {
    setIsDetecting(true);
    setDetectError(null);

    if (!navigator.geolocation) {
      setDetectError('Geolocation is not supported by your browser');
      setIsDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14`
          );
          const data = await res.json();
          const addressParts = [
            data?.address?.suburb,
            data?.address?.neighbourhood,
            data?.address?.quarter,
            data?.address?.city_district,
            data?.address?.town,
            data?.address?.city,
            data?.address?.state_district,
          ].filter(Boolean);
          const detectedArea = addressParts[0]?.toLowerCase() || '';

          // Match detected area to our locations list
          const matched = locations.find(
            (l) =>
              l.name.toLowerCase().includes(detectedArea) ||
              detectedArea.includes(l.name.toLowerCase())
          );

          if (matched) {
            setLocation(matched.id);
          } else {
            // Try matching on the address components more broadly
            const fullAddress = JSON.stringify(data?.address || {}).toLowerCase();
            const broadMatch = locations.find((l) => fullAddress.includes(l.name.toLowerCase()));
            if (broadMatch) {
              setLocation(broadMatch.id);
            } else {
              setLocation('loc14');
            }
          }
        } catch {
          setLocation('loc14');
        }
        setIsDetecting(false);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setDetectError('Location permission denied. Please allow location access or select manually.');
        } else {
          setDetectError('Unable to detect your location. Please select manually.');
        }
        setIsDetecting(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const loc = locations.find((l) => l.id === selectedLocation) || locations[0];

  return (
    <LocationContext.Provider
      value={{ selectedLocation, selectedCity: loc.city, setLocation, detectLocation, isDetecting, detectError }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used within LocationProvider');
  return ctx;
}
