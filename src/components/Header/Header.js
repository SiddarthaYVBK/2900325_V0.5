import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  text-decoration: none;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;
`;

const NavLink = styled(Link)`
  color: #555;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;

  &:hover {
    color: #0070f3;
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Logo to="/">Your Name</Logo>
      <Nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/#skills">Skills</NavLink>
        <NavLink to="/#experience">Experience</NavLink>
        <NavLink to="/booking">Book a Call</NavLink>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;