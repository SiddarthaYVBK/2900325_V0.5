import React from 'react';
import styled from 'styled-components';
import profilePhoto from '../../assets/images/YerabatiSiddartha_Photo.jpg';
import { useNavigate } from 'react-router-dom';

const ProfileContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1rem;
  background-color: #f0f7ff;
  text-align: center;
  
  @media (min-width: 768px) {
    flex-direction: row;
    text-align: left;
    padding: 4rem 2rem;
  }
`;

const ProfileImage = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  @media (min-width: 768px) {
    width: 200px;
    height: 200px;
    margin-right: 3rem;
    margin-bottom: 0;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProfileInfo = styled.div`
  max-width: 600px;
`;

const Name = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #333;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  color: #555;
  margin-bottom: 1rem;
`;

const Bio = styled.p`
  line-height: 1.6;
  color: #666;
  margin-bottom: 1.5rem;
`;

const BookButton = styled.button`
  display: inline-block;
  background-color: #0070f3;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  border: none;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0051cc;
  }
`;

const ProfileSection = () => {
  const navigate = useNavigate();
  
  const handleBooking = (e) => {
    e.preventDefault();
    try {
      navigate('/booking');
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback - direct link if navigation fails
      window.location.href = '/booking';
    }
  };
  
  return (
    <ProfileContainer id="profile">
      <ProfileImage>
        {/* Check if image exists and provide fallback */}
        <img 
          src={profilePhoto} 
          alt="Yerabati Siddartha" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/200?text=Photo';
          }}
        />
      </ProfileImage>
      <ProfileInfo>
        <Name>Yerabati Venkata Balakrishna Siddartha</Name>
        <Title>QA Manager || Ex- Flynas</Title>
        <Bio>
          Accomplished IT professional with 14+ years of experience in Software Testing, Quality Assurance, and Project Management. Expertise in developing complex testing frameworks, DevSecOps, and leading cross-functional teams across diverse industries. Proven track record of improving product quality, enhancing system reliability, and driving successful project outcomes.
        </Bio>
        <BookButton onClick={handleBooking}>
          Book a 1:1 Call
        </BookButton>
      </ProfileInfo>
    </ProfileContainer>
  );
};

export default ProfileSection;