import React from 'react';
import styled from 'styled-components';

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

const BookButton = styled.a`
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

const ProfileSection = () => {
  return (
    <ProfileContainer>
      <ProfileImage>
        <img src="https://via.placeholder.com/200" alt="Your Name" />
      </ProfileImage>
      <ProfileInfo>
        <Name>Your Name</Name>
        <Title>Your Title - Company Name</Title>
        <Bio>
          Write a compelling bio here that highlights your expertise, experience, and what you can offer to people who book a call with you. Make it personable but professional, focusing on your strengths and the value you provide.
        </Bio>
        <BookButton href="/booking">Book a 1:1 Call</BookButton>
      </ProfileInfo>
    </ProfileContainer>
  );
};

export default ProfileSection;