import './SearchBar.css';

function SearchBar({ searchTerm, onSearchChange, resultCount }) {
  return (
    <div className="search-container">
      <div className="search-wrapper">
        <div className="search-icon-wrapper">
          <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Buscar ubicación por nombre o descripción..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button 
            className="search-clear"
            onClick={() => onSearchChange('')}
            aria-label="Limpiar búsqueda"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      {searchTerm && (
        <div className="search-results">
          <span className="results-badge">
            {resultCount > 0 
              ? `${resultCount} resultado${resultCount !== 1 ? 's' : ''} encontrado${resultCount !== 1 ? 's' : ''}` 
              : 'Sin resultados'}
          </span>
        </div>
      )}
    </div>
  );
}

export default SearchBar;