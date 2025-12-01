import { useState, useEffect } from 'react';
import MapComponent from './components/MapComponent';
import PlaceForm from './components/PlaceForm';
import PlacesTable from './components/PlacesTable';
import SearchBar from './components/SearchBar';
import ZoneForm from './components/ZoneForm';
import ZonesTable from './components/ZonesTable';
import CaseForm from './components/CaseForm';
import CasesTable from './components/CasesTable';
import ResourceForm from './components/ResourceForm';
import ResourcesTable from './components/ResourcesTable';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

const API_URL = 'http://localhost:3000/api/places';
const ZONES_API_URL = 'http://localhost:3000/api/zones';
const CASES_API_URL = 'http://localhost:3000/api/cases';
const RESOURCES_API_URL = 'http://localhost:3000/api/resources';

function App() {
  const [places, setPlaces] = useState([]);
  const [zones, setZones] = useState([]);
  const [cases, setCases] = useState([]);
  const [resources, setResources] = useState([]);
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
  const [caseFormData, setCaseFormData] = useState({
    disease: '',
    caseCount: '',
    status: 'Activo',
    sourcePlace: '',
    description: '',
    id: ''
  });
  const [resourceFormData, setResourceFormData] = useState({
    resourceType: '',
    quantity: '',
    status: 'Disponible',
    placeId: '',
    notes: '',
    id: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [editZoneMode, setEditZoneMode] = useState(false);
  const [editCaseMode, setEditCaseMode] = useState(false);
  const [editResourceMode, setEditResourceMode] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [isDrawingZone, setIsDrawingZone] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || '');
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadPlaces();
      loadZones();
      loadCases();
      loadResources();
    }
  }, [isAuthenticated]);

  function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    setUserEmail('');
    setPlaces([]);
    setZones([]);
    setCases([]);
    setResources([]);
  }

  function handleLoginSuccess(data) {
    setIsAuthenticated(true);
    setUserEmail(data.user.email);
    localStorage.setItem('userEmail', data.user.email);
    loadPlaces();
    loadZones();
  }

  async function loadPlaces() {
    try {
      const response = await fetch(API_URL, {
        headers: getAuthHeaders()
      });
      if (response.status === 401 || response.status === 403) {
        alert('Sesión expirada. Por favor inicia sesión nuevamente.');
        handleLogout();
        return;
      }
      const data = await response.json();
      setPlaces(data);
    } catch (error) {
      console.error('Error cargando lugares:', error);
      alert('Error al cargar lugares');
    }
  }

  async function loadZones() {
    try {
      const response = await fetch(ZONES_API_URL, {
        headers: getAuthHeaders()
      });
      if (response.status === 401 || response.status === 403) {
        alert('Sesión expirada. Por favor inicia sesión nuevamente.');
        handleLogout();
        return;
      }
      const data = await response.json();
      setZones(data);
    } catch (error) {
      console.error('Error cargando zonas:', error);
      alert('Error al cargar zonas');
    }
  }

  async function loadCases() {
    try {
      const response = await fetch(CASES_API_URL, {
        headers: getAuthHeaders()
      });
      if (response.status === 401 || response.status === 403) {
        alert('Sesión expirada. Por favor inicia sesión nuevamente.');
        handleLogout();
        return;
      }
      const data = await response.json();
      setCases(data);
    } catch (error) {
      console.error('Error cargando casos:', error);
      alert('Error al cargar casos epidemiológicos');
    }
  }

  async function loadResources() {
    try {
      const response = await fetch(RESOURCES_API_URL, {
        headers: getAuthHeaders()
      });
      if (response.status === 401 || response.status === 403) {
        alert('Sesión expirada. Por favor inicia sesión nuevamente.');
        handleLogout();
        return;
      }
      const data = await response.json();
      setResources(data);
    } catch (error) {
      console.error('Error cargando recursos:', error);
      alert('Error al cargar recursos sanitarios');
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
    setCaseFormData(prev => ({
      ...prev,
      lat: latlng.lat,
      lng: latlng.lng
    }));
    setResourceFormData(prev => ({
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
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name,
          description,
          latitude: parseFloat(lat),
          longitude: parseFloat(lng)
        })
      });

      if (response.status === 401 || response.status === 403) {
        alert('Sesión expirada. Por favor inicia sesión nuevamente.');
        handleLogout();
        return;
      }

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || 'Error al guardar el lugar');
        return;
      }
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
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name,
          description,
          coordinates
        })
      });

      if (response.status === 401 || response.status === 403) {
        alert('Sesión expirada. Por favor inicia sesión nuevamente.');
        handleLogout();
        return;
      }

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || 'Error al guardar la zona');
        return;
      }
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
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.status === 401 || response.status === 403) {
        alert('Sesión expirada. Por favor inicia sesión nuevamente.');
        handleLogout();
        return;
      }

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || 'Error al eliminar el lugar');
        return;
      }
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
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.status === 401 || response.status === 403) {
        alert('Sesión expirada. Por favor inicia sesión nuevamente.');
        handleLogout();
        return;
      }

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || 'Error al eliminar la zona');
        return;
      }
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

  // Case handlers
  function handleCaseInputChange(e) {
    const { name, value } = e.target;
    setCaseFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleCaseSubmit(e) {
    e.preventDefault();

    const { disease, caseCount, status, sourcePlace, description, id } = caseFormData;

    if (!disease || !caseCount) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    const url = editCaseMode ? `${CASES_API_URL}/${id}` : CASES_API_URL;
    const method = editCaseMode ? 'PUT' : 'POST';

    // Preparar el body - solo incluir location si hay sourcePlace
    const bodyData = {
      disease,
      caseCount: parseInt(caseCount),
      status,
      description
    };

    // Si hay sourcePlace (zona), agregarlo
    if (sourcePlace) {
      bodyData.sourcePlace = sourcePlace;
      // Obtener el centro de la zona seleccionada
      const selectedZone = zones.find(zone => zone._id === sourcePlace);
      if (selectedZone && selectedZone.coordinates && selectedZone.coordinates.length > 0) {
        // Calcular el centroide de la zona
        const lats = selectedZone.coordinates.map(coord => coord.lat);
        const lngs = selectedZone.coordinates.map(coord => coord.lng);
        const centerLat = lats.reduce((a, b) => a + b, 0) / lats.length;
        const centerLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
        
        if (centerLng != null && centerLat != null) {
          bodyData.location = {
            type: 'Point',
            coordinates: [centerLng, centerLat]
          };
        }
      }
    }

    try {
      const response = await fetch(url, {
        method: method,
        headers: getAuthHeaders(),
        body: JSON.stringify(bodyData)
      });

      if (response.status === 401 || response.status === 403) {
        alert('Sesión expirada. Por favor inicia sesión nuevamente.');
        handleLogout();
        return;
      }

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || 'Error al guardar el caso');
        return;
      }
      alert(editCaseMode ? 'Caso actualizado' : 'Caso registrado');
      resetCaseForm();
      loadCases();
    } catch (error) {
      console.error('Error guardando caso:', error);
      alert('Error al guardar el caso');
    }
  }

  function handleEditCase(caseItem) {
    setCaseFormData({
      disease: caseItem.disease,
      caseCount: caseItem.caseCount,
      status: caseItem.status || 'Activo',
      sourcePlace: caseItem.sourcePlace?._id || '',
      description: caseItem.description || '',
      id: caseItem._id
    });
    setEditCaseMode(true);
  }

  async function handleDeleteCase(id) {
    if (!window.confirm('¿Estás seguro de eliminar este caso?')) {
      return;
    }

    try {
      const response = await fetch(`${CASES_API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.status === 401 || response.status === 403) {
        alert('Sesión expirada. Por favor inicia sesión nuevamente.');
        handleLogout();
        return;
      }

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || 'Error al eliminar el caso');
        return;
      }
      alert(data.message);
      loadCases();
    } catch (error) {
      console.error('Error eliminando caso:', error);
      alert('Error al eliminar el caso');
    }
  }

  function resetCaseForm() {
    setCaseFormData({
      disease: '',
      caseCount: '',
      status: 'Activo',
      sourcePlace: '',
      description: '',
      id: ''
    });
    setEditCaseMode(false);
  }

  // Resource handlers
  function handleResourceInputChange(e) {
    const { name, value } = e.target;
    setResourceFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleResourceSubmit(e) {
    e.preventDefault();

    const { resourceType, quantity, status, placeId, notes, id } = resourceFormData;

    if (!resourceType || !quantity) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    const url = editResourceMode ? `${RESOURCES_API_URL}/${id}` : RESOURCES_API_URL;
    const method = editResourceMode ? 'PUT' : 'POST';

    // Preparar el body - solo incluir location si hay placeId
    const bodyData = {
      resourceType,
      quantity: parseInt(quantity),
      status,
      notes
    };

    // Si hay placeId (zona), agregarlo y obtener coordenadas
    if (placeId) {
      bodyData.placeId = placeId;
      // Obtener el centro de la zona seleccionada
      const selectedZone = zones.find(zone => zone._id === placeId);
      if (selectedZone && selectedZone.coordinates && selectedZone.coordinates.length > 0) {
        // Calcular el centroide de la zona
        const lats = selectedZone.coordinates.map(coord => coord.lat);
        const lngs = selectedZone.coordinates.map(coord => coord.lng);
        const centerLat = lats.reduce((a, b) => a + b, 0) / lats.length;
        const centerLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
        
        if (centerLng != null && centerLat != null) {
          bodyData.location = {
            type: 'Point',
            coordinates: [centerLng, centerLat]
          };
        }
      }
    }

    try {
      const response = await fetch(url, {
        method: method,
        headers: getAuthHeaders(),
        body: JSON.stringify(bodyData)
      });

      if (response.status === 401 || response.status === 403) {
        alert('Sesión expirada. Por favor inicia sesión nuevamente.');
        handleLogout();
        return;
      }

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || 'Error al guardar el recurso');
        return;
      }
      alert(editResourceMode ? 'Recurso actualizado' : 'Recurso registrado');
      resetResourceForm();
      loadResources();
    } catch (error) {
      console.error('Error guardando recurso:', error);
      alert('Error al guardar el recurso');
    }
  }

  function handleEditResource(resource) {
    setResourceFormData({
      resourceType: resource.resourceType,
      quantity: resource.quantity,
      status: resource.status || 'Disponible',
      placeId: resource.placeId?._id || '',
      notes: resource.notes || '',
      id: resource._id
    });
    setEditResourceMode(true);
  }

  async function handleDeleteResource(id) {
    if (!window.confirm('¿Estás seguro de eliminar este recurso?')) {
      return;
    }

    try {
      const response = await fetch(`${RESOURCES_API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.status === 401 || response.status === 403) {
        alert('Sesión expirada. Por favor inicia sesión nuevamente.');
        handleLogout();
        return;
      }

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || 'Error al eliminar el recurso');
        return;
      }
      alert(data.message);
      loadResources();
    } catch (error) {
      console.error('Error eliminando recurso:', error);
      alert('Error al eliminar el recurso');
    }
  }

  function resetResourceForm() {
    setResourceFormData({
      resourceType: '',
      quantity: '',
      status: 'Disponible',
      placeId: '',
      notes: '',
      id: ''
    });
    setEditResourceMode(false);
  }

  function handleRegisterSuccess(data) {
    setShowRegister(false);
    alert('Cuenta creada exitosamente. Por favor inicia sesión.');
  }

  function handleGoToRegister() {
    setShowRegister(true);
  }

  function handleBackToLogin() {
    setShowRegister(false);
  }

  if (!isAuthenticated) {
    if (showRegister) {
      return (
        <div className="App">
          <Register 
            onRegisterSuccess={handleRegisterSuccess}
            onBackToLogin={handleBackToLogin}
          />
        </div>
      );
    }
    
    return (
      <div className="App">
        <Login 
          onLogin={handleLoginSuccess}
          onGoToRegister={handleGoToRegister}
        />
      </div>
    );
  }

  return (
    <div className="App">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Registro de Ubicaciones con Leaflet</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span>Usuario: <strong>{userEmail}</strong></span>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </div>
      
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginTop: '20px' }}>
        {/* Gestión de Lugares */}
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
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

        {/* Gestión de Zonas */}
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
          <h2>Gestión de Zonas</h2>
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

        {/* Gestión de Casos Epidemiológicos */}
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
          <h2>Casos Epidemiológicos</h2>
          <CaseForm
            formData={caseFormData}
            onChange={handleCaseInputChange}
            onSubmit={handleCaseSubmit}
            onCancel={resetCaseForm}
            editMode={editCaseMode}
            places={zones}
          />

          <CasesTable
            cases={cases}
            onEdit={handleEditCase}
            onDelete={handleDeleteCase}
          />
        </div>

        {/* Gestión de Recursos Sanitarios */}
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
          <h2>Recursos Sanitarios</h2>
          <ResourceForm
            formData={resourceFormData}
            onChange={handleResourceInputChange}
            onSubmit={handleResourceSubmit}
            onCancel={resetResourceForm}
            editMode={editResourceMode}
            places={zones}
          />

          <ResourcesTable
            resources={resources}
            onEdit={handleEditResource}
            onDelete={handleDeleteResource}
          />
        </div>
      </div>
    </div>
  );
}

export default App;