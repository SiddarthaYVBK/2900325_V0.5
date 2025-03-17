// src/pages/ThankYouPage/ThankYouPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const ThankYouContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 1rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: #0070f3;
`;

const Message = styled.p`
  font-size: 1.25rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const HomeButton = styled(Link)`
  display: inline-block;
  background-color: #0070f3;
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0051cc;
  }
`;

const ThankYouPage = () => {
  return (
    <ThankYouContainer>
      <Title>Thank You!</Title>
      <Message>
        I've received your booking request and will get back to you within 24 hours to confirm the details of our call.
        Looking forward to our conversation!
      </Message>
      <HomeButton to="/">Back to Home</HomeButton>
    </ThankYouContainer>
  );
};

export default ThankYouPage;