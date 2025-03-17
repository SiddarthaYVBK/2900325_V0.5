// src/pages/BookingPage/BookingPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

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
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 150px;
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

  &:hover {
    background-color: #0051cc;
  }
`;

const BookingPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    topic: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to a backend
    console.log('Booking submitted:', formData);
    // Navigate to thank you page
    navigate('/thank-you');
  };

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
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="time">Preferred Time</Label>
          <Select
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          >
            <option value="">Select a time slot</option>
            <option value="9:00 AM">9:00 AM</option>
            <option value="10:00 AM">10:00 AM</option>
            <option value="11:00 AM">11:00 AM</option>
            <option value="1:00 PM">1:00 PM</option>
            <option value="2:00 PM">2:00 PM</option>
            <option value="3:00 PM">3:00 PM</option>
            <option value="4:00 PM">4:00 PM</option>
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
            <option value="Other">Other</option>
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
        <Button type="submit">Book Now</Button>
      </BookingForm>
    </BookingContainer>
  );
};

export default BookingPage;