// src/pages/HomePage/HomePage.js
import React from 'react';
import ProfileSection from '../../components/ProfileSection/ProfileSection';
import SkillsSection from '../../components/SkillsSection/SkillsSection';
import ExperienceSection from '../../components/ExperienceSection/ExperienceSection';
import BookingSection from '../../components/BookingSection/BookingSection';

const HomePage = () => {
  return (
    <>
      <ProfileSection />
      <SkillsSection />
      <ExperienceSection />
      <BookingSection />
    </>
  );
};

export default HomePage;