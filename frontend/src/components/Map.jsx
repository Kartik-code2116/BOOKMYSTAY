import React from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';

const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 };

function ClickHandler({ interactive, onLocationSelect }) {
  useMapEvents({
    click: (e) => {
      if (interactive && onLocationSelect) {
        onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    }
  });
  return null;
}

const Map = ({ latitude, longitude, title, interactive = false, onLocationSelect }) => {
  const isValidCoords = latitude !== undefined && latitude !== null && latitude !== '' &&
    longitude !== undefined && longitude !== null && longitude !== '';
  const lat = isValidCoords ? parseFloat(latitude) : null;
  const lng = isValidCoords ? parseFloat(longitude) : null;
  const validParsed = lat != null && lng != null && !Number.isNaN(lat) && !Number.isNaN(lng);

  if (!validParsed && !interactive) {
    return (
      <div style={{
        width: '100%', height: '400px', background: 'var(--neutral-100)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        borderRadius: 'var(--radius-lg)', color: 'var(--neutral-500)', border: '1px dashed var(--neutral-300)',
        padding: 'var(--spacing-lg)', textAlign: 'center'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>📍</div>
        <div>No location coordinates available for this property.</div>
        <div style={{ fontSize: '0.8rem', marginTop: 'var(--spacing-xs)' }}>
          Edit this property to select a location on the map.
        </div>
      </div>
    );
  }

  const center = validParsed ? [lat, lng] : [DEFAULT_CENTER.lat, DEFAULT_CENTER.lng];

  return (
    <MapContainer
      center={center}
      zoom={validParsed ? (interactive ? 13 : 15) : 5}
      style={{
        width: '100%',
        height: '400px',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)'
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler interactive={interactive} onLocationSelect={onLocationSelect} />
      {validParsed && (
        <Marker
          position={[lat, lng]}
          draggable={interactive}
          eventHandlers={
            interactive
              ? {
                  dragend: (event) => {
                    const marker = event.target;
                    const pos = marker.getLatLng();
                    onLocationSelect?.({ lat: pos.lat, lng: pos.lng });
                  }
                }
              : undefined
          }
          title={title || 'Property Location'}
        />
      )}
    </MapContainer>
  );
};

export default Map;
