// src/components/TestimonialsSection/TestimonialsSection.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import testimonialsData from '../../data/testimonials.json';
import { FaQuoteLeft, FaQuoteRight, FaLinkedin } from 'react-icons/fa';

// Container for the entire section
const SectionContainer = styled.section`
  padding: 4rem 1rem;
  background-color: #f0f7ff;
`;

// Content wrapper to control width and centering
const SectionContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

// Main section title styling
const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 3rem;
  text-align: center;
  color: #333;
`;

// Wrapper for the testimonial carousel and navigation
const TestimonialsWrapper = styled.div`
  position: relative;
`;

// Container for the sliding testimonials
const TestimonialSlider = styled.div`
  display: flex;
  overflow: hidden;
  position: relative;
`;

// Individual testimonial card styling
const TestimonialCard = styled.div`
  flex: 0 0 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  // Only show the active card
  display: ${props => (props.isActive ? 'block' : 'none')};
`;

// Container for the testimonial text with quote icons
const TestimonialContent = styled.div`
  text-align: center;
  position: relative;
  padding: 1.5rem 0;
`;

// Left quote icon styling
const QuoteLeft = styled(FaQuoteLeft)`
  color: #0070f3;
  font-size: 1.5rem;
  position: absolute;
  top: 0;
  left: 0;
`;

// Right quote icon styling
const QuoteRight = styled(FaQuoteRight)`
  color: #0070f3;
  font-size: 1.5rem;
  position: absolute;
  bottom: 0;
  right: 0;
`;

// Testimonial text styling
const TestimonialText = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  color: #555;
  margin: 0 2rem;
`;

// Container for person information (name, title, image)
const PersonInfo = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// Person image styling (circular)
const PersonImage = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 1rem;
  border: 3px solid #0070f3;
  display: ${props => (props.hasImage ? 'block' : 'none')};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// Person name styling
const PersonName = styled.h4`
  font-size: 1.2rem;
  margin: 0;
  color: #333;
`;

// Person title/position styling
const PersonTitle = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 0.4rem 0;
`;

// Source tag styling (LinkedIn, etc.)
const SourceTag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #777;
  
  svg {
    margin-right: 5px;
    color: #0077B5;
  }
`;

// Navigation dots container
const Navigation = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

// Individual navigation dot styling
const NavDot = styled.button`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => (props.active ? '#0070f3' : '#ccc')};
  margin: 0 5px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
`;

// Previous/Next arrow buttons
const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s ease;
  z-index: 10;
  
  &:hover {
    opacity: 1;
  }
  
  &.prev {
    left: 10px;
  }
  
  &.next {
    right: 10px;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

// Call to action section styling
const CallToAction = styled.div`
  text-align: center;
  margin-top: 3rem;
`;

// Call to action text styling
const CTAText = styled.p`
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 1.5rem;
`;

// Call to action button styling
const CTAButton = styled(Link)`
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
    color: white;
  }
`;

/**
 * TestimonialsSection Component
 * 
 * Displays a carousel of testimonials with navigation dots and previous/next arrows.
 * Includes auto-rotation of testimonials and a call-to-action button for booking.
 */
const TestimonialsSection = () => {
  // State to track which testimonial is currently active
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Auto-rotate testimonials every 5 seconds
  useEffect(() => {
    // Skip auto-rotation if there are no testimonials
    if (!testimonialsData || testimonialsData.length <= 1) return;
    
    const interval = setInterval(() => {
      setActiveIndex(prevIndex => 
        prevIndex === testimonialsData.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);
  
  // Validation - return null if no testimonial data
  if (!testimonialsData || !Array.isArray(testimonialsData) || testimonialsData.length === 0) {
    console.error('Testimonial data is missing or invalid');
    return null;
  }
  
  // Handle click on next arrow
  const handleNext = () => {
    setActiveIndex(prevIndex => 
      prevIndex === testimonialsData.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  // Handle click on previous arrow
  const handlePrev = () => {
    setActiveIndex(prevIndex => 
      prevIndex === 0 ? testimonialsData.length - 1 : prevIndex - 1
    );
  };
  
  // Handle click on navigation dot
  const handleDotClick = (index) => {
    setActiveIndex(index);
  };
  
  // Render the component
  return (
    <SectionContainer id="testimonials">
      <SectionContent>
        <SectionTitle>What People Say</SectionTitle>
        
        <TestimonialsWrapper>
          {/* Previous button */}
          <ArrowButton className="prev" onClick={handlePrev}>
            &lt;
          </ArrowButton>
          
          {/* Testimonial slider */}
          <TestimonialSlider>
            {testimonialsData.map((testimonial, index) => (
              <TestimonialCard 
                key={index} 
                isActive={index === activeIndex}
              >
                <TestimonialContent>
                  <QuoteLeft />
                  <TestimonialText>{testimonial.testimonial}</TestimonialText>
                  <QuoteRight />
                </TestimonialContent>
                
                <PersonInfo>
                  <PersonImage hasImage={testimonial.image && testimonial.image.length > 0}>
                    <img 
                      src={testimonial.image || 'https://via.placeholder.com/70'} 
                      alt={testimonial.name}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/70';
                      }}
                    />
                  </PersonImage>
                  <PersonName>{testimonial.name}</PersonName>
                  <PersonTitle>{testimonial.title}</PersonTitle>
                  <SourceTag>
                    {testimonial.source === 'LinkedIn' && <FaLinkedin />}
                    {testimonial.source}
                  </SourceTag>
                </PersonInfo>
              </TestimonialCard>
            ))}
          </TestimonialSlider>
          
          {/* Next button */}
          <ArrowButton className="next" onClick={handleNext}>
            &gt;
          </ArrowButton>
          
          {/* Navigation dots */}
          <Navigation>
            {testimonialsData.map((_, index) => (
              <NavDot 
                key={index} 
                active={index === activeIndex}
                onClick={() => handleDotClick(index)}
              />
            ))}
          </Navigation>
          
          {/* Call to action section */}
          <CallToAction>
            <CTAText>Need personalized guidance on QA or career development?</CTAText>
            <CTAButton to="/booking">Book a 1:1 Call</CTAButton>
          </CallToAction>
        </TestimonialsWrapper>
      </SectionContent>
    </SectionContainer>
  );
};

export default TestimonialsSection;