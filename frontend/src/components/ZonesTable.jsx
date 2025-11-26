function ZonesTable({ zones, onEdit, onDelete, onSelect }) {
  return (
    <div className="table-container">
      <h2>Zonas Registradas</h2>
      <table id="zones-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Puntos</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {zones.map((zone) => (
            <tr 
              key={zone._id}
              onClick={() => onSelect(zone)}
              style={{ cursor: 'pointer' }}
            >
              <td>{zone.name}</td>
              <td>{zone.description}</td>
              <td>{zone.coordinates.length}</td>
              <td>{new Date(zone.createdAt).toLocaleDateString()}</td>
              <td>
                <button 
                  className="edit-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(zone);
                  }}
                >
                  Editar
                </button>
                <button 
                  className="delete-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(zone._id);
                  }}
                >
                  Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ZonesTable;