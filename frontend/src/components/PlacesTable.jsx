function PlacesTable({ places, onEdit, onDelete }) {
  return (
    <div className="table-container">
      <h2>Lugares Registrados</h2>
      <table id="places-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Latitud</th>
            <th>Longitud</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody id="places-tbody">
          {places.map((place) => {
            const [lng, lat] = place.location.coordinates;
            return (
              <tr key={place._id}>
                <td>{place.name}</td>
                <td>{place.description}</td>
                <td>{lat.toFixed(6)}</td>
                <td>{lng.toFixed(6)}</td>
                <td>
                  <button 
                    className="edit-btn" 
                    onClick={() => onEdit(place)}
                  >
                    Editar
                  </button>
                  <button 
                    className="delete-btn" 
                    onClick={() => onDelete(place._id)}
                  >
                    Borrar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default PlacesTable;