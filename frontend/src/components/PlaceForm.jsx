function PlaceForm({ 
  formData, 
  onChange, 
  onSubmit, 
  onCancel, 
  editMode 
}) {
  return (
    <form id="place-form" onSubmit={onSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={onChange}
        placeholder="Nombre del lugar"
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
      <button type="submit" id="submit-btn">
        {editMode ? 'Actualizar Lugar' : 'Registrar Lugar'}
      </button>
      {editMode && (
        <button 
          type="button" 
          id="cancel-btn" 
          onClick={onCancel}
          style={{ backgroundColor: '#dc3545' }}
        >
          Cancelar
        </button>
      )}
    </form>
  );
}

export default PlaceForm;