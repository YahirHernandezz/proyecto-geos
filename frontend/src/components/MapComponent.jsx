import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import ZoneDrawer from './ZoneDrawer';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Icono de hospital estilo médico (azul)
const hospitalIcon = L.divIcon({
  className: 'custom-hospital-marker',
  html: `
    <div style="
      position: relative;
      width: 40px;
      height: 40px;
    ">
      <div style="
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 12px solid #0071e3;
      "></div>
      <div style="
        background: linear-gradient(135deg, #0071e3 0%, #0056b3 100%);
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0, 113, 227, 0.4);
        border: 3px solid white;
      ">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/>
        </svg>
      </div>
    </div>
  `,
  iconSize: [40, 52],
  iconAnchor: [20, 52],
  popupAnchor: [0, -52]
});

// Icono destacado para búsquedas (rojo médico)
const highlightedIcon = L.divIcon({
  className: 'custom-hospital-marker-highlight',
  html: `
    <div style="
      position: relative;
      width: 40px;
      height: 40px;
      animation: bounce 1s ease-in-out infinite;
    ">
      <div style="
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 12px solid #d32f2f;
      "></div>
      <div style="
        background: linear-gradient(135deg, #d32f2f 0%, #c62828 100%);
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(211, 47, 47, 0.5);
        border: 3px solid white;
      ">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/>
        </svg>
      </div>
    </div>
  `,
  iconSize: [40, 52],
  iconAnchor: [20, 52],
  popupAnchor: [0, -52]
});

// Icono de ubicación seleccionada (verde)
const selectedIcon = L.divIcon({
  className: 'custom-hospital-marker-selected',
  html: `
    <div style="
      position: relative;
      width: 40px;
      height: 40px;
    ">
      <div style="
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 12px solid #00a878;
      "></div>
      <div style="
        background: linear-gradient(135deg, #00a878 0%, #00bf8f 100%);
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0, 168, 120, 0.5);
        border: 3px solid white;
      ">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
    </div>
  `,
  iconSize: [40, 52],
  iconAnchor: [20, 52],
  popupAnchor: [0, -52]
});

// Agregar estilos para la animación
const style = document.createElement('style');
style.textContent = `
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  .custom-hospital-marker,
  .custom-hospital-marker-highlight,
  .custom-hospital-marker-selected {
    background: transparent !important;
    border: none !important;
  }
`;
document.head.appendChild(style);

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

function MapCenterUpdater({ places, searchTerm }) {
  const map = useMap();
  const previousPlacesRef = useRef([]);
  const previousSearchRef = useRef('');

  useEffect(() => {
    // Solo actualizar si hay un término de búsqueda activo o si cambiaron los lugares
    const placesChanged = JSON.stringify(places.map(p => p._id)) !== 
                          JSON.stringify(previousPlacesRef.current.map(p => p._id));
    const searchChanged = searchTerm !== previousSearchRef.current;
    
    // Solo recentrar si hay búsqueda activa y los lugares cambiaron
    if (searchTerm && placesChanged && places.length > 0) {
      const bounds = L.latLngBounds(
        places.map(place => {
          const [lng, lat] = place.location.coordinates;
          return [lat, lng];
        })
      );
      
      // Ajustar el mapa con un padding para mejor visualización
      map.fitBounds(bounds, { 
        padding: [50, 50],
        maxZoom: 15,
        animate: true,
        duration: 0.5
      });

      // Si solo hay un lugar, centrarlo con zoom específico
      if (places.length === 1) {
        const [lng, lat] = places[0].location.coordinates;
        setTimeout(() => {
          map.setView([lat, lng], 14, { animate: true });
        }, 100);
      }
    }

    // Actualizar referencias
    previousPlacesRef.current = places;
    previousSearchRef.current = searchTerm;
  }, [places, searchTerm, map]);

  return null;
}

function PlaceMarker({ place, isHighlighted }) {
  const markerRef = useRef(null);
  const [lng, lat] = place.location.coordinates;
  const markerIcon = isHighlighted ? highlightedIcon : hospitalIcon;

  useEffect(() => {
    // Abrir popup automáticamente si es el único resultado destacado
    if (isHighlighted && markerRef.current) {
      setTimeout(() => {
        markerRef.current.openPopup();
      }, 600);
    }
  }, [isHighlighted]);

  return (
    <Marker 
      ref={markerRef}
      position={[lat, lng]}
      icon={markerIcon}
    >
      <Popup>
        <div style={{ minWidth: '180px', padding: '4px' }}>
          <div style={{ 
            fontSize: '1.1rem', 
            fontWeight: '600',
            color: '#1d1d1f',
            marginBottom: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ fontSize: '1.2rem' }}>🏥</span>
            {place.name}
          </div>
          <span style={{ 
            color: '#6e6e73', 
            fontSize: '0.9rem',
            lineHeight: '1.4'
          }}>
            {place.description}
          </span>
        </div>
      </Popup>
    </Marker>
  );
}

function MapComponent({ 
  places, 
  selectedLocation, 
  onMapClick, 
  editingPlace,
  zones,
  onZoneComplete,
  selectedZone,
  isDrawingZone,
  searchTerm = ''
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
      <MapCenterUpdater places={places} searchTerm={searchTerm} />

      {/* Componente para dibujar y mostrar zonas */}
      <ZoneDrawer 
        zones={zones}
        onZoneComplete={onZoneComplete}
        selectedZone={selectedZone}
        editingZone={isDrawingZone}
      />

      {/* Marcador de selección de lugar */}
      {selectedLocation && !isDrawingZone && (
        <Marker 
          position={[selectedLocation.lat, selectedLocation.lng]}
          icon={selectedIcon}
        >
          <Popup>
            <div style={{ padding: '4px', textAlign: 'center' }}>
              <span style={{ fontSize: '1.2rem' }}>📍</span>
              <div style={{ marginTop: '4px', fontWeight: '600', color: '#1d1d1f' }}>
                {editingPlace ? 'Editando ubicación' : 'Ubicación seleccionada'}
              </div>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Marcadores de lugares registrados */}
      {places && places.length > 0 && places.map((place) => {
        const isHighlighted = places.length <= 3;
        return (
          <PlaceMarker 
            key={place._id}
            place={place}
            isHighlighted={isHighlighted}
          />
        );
      })}
    </MapContainer>
  );
}

export default MapComponent;