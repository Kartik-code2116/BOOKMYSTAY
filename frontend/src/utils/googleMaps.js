const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

let authFailedGlobal = false;
window.gm_authFailure = () => {
  authFailedGlobal = true;
  window.dispatchEvent(new Event('gm_authFailure'));
};

let googleMapsPromise = null;

export const hasGoogleMapsKey = () => Boolean(GOOGLE_MAPS_API_KEY);

export const hasGoogleMapsAuthFailed = () => authFailedGlobal;

export const loadGoogleMaps = (libraries = ['marker']) => {
  if (googleMapsPromise) return googleMapsPromise;
  if (window.google && window.google.maps) {
    googleMapsPromise = Promise.resolve(window.google.maps);
    return googleMapsPromise;
  }

  if (!GOOGLE_MAPS_API_KEY) {
    return Promise.reject(new Error('Google Maps API key missing'));
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const libs = libraries.length ? `&libraries=${libraries.join(',')}` : '';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}${libs}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google.maps);
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });

  return googleMapsPromise;
};

export const reverseGeocode = async (lat, lng) => {
  // Try Google first when key is present.
  if (GOOGLE_MAPS_API_KEY) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      const first = data?.results?.[0];
      if (first) {
        const components = first.address_components || [];
        const city =
          components.find((c) => c.types.includes('locality'))?.long_name ||
          components.find((c) => c.types.includes('administrative_area_level_2'))?.long_name ||
          '';
        const country = components.find((c) => c.types.includes('country'))?.long_name || '';

        return {
          address: first.formatted_address || '',
          city,
          country
        };
      }
    } catch (error) {
      console.warn('Google reverse geocoding failed, using fallback provider:', error);
    }
  }

  // Fallback: OpenStreetMap Nominatim (no API key required).
  try {
    const osmResponse = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
    );
    const osmData = await osmResponse.json();
    const addressData = osmData?.address || {};
    const city =
      addressData.city ||
      addressData.town ||
      addressData.village ||
      addressData.county ||
      '';
    const country = addressData.country || '';

    return {
      address: osmData?.display_name || `${lat}, ${lng}`,
      city,
      country
    };
  } catch (error) {
    console.warn('Nominatim reverse geocoding failed:', error);
    return {
      address: `${lat}, ${lng}`,
      city: '',
      country: ''
    };
  }
};
