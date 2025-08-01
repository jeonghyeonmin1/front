import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { routes } from './config/routes';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {routes.map(({ path, element: Component, name }) => (
            <Route 
              key={name} 
              path={path} 
              element={<Component />} 
            />
          ))}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
