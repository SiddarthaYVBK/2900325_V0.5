// src/components/Header/Header.js
import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  text-decoration: none;
  cursor: pointer;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;
`;

const NavLink = styled.a`
  color: #555;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
  cursor: pointer;

  &:hover {
    color: #0070f3;
  }
`;

const Header = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleNavClick = (path) => {
    navigate(path);
  };

  return (
    <HeaderContainer>
      <Logo onClick={handleLogoClick}>YS</Logo>
      <Nav>
        <NavLink onClick={() => handleNavClick('/blog')}>
          Blog
        </NavLink>
        <NavLink onClick={() => handleNavClick('/booking')}>
          Book a Call
        </NavLink>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;