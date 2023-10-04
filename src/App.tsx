import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout/Layout';

import Terms from './pages/Terms/Terms';
import Home from './pages/Home/Home';
import Onboard from './pages/Onboard/Onboard';
import Review from './pages/Review/Review';

import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Layout />}>
            <Route path="/terms" element={<Terms />} />
            <Route path="/onboard" element={<Onboard />} />
            <Route path="/review" element={<Review />} />
            <Route path="/" element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
