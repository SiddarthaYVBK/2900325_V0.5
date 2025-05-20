// src/App.js - Updated with Blog Routes
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NavigationProvider } from './context/NavigationContext';
import { FormProvider } from './context/FormContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import BookingPage from './pages/BookingPage/BookingPage';
import ThankYouPage from './pages/ThankYouPage/ThankYouPage';
import BlogPage from './pages/BlogPage/BlogPage';
import BlogEditorPage from './pages/BlogPage/BlogEditorPage';
import BlogPostPage from './pages/BlogPage/BlogPostPage';
import BlogTagPage from './pages/BlogPage/BlogTagPage';
import ConfirmationModal from './components/common/ConfirmationModal';
import './App.css';

function App() {
  return (
    <Router>
      <FormProvider>
        <NavigationProvider>
          <div className="App">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/booking" element={<BookingPage />} />
                <Route path="/thank-you" element={<ThankYouPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/new" element={<BlogEditorPage />} />
                <Route path="/blog/edit/:id" element={<BlogEditorPage />} />
                <Route path="/blog/post/:id" element={<BlogPostPage />} />
                <Route path="/blog/tag/:keyword" element={<BlogTagPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </NavigationProvider>
      </FormProvider>
    </Router>
  );
}

export default App;