import React from 'react';
import { useAuth } from '../utils/hooks';

const Navigation = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <a href="/" className="navbar-brand">
          📋 Prime AI Tasks
        </a>
        <div className="navbar-menu">
          {user ? (
            <>
              <span>Welcome, <strong>{user.name}</strong></span>
              <button className="btn btn-secondary" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/login">Login</a>
              <a href="/register">Register</a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
