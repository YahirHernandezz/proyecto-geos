function ZoneForm({ 
  formData, 
  onChange, 
  onSubmit, 
  onCancel, 
  editMode,
  onStartDrawing,
  isDrawing
}) {
  return (
    <div className="zone-form-container">
      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={onChange}
          placeholder="Nombre de la zona"
          required
        />
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={onChange}
          placeholder="Descripción"
          required
        />
        
        <button 
          type="button" 
          onClick={onStartDrawing}
          style={{ 
            backgroundColor: isDrawing ? '#dc3545' : '#28a745',
            marginBottom: '10px'
          }}
        >
          {isDrawing ? 'Cancelar Dibujo' : 'Dibujar Zona en Mapa'}
        </button>

        {formData.coordinates.length > 0 && (
          <p style={{ color: '#28a745', fontSize: '14px' }}>
            ✓ Zona dibujada con {formData.coordinates.length} puntos
          </p>
        )}

        <button 
          type="submit" 
          disabled={formData.coordinates.length < 3}
          style={{ 
            opacity: formData.coordinates.length < 3 ? 0.5 : 1 
          }}
        >
          {editMode ? 'Actualizar Zona' : 'Guardar Zona'}
        </button>

        {editMode && (
          <button 
            type="button" 
            onClick={onCancel}
            style={{ backgroundColor: '#dc3545' }}
          >
            Cancelar
          </button>
        )}
      </form>

      <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
        Instrucciones: Haz clic en "Dibujar Zona", luego haz clic en el mapa para 
        trazar los puntos. Doble clic para finalizar.
      </p>
    </div>
  );
}

export default ZoneForm;