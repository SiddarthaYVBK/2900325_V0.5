// src/components/SkillsSection/SkillsSection.js
import React from 'react';
import styled from 'styled-components';

// Main section container
const SectionContainer = styled.section`
  padding: 3rem 1rem;
  background-color: #ffffff;
  
  @media (min-width: 768px) {
    padding: 4rem 2rem;
  }
`;

// Section title styling
const SectionTitle = styled.h2`
  font-size: 1.75rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #333;
`;

// Grid container for skill cards
const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
`;

// Individual skill card with fixed height
const SkillCard = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
  height: 85%; /* Set fixed height for card */
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

// Skill title styling
const SkillTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  color: #333;
  text-align: center;
`;

// Skill description with text overflow handling
const SkillDescription = styled.p`
  color: #666;
  line-height: 1.5;
  flex-grow: 1;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 6; /* Limit to ~5 lines of text */
  -webkit-box-orient: vertical;
  text-align: left;
`;

/**
 * SkillsSection Component
 * 
 * Displays skills in an auto-adjusting grid format with standardized card heights.
 * Uses existing hard-coded skills data with improved layout management.
 */
const SkillsSection = () => {
  const skills = [
    {
      title: "Quality Assurance",
      description: "Expert in manual and automated testing methodologies, test planning, and QA strategy."
    },
    {
      title: "Test Automation",
      description: "Proficient with Selenium Webdriver, cucumber, TestNG and other automation frameworks."
    },
    {
      title: "CI/CD Implementation",
      description: "Experience setting up continuous integration and deployment pipelines for efficient testing."
    },
    {
      title: "Product Management",
      description: "Skilled in product roadmapping, feature prioritization, and stakeholder management."
    },
    {
      title: "Agile Methodologies",
      description: "Certified Scrum Master with experience in various agile frameworks."
    },
    {
      title: "Performance Testing",
      description: "Expertise in load testing, stress testing, and performance optimization."
    },
    {
      title: "Observability",
      description: "Proficient in architecting New Relic observability strategies, defining use cases for APM agent integration, distributed tracing via pathpoints for API SLA monitoring, and proactive synthetic checks for critical user journeys."
    }
  ];

  return (
    <SectionContainer id="skills">
      <SectionTitle>Skills & Expertise</SectionTitle>
      <SkillsGrid>
        {skills.map((skill, index) => (
          <SkillCard key={index}>
            <SkillTitle>{skill.title}</SkillTitle>
            <SkillDescription>{skill.description}</SkillDescription>
          </SkillCard>
        ))}
      </SkillsGrid>
    </SectionContainer>
  );
};

export default SkillsSection;