function SearchBar({ searchTerm, onSearchChange, resultCount }) {
  return (
    <div className="search-container">
      <h2>Buscar Ubicación</h2>
      <input
        type="text"
        placeholder="Buscar ubicación por nombre..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />
      {searchTerm && (
        <p className="search-results">
          {resultCount > 0 
            ? `${resultCount} resultado(s) encontrado(s)` 
            : 'No se encontraron ubicaciones'}
        </p>
      )}
    </div>
  );
}

export default SearchBar;