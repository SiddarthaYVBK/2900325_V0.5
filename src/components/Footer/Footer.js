import React from 'react';
import styled from 'styled-components';
import { FaLinkedin, FaGithub, FaTwitter, FaEnvelope } from 'react-icons/fa';

const FooterContainer = styled.footer`
  padding: 2rem;
  background-color: #f8f9fa;
  text-align: center;
  margin-top: 2rem;
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
`;

const SocialIcon = styled.a`
  color: #555;
  font-size: 1.5rem;
  transition: color 0.3s;

  &:hover {
    color: #0070f3;
  }
`;

const Copyright = styled.p`
  color: #777;
  font-size: 0.9rem;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <SocialLinks>
        <SocialIcon href="https://linkedin.com/in/yourprofile" target="_blank">
          <FaLinkedin />
        </SocialIcon>
        <SocialIcon href="https://github.com/yourusername" target="_blank">
          <FaGithub />
        </SocialIcon>
        <SocialIcon href="https://twitter.com/yourhandle" target="_blank">
          <FaTwitter />
        </SocialIcon>
        <SocialIcon href="mailto:your.email@example.com">
          <FaEnvelope />
        </SocialIcon>
      </SocialLinks>
      <Copyright>© {new Date().getFullYear()} Your Name. All rights reserved.</Copyright>
    </FooterContainer>
  );
};

export default Footer;