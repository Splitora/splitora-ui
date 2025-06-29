import React from 'react';
import { Button } from '../../components';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="home-content">
        <h1>Welcome to Splitora</h1>
        <p className="home-subtitle">
          A modern React application with a well-organized structure
        </p>
        
        <div className="home-actions">
          <Button variant="primary" size="large">
            Get Started
          </Button>
          <Button variant="secondary" size="large">
            Learn More
          </Button>
        </div>

        <div className="home-features">
          <div className="feature">
            <h3>🚀 Fast Development</h3>
            <p>Built with Vite for lightning-fast development experience</p>
          </div>
          <div className="feature">
            <h3>⚛️ Modern React</h3>
            <p>Using the latest React 19 features and best practices</p>
          </div>
          <div className="feature">
            <h3>🎨 Clean Structure</h3>
            <p>Well-organized folder structure for scalable applications</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 