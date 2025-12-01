import React from 'react';
import './Gallery.css';
import saludMXImage from '../assets/saludMX.png';
import holidayImage from '../assets/image1.png';

export default function Gallery() {
  return (
    <div className="gallery-container">
      <div className="gallery-content">
        <div className="gallery-header">
          <h1 className="gallery-title">Centro de Visualización</h1>
          <p className="gallery-subtitle">Análisis Geográfico y Sanitario</p>
        </div>
        
        <div className="gallery-image-wrapper">
          <div className="image-card">
            <img 
              src={saludMXImage}
              alt="Sistema de Salud México" 
              className="gallery-image"
            />
            <div className="image-overlay">
              <div className="overlay-content">
                <h3>Sistema de Salud México</h3>
                <p>Plataforma de análisis y gestión sanitaria</p>
              </div>
            </div>
          </div>
        </div>

        <div className="gallery-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <div className="stat-icon-inner"></div>
            </div>
            <div className="stat-content">
              <h4>Cobertura Total</h4>
              <p className="stat-value">100%</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon stat-icon-green">
              <div className="stat-icon-inner"></div>
            </div>
            <div className="stat-content">
              <h4>Zonas Activas</h4>
              <p className="stat-value">24/7</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon stat-icon-red">
              <div className="stat-icon-inner"></div>
            </div>
            <div className="stat-content">
              <h4>Monitoreo</h4>
              <p className="stat-value">Activo</p>
            </div>
          </div>
        </div>

        {/* Sección especial de despedida navideña */}
        <div className="holiday-section">
          <div className="holiday-card">
            <div className="holiday-content">
              <div className="holiday-image-container">
                <img 
                  src={holidayImage}
                  alt="Felices Fiestas" 
                  className="holiday-image"
                />
              </div>
              <div className="holiday-message">
                <div className="holiday-decorations">
                  <span className="decoration-star">★</span>
                  <span className="decoration-tree">🎄</span>
                  <span className="decoration-star">★</span>
                </div>
                <h2 className="holiday-title">Felices Fiestas</h2>
                <div className="holiday-text">
                  <p className="message-primary">
                    Gracias por todo su apoyo, dedicación y enseñanzas durante este semestre.
                  </p>
                  <p className="message-secondary">
                    Su guía ha sido fundamental en nuestro desarrollo profesional.
                    Que estas fiestas estén llenas de paz, alegría y momentos especiales
                    junto a sus seres queridos.
                  </p>
                  <p className="message-signature">
                    Con aprecio y los mejores deseos para el nuevo año,
                  </p>
                  <p className="message-team">El equipo GeoSalud</p>
                </div>
                <div className="holiday-footer">
                  <div className="snowflake">❄</div>
                  <span className="year-text">Diciembre 2025</span>
                  <div className="snowflake">❄</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
