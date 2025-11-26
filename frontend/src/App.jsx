import { useState, useEffect } from 'react';
import MapComponent from './components/MapComponent';
import PlaceForm from './components/PlaceForm';
import PlacesTable from './components/PlacesTable';
import SearchBar from './components/SearchBar';
import ZoneForm from './components/ZoneForm';
import ZonesTable from './components/ZonesTable';
import './App.css';

const API_URL = 'http://localhost:3000/api/places';
const ZONES_API_URL = 'http://localhost:3000/api/zones';

function App() {
  const [places, setPlaces] = useState([]);
  const [zones, setZones] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    lat: '',
    lng: '',
    id: ''
  });
  const [zoneFormData, setZoneFormData] = useState({
    name: '',
    description: '',
    coordinates: [],
    id: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [editZoneMode, setEditZoneMode] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [isDrawingZone, setIsDrawingZone] = useState(false);

  useEffect(() => {
    loadPlaces();
    loadZones();
  }, []);

  async function loadPlaces() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setPlaces(data);
    } catch (error) {
      console.error('Error cargando lugares:', error);
    }
  }

  async function loadZones() {
    try {
      const response = await fetch(ZONES_API_URL);
      const data = await response.json();
      setZones(data);
    } catch (error) {
      console.error('Error cargando zonas:', error);
    }
  }

  const filteredPlaces = places.filter(place => 
    place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    place.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleMapClick(latlng) {
    setFormData(prev => ({
      ...prev,
      lat: latlng.lat,
      lng: latlng.lng
    }));
    setSelectedLocation(latlng);
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function handleZoneInputChange(e) {
    const { name, value } = e.target;
    setZoneFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { name, description, lat, lng, id } = formData;

    if (!lat || !lng) {
      alert('Por favor selecciona una ubicación en el mapa');
      return;
    }

    const url = editMode ? `${API_URL}/${id}` : API_URL;
    const method = editMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          description,
          latitude: parseFloat(lat),
          longitude: parseFloat(lng)
        })
      });

      await response.json();
      alert(editMode ? 'Lugar actualizado' : 'Lugar registrado');
      resetForm();
      loadPlaces();
    } catch (error) {
      console.error('Error guardando lugar:', error);
      alert('Error al guardar el lugar');
    }
  }

  async function handleZoneSubmit(e) {
    e.preventDefault();

    const { name, description, coordinates, id } = zoneFormData;

    if (coordinates.length < 3) {
      alert('Por favor dibuja una zona con al menos 3 puntos');
      return;
    }

    const url = editZoneMode ? `${ZONES_API_URL}/${id}` : ZONES_API_URL;
    const method = editZoneMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          description,
          coordinates
        })
      });

      await response.json();
      alert(editZoneMode ? 'Zona actualizada' : 'Zona registrada');
      resetZoneForm();
      loadZones();
    } catch (error) {
      console.error('Error guardando zona:', error);
      alert('Error al guardar la zona');
    }
  }

  function handleZoneComplete(coordinates) {
    setZoneFormData(prev => ({
      ...prev,
      coordinates
    }));
    setIsDrawingZone(false);
    alert('Zona dibujada. Completa el formulario y guarda.');
  }

  function handleStartDrawing() {
    setIsDrawingZone(!isDrawingZone);
    if (!isDrawingZone) {
      setZoneFormData(prev => ({
        ...prev,
        coordinates: []
      }));
    }
  }

  function resetForm() {
    setFormData({
      name: '',
      description: '',
      lat: '',
      lng: '',
      id: ''
    });
    setEditMode(false);
    setSelectedLocation(null);
  }

  function resetZoneForm() {
    setZoneFormData({
      name: '',
      description: '',
      coordinates: [],
      id: ''
    });
    setEditZoneMode(false);
    setIsDrawingZone(false);
    setSelectedZone(null);
  }

  function handleEdit(place) {
    const [lng, lat] = place.location.coordinates;
    setFormData({
      name: place.name,
      description: place.description,
      lat: lat,
      lng: lng,
      id: place._id
    });
    setEditMode(true);
    setSelectedLocation({ lat, lng });
  }

  function handleEditZone(zone) {
    setZoneFormData({
      name: zone.name,
      description: zone.description,
      coordinates: zone.coordinates,
      id: zone._id
    });
    setEditZoneMode(true);
    setSelectedZone(zone);
  }

  async function handleDelete(id) {
    if (!window.confirm('¿Estás seguro de eliminar este lugar?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      alert(data.message);
      loadPlaces();
    } catch (error) {
      console.error('Error eliminando lugar:', error);
      alert('Error al eliminar el lugar');
    }
  }

  async function handleDeleteZone(id) {
    if (!window.confirm('¿Estás seguro de eliminar esta zona?')) {
      return;
    }

    try {
      const response = await fetch(`${ZONES_API_URL}/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      alert(data.message);
      loadZones();
    } catch (error) {
      console.error('Error eliminando zona:', error);
      alert('Error al eliminar la zona');
    }
  }

  function handleSelectZone(zone) {
    setSelectedZone(zone);
  }

  return (
    <div className="App">
      <h1>Registro de Ubicaciones con Leaflet</h1>
      
      <SearchBar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        resultCount={filteredPlaces.length}
      />

      <MapComponent
        places={filteredPlaces}
        selectedLocation={selectedLocation}
        onMapClick={handleMapClick}
        editingPlace={editMode}
        zones={zones}
        onZoneComplete={handleZoneComplete}
        selectedZone={selectedZone}
        isDrawingZone={isDrawingZone}
      />

      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div style={{ flex: 1 }}>
          <h2>Gestión de Lugares</h2>
          <PlaceForm
            formData={formData}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={resetForm}
            editMode={editMode}
          />

          <PlacesTable
            places={filteredPlaces}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        <div style={{ flex: 1 }}>
          <ZoneForm
            formData={zoneFormData}
            onChange={handleZoneInputChange}
            onSubmit={handleZoneSubmit}
            onCancel={resetZoneForm}
            editMode={editZoneMode}
            onStartDrawing={handleStartDrawing}
            isDrawing={isDrawingZone}
          />

          <ZonesTable
            zones={zones}
            onEdit={handleEditZone}
            onDelete={handleDeleteZone}
            onSelect={handleSelectZone}
          />
        </div>
      </div>
    </div>
  );
}

export default App;