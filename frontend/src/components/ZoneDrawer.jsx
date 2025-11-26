import { useState } from 'react';
import { Polygon, Popup, useMapEvents } from 'react-leaflet';

function ZoneDrawer({ zones, onZoneComplete, selectedZone, editingZone }) {
  const [drawingPoints, setDrawingPoints] = useState([]);

  useMapEvents({
    click: (e) => {
      if (editingZone) {
        const { lat, lng } = e.latlng;
        setDrawingPoints(prev => [...prev, [lat, lng]]);
      }
    }
  });

  // Completar zona con doble click
  useMapEvents({
    dblclick: () => {
      if (editingZone && drawingPoints.length >= 3) {
        onZoneComplete(drawingPoints);
        setDrawingPoints([]);
      }
    }
  });

  return (
    <>
      {/* Zona en proceso de dibujo */}
      {drawingPoints.length > 0 && (
        <Polygon
          positions={drawingPoints}
          pathOptions={{ color: 'blue', fillColor: 'lightblue', fillOpacity: 0.4 }}
        />
      )}

      {/* Zonas guardadas */}
      {zones.map((zone) => (
        <Polygon
          key={zone._id}
          positions={zone.coordinates}
          pathOptions={{
            color: selectedZone?._id === zone._id ? 'red' : 'green',
            fillColor: selectedZone?._id === zone._id ? 'pink' : 'lightgreen',
            fillOpacity: 0.4
          }}
        >
          <Popup>
            <b>{zone.name}</b>
            <br />
            {zone.description}
            <br />
            <small>{zone.coordinates.length} puntos</small>
          </Popup>
        </Polygon>
      ))}
    </>
  );
}

export default ZoneDrawer;