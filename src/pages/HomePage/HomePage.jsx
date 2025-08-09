import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/group');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Split Expenses
              <span className="highlight"> Easily</span>
            </h1>
            <p className="hero-subtitle">
              Manage shared expenses with friends, roommates, and groups. 
              Track who owes what and settle up without the hassle.
            </p>
            <div className="hero-actions">
              <Button 
                variant="primary" 
                size="large" 
                onClick={handleGetStarted}
                className="cta-button"
              >
                Get Started
              </Button>
              <Button 
                variant="secondary" 
                size="large" 
                onClick={handleLogin}
                className="login-button"
              >
                Login
              </Button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="app-preview">
              <div className="preview-card">
                <div className="preview-header">
                  <span className="preview-icon">👥</span>
                  <span className="preview-title">Roommates</span>
                </div>
                <div className="preview-content">
                  <div className="expense-item">
                    <span>🏠 Rent</span>
                    <span>$1,200</span>
                  </div>
                  <div className="expense-item">
                    <span>⚡ Utilities</span>
                    <span>$150</span>
                  </div>
                  <div className="expense-item">
                    <span>🛒 Groceries</span>
                    <span>$300</span>
                  </div>
                </div>
                <div className="preview-footer">
                  <span>Total: $1,650</span>
                  <span className="settled">✓ Settled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Splitora?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Easy to Use</h3>
              <p>Simple interface to add expenses and track balances in real-time.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Group Management</h3>
              <p>Create groups for different occasions - roommates, trips, events.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Smart Settlements</h3>
              <p>Automatically calculate who owes what and suggest optimal settlements.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Detailed Reports</h3>
              <p>Get insights into your spending patterns and group expenses.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Private</h3>
              <p>Your financial data is encrypted and kept private.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌐</div>
              <h3>Cross-Platform</h3>
              <p>Access from any device - web, mobile, tablet.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Create a Group</h3>
              <p>Start by creating a group for your roommates, trip, or event.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Add Expenses</h3>
              <p>Record shared expenses and specify who paid for what.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Track Balances</h3>
              <p>See who owes money and who is owed money in real-time.</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Settle Up</h3>
              <p>Get smart suggestions for the most efficient way to settle debts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Simplify Your Shared Expenses?</h2>
            <p>Join thousands of users who trust Splitora to manage their shared finances.</p>
            <div className="cta-actions">
              <Button 
                variant="primary" 
                size="large" 
                onClick={handleSignup}
                className="signup-button"
              >
                Sign Up Free
              </Button>
              <Button 
                variant="ghost" 
                size="large" 
                onClick={handleLogin}
                className="login-button"
              >
                Already have an account? Login
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 