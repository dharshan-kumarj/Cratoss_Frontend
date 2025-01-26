import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import IntroPage from '../src/pages/intro';

const App: React.FC = () => {
  return (
    <Router>
          <Routes>
      <Route path="/" element={<IntroPage/>}/>
    </Routes>
    </Router>

  );
};

export default App;