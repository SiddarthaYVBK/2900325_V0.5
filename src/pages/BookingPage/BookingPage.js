// src/pages/BookingPage/BookingPage.js
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useFormContext } from '../../context/FormContext';
import { useNavigation } from '../../context/NavigationContext';
import debounce from 'lodash.debounce';

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
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
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
  max-height: 100px;
  resize: vertical;
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
  align-self: flex-start; /* Left align the button */

  &:hover {
    background-color: #0051cc;
  }
`;

const BookingPage = () => {
  const navigate = useNavigate();
  // Add fallback for local state in case context fails
  const [localIsDirty, setLocalIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Add loading state
  const [services, setServices] = useState([]); // Add state for services
  
  // Add error handling for context hooks
  const formContext = useFormContext();
  const navigationContext = useNavigation();
  
  // Use useMemo to stabilize these values across renders
  const isDirty = useMemo(() => 
    formContext?.isDirty || localIsDirty, 
    [formContext?.isDirty, localIsDirty]
  );

  const setIsDirty = useMemo(() => 
    formContext?.setIsDirty || setLocalIsDirty, 
    [formContext?.setIsDirty, setLocalIsDirty]
  );

  const setFormIsDirty = useMemo(() => 
    navigationContext?.setFormIsDirty || (() => {}), 
    [navigationContext?.setFormIsDirty]
  );
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
	services: '',
    date: '',
    time: '',
    message: '',
    sessionDuration: '30', // Default to 30 minutes
    serviceId: '',         // New field for selected service
  });

  // Create debounced function for saving to localStorage
  const saveFormData = useRef(
    debounce((data) => {
      // Only save if there's actual data
      if (Object.values(data).some(value => value !== '')) {
        try {
          localStorage.setItem('bookingFormData', JSON.stringify(data));
        } catch (err) {
          console.error('Error saving form data to localStorage:', err);
        }
      }
    }, 1000)
  ).current;

  // Load saved form data on initial render
  const initialLoadDone = useRef(false);
  
  useEffect(() => {
    // Skip if already loaded once
    if (initialLoadDone.current) return;
    initialLoadDone.current = true;
  
    try {
      const savedFormData = localStorage.getItem('bookingFormData');
      
      if (savedFormData) {
        const parsedData = JSON.parse(savedFormData);
        setFormData(parsedData);
        
        // Mark form as dirty if there's saved data
        setLocalIsDirty(true);
        
        // Safely update context state
        if (typeof setIsDirty === 'function') setIsDirty(true);
        if (typeof setFormIsDirty === 'function') setFormIsDirty(true);
      }
    } catch (error) {
      console.error('Error loading saved form data:', error);
    }
  }, [setIsDirty, setFormIsDirty]);
  
  // Save form data when it changes
  useEffect(() => {
    // Use the debounced save function
    saveFormData(formData);
    
    // Clean up debounce on unmount
    return () => {
      saveFormData.cancel();
    };
  }, [formData, saveFormData]);
  
  // Fetch services from backend - only run once on mount
useEffect(() => {
  const fetchServices = async () => {
    try {
      console.log('Fetching services...');
      const response = await fetch('http://localhost:5000/api/services');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch services: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Services data:', data);
      
      if (data.success && data.services) {
        console.log(`Found ${data.services.length} services`);
        setServices(data.services);
        
        // Set default service if available and none selected
        if (data.services.length > 0 && !formData.serviceId) {
          setFormData(prev => ({
            ...prev,
            serviceId: data.services[0].service_id.toString()
          }));
        }
      } else {
        console.error('Invalid data format:', data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };
  
  fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);  // Empty dependency array with ESLint disable comment

  // Handle browser tab close/refresh warnings
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty || localIsDirty) {
        const message = "You have unsaved changes. Are you sure you want to leave?";
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, localIsDirty]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Set both context states safely
    setLocalIsDirty(true);
    
    try {
      if (setIsDirty) setIsDirty(true);
      if (setFormIsDirty) setFormIsDirty(true);
    } catch (err) {
      console.error('Error updating form state:', err);
    }
  };

// In handleSubmit function in BookingPage.js
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    // Format services data as expected by the server
    const services = [{
      serviceId: formData.serviceId,
      quantity: 1
    }];

    // Send booking data to the backend
    const response = await fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        date: formData.date,
        time: formData.time,
        timezone: 'Asia/Kolkata', // IST timezone
        topic: formData.topic,
        message: formData.message,
        services: services,
        // No need to send sessionDuration as it's hardcoded on server
      }),
    });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit booking');
      }
      
      console.log('Booking submitted:', data);
    
      // Reset form state
      setLocalIsDirty(false);
      
      // Safely update context state
      if (typeof setIsDirty === 'function') setIsDirty(false);
      if (typeof setFormIsDirty === 'function') setFormIsDirty(false);
      
      // Clear saved form data
      try {
        localStorage.removeItem('bookingFormData');
      } catch (err) {
        console.error('Error removing form data from localStorage:', err);
      }
      
      // Navigate to thank you page
      navigate('/thank-you');
    }   catch (error) {
        // Error handling...
    }   finally {
        setIsSubmitting(false);
  }
};

  const generateTimeSlots = useMemo(() => {
    if (!formData.date) return [];

    const now = new Date();
    const selectedDate = new Date(formData.date);
    selectedDate.setHours(0, 0, 0, 0); // Normalize to midnight

    const timeSlots = [];
    let startTime = new Date(selectedDate);
    startTime.setHours(9, 0, 0, 0); // Start at 9:00 AM IST

    const endTime = new Date(selectedDate);
    endTime.setHours(20, 0, 0, 0); // End at 8:00 PM IST

    const duration = parseInt(formData.sessionDuration, 10); // Get duration in minutes

    while (startTime <= endTime) {
      const timeString = startTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });

      // Disable past times
      if (selectedDate.toDateString() === now.toDateString() && startTime < now) {
        timeSlots.push({ value: timeString, disabled: true });
      } else {
        timeSlots.push({ value: timeString, disabled: false });
      }

      startTime.setMinutes(startTime.getMinutes() + duration);
    }
    return timeSlots;
  }, [formData.date, formData.sessionDuration]);

  return (
    <BookingContainer>
      <PageTitle>Book a 1:1 Call</PageTitle>
      <BookingForm onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="date">Preferred Date</Label>
          <Input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            required
          />
          <TimezoneInfo>
            All times are in Indian Standard Time (IST) - UTC+5:30
          </TimezoneInfo>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="sessionDuration">Session Duration</Label>
          <Select
            id="sessionDuration"
            name="sessionDuration"
            value={formData.sessionDuration}
            onChange={handleChange}
            required
          >
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="time">Preferred Time</Label>
          <Select
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            disabled={!formData.date}
          >
            <option value="">Select a time slot</option>
            {generateTimeSlots.map((slot) => (
              <option key={slot.value} value={slot.value} disabled={slot.disabled}>
                {slot.value}
              </option>
            ))}
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="topic">Topic</Label>
          <Select
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            required
          >
            <option value="">Select a topic</option>
            <option value="Career Advice">Career Advice</option>
            <option value="QA Best Practices">QA Best Practices</option>
            <option value="Test Automation">Test Automation</option>
            <option value="CI/CD Implementation">CI/CD Implementation</option>
            <option value="Agile Methodologies">Agile Methodologies</option>
            <option value="Mock Interviews">Mock Interviews</option>
            <option value="Other">Other</option>
          </Select>
        </FormGroup>
        
		{/* Add service selection */}
        <FormGroup>
          <Label htmlFor="serviceId">Services</Label>
          <Select
            id="serviceId"
            name="serviceId"
            value={formData.serviceId}
            onChange={handleChange}
            required
          >
            <option value="">Select a service</option>
            {services.map(service => (
              <option key={service.service_id} value={service.service_id}>
                {service.service_name} (${service.default_price})
              </option>
            ))}
          </Select>
        </FormGroup>
		
        <FormGroup>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Please share what you'd like to discuss during our call."
            required
          />
        </FormGroup>
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Book Now'}
        </Button>
      </BookingForm>
    </BookingContainer>
  );
};
export default BookingPage;