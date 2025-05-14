// src/pages/HomePage/HomePage.js
import React from 'react';
import ProfileSection from '../../components/ProfileSection/ProfileSection';
import SkillsSection from '../../components/SkillsSection/SkillsSection';
import ExperienceSection from '../../components/ExperienceSection/ExperienceSection';
import TestimonialsSection from '../../components/TestimonialsSection/TestimonialsSection';


const HomePage = () => {
  return (
    <>
      <ProfileSection />
      <SkillsSection />
      <ExperienceSection />
      <TestimonialsSection />
    </>
  );
};

export default HomePage;