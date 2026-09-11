import { useState, useEffect } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';

export type LocationCity = {
  city: string;
  state: string;
  loading: boolean;
  granted: boolean;
};

/**
 * Hook to request location permission on app open,
 * get lat/lon, and reverse-geocode to a city name.
 * Falls back to the provided default city if permission denied or error.
 */
export const useLocationCity = (defaultCity: string = 'Pune') => {
  const [locationCity, setLocationCity] = useState<LocationCity>({
    city: defaultCity,
    state: '',
    loading: true,
    granted: false,
  });

  useEffect(() => {
    const requestAndFetch = async () => {
      try {
        // 1. Request permission (Android)
        let permissionGranted = false;

        if (Platform.OS === 'android') {
          const status = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access',
              message:
                'HelloDoctor needs your location to show doctors near you and provide city-specific health info.',
              buttonNeutral: 'Ask Later',
              buttonNegative: 'Deny',
              buttonPositive: 'Allow',
            },
          );
          permissionGranted = status === PermissionsAndroid.RESULTS.GRANTED;
        } else {
          // iOS handles permission via Geolocation.requestAuthorization
          Geolocation.requestAuthorization();
          permissionGranted = true;
        }

        if (!permissionGranted) {
          console.log('Location permission denied, using default city:', defaultCity);
          setLocationCity({
            city: defaultCity,
            state: '',
            loading: false,
            granted: false,
          });
          return;
        }

        // 2. Get current position using @react-native-community/geolocation
        Geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              console.log('Location obtained:', latitude, longitude);

              // 3. Reverse geocode using Nominatim (free, no API key)
              const geoRes = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
                { headers: { 'User-Agent': 'HelloDoctorApp/1.0' } },
              );

              if (geoRes.data && geoRes.data.address) {
                const addr = geoRes.data.address;
                const detectedCity =
                  addr.city ||
                  addr.town ||
                  addr.village ||
                  addr.county ||
                  addr.state_district ||
                  defaultCity;
                const detectedState = addr.state || '';

                console.log('Detected city:', detectedCity, 'state:', detectedState);

                setLocationCity({
                  city: detectedCity,
                  state: detectedState,
                  loading: false,
                  granted: true,
                });
              } else {
                setLocationCity({
                  city: defaultCity,
                  state: '',
                  loading: false,
                  granted: true,
                });
              }
            } catch (geoError) {
              console.log('Reverse geocode error:', geoError);
              setLocationCity({
                city: defaultCity,
                state: '',
                loading: false,
                granted: true,
              });
            }
          },
          (error) => {
            console.log('Geolocation error:', error.message);
            setLocationCity({
              city: defaultCity,
              state: '',
              loading: false,
              granted: false,
            });
          },
          { enableHighAccuracy: false, timeout: 15000, maximumAge: 300000 },
        );
      } catch (error) {
        console.log('Location error:', error);
        setLocationCity({
          city: defaultCity,
          state: '',
          loading: false,
          granted: false,
        });
      }
    };

    requestAndFetch();
  }, [defaultCity]);

  return locationCity;
};
