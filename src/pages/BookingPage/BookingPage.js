// src/pages/BookingPage/BookingPage.js
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useFormContext } from '../../context/FormContext';
import { useNavigation } from '../../context/NavigationContext';
import debounce from 'lodash.debounce';

// API base URL - can be overridden by environment variables
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK_DATA === 'true';

/**
 * API client functions
 */
const api = {
  /**
   * Fetches services from the API
   * @returns {Promise<Array>} List of services
   */
  getServices: async () => {
    if (USE_MOCK_DATA) {
      // Return mock data
      return [
        { service_id: "1", service_name: "Test Consulting", default_price: 100 },
        { service_id: "2", service_name: "Mentorship", default_price: 80 }
      ];
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/services`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch services: ${response.status}`);
      }
      
      const data = await response.json();
      return data.success && data.services ? data.services : [];
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  },

  /**
   * Submits a booking to the API
   * @param {Object} bookingData - Booking information
   * @returns {Promise<Object>} Booking confirmation
   */
  createBooking: async (bookingData) => {
    if (USE_MOCK_DATA) {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: true, message: "Booking created successfully" };
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to submit booking: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error submitting booking:', error);
      throw error;
    }
  }
};

// Reusable form components
const FormField = ({ label, id, name, value, onChange, type = "text", error, children, ...props }) => (
  <FormGroup>
    <Label htmlFor={id}>{label}</Label>
    {children || (
      <Input 
        type={type} 
        id={id} 
        name={name} 
        value={value} 
        onChange={onChange} 
        className={error ? 'error' : ''} 
        {...props} 
      />
    )}
    {error && <ErrorMessage>{error}</ErrorMessage>}
  </FormGroup>
);

const SelectField = ({ label, id, name, value, onChange, error, children, ...props }) => (
  <FormField label={label} id={id} name={name} error={error}>
    <Select 
      id={id} 
      name={name} 
      value={value} 
      onChange={onChange} 
      className={error ? 'error' : ''} 
      {...props}
    >
      {children}
    </Select>
  </FormField>
);

const TextareaField = ({ label, id, name, value, onChange, error, ...props }) => (
  <FormField label={label} id={id} name={name} error={error}>
    <Textarea 
      id={id} 
      name={name} 
      value={value} 
      onChange={onChange} 
      className={error ? 'error' : ''} 
      {...props} 
    />
  </FormField>
);

