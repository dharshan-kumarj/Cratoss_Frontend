import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import AI from '../images/AI.png';

const IntroPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  return (
    <Wrapper>
    <p className='text-5xl'>Hello</p>

      <Container>
        <Logo src={AI} alt="Cratoss Logo" />
        <Title>Welcome to</Title>
        <MainTitle>Cratoss</MainTitle>
        <Subtitle>Your Personal IOT Assistant!</Subtitle>
        <GetStartedButton onClick={handleGetStarted}>Get Started!</GetStartedButton>
      </Container>
      <Graph>
        <GraphSvg viewBox="0 0 1000 100" preserveAspectRatio="none">
          <GraphPath d="M0,50 Q250,10 500,50 T1000,50" fill="none" stroke="#007bff" strokeWidth="2" />
        </GraphSvg>
      </Graph>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to right, #1a1a2e, #16213e, #0f3460);
  color: white;
`;

const Container = styled.div`
  text-align: center;
  max-width: 800px;
  padding: 40px;
`;

const Logo = styled.img`
  width: 240px;
  height: 240px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    width: 180px;
    height: 180px;
    margin-bottom: 20px;
  }
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 10px;
  }
`;

const MainTitle = styled(Title)`
  font-weight: bold;
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 30px;
  }
`;

const GetStartedButton = styled.button`
  background-color: #007bff;
  border: none;
  padding: 15px 30px;
  font-size: 1.2rem;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 1.1rem;
  }
`;

const Graph = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 60px;
  }
`;

const GraphSvg = styled.svg`
  width: 100%;
  height: 100%;
`;

const GraphPath = styled.path`
  fill: none;
  stroke: #007bff;
  stroke-width: 2;
`;

export default IntroPage;