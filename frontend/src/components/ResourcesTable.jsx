import React from 'react';

export default function ResourcesTable({ resources, onEdit, onDelete }) {
    const getStatusColor = (status) => {
        const colors = {
            'Disponible': '#28a745',
            'Escaso': '#ffc107',
            'Agotado': '#dc3545'
        };
        return colors[status] || '#6c757d';
    };

    return (
        <div style={{ marginTop: '20px' }}>
            <h3>Recursos Registrados ({resources.length})</h3>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8f9fa' }}>
                            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Tipo</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Cantidad</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Estado</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Zona</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Notas</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resources.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
                                    No hay recursos registrados
                                </td>
                            </tr>
                        ) : (
                            resources.map((resource) => (
                                <tr key={resource._id} style={{ borderBottom: '1px solid #ddd' }}>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                        <strong>{resource.resourceType}</strong>
                                    </td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                        <strong>{resource.quantity}</strong>
                                    </td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                        <span style={{
                                            backgroundColor: getStatusColor(resource.status),
                                            color: 'white',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '12px'
                                        }}>
                                            {resource.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                        {resource.placeId?.name || 'Sin zona'}
                                    </td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                        {resource.notes || '-'}
                                    </td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                        <button
                                            onClick={() => onEdit(resource)}
                                            style={{ padding: '5px 10px', marginRight: '5px', backgroundColor: '#ffc107', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => onDelete(resource._id)}
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
