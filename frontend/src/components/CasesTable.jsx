import React from 'react';

export default function CasesTable({ cases, onEdit, onDelete }) {
    const getStatusColor = (status) => {
        const colors = {
            'Activo': '#dc3545',
            'Controlado': '#28a745',
            'Cerrado': '#6c757d'
        };
        return colors[status] || '#6c757d';
    };

    return (
        <div style={{ marginTop: '20px' }}>
            <h3>Casos Registrados ({cases.length})</h3>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8f9fa' }}>
                            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Enfermedad</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Casos</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Estado</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Zona</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Descripción</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cases.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
                                    No hay casos registrados
                                </td>
                            </tr>
                        ) : (
                            cases.map((caseItem) => (
                                <tr key={caseItem._id} style={{ borderBottom: '1px solid #ddd' }}>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                        <strong>{caseItem.disease}</strong>
                                    </td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                        {caseItem.caseCount}
                                    </td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                        <span style={{
                                            backgroundColor: getStatusColor(caseItem.status),
                                            color: 'white',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '12px'
                                        }}>
                                            {caseItem.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                        {caseItem.sourcePlace?.name || 'Sin zona'}
                                    </td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                        {caseItem.description || '-'}
                                    </td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                        <button
                                            onClick={() => onEdit(caseItem)}
                                            style={{ padding: '5px 10px', marginRight: '5px', backgroundColor: '#ffc107', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => onDelete(caseItem._id)}
                                            style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
