import React from 'react';

export default function CaseForm({ formData, onChange, onSubmit, onCancel, editMode, places }) {
    return (
        <form onSubmit={onSubmit} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
            <h3>{editMode ? 'Editar Caso' : 'Nuevo Caso'}</h3>

            <div style={{ marginBottom: '10px' }}>
                <label>Enfermedad *</label>
                <input
                    type="text"
                    name="disease"
                    value={formData.disease}
                    onChange={onChange}
                    required
                    placeholder="Ej: Dengue, COVID-19, etc."
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
            </div>

            <div style={{ marginBottom: '10px' }}>
                <label>Número de Casos *</label>
                <input
                    type="number"
                    name="caseCount"
                    value={formData.caseCount}
                    onChange={onChange}
                    required
                    min="1"
                    placeholder="Ej: 5"
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
                    <option value="Activo">Activo</option>
                    <option value="Controlado">Controlado</option>
                    <option value="Cerrado">Cerrado</option>
                </select>
            </div>

            <div style={{ marginBottom: '10px' }}>
                <label>Zona (opcional)</label>
                <select
                    name="sourcePlace"
                    value={formData.sourcePlace}
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
                <label>Descripción (opcional)</label>
                <textarea
                    name="description"
                    value={formData.description}
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
