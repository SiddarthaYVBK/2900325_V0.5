import React from 'react';
import styled from 'styled-components';

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
`;

const Description = styled.p`
  color: #666;
  line-height: 1.5;
  margin-bottom: 0.5rem;
`;

const ResponsibilitiesList = styled.ul`
  padding-left: 1.25rem;
  margin-top: 0.75rem;
`;

const ResponsibilityItem = styled.li`
  color: #666;
  line-height: 1.5;
  margin-bottom: 0.5rem;
`;

const ExperienceSection = () => {
  const experiences = [
    {
      title: "Senior QA Engineer",
      company: "ABC Technologies",
      duration: "Jan 2020 - Present",
      description: "Leading quality assurance initiatives for enterprise software products.",
      responsibilities: [
        "Implemented automated testing strategies that reduced regression testing time by 60%",
        "Led a team of 5 QA professionals across multiple product lines",
        "Collaborated with product managers to define acceptance criteria and quality metrics",
        "Established CI/CD pipelines for continuous testing and delivery"
      ]
    },
    {
      title: "QA Lead",
      company: "XYZ Software",
      duration: "Mar 2017 - Dec 2019",
      description: "Managed quality assurance processes for mobile applications.",
      responsibilities: [
        "Developed comprehensive test plans and test cases for iOS and Android applications",
        "Conducted performance and security testing for financial applications",
        "Mentored junior QA engineers and facilitated knowledge sharing sessions",
        "Implemented test automation frameworks that increased test coverage by 40%"
      ]
    },
    {
      title: "QA Engineer",
      company: "Tech Solutions Inc.",
      duration: "Jun 2014 - Feb 2017",
      description: "Performed testing for web-based SaaS applications.",
      responsibilities: [
        "Executed manual and automated tests for web applications",
        "Identified and documented software defects in tracking systems",
        "Participated in agile ceremonies and provided testing estimates",
        "Collaborated with developers to ensure quality standards were met"
      ]
    }
  ];

  return (
    <SectionContainer id="experience">
      <SectionTitle>Experience</SectionTitle>
      <Timeline>
        {experiences.map((exp, index) => (
          <TimelineItem key={index}>
            <JobTitle>{exp.title}</JobTitle>
            <Company>{exp.company}</Company>
            <Duration>{exp.duration}</Duration>
            <Description>{exp.description}</Description>
            <ResponsibilitiesList>
              {exp.responsibilities.map((resp, i) => (
                <ResponsibilityItem key={i}>{resp}</ResponsibilityItem>
              ))}
            </ResponsibilitiesList>
          </TimelineItem>
        ))}
      </Timeline>
    </SectionContainer>
  );
};

export default ExperienceSection;