// Style definitions
const BookingContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const BookingForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background-color: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: left;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  align-items: flex-start;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  
  &.error {
    border-color: #e53935;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  
  &.error {
    border-color: #e53935;
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  min-height: 100px;
  resize: vertical;
  
  &.error {
    border-color: #e53935;
  }
`;

const TimezoneInfo = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.5rem;
  width: 100%;
`;

const Button = styled.button`
  background-color: #0070f3;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  align-self: flex-start;

  &:hover:not(:disabled) {
    background-color: #0051cc;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #e53935;
  font-size: 0.85rem;
  margin-top: 0.25rem;
`;

const FormStatus = styled.div`
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-weight: 500;
  background-color: ${props => props.isError ? '#ffebee' : '#e8f5e9'};
  color: ${props => props.isError ? '#c62828' : '#2e7d32'};
  display: ${props => props.visible ? 'block' : 'none'};
`;

// Service-topic relationship mapping
const serviceTopicsMap = {
  "Test Consulting": [
    "End to End Test Partner",
    "Test Automation Web",
    "Test Automation Mobile",
    "Performance Testing",
    "DevOps implementation",
    "Observability"
  ],
  "Mentorship": [
    "Agile Project Management",
    "Test Automation of Web & Mobile",
    "Performance Testing",
    "Leadership & Management",
    "DevOps",
    "Mock Interview"
  ]
};

/**
 * BookingPage Component
 * 
 * A form that allows users to book a 1:1 call, with validation and service-specific topics.
 */
const BookingPage = () => {
  const navigate = useNavigate();
  const [localIsDirty, setLocalIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [services, setServices] = useState([]);
  const [statusMessage, setStatusMessage] = useState({ message: '', isError: false });
  
  // Form validation errors
  const [errors, setErrors] = useState({});
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    services: '',
    date: '',
    time: '',
    message: '',
    sessionDuration: '30',
    serviceId: '',
    topic: '',
  });

  // Access context hooks safely
  const formContext = useFormContext();
  const navigationContext = useNavigation();
  
  // Context fallbacks for safety
  const isDirty = useMemo(() => 
    formContext?.isDirty || localIsDirty, 
    [formContext?.isDirty, localIsDirty]
  );

  const setIsDirty = useCallback((value) => {
    setLocalIsDirty(value);
    if (formContext?.setIsDirty) formContext.setIsDirty(value);
  }, [formContext]);

  const setFormIsDirty = useCallback((value) => {
    if (navigationContext?.setFormIsDirty) navigationContext.setFormIsDirty(value);
  }, [navigationContext]);

  // Create debounced function for saving to localStorage
  const saveFormData = useMemo(() => 
    debounce((data) => {
      if (Object.values(data).some(value => value !== '')) {
        try {
          localStorage.setItem('bookingFormData', JSON.stringify(data));
          console.log('Form data saved to localStorage');
        } catch (err) {
          console.error('Error saving form data to localStorage:', err);
        }
      }
    }, 1000), 
    []
  );

  // Get selected service name
  const selectedService = useMemo(() => 
    services.find(s => s.service_id.toString() === formData.serviceId), 
    [services, formData.serviceId]
  );

  // Get available topics based on service selection
  const availableTopics = useMemo(() => {
    const serviceName = selectedService?.service_name;
    return serviceName ? serviceTopicsMap[serviceName] || [] : [];
  }, [selectedService]);

  // Handle form changes with validation
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }

    // Special handling for serviceId changes
    if (name === 'serviceId') {
      // Reset topic when service changes
      setFormData(prev => ({ ...prev, [name]: value, topic: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Mark form as dirty
    setIsDirty(true);
    setFormIsDirty(true);
    
    // Log the change
    console.log(`Field "${name}" changed to "${value}"`);
  }, [errors, setIsDirty, setFormIsDirty]);

  // Initial load - fetch services and load saved form data
  useEffect(() => {
    const initialLoad = async () => {
      // Load saved form data
      try {
        const savedFormData = localStorage.getItem('bookingFormData');
        
        if (savedFormData) {
          const parsedData = JSON.parse(savedFormData);
          setFormData(parsedData);
          setIsDirty(true);
          setFormIsDirty(true);
          console.log('Loaded saved form data from localStorage');
        }
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
      
      // Fetch services
      try {
        console.log('Fetching services...');
        const servicesData = await api.getServices();
        setServices(servicesData);
        console.log('Services loaded:', servicesData);
      } catch (error) {
        console.error('Error fetching services:', error);
        setStatusMessage({
          message: 'Failed to load services. Please try again later.',
          isError: true
        });
      }
    };
    
    initialLoad();
  }, [setIsDirty, setFormIsDirty]);

  // Save form data when it changes
  useEffect(() => {
    saveFormData(formData);
    return () => saveFormData.cancel();
  }, [formData, saveFormData]);

  // Browser tab close/refresh warnings
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        const message = "You have unsaved changes. Are you sure you want to leave?";
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Form validation
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    // Required fields validation
    const requiredFields = ['name', 'email', 'date', 'time', 'topic', 'serviceId', 'message'];
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });
    
    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Date validation - must be today or future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(formData.date);
    if (formData.date && selectedDate < today) {
      newErrors.date = 'Please select today or a future date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Time slots generation
  const generateTimeSlots = useMemo(() => {
    if (!formData.date) return [];

    const now = new Date();
    const selectedDate = new Date(formData.date);
    selectedDate.setHours(0, 0, 0, 0);
    const isToday = selectedDate.toDateString() === now.toDateString();

    const timeSlots = [];
    let startTime = new Date(selectedDate);
    startTime.setHours(9, 0, 0, 0); // Start at 9:00 AM

    const endTime = new Date(selectedDate);
    endTime.setHours(20, 0, 0, 0); // End at 8:00 PM

    const duration = parseInt(formData.sessionDuration, 10);

    while (startTime <= endTime) {
      const timeString = startTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });

      // Disable past times if today
      const disabled = isToday && startTime < now;
      timeSlots.push({ value: timeString, disabled });

      startTime.setMinutes(startTime.getMinutes() + duration);
    }
    
    return timeSlots;
  }, [formData.date, formData.sessionDuration]);

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submission initiated');
    
    // Validate form
    if (!validateForm()) {
      console.log('Form validation failed', errors);
      setStatusMessage({
        message: 'Please fix the errors in the form.',
        isError: true
      });
      return;
    }
    
    setIsSubmitting(true);
    setStatusMessage({ message: '', isError: false });

    try {
      console.log('Preparing booking data for submission');
      
      // Format services data as expected by the server
      const services = [{
        serviceId: formData.serviceId,
        quantity: 1
      }];

	const bookingData = {
		  name: formData.name,                // Maps to customer_name
		  email: formData.email,              // Maps to customer_email
		  date: formData.date,                // Used to create the booking_utc timestamp
		  time: formData.time,                // Maps to start_time_ist
		  topic: formData.topic,              // Maps to booking_subject
		  message: formData.message,          // Maps to notes
		  sessionDuration: formData.sessionDuration, // Used to calculate end_time_ist
		  services: [{
			serviceId: formData.serviceId,
			quantity: 1
  }]
};
      
      // Submit the booking
      const result = await api.createBooking(bookingData);
      console.log('Booking submitted successfully:', result);
      
      // Reset form state
      setIsDirty(false);
      setFormIsDirty(false);
      
      // Clear saved form data
      try {
        localStorage.removeItem('bookingFormData');
        console.log('Form data cleared from localStorage');
      } catch (err) {
        console.error('Error removing form data from localStorage:', err);
      }
      
      // Navigate to thank you page
      navigate('/thank-you');
    } catch (error) {
      console.error('Error submitting booking:', error);
      setStatusMessage({
        message: `Failed to submit booking: ${error.message}`,
        isError: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BookingContainer>
      <PageTitle>Book a 1:1 Call</PageTitle>
      
      {/* Status messages */}
      <FormStatus 
        visible={!!statusMessage.message} 
        isError={statusMessage.isError}
      >
        {statusMessage.message}
      </FormStatus>
      
      <BookingForm onSubmit={handleSubmit}>
        <FormField
          label="Name"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          error={errors.name}
        />
        
        <FormField
          label="Email"
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          error={errors.email}
        />

        <FormField
          label="Preferred Date"
          id="date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]}
          required
          error={errors.date}
        >
          <Input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            required
            className={errors.date ? 'error' : ''}
          />
          <TimezoneInfo>
            All times are in Indian Standard Time (IST) - UTC+5:30
          </TimezoneInfo>
        </FormField>
        
        <SelectField
          label="Session Duration"
          id="sessionDuration"
          name="sessionDuration"
          value={formData.sessionDuration}
          onChange={handleChange}
          required
        >
          <option value="30">30 minutes</option>
          <option value="60">1 hour</option>
        </SelectField>
        
        <SelectField
          label="Preferred Time"
          id="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
          disabled={!formData.date}
          error={errors.time}
        >
          <option value="">Select a time slot</option>
          {generateTimeSlots.map((slot, index) => (
            <option key={index} value={slot.value} disabled={slot.disabled}>
              {slot.value}
            </option>
          ))}
        </SelectField>
        
        <SelectField
          label="Services"
          id="serviceId"
          name="serviceId"
          value={formData.serviceId}
          onChange={handleChange}
          required
          error={errors.serviceId}
        >
          <option value="">Select a service</option>
          {services.map(service => (
            <option key={service.service_id} value={service.service_id}>
              {service.service_name} (${service.default_price})
            </option>
          ))}
        </SelectField>
        
        <SelectField
          label="Topic"
          id="topic"
          name="topic"
          value={formData.topic}
          onChange={handleChange}
          required
          disabled={!formData.serviceId || availableTopics.length === 0}
          error={errors.topic}
        >
          <option value="">Select a topic</option>
          {availableTopics.map((topic, index) => (
            <option key={index} value={topic}>{topic}</option>
          ))}
        </SelectField>
        
        <TextareaField
          label="Message"
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Please share what you'd like to discuss during our call."
          required
          error={errors.message}
        />
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Book Now'}
        </Button>
      </BookingForm>
    </BookingContainer>
  );
};

export default BookingPage;