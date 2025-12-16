import React from 'react';
import './Home.css';

function HomePage() {
  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Experience True Luxury</h1>
          <p>Elegance, comfort, and impeccable service in the heart of the city.</p>
          <button onClick={() => window.location.href='/rooms'}>Book a Room</button>
        </div>
      </div>
      
      <div className="features-section">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">💎 Premium Service</div>
          <div className="feature-card">🍽️ Exquisite Cuisine</div>
          <div className="feature-card">🏊 SPA & Pool</div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;