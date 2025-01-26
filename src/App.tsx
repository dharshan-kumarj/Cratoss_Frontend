import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import IntroPage from '../src/pages/intro';
import Dashboard from '../src/pages/dashboard'

const App: React.FC = () => {
  return (
    <Router>
          <Routes>
      <Route path="/" element={<IntroPage/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
    </Routes>
    </Router>

  );
};

export default App;