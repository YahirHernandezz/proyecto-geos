import React from 'react';

export default function ResourceForm({ formData, onChange, onSubmit, onCancel, editMode, places }) {
  return (
    <form onSubmit={onSubmit} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
      <h3>{editMode ? 'Editar Recurso' : 'Nuevo Recurso'}</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <label>Tipo de Recurso *</label>
        <input
          type="text"
          name="resourceType"
          value={formData.resourceType}
          onChange={onChange}
          required
          placeholder="Ej: Vacunas, Ventiladores, etc."
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Cantidad *</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={onChange}
          required
          min="0"
          placeholder="Ej: 50"
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Estado</label>
        <select
          name="status"
          value={formData.status}
          onChange={onChange}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        >
          <option value="Disponible">Disponible</option>
          <option value="Escaso">Escaso</option>
          <option value="Agotado">Agotado</option>
        </select>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Zona (opcional)</label>
        <select
          name="placeId"
          value={formData.placeId}
          onChange={onChange}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        >
          <option value="">Sin zona</option>
          {places.map(zone => (
            <option key={zone._id} value={zone._id}>{zone.name}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Notas (opcional)</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={onChange}
          rows="2"
          placeholder="Información adicional..."
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          {editMode ? 'Actualizar' : 'Registrar'}
        </button>
        {editMode && (
          <button type="button" onClick={onCancel} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
