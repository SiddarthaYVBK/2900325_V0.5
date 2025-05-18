// src/components/BookingSection/BookingSection.js
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const SectionContainer = styled.section`
  padding: 3rem 1rem;
  background-color: #f0f7ff;
  
  @media (min-width: 768px) {
    padding: 4rem 2rem;
  }
`;

const SectionContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  margin-bottom: 1rem;
  color: #333;
`;

const SectionDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  color: #555;
`;

const BookingButton = styled(Link)`
  display: inline-block;
  background-color: #0070f3;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0051cc;
  }
`;

const BookingSection = () => {
  return (
    <SectionContainer id="booking">
      <SectionContent>
        <SectionTitle>Book a 1:1 Call</SectionTitle>
        <SectionDescription>
			Looking for QA, DevOps, or Observability expertise — or guidance to grow your tech career?
			Whether you're a business seeking hands-on solutions or a learner aiming to upskill in automation, performance, or DevOps — let’s connect.
        </SectionDescription>
        <BookingButton to="/booking">Schedule a Call</BookingButton>
      </SectionContent>
    </SectionContainer>
  );
};

export default BookingSection;