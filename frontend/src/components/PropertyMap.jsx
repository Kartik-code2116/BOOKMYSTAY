import { useMemo } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';

function PropertyMap({ properties = [], onMarkerClick }) {
  const mappable = useMemo(
    () =>
      properties.filter(
        (p) =>
          p.latitude !== undefined &&
          p.latitude !== null &&
          p.longitude !== undefined &&
          p.longitude !== null &&
          !Number.isNaN(parseFloat(p.latitude)) &&
          !Number.isNaN(parseFloat(p.longitude))
      ),
    [properties]
  );

  const defaultCenter = [20.5937, 78.9629];
  const center = mappable.length
    ? [parseFloat(mappable[0].latitude), parseFloat(mappable[0].longitude)]
    : defaultCenter;

  return (
    <MapContainer
      center={center}
      zoom={mappable.length ? 12 : 4}
      style={{
        height: '420px',
        width: '100%',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--neutral-200)'
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {mappable.map((property) => (
        <Marker
          key={property.id}
          position={[parseFloat(property.latitude), parseFloat(property.longitude)]}
          eventHandlers={{ click: () => onMarkerClick?.(property) }}
        />
      ))}
    </MapContainer>
  );
}

export default PropertyMap;
