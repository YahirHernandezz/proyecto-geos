import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import ZoneDrawer from './ZoneDrawer';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix para los iconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function MapClickHandler({ onMapClick, isDrawingZone }) {
  useMapEvents({
    click: (e) => {
      if (!isDrawingZone) {
        onMapClick(e.latlng);
      }
    },
  });
  return null;
}

function MapComponent({ 
  places, 
  selectedLocation, 
  onMapClick, 
  editingPlace,
  zones,
  onZoneComplete,
  selectedZone,
  isDrawingZone
}) {
  return (
    <MapContainer 
      center={[20.505, -101.695440]} 
      zoom={6} 
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapClickHandler onMapClick={onMapClick} isDrawingZone={isDrawingZone} />

      {/* Componente para dibujar y mostrar zonas */}
      <ZoneDrawer 
        zones={zones}
        onZoneComplete={onZoneComplete}
        selectedZone={selectedZone}
        editingZone={isDrawingZone}
      />

      {/* Marcador de selección de lugar */}
      {selectedLocation && !isDrawingZone && (
        <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
          <Popup>
            {editingPlace ? 'Editando ubicación' : 'Ubicación seleccionada'}
          </Popup>
        </Marker>
      )}

      {/* Marcadores de lugares registrados */}
      {places.map((place) => {
        const [lng, lat] = place.location.coordinates;
        return (
          <Marker key={place._id} position={[lat, lng]}>
            <Popup>
              <b>{place.name}</b>
              <br />
              {place.description}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default MapComponent;