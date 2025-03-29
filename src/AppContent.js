// CREATE/UPDATE src/AppContent.js:
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import BookingPage from './pages/BookingPage/BookingPage';
import ThankYouPage from './pages/ThankYouPage/ThankYouPage';
import ConfirmationModal from './components/common/ConfirmationModal';
import { useNavigation } from './context/NavigationContext';

const AppContent = () => {
  const { showWarning, confirmNavigation, cancelNavigation } = useNavigation();
  
  return (
    <div className="App">
      <Header />
      {showWarning && (
        <ConfirmationModal
          isOpen={showWarning}
          title="Unsaved Changes"
          message="You have unsaved changes that will be lost if you leave this page. Are you sure you want to continue?"
          onConfirm={confirmNavigation}
          onCancel={cancelNavigation}
        />
      )}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default AppContent;