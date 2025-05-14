import React, { useState } from 'react';
import styled from 'styled-components';
import experienceData from '../../data/experience.json';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

const SectionContainer = styled.section`
  padding: 3rem 1rem;
  background-color: #f8f9fa;
  
  @media (min-width: 768px) {
    padding: 4rem 2rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #333;
`;

const Timeline = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const TimelineItem = styled.div`
  position: relative;
  padding-left: 2rem;
  padding-bottom: 2rem;
  border-left: 2px solid #0070f3;
  
  &:last-child {
    border-left: 2px solid transparent;
  }
  
  &:before {
    content: '';
    position: absolute;
    left: -8px;
    top: 0;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: #0070f3;
  }
`;

const TimeMarker = styled.div`
  position: absolute;
  left: -160px;
  top: 0;
  width: 140px;
  text-align: right;
  font-size: 0.85rem;
  color: #777;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const JobHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin-bottom: 0.5rem;
`;

const JobTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
  color: #333;
`;

const Company = styled.h4`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #0070f3;
`;

const Duration = styled.p`
  font-size: 0.9rem;
  color: #777;
  margin-bottom: 1rem;
  
  @media (min-width: 768px) {
    display: none; /* Hide on desktop since we show it on the left */
  }
`;

const Location = styled.p`
  font-size: 0.9rem;
  color: #777;
  margin-bottom: 0.5rem;
`;

const ResponsibilitiesList = styled.ul`
  padding-left: 1.25rem;
  margin-top: 0.75rem;
  text-align: left;
`;

const ResponsibilityItem = styled.li`
  color: #666;
  line-height: 1.5;
  margin-bottom: 0.5rem;
  text-align: left;
`;

const ChevronIcon = styled.span`
  margin-left: 10px;
  display: flex;
  align-items: center;
`;

const ExpandableContent = styled.div`
  max-height: ${({ isExpanded }) => (isExpanded ? '1000px' : '0')};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
  opacity: ${({ isExpanded }) => (isExpanded ? '1' : '0')};
  transition: opacity 0.3s ease-in-out, max-height 0.3s ease-in-out;
`;

const ExperienceSection = () => {
  // State to track which items are expanded
  const [expandedItems, setExpandedItems] = useState({});
  
  // Toggle expansion for a specific item
  const toggleExpansion = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  // Validation
  if (!experienceData || !Array.isArray(experienceData) || experienceData.length === 0) {
    console.error('Experience data is missing or invalid');
    return (
      <SectionContainer id="experience">
        <SectionTitle>Experience</SectionTitle>
        <p>Experience information is currently unavailable.</p>
      </SectionContainer>
    );
  }
  
  return (
    <SectionContainer id="experience">
      <SectionTitle>Experience</SectionTitle>
      <Timeline>
        {experienceData.map((exp, index) => (
          <TimelineItem key={index}>
            <TimeMarker>{exp.Duration}</TimeMarker>
            <JobHeader onClick={() => toggleExpansion(index)}>
              <div>
                <JobTitle>{exp.Role}</JobTitle>
              </div>
              <ChevronIcon>
                {expandedItems[index] ? <FaChevronDown /> : <FaChevronRight />}
              </ChevronIcon>
            </JobHeader>
            
            <ExpandableContent isExpanded={expandedItems[index] || false}>
              <Company>{exp.Company}</Company>
              {exp.Location && <Location>{exp.Location}</Location>}
              <Duration>{exp.Duration}</Duration>
              <ResponsibilitiesList>
                {exp.Responsibilities && exp.Responsibilities.map((resp, i) => (
                  <ResponsibilityItem key={i}>{resp}</ResponsibilityItem>
                ))}
              </ResponsibilitiesList>
            </ExpandableContent>
          </TimelineItem>
        ))}
      </Timeline>
    </SectionContainer>
  );
};

export default ExperienceSection;