import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { NavigationProvider } from './context/NavigationContext';
import AppContent from './AppContent';
import { FormProvider } from './context/FormContext';
import './App.css';

function App() {
  return (
    <Router>
      <FormProvider>
        <NavigationProvider>
          <AppContent />
        </NavigationProvider>
      </FormProvider>
    </Router>
  );
}

export default App